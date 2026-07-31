import { defineConfig } from 'vite';
import fs from 'fs';
import { resolve } from 'path';
import { parse } from 'vue-docgen-api';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

function vitePluginMetadata() {
    let generated = false;
    return {
        name: 'vine-ui-metadata',
        async buildStart() {
            if (generated) {
                return;
            }
            generated = true;
            const rootDir = resolve(import.meta.dirname, './');
            const componentDir = resolve(rootDir, 'src/vine-ui/components');
            const examplesDir = resolve(rootDir, 'src/docs/examples');
            const tempDir = resolve(rootDir, '.temp');

            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }

            console.log('[vine-ui-metadata] generating components info ...');

            const componentPathList = [];
            const componentList = fs.readdirSync(componentDir);
            componentList.forEach((file) => {
                const filePath = resolve(componentDir, file);
                if (fs.statSync(filePath).isFile() && file.endsWith('.vue')) {
                    componentPathList.push(filePath);
                }
            });

            const examplePathList = [];
            const exampleList = fs.readdirSync(examplesDir);
            exampleList.forEach((file) => {
                const filePath = resolve(examplesDir, file);
                if (fs.statSync(filePath).isFile() && file.endsWith('.vue')) {
                    examplePathList.push(filePath);
                }
            });

            const info = {};

            for (const filePath of componentPathList) {
                const result = await parse(filePath);
                info[result.displayName] = result;
            }

            for (const filePath of examplePathList) {
                let source = fs.readFileSync(filePath, 'utf-8');
                source = source.replace('../vine-ui.js', 'vine-ui');

                const parts = filePath.split(/[/\\]/);
                const filename = parts[parts.length - 1];
                const key = filename.replace(/\.vue$/, '');
                const displayName = info[key] ? key : key.split(/[.-]/)[0];
                if (!info[displayName]) {
                    continue;
                }
                if (!info[displayName].source) {
                    info[displayName].source = {};
                }
                info[displayName].source[filename] = source;
            }

            const metadataPath = resolve(tempDir, 'metadata.json');
            fs.writeFileSync(metadataPath, JSON.stringify(info, null, 4));
            console.log(`[vine-ui-metadata] metadata generated: ${metadataPath}`);
        }
    };
}

const metadataPlugin = vitePluginMetadata();

export default defineConfig(({ command, mode }) => {

    if (mode === 'docs') {
        // Dev mode or docs build: serve/build the app (demo site)
        return {
            plugins: [vue(), metadataPlugin],
            root: '.',
            base: './',
            server: {
                open: true
            },
            build: {
                outDir: 'docs',
                emptyOutDir: true,
                rolldownOptions: {
                    output: {
                        manualChunks(id) {
                            const chunks = {
                                'codemirror': 'codemirror',
                                'lezer': 'lezer',

                                'vue': 'vue',
                                'src/vine-ui': 'vine-ui',

                                'node_modules': 'vendor'
                            };
                            for (const key in chunks) {
                                if (id.includes(key)) {
                                    return chunks[key];
                                }
                            }
                        }
                    }
                }
            }
        };
    }

    if (command === 'serve') {
        // Dev mode: serve the app (demo site)
        return {
            plugins: [vue(), metadataPlugin],
            root: '.',
            base: './',
            server: {
                open: true
            }
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
                    const src = resolve(import.meta.dirname, 'src/vine-ui/vine-ui.d.ts');
                    const dest = resolve(import.meta.dirname, 'dist/vine-ui.d.ts');
                    fs.copyFileSync(src, dest);
                    console.log('[copy-dts] copied to dist/vine-ui.d.ts');
                }
            }
        ],
        build: {
            lib: {
                entry: resolve(import.meta.dirname, 'src/vine-ui/index.js'),
                name: 'vine-ui',
                formats: ['umd', 'es'],
                fileName: (format) => (format === 'es' ? 'vine-ui.esm.js' : 'vine-ui.js')
            },
            rolldownOptions: {
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
