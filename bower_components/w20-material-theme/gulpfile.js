'use strict';

var gulp = require('gulp'),
    bump = require('gulp-bump');
 
gulp.task('bump', function() {
  var typeIndex = process.argv.indexOf("--type") + 1,
      type = typeIndex? process.argv[typeIndex]: 'patch';

  gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type: type}))
    .pipe(gulp.dest('./'));
});

gulp.task('test', function() {

});