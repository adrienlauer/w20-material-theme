define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular',

    '[text]!{w20-material-theme}/templates/topbar.html',
    '[text]!{w20-material-theme}/templates/sidenav.html',

    '{w20-material-theme}/modules/material-theme',
    '{w20-material-theme}/modules/route-service',

    '{w20-core}/modules/culture',
    '{w20-core}/modules/utils',

], function(require, module, _, angular, topbarTemplate, sidenavTemplate, w20materialThemeModule) {
    'use strict';

    var w20MaterialTheme = w20materialThemeModule.module,
        _config = module && module.config() || {},
        sidenavName = "";

    w20MaterialTheme.directive('w20MaterialTopbar', ['$rootScope', '$route', 'CultureService', '$timeout', '$window', '$document', '$mdUtil', '$animate',
        function($rootScope, $route, cultureService, $timeout, $window, $document, $mdUtil, $animate) {
            return {
                template: topbarTemplate,
                restrict: 'E',
                transclude: true,
                scope: true,
                link: link
            };

            function link(scope, iElement, iAttrs) {

                scope.topbar = {
                    title: ""
                };

                scope.displayName = cultureService.displayName;

                scope.openSidenav = function() {
                    scope.$emit(sidenavName +".open", true);
                };
                
                scope.action = {
                    opened: false,
                    value: "",
                    backdrop: $mdUtil.createBackdrop(scope, "md-opaque md-menu-backdrop ng-enter"),
                    style: {},
                    open: function() {
                        scope.action.opened = true;
                        
                        scope.action.style = {
                            'z-index': 100 //Watch for md-backdrop.md-menu-backdrop rule in angular-material.css, then add 1
                        };
                        
                        $animate.enter(scope.action.backdrop, $document.context.body);
                    },
                    close: function() {
                        scope.action.opened = false;
                        $animate.leave(scope.action.backdrop).then(function() {
                            scope.action.style = {};
                        });
                    }
                };

                scope.action.backdrop[0].addEventListener('click', function() {
                    scope.$applyAsync(scope.action.close);
                });

                scope.unregister = {
                    "$routeChangeSuccess" : $rootScope.$on('$routeChangeSuccess', function(event, route) {
                        scope.topbar.title = cultureService.localize(route.$$route.i18n + ".title");
                    })
                }

                scope.$on('$destroy', function(event) {
                    scope.unregister.forEach(function(fn) {fn()});
                });
            }
        }
    ]);

    w20MaterialTheme.directive('w20MaterialSidenav', ['$rootScope', 'CultureService', 'AuthenticationService', 'RouteService', '$mdSidenav', '$location',
        function($rootScope, cultureService, authenticationService, routeService, $mdSidenav, $location) {

            return {
                template: sidenavTemplate,
                restrict: 'E',
                scope: true,
                compile: compile
            };

            function compile(tElement, tAttrs) {
                if(tAttrs.componentName)
                    tElement.children().attr('md-component-id', tAttrs.componentName);
                else
                    tElement.attr('component-name', tAttrs.componentName = "w20.material.sidenav");
                return link;
            }

            function link(scope, iElement, iAttrs) {
                scope.sidenav = {
                    logoUrl: _config.logoUrl || "/home",
                    logoImg: _config.logoImg,
                    backgroundImg: _config.backgroundImg,
                    user: "",
                    routes: routeService.topLevelRoutes(),
                    name: "w20.material.sidenav" || iAttrs.componentName
                };

                sidenavName = scope.sidenav.name;
                
                scope.displayName = cultureService.displayName;
                
                scope.go = function(path, $event) {
                    $location.path(path);
                    $mdSidenav(scope.sidenav.name).close();
                };

                scope.unregister = {
                    "w20.security.authenticated": $rootScope.$on('w20.security.authenticated',function(){
                        scope.userFullName = authenticationService.subjectPrincipals().fullName;
                    }),
                    [scope.sidenav.name +".open"]: $rootScope.$on(scope.sidenav.name +".open", function(event, val) {
                        val = !angular.isDefined(val) ? 'toggle': val ? 'open': 'close';
                        $mdSidenav(scope.sidenav.name)[val]();
                    })
                }
                
                scope.$on('$destroy', function(event) {
                    scope.unregister.forEach(function(fn) {fn()});
                });
            };
        }
    ]);

    return {
        lifecycle: {}
    };
});
