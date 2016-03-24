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

  angularModule.filter('randomUser', function() {
    return function(users, query) {
      var returned = [];
      for(var i in users) {
        if(users[i].user.name.first.indexOf(query.toLowerCase()) != -1 ||
           users[i].user.name.last.indexOf(query.toLowerCase()) != -1)
          returned.push(users[i]);
      }
      return returned;
    }
  });

  return {
    lifecycle: {}
  };
});