import gulp from 'gulp';
const { src, dest, watch, series } = gulp;

// Dependencias de CSS - SASS.

import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
const sass = gulpSass(dartSass);

// Dependencias imagenes

import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

// Función CSS
export const css = (done) => {

    // Compilar SASS.
    // Pasos: 1.- Identificar archivo. 2.- Compilarlo. 3.- Guardarlo.
    src('src/scss/styles.scss') // 1.
    .pipe( sass( {outputStyle:'expanded'} ) ) // 2.
    .pipe( postcss( [ autoprefixer() ] ) )
    .pipe( dest('build/css') ) // 3.
    done();

};

export const imagenes = () => {
    return  ( 
        src('./src/img/**/*')
        .pipe( imagemin() )
        .pipe( dest('build/img') )
    );
};

export const convertirWebp = () => {

    const opciones = {quality : 50};
    return src(['./src/img/**/*.png', './src/img/**/*.jpg'])
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )

};

export const convertirAvif = () => {

    const opciones = {quality : 50, method: 'ssim'};
    return src(['./src/img/**/*.png', './src/img/**/*.jpg'])
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )

};
// Función dev para observar cambios
export const dev = () => {

    // Utilizamos un watch para estar atentos a los cambios que
    // se produzcan en el archivo .sass para compilarlos 
    // y reflejarlos y en pantalla.
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);

};

// Exportaciones
export default series(imagenes, convertirWebp, convertirAvif, css, dev);