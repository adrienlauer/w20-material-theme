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

    angularModule.controller('ContactController', ['$scope', '$route', '$log',
        function($scope, $route, $log) {

            $scope.$on('w20.material.topbar.search.query', function(event, query) {
                if($route.current.scope !== $scope)
                    return;
                $log.info("Contacts", $route, $scope);
            })
        }
    ]);

    return {
        lifecycle: {}
    };
});