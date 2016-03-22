define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular'

], function(require, module, _, angular) {
    'use strict';

    var _config = module && module.config() || {},
        w20MaterialThemeDemo = angular.module('w20MaterialThemeDemo', ['ngResource']);

    w20MaterialThemeDemo.run(['$rootScope', function($rootScope) {
        $rootScope.search = {
            disabled: "false",
            placeholder: ""
        }
        
        $rootScope.$on('$routeChangeSuccess', function(event, route) {
            $rootScope.search.disabled = (!!(route && route.search && route.search.disabled)).toString();
            $rootScope.search.placeholder = route && route.search && route.search.placeholder ? route.search.placeholder: "";
        })
    }]);

    return {
        angularModules: ['w20MaterialThemeDemo'],
        module: w20MaterialThemeDemo
    };
});