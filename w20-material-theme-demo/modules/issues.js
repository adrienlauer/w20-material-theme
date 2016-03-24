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

  angularModule.controller('IssueController', ['$scope', '$log', '$timeout',
    function($scope, $log, $timeout) {
      $scope.defaultIssue = {
        title: "",
        description: "",
        dueDate: undefined,
        labels: [],
        assignee: undefined,
        notifications: false
      };
      $scope.issue = angular.copy($scope.defaultIssue);
      $scope.issues = [];
      $scope.selectedTab = 0;

      $scope.minDate = new Date();


      $scope.labels = [
        "Breaking Change",
        "Change milestone",
        "Easy fix",
        "In Progress",
        "Known Issue",
        "Kudos!",
        "Lots of Comments",
        "Pull Request Please"
      ];

      $scope.loadAssignees = function loadAssignees() {
        return $timeout(function() {
          $scope.assignees = $scope.assignees || [
            { id: 1, name: 'Scooby Doo' },
            { id: 2, name: 'Shaggy Rodgers' },
            { id: 3, name: 'Fred Jones' },
            { id: 4, name: 'Daphne Blake' },
            { id: 5, name: 'Velma Dinkley' }
          ];
        }, 650);
      };

      $scope.addIssue = function addIssue (argument) {
        $scope.issues.push($scope.issue);
        $scope.issue = angular.copy($scope.defaultIssue);
        $scope.selectedTab = 1;
        $scope.issueForm.$setPristine();
      }
    }
  ]);

  return {
    lifecycle: {}
  };
});