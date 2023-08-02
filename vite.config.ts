/// <reference types="vitest" />
import { defineConfig } from 'vite';

const lib = defineConfig({
    build: {
        emptyOutDir: false,
        outDir: 'dist',
        minify: false,
        target: 'es2018',
        sourcemap: true,
        lib: {
            entry: 'src/index.js',
            formats: ['es'],
            fileName: 'index'
        }
    }
});

const dev = defineConfig({
    root: './demo',
    build: {
        outDir: '../build'
    },
    test: {
        include: ['../**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        globals: true
    }
});

export default ({ mode }) => {
    if (mode === 'lib') return lib;
    return dev;
};