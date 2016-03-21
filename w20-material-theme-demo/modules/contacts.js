define([
    'require',
    'module',

    '{lodash}/lodash',
    '{angular}/angular',

    '{w20-material-theme-demo}/modules/module'

], function(require, module, _, angular, demo) {
    'use strict';

    var _config = module && module.config() || {},
        angularModule = demo.module;

    angularModule.controller('ContactController', ['$scope', 
        function($scope) {

        }
    ]);

    return {
        lifecycle: {}
    };
});