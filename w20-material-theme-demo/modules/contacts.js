define([
  'require',
  'module',

  '{lodash}/lodash',
  '{angular}/angular',

  '{w20-material-theme-demo}/modules/module',
  '{w20-material-theme-demo}/modules/resources/random-user-service',
  '{w20-material-theme-demo}/modules/filters/capitalize-filter',
  '{w20-material-theme-demo}/modules/filters/random-user-filter'

], function(require, module, _, angular, demo) {
  'use strict';

  var _config = module && module.config() || {},
    angularModule = demo.module;

  angularModule.controller('ContactController', ['$rootScope', '$scope', '$route', '$log', '$mdToast', '$mdSidenav', '$filter', 'RandomUserService',
    function($rootScope, $scope, $route, $log, $mdToast, $mdSidenav, $filter, RandomUserService) {

      $scope._users = [];
      $scope.shownUsers = [];
      Object.defineProperty($scope, 'users', {
        get: function() {
          return $scope._users;
        },
        set: function(val) {
          $scope._users = $scope.shownUsers = val;
        }
      });


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
          $rootScope.swipe.right = $scope.closeInspect;
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
        
        $scope.shownUsers = $filter('randomUser')($scope.users, query);
        $log.info("Shown users", $scope.shownUsers);
      })
    }
  ]);

  return {
    lifecycle: {}
  };
});