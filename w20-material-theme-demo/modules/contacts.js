define([
  'require',
  'module',

  '{lodash}/lodash',
  '{angular}/angular',

  '{w20-material-theme-demo}/modules/module',
  '{w20-material-theme-demo}/modules/resources/random-user-service',
  '{w20-material-theme-demo}/modules/filters/capitalize-filter'

], function(require, module, _, angular, demo) {
  'use strict';

  var _config = module && module.config() || {},
    angularModule = demo.module;

  angularModule.controller('ContactController', ['$rootScope', '$scope', '$route', '$log', '$mdToast', '$mdSidenav', 'RandomUserService',
    function($rootScope, $scope, $route, $log, $mdToast, $mdSidenav, RandomUserService) {

      $scope.users = [];
      $scope.refreshUsers = function () {
        RandomUserService.getUsers({
          results: 15,
          nat: "FR"
        }, function(data, status) {
          if(data.error) {
            $mdToast.showSimple("Random User API encoutered a problem");
            $log.error("Random User API encoutered a problem", data.error);
          } else {
            $scope.$applyAsync(function() {
              $scope.users = data.results;
              $log.info($scope.users);
            });
          }
        });
      };
      $scope.refreshUsers();


      $scope.swipeRight = angular.noop;
      $scope.selectedUser = {};
      $scope.pictureDisplayed = false;
      $scope.$watch(function() {
        return $mdSidenav('user-details').isOpen();
      }, function(newVal, oldVal) {
        if(newVal) {
          $scope.swipeRight = $rootScope.swipe.right;
          $rootScope.swipe.right = angular.noop;
          $scope.pictureDisplayed = true;
        } else if(!newVal && oldVal) {
          $rootScope.swipe.right = $scope.swipeRight;
          $scope.swipeRight = angular.noop;
          $scope.pictureDisplayed = false;
        }
      });

      $scope.inspectUser = function(user, $event) {
        $scope.selectedUser = user;
        $mdSidenav('user-details').open()
      };

      $scope.closeInspect = function() {
        $mdSidenav('user-details').close().then(function() {
          $scope.selectedUser = {};
        })
      };

      $scope.$on('w20.material.topbar.search.query', function(event, query) {
        if ($route.current.scope !== $scope)
          return;
        $log.info("Contacts", $route, $scope);
      })
    }
  ]);

  return {
    lifecycle: {}
  };
});