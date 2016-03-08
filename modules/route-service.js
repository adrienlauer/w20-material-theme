define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular',

    '{w20-material-theme}/modules/material-theme',

    '{w20-core}/modules/culture',
    '{w20-core}/modules/utils',

], function(require, module, _, angular, theme) {
    'use strict';

    theme = theme.module;

    theme.factory('RouteService', ['$route', 'SecurityExpressionService', function($route, securityExpressionService) {

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
                return angular.isDefined(cats)? _.indexOf(cats, elt): elt;
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
