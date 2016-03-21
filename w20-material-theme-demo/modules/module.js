define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular'

], function(require, module, _, angular) {
    'use strict';

    var _config = module && module.config() || {},
        w20MaterialThemeDemo = angular.module('w20MaterialThemeDemo', ['ngResource']);

    return {
        angularModules: ['w20MaterialThemeDemo'],
        module: w20MaterialThemeDemo
    };
});