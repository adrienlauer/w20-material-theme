var gulp = require('gulp');
var serve = require('gulp-serve');
var open = require('gulp-open');
var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');
var reload = browserSync.reload;

gulp.task('serve', function() {
  browserSync({
    port: 3000,
    notify: false,
    logPrefix: 'w20',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      baseDir: ['.'],
      middleware: [historyApiFallback()]
    }
  });

  gulp.watch(['w20-material-theme-demo/views/**/*.html', 'index.html'], reload);
  gulp.watch(['w20-material-theme-demo/style/**/*.css'], reload);
  gulp.watch(['w20-material-theme-demo/modules/**/*.js'], reload);
  gulp.watch(['w20-material-theme-demo/images/**/*'], reload);
  gulp.watch(['w20.app.json', 'w20-material-theme-demo/w20-material-theme-demo.w20.json'], reload);
});

gulp.task('default', ['serve'])