/* jshint strict: false */
/* globals process */

var gulp = require('gulp');
var bump = require('gulp-bump');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
 
gulp.task('bump', function() {
  var typeIndex = process.argv.indexOf('--type') + 1,
      type = typeIndex? process.argv[typeIndex]: 'patch';

  gulp.src(['./package.json', './bower.json'])
    .pipe(bump({type: type}))
    .pipe(gulp.dest('./'));
});

gulp.task('jshint', function() {
	return gulp.src('modules/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('csslint', function() {
	return gulp.src('style/*.css')
		.pipe(csslint())
		.pipe(csslint.reporter());
});

gulp.task('lint', ['jshint', 'csslint']);

gulp.task('test', ['lint']);