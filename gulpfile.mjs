import path from 'path'
import fs from 'fs'
import { glob } from 'glob'

import { src, dest, watch, series } from 'gulp'
import sharp from 'sharp'

// Dependencias de CSS - SASS.

import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';
const sass = gulpSass(dartSass);


// Función CSS
export const css = (done) => {

    // Compilar SASS.
    // Pasos: 1.- Identificar archivo. 2.- Compilarlo. 3.- Guardarlo.
    src('src/scss/app.scss') // 1.
        .pipe(sourcemaps.init())  
        .pipe(sass({ outputStyle: 'expanded' })) // 2.
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.')) 
        .pipe(dest('build/css')) // 3.
    done();

};

export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './build/img';
    const images = await glob('./src/img/**/*.{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif) 
}


// Función dev para observar cambios
export const dev = () => {

    // Utilizamos un watch para estar atentos a los cambios que
    // se produzcan en el archivo .sass para compilarlos 
    // y reflejarlos y en pantalla.
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);

};

// Exportaciones
export default series(imagenes, css, dev);