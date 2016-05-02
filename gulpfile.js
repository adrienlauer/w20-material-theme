'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var jshint = require('gulp-jshint');
 
gulp.task('bump', function() {
  var typeIndex = process.argv.indexOf("--type") + 1,
      type = typeIndex? process.argv[typeIndex]: 'patch';

  gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type: type}))
    .pipe(gulp.dest('./'));
});

gulp.task('lint', function() {
	return gulp.src('modules/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', ['lint']);