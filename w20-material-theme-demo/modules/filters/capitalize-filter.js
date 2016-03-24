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

  // From Joseph Shambrook (http://codepen.io/WinterJoey/pen/sfFaK)
  angularModule.filter('capitalize', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });

  return {
    lifecycle: {}
  };
});