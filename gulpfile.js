(function () {
  'use strict';

  const KarmaServer = require('karma').Server,
    browserSync = require('browser-sync'),
    del = require('del'),
    eslintOptions = require('./.eslintrc.js'),
    gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    project = require('./package.json'),
    reload = browserSync.reload,
    wiredep = require('wiredep').stream;


  let $ = gulpLoadPlugins(),
    lint;


  gulp.task('styles', () => {
    return gulp.src('example/styles/*.scss')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass.sync({
        outputStyle: 'expanded',
        precision: 10,
        includePaths: ['.']
      }).on('error', $.sass.logError))
      .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.tmp/styles'))
      .pipe(reload({stream: true}));
  });

  gulp.task('scripts-geildankevr', ['copy-vendor'], () => {
    return gulp.src([
      'src/geildankevr-core.js',
      'src/geildankevr-content.js',
      'src/geildankevr-!(core)!(content)*.js',
      '!src/*.spec.js'
    ])
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.concat('geildankevr.js'))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('example/geildankevr'))
      .pipe(reload({stream: true}));
  });

  gulp.task('copy-vendor', () => {
    return gulp.src('src/vendor/*.js')
      .pipe($.plumber())
      .pipe(gulp.dest('example/geildankevr/vendor'))
      .pipe(reload({stream: true}));
  });

  gulp.task('scripts', () => {
    return gulp.src('example/scripts/**/*.js')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe(reload({stream: true}));
  });

  lint = function (files, options) {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };

  gulp.task('lint', () => {
    return lint(['example/scripts/**/*.js', 'src/*.js'], eslintOptions);
  });

  gulp.task('html', ['styles', 'scripts', 'scripts-geildankevr'], () => {
    return gulp.src('example/*.html')
      .pipe($.useref({searchPath: ['.tmp', 'example', '.']}))
      .pipe($.if('*.js', $.uglify()))
      .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
      .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('dev'));
  });

  gulp.task('images', () => {
    return gulp.src('example/images/**/*')
      .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs, they are often used
        // as hooks for embedding and styling
        svgoPlugins: [{cleanupIDs: false}]
      })))
      .pipe(gulp.dest('dev/images'));
  });

  gulp.task('extras', () => {
    return gulp.src([
      'example/*.*',
      '!example/*.html'
    ], {
      dot: true
    }).pipe(gulp.dest('dev'));
  });

  gulp.task('clean', del.bind(null, ['.tmp', 'dev']));

  gulp.task('serve', ['styles', 'scripts', 'scripts-geildankevr'], () => {
    browserSync({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'example']
      }
    });

    gulp.watch([
      'example/*.html',
      'example/images/**/*'
    ]).on('change', reload);

    gulp.watch('example/styles/**/*.scss', ['styles']);
    gulp.watch('example/scripts/**/*.js', ['scripts']);
    gulp.watch('src/**/*.js', ['scripts-geildankevr', 'lint', 'test']);
  });

  gulp.task('serve:dev', () => {
    browserSync({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['dev']
      }
    });
  });

  gulp.task('serve:test', ['scripts'], () => {
    browserSync({
      notify: false,
      port: 9000,
      ui: false,
      server: {
        baseDir: 'test',
        routes: {
          '/scripts': '.tmp/scripts'
        }
      }
    });

    gulp.watch('example/scripts/**/*.js', ['scripts']);
  });

  // inject bower components
  gulp.task('wiredep', () => {
    gulp.src('example/styles/*.scss')
      .pipe(wiredep({
        ignorePath: /^(\.\.\/)+/
      }))
      .pipe(gulp.dest('example/styles'));

    gulp.src('example/*.html')
      .pipe(wiredep({
        ignorePath: /^(\.\.\/)*\.\./
      }))
      .pipe(gulp.dest('example'));
  });

  gulp.task('zip-lib', () => {
    const filename = 'GeilDankeVR-' + project.version + '.zip';

    return gulp.src('lib/**/*')
      .pipe($.zip(filename))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('build', ['lint', 'test', 'scripts-geildankevr'], () => {
    return gulp.src([
      'example/geildankevr/vendor/three.js',
      'example/geildankevr/**/!(three)*.js'
    ])
      .pipe($.uglify())
      .pipe($.concat('geildankevr.min.js'))
      .pipe(gulp.dest('lib/geildankevr'));
  });

  gulp.task('test', function (done) {
    new KarmaServer({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, (errCode) => {
      if (errCode === 1) {
        done('Unit Test failures');
        return;
      }
      done();
    }).start();
  });

  // gulp.task('tdd', function (done) {
  //   new KarmaServer({
  //     configFile: __dirname + '/karma.conf.js'
  //   }, done).start();
  // });

  gulp.task('default', ['clean', 'build'], () => {
    gulp.start('zip-lib');
  });
}());
