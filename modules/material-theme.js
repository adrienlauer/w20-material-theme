define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular',

    '{w20-core}/modules/culture',
    '{w20-core}/modules/utils',

], function(require, module, _, angular) {
    'use strict';

    var _config = module && module.config() || {},
        w20MaterialTheme = angular.module('w20MaterialTheme', ['ngMaterial','w20CoreCulture', 'w20CoreUtils', 'ngSanitize', 'ngAnimate', 'ngAria']);
    
    w20MaterialTheme.config(['$ariaProvider', '$mdThemingProvider', function($ariaProvider, $mdThemingProvider) {
        $ariaProvider.config({
            tabindex: false
        });
        $mdThemingProvider.theme('default')
            .primaryPalette(_config.palette.primary)
            .accentPalette(_config.palette.secondary);
    }]);

    return {
        angularModules: ['w20MaterialTheme'],
        module: w20MaterialTheme,
        lifecycle: {}
    };
});
