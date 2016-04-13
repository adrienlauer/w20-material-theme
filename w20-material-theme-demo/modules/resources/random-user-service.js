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

  angularModule.factory('RandomUserService', [
    function() {
      return {
        getUsers: getUsers
      }

      function getUsers (options, cb) {
        $.getJSON("http://api.randomuser.me/0.8", {
          results: options.results,
          key: options.key,
          gender: options.gender,
          seed: options.seed,
          nat: options.nat
        }, cb);
      }
    }
  ]);

  return {
    lifecycle: {}
  };
});