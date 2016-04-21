var gulp = require('gulp'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  templateCache = require('gulp-angular-templatecache'),
  del = require('del'),
  merge = require('merge-stream');

gulp.task('default', [
  'clean:dist', 
  'jshint', 
  'templateCache', 
  'merge', 
  'minify', 
  'clean:tmp'
]);

gulp.task('templateCache', function() {
  var dtp = gulp.src('./src/templates/datetimepicker.html')
    .pipe(templateCache({
		module: 'dateTimePicker',
		filename: 'dateTimePicker-tpl.js',
		root: 'templates'
	}))
    .pipe(gulp.dest('tmp'));
  var fdp = gulp.src('./src/templates/form-datepicker.html')
    .pipe(templateCache({
		module: 'schemaForm',
		filename: 'schemaForm-tpl.js',
		root: 'templates'
	}))
    .pipe(gulp.dest('tmp'));
	
  return merge(dtp, fdp);
});

gulp.task('jshint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('clean:dist', function() {
  return del.sync([
    'dist'
  ]);
});

gulp.task('clean:tmp', ['merge'], function() {
  return del.sync([
    'tmp'
  ]);
});

gulp.task('merge', ['templateCache', 'jshint'], function() {
   return gulp.src([
    './src/*.js',
	'./tmp/*.js'
    ])
  .pipe(concat('datetimepicker.js'))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', ['merge'], function() {
  return gulp.src([
    './dist/datetimepicker.js',
    ])
  .pipe(uglify())
  .pipe(rename('datetimepicker.min.js'))
  .pipe(gulp.dest('./dist/'));
});
