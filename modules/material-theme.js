define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular',

    '[text]!{w20-material-theme}/templates/topbar.html',
    '[text]!{w20-material-theme}/templates/sidenav.html',

    '{angular-sanitize}/angular-sanitize',
    '{w20-core}/modules/culture',
    '{w20-core}/modules/utils',

], function(require, module, _, angular, topbarTemplate, sidenavTemplate, ngSanitize, ngMaterial) {
    'use strict';

    var _config = module && module.config() || {},
        fjvMobileThemeMenu = angular.module('fjvMobileThemeMenu', ['ngMaterial','w20CoreCulture', 'w20CoreUtils', 'ngSanitize', 'ngAnimate']),
        showTopbar = true,
        showSidenav = true;
    
    fjvMobileThemeMenu.config(['$ariaProvider', '$mdThemingProvider', function($ariaProvider, $mdThemingProvider) {
        $ariaProvider.config({
            tabindex: false
        });
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink');
    }]);

    fjvMobileThemeMenu.directive('w20MaterialTopbar', ['$rootScope', '$route', 'EventService', 'DisplayService', 'MenuService', 'EnvironmentService', 'ApplicationService', 'SecurityExpressionService', 'CultureService', '$timeout', '$window', '$document', '$log', '$mdUtil', '$animate',
        function($rootScope, $route, eventService, displayService, menuService, environmentService, applicationService, securityExpressionService, cultureService, $timeout, $window, $document, $log, $mdUtil, $animate) {
            function isRouteVisible(route) {
                return !route.hidden && (typeof route.security === 'undefined' || securityExpressionService.evaluate(route.security));
            }

            var unpeekTimeoutPromise;



            return {
                template: topbarTemplate,
                transclude: true,
                restrict: 'A',
                scope: true,
                link: function(scope, iElement, iAttrs) {
                    scope.hideViews = _config.hideViews || false;
                    scope.title = iAttrs.title || '\'' + applicationService.applicationId + '\'';
                    scope.description = iAttrs.subtitle || '';
                    scope.navActions = menuService.getActions;
                    scope.navAction = menuService.getAction;
                    scope.displayName = cultureService.displayName;
                    scope.envtype = environmentService.environment;
                    scope.logoUrl = _config.logoUrl;
                    scope.isTopbarDisplayed = function() {
                        return showTopbar;
                    };

                    scope.peekSection = function() {
                        if (unpeekTimeoutPromise) {
                            $timeout.cancel(unpeekTimeoutPromise);
                            unpeekTimeoutPromise = null;
                        }
                        scope.showViews = true;
                    };

                    scope.unpeekSection = function() {
                        scope.showViews = false;
                    };

                    scope.routeCategories = function() {
                        return _.sortBy(_.uniq(_.filter(_.map($route.routes, function(route) {
                            if (typeof route.category !== 'undefined' && route.category !== '__top' && isRouteVisible(route)) {
                                return route.category;
                            } else {
                                return null;
                            }
                        }), function(elt) {
                            return elt !== null && (typeof _config.categories !== 'undefined' ? _.contains(_config.categories, elt) : true);
                        })), function(elt) {
                            if (typeof _config.categories !== 'undefined') {
                                return _.indexOf(_config.categories, elt);
                            } else {
                                return elt;
                            }
                        });
                    };

                    scope.topLevelRoutes = function() {
                        return _.filter($route.routes, function(route) {
                            return route.category === '__top' && isRouteVisible(route);
                        });
                    };

                    scope.routesFromCategory = function(category) {
                        return _.filter($route.routes, function(route) {
                            return route.category === category && isRouteVisible(route);
                        });
                    };

                    scope.routeSortKey = function(route) {
                        return route.sortKey || route.path;
                    };

                    displayService.registerContentShiftCallback(function() {
                        return [showTopbar ? 0 : 0, 0, 0, 0];
                    });

                    scope.openSearch = function() {
                        scope.search.open = true;
                        scope.focusSearch();
                        if(!scope.search.backdrop) {
                            scope.search.backdrop = $mdUtil.createBackdrop(scope, "md-opaque md-menu-backdrop ng-enter");
                            scope.search.backdrop[0].addEventListener('click', function() {
                                scope.$applyAsync(scope.closeSearch);
                            });
                        }
                        
                        scope.search.style = {
                                'z-index': 100 //Watch for md-backdrop.md-menu-backdrop rule in angular-material.css, then add 1
                        };
                        
                        $animate.enter(scope.search.backdrop, $document.context.body);
                    };
                    
                    scope.focusSearch = function() {
                        $timeout(function() {
                            $window.document.querySelector("md-toolbar [name=reference-search]").focus();
                        });
                    };
                    
                    scope.closeSearch = function() {
                        scope.search.open = false;
                        $animate.leave(scope.search.backdrop).then(function() {
                            scope.search.style = {};
                        });
                    };
                    
                    scope.$watch("search.value", function(value) {
                        $rootScope.$broadcast("executeSearch", value);
                    });                    
                    
                    scope.search = {
                        _open: false,
                        value: "",
                        backdrop: null,
                        style: {},
                        get open() {
                            return scope._open;
                        },
                        set open(val) {
                            scope._open = !!val;
                        }
                    };
                    
                    scope.title = {
                        value: "",
                        unregister: $rootScope.$on('$routeChangeSuccess', function(event, route) {
                            scope.title.value = cultureService.localize(route.$$route.i18n + ".title");
                        })
                    };
                }
            };
        }
    ]);

    fjvMobileThemeMenu.directive('w20MaterialSidenav', ['$rootScope', '$route', 'EventService', 'DisplayService', 'MenuService', 'EnvironmentService', 'ApplicationService', 'SecurityExpressionService', 'CultureService', '$timeout', '$log', '$mdSidenav', '$location', 'AuthenticationService',
        function($rootScope, $route, eventService, displayService, menuService, environmentService, applicationService, securityExpressionService, cultureService, $timeout, $log, $mdSidenav, $location, authenticationService) {
            function isRouteVisible(route) {
                return !route.hidden && (typeof route.security === 'undefined' || securityExpressionService.evaluate(route.security));
            }

            var unpeekTimeoutPromise;



            return {
                template: sidenavTemplate,
                replace: true,
                transclude: true,
                restrict: 'A',
                scope: true,
                link: function(scope, iElement, iAttrs) {
                    scope.hideViews = _config.hideViews || false;
                    scope.title = iAttrs.title || '\'' + applicationService.applicationId + '\'';
                    scope.description = iAttrs.subtitle || '';
                    scope.navActions = menuService.getActions;
                    scope.navAction = menuService.getAction;
                    scope.displayName = cultureService.displayName;
                    scope.envtype = environmentService.environment;
                    scope.logoUrl = _config.logoUrl;
                    scope.userFullName = "";
                    
                    $rootScope.$on('w20.security.authenticated',function(){
                        scope.userFullName = authenticationService.subjectPrincipals().fullName;
                    });
                    
                    scope.isSidenavDisplayed = function() {
                        return showSidenav;
                    };

                    scope.peekSection = function() {
                        if (unpeekTimeoutPromise) {
                            $timeout.cancel(unpeekTimeoutPromise);
                            unpeekTimeoutPromise = null;
                        }
                        scope.showViews = true;
                    };

                    scope.unpeekSection = function() {
                        scope.showViews = false;
                    };

                    scope.routeCategories = function() {
                        return _.sortBy(_.uniq(_.filter(_.map($route.routes, function(route) {
                            if (typeof route.category !== 'undefined' && route.category !== '__top' && isRouteVisible(route)) {
                                return route.category;
                            } else {
                                return null;
                            }
                        }), function(elt) {
                            return elt !== null && (typeof _config.categories !== 'undefined' ? _.contains(_config.categories, elt) : true);
                        })), function(elt) {
                            if (typeof _config.categories !== 'undefined') {
                                return _.indexOf(_config.categories, elt);
                            } else {
                                return elt;
                            }
                        });
                    };

                    scope.topLevelRoutes = function() {
                        return _.filter($route.routes, function(route) {
                            return route.category === '__top' && isRouteVisible(route);
                        });
                    };

                    scope.routesFromCategory = function(category) {
                        return _.filter($route.routes, function(route) {
                            return route.category === category && isRouteVisible(route);
                        });
                    };

                    scope.routeSortKey = function(route) {
                        return route.sortKey || route.path;
                    };
                    
                    scope._open = false;
                    Object.defineProperty(scope, 'open', {
                        get: function() {
                            return scope._open;
                        },
                        set: function(val) {
                            if(val !== 'toggle' && typeof val !== 'boolean')
                                throw new RangeError("Valid values: true, false or 'toggle'");
                            if(val === 'toggle') 
                                scope._open = ~~val == open;
                            else
                                scope._open = val;
                            
                        }
                    });
                    
                    scope.processOpen = function(event) {
                        if(window.innerWidth < 1200 || scope.open)
                            scope.open = (event.pageX - event.currentTarget.offsetWidth) < 0;
                    };
                    
                    scope.processEnter = function(event) {
                        if(window.innerWidth < 1200 || scope.open)
                            scope.open = scope.open || (event.pageX - event.target.offsetWidth) < 0;
                    };
                    
                    scope.openSidenav = function(event) {
                        if(window.innerWidth < 1200)
                            scope.open = true;
                    };
                    
                    scope.closeSidenav = function(event) {
                        if(window.innerWidth < 1200)
                            scope.open = false;
                    };
                    
                    scope.goTo = function(path, $event) {
                        $location.path(path);
                        $mdSidenav('left').close();
                    };
                    
                    scope.$on('$routeChangeSuccess', function() {
                        scope.open = false;
                    });

                    var unregister = $rootScope.$on("sidenav.open", function(event, val) {
//                        if(window.innerWidth < 1200)
//                            scope.open = val;
                        val = val === 'toggle' ? 'toggle': val ? 'open': 'close';
                        
                        $mdSidenav('left')[val]();
                    });
                    
                    scope.$on('$destroy', function(event) {
                        unregister();
                    });

                    displayService.registerContentShiftCallback(function() {
                        return [showSidenav ? 0 : 0, 0, 0, 0];
                    });
                }
            };
        }
    ]);

    fjvMobileThemeMenu.run(['$rootScope', 'DisplayService', 'MenuService', function($rootScope, displayService, menuService) {
        $rootScope.$on('$routeChangeSuccess', function(event, routeInfo) {
            if (routeInfo && routeInfo.$$route) {
                switch (routeInfo.$$route.navigation) {
                    case 'none':
                        showTopbar = false;
                        break;
                    case 'topbar':
                        showTopbar = true;
                        break;
                    case 'full':
                        /* falls through */
                    default:
                        showTopbar = true;
                        break;
                }

                displayService.computeContentShift();
            }
        });

        if (!_config.hideSecurity) {
            menuService.addAction('login', 'w20-login', {
                sortKey: 0
            });
            menuService.addAction('logout', 'w20-logout', {
                sortKey: 100
            });
        }

        if (!_config.hideCulture) {
            menuService.addAction('culture', 'w20-culture', {
                sortKey: 200
            });
        }

        if (!_config.hideConnectivity) {
            menuService.addAction('connectivity', 'w20-connectivity', {
                sortKey: 300
            });
        }

        _.each(_config.links, function(link, idx) {
            if (idx < 10) {
                menuService.addAction('link-' + idx, 'w20-link', _.extend(link, {
                    sortKey: 400 + idx
                }));
            }
        });
    }]);


    return {
        angularModules: ['fjvMobileThemeMenu'],
        lifecycle: {
            pre: function(modules, fragments, callback) {
                angular.element('body').addClass('w20-top-shift-padding w20-right-shift-padding w20-bottom-shift-padding w20-left-shift-padding');
                callback(module);
            }
        }
    };
});
