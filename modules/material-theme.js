define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular',
    '{angular-animate}/angular-animate',

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
        var themeConfig = $mdThemingProvider.theme('default')
                            .primaryPalette(_config.theme.primaryPalette.name, _config.theme.primaryPalette.hues)
                            .accentPalette(_config.theme.accentPalette.name, _config.theme.accentPalette.hues)
                            .dark(_config.theme.dark);
        if(_config.theme.warnPalette)
            themeConfig = themeConfig.warnPalette(_config.theme.warnPalette.name, _config.theme.warnPalette.hues);
        if(_config.theme.backgroundPalette)
            themeConfig = themeConfig.backgroundPalette(_config.theme.backgroundPalette.name, _config.theme.backgroundPalette.hues);

    }]);

    return {
        angularModules: ['w20MaterialTheme'],
        module: w20MaterialTheme,
        lifecycle: {}
    };
});
