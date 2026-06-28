import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';
import vitePluginMetadata from './scripts/vite-plugin-metadata.mjs';

const metadataPlugin = vitePluginMetadata();

export default defineConfig(({ command, mode }) => {
    const isDev = command === 'serve';
    const isDocs = mode === 'docs';

    if (isDev || isDocs) {
        // Dev mode or docs build: serve/build the app (demo site)
        return {
            plugins: [vue(), metadataPlugin],
            root: '.',
            base: './',
            server: {
                open: true
            },
            build: isDocs ? {
                outDir: 'docs',
                emptyOutDir: true
            } : null
        };
    }

    // Build mode: build the vine-ui library
    return {
        plugins: [
            vue(),
            metadataPlugin,
            cssInjectedByJs(),
            {
                name: 'copy-dts',
                closeBundle() {
                    const src = resolve(__dirname, 'src/vine-ui/vine-ui.d.ts');
                    const dest = resolve(__dirname, 'dist/vine-ui.d.ts');
                    copyFileSync(src, dest);
                    console.log('[copy-dts] copied to dist/vine-ui.d.ts');
                }
            }
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/vine-ui/index.js'),
                name: 'vine-ui',
                formats: ['umd', 'es'],
                fileName: (format) => (format === 'es' ? 'vine-ui.esm.js' : 'vine-ui.js')
            },
            rollupOptions: {
                external: ['vue'],
                output: {
                    globals: {
                        vue: 'Vue'
                    }
                }
            },
            outDir: 'dist',
            emptyOutDir: true,
            cssCodeSplit: false
        }
    };
});
