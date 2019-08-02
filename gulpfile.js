const { src, dest, watch, parallel, task, series } = require('gulp'),
      sass = require('gulp-sass'),
      plumber = require('gulp-plumber'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      server = require('browser-sync').create(),
      webp = require('gulp-webp'),
      del = require('del'),
      svgstore = require('gulp-svgstore'),
      minify = require('gulp-csso'),
      rename = require('gulp-rename'),
      imagemin = require('gulp-imagemin'),
      babel = require('gulp-babel');

const path = {
  build: {
    html: 'dist/',
    css: 'dist/css',
    js: 'dist/js',
    img: 'dist/img',
    fonts: 'dist/fonts'
  },
  src: {
    html: 'src/*.html',
    style: 'src/sass/style.{scss, sass}',
    js: 'src/js/index.js',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.{woff, woff2}}',
  },
  watch: {
    html: 'src/**/*.html',
    style: 'src/sass/**/*.{scss, sass}',
    js: 'src/js/**/*.js',
    img: 'src/img/**/*.*'
  },
  clean: './dist'
};

const serverConfig = {
  server: {
    baseDir: './dist',
  },
  tunnel: true,
  host: 'localhost',
  port: 3000,
  logPrefix: 'Frontend Mirangs'
};

const style = () => 
  src(path.src.style)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(dest(path.build.css))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(dest(path.build.css))
    .pipe(server.stream());

const js = () => 
  src(path.src.js)
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest(path.build.js))
    .pipe(server.stream());

const images = () => 
  src(path.src.img)
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(dest(path.build.img))
    .pipe(server.stream());

const webpTask = () =>
  src('src/img/**/*.{png, jpg, jpeg}')
    .pipe(webp({ quality: 90 }))
    .pipe(dest(path.build.img))
    .pipe(server.stream());

const sprite = () =>
  src('src/img/**/icon-*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(dest(path.build.img))
    .pipe(server.stream());

const clean = () => 
  del(path.clean);

const fonts = () => 
  src(path.src.fonts)
    .pipe(dest(path.build.fonts));

const html = () =>
  src(path.src.html)
    .pipe(dest(path.build.html));

const build = async () => 
  series(
    clean,
    await parallel(
      fonts,
      html,
      images,
      style,
      js
    ))();

const serve = () => {
  server.init(serverConfig);

  watch(path.watch.style, parallel(style));
  watch(path.watch.html, parallel(html));
  watch(path.watch.js, parallel(js));
  watch(path.watch.img, parallel(images));
};

task('default', build);
task('start', series(build, serve));
