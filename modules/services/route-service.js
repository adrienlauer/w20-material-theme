define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular',

], function(require, module, _, angular) {
    'use strict';

    var _config = module && module.config() || {},
        w20MaterialTheme = angular.module('w20MaterialTheme', ['ngMaterial','w20CoreCulture', 'w20CoreUtils', 'ngSanitize', 'ngAnimate']);
        
    w20MaterialTheme.factory('RouteService', ['$route', 'SecurityExpressionService', function($route, securityExpressionService) {

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

        function categories() {
            return _.sortBy(_.uniq(_.filter(_.map($route.routes, function (route) {
                if (angular.isDefined(route.category) && route.category !== '__top' && isVisible(route))
                    return route.category;
                return null;
            }), function (elt) {
                return elt !== null && (angular.isDefined(_config.categories) ? _.contains(_config.categories, elt) : true);
            })), function (elt) {
                return angular.isDefined(_config.categories)? _.indexOf(_config.categories, elt), elt;
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

    return {
        lifecycle: {}
    };
});
