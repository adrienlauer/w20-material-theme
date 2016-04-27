define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular',

    '[text]!{w20-material-theme}/templates/topbar.html',
    '[text]!{w20-material-theme}/templates/sidenav.html',

    '{w20-core}/modules/culture',
    '{w20-core}/modules/utils'
], function (require, module, _, angular, topbarTemplate, sidenavTemplate) {
    'use strict';

    var _config = module && module.config() || {},
        _sidenavConfig = _.merge({}, _config.sidenav),
        _themeConfig = _.merge({
            primaryPalette: {
                name: "blue"
            },
            accentPalette: {
                name: "orange"
            },
            dark: false
        }, _config.theme),
        w20MaterialTheme = angular.module('w20MaterialTheme', ['ngMaterial', 'w20CoreCulture', 'w20CoreUtils', 'ngSanitize', 'ngAnimate', 'ngAria']);

    w20MaterialTheme.config(['$ariaProvider', '$mdThemingProvider', function ($ariaProvider, $mdThemingProvider) {
        $ariaProvider.config({
            tabindex: false
        });

        var themeConfig = $mdThemingProvider.theme('default')
            .primaryPalette(_themeConfig.primaryPalette.name, _themeConfig.primaryPalette.hues)
            .accentPalette(_themeConfig.accentPalette.name, _themeConfig.accentPalette.hues);

        if (_themeConfig.warnPalette)
            themeConfig = themeConfig.warnPalette(_themeConfig.warnPalette.name, _themeConfig.warnPalette.hues);

        if (_themeConfig.backgroundPalette)
            themeConfig = themeConfig.backgroundPalette(_themeConfig.backgroundPalette.name, _themeConfig.backgroundPalette.hues);

        themeConfig.dark(_themeConfig.dark);
    }]);

    w20MaterialTheme.factory('RouteService', ['$route', 'SecurityExpressionService', function ($route, securityExpressionService) {
        return {
            routeCategories: categories,
            routesFromCategory: route,
            topLevelRoutes: route.bind(this, '__top'),
            routeSortKey: sortKey,
            isRouteVisible: isVisible
        };

        function isVisible(route) {
            return !route.hidden && (typeof route.security === 'undefined' || securityExpressionService.evaluate(route.security));
        }

        function categories(cats) {
            return _.sortBy(_.uniq(_.filter(_.map($route.routes, function (route) {
                if (angular.isDefined(route.category) && route.category !== '__top' && isVisible(route))
                    return route.category;
                return null;
            }), function (elt) {
                return elt !== null && (angular.isDefined(cats) ? _.contains(cats, elt) : true);
            })), function (elt) {
                return angular.isDefined(cats) ? _.indexOf(cats, elt) : elt;
            });
        }

        function route(category) {
            return _.filter($route.routes, function (route) {
                return route.category === category && isVisible(route);
            });
        }

        function sortKey(route) {
            return route.sortKey || route.path
        }
    }]);

    w20MaterialTheme.directive('w20MaterialTopbar', ['$rootScope', '$route', 'CultureService', '$timeout', '$window',
        function ($rootScope, $route, cultureService, $timeout, $window) {
            return {
                template: topbarTemplate,
                restrict: 'E',
                scope: {
                    searchMaxlength: "=",
                    searchPlaceholder: "=",
                    searchDisabled: "=?"
                },
                link: link
            };

            function link(scope) {
                scope.topbar = {
                    title: ""
                };

                scope.displayName = cultureService.displayName;

                scope.openSidenav = function () {
                    scope.$emit("w20.material.sidenav.open", true);
                };

                scope.search = {
                    opened: false,
                    value: "",
                    disabled: false,
                    _placeholder: "",
                    get placeholder() {
                        return scope.search._placeholder;
                    },
                    set placeholder(val) {
                        scope.search._placeholder = val ? cultureService.localize(val, [], val) : '';
                    },
                    unwatch: undefined,
                    open: function () {
                        scope.search.opened = true;
                        scope.search.focus();

                        scope.search.unwatch = scope.$watch(function (scope) {
                            return scope.search.value;
                        }, scope.search._broadcast);
                    },
                    close: function () {
                        scope.search.opened = false;
                        scope.search.unwatch();
                        scope.search.value = "";
                        scope.search._broadcast("");
                    },
                    focus: function () {
                        $timeout(function () {
                            $window.document.querySelector("md-toolbar [name=w20-material-theme-search]").focus();
                        });
                    },
                    _broadcast: function (value) {
                        $rootScope.$broadcast("w20.material.topbar.search.query", value);
                    }
                };

                scope.$watch(function () {
                    return scope.searchDisabled;
                }, function (newV, oldV) {
                    if (newV !== oldV)
                        scope.search.disabled = newV == "true" || newV == "" ? true : false;
                    scope.search.opened = scope.search.disabled ? false : scope.search.opened;
                });

                scope.$watch(function () {
                    return scope.searchPlaceholder;
                }, function (newV, oldV) {
                    if (newV !== oldV)
                        scope.search.placeholder = newV;
                });
                scope.search.placeholder = scope.searchPlaceholder;

                scope.unregister = {
                    "$routeChangeSuccess": $rootScope.$on('$routeChangeSuccess', function (event, route) {
                        if (route && route.$$route)
                            scope.topbar.title = cultureService.localize(route.$$route.i18n + ".title", [], cultureService.localize(route.$$route.i18n));
                        scope.search.value = "";
                    })
                };

                scope.$on('$destroy', function () {
                    scope.unregister.forEach(function (fn) {
                        fn()
                    });
                });
            }
        }
    ]);

    w20MaterialTheme.directive('w20MaterialSidenav', ['$rootScope', 'CultureService', 'AuthenticationService', 'ApplicationService', 'RouteService', '$mdSidenav', '$location',
        function ($rootScope, cultureService, authenticationService, applicationService, routeService, $mdSidenav, $location) {

            return {
                template: sidenavTemplate,
                restrict: 'E',
                scope: true,
                link: link
            };

            function link(scope, iElement, iAttrs) {
                scope.sidenav = {
                    title: iAttrs.title || '\'' + applicationService.applicationId + '\'',
                    logoUrl: _sidenavConfig.logoUrl || "/",
                    logoImg: _sidenavConfig.logoImg,
                    backgroundImg: _sidenavConfig.backgroundImg,
                    user: "",
                    routes: routeService.topLevelRoutes(),
                    name: "w20.material.sidenav"
                };

                scope.displayName = cultureService.displayName;

                scope.go = function (path) {
                    $location.path(path);
                    $mdSidenav("w20.material.sidenav").close();
                };

                scope.unregister = {
                    "w20.security.authenticated": $rootScope.$on('w20.security.authenticated', function () {
                        scope.userFullName = authenticationService.subjectPrincipals().fullName;
                    }),
                    "w20.material.sidenav.open": $rootScope.$on(scope.sidenav.name + ".open", function (event, val) {
                        val = !angular.isDefined(val) ? 'toggle' : val ? 'open' : 'close';
                        $mdSidenav("w20.material.sidenav")[val]();
                    })
                };

                scope.$on('$destroy', function () {
                    scope.unregister.forEach(function (fn) {
                        fn()
                    });
                });
            }
        }
    ]);

    return {
        angularModules: ['w20MaterialTheme'],
        module: w20MaterialTheme
    };
});
