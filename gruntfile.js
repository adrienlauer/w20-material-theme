module.exports = function(grunt) {
  'use strict';

  require('jit-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      static: {
        src: ['modules/**/*.js']
      }
    }
  });

  grunt.registerTask('default', ['jshint']);
};