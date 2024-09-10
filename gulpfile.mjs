import gulp from 'gulp';
const { src, dest, watch, series } = gulp;

// DEPENDENCIAS CSS Y SASS

import * as dartSass from sass;
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
const sass = gulpSass(dartSass);

// DEPENDENCIAS IMAGENES 
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

export const css = ( done ) => {

    src('./src/scss/app.scss')
        .pipe( sass() )
        .pipe( postcss( [ autoprefixer() ] ))
        .pipe( dest('build/css ') )

    done();
}

export const imagenes = () => {
    return src('./src/img/**/*')
    .pipe( imagemin( { optimizationLevel: 3 } ))
    .pipe(dest('build/img/'))
}


function dev(){

    watch('./src/scss/**/*.scss', css);
    watch('./src/img/**/*', imagenes);
}

/* exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.default = series( imagenes, css, dev ); */

export default series(imagenes, convertirWebp, convertirAvif, css, dev);