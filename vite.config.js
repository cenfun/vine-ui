import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import { parse } from 'vue-docgen-api';

import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

import { defineConfig } from 'vite';

// Replace with your library id
const ID = 'vine-ui';

const timestamp = (postfix) => {
    let ts = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().slice(2, 19);
    ts = ts.replace(/[-:]/g, '');
    ts = ts.replace('T', '-');
    if (postfix) {
        ts = `${ts}-${postfix}`;
    }
    return ts;
};

const getCommit = () => {
    const headPath = path.resolve('.git/HEAD');
    if (fs.existsSync(headPath)) {
        const rev = fs.readFileSync(headPath).toString().trim();
        if (rev.indexOf(':') === -1) {
            return rev.slice(0, 8);
        }
        const refPath = rev.split(':').pop().trim();
        return fs.readFileSync(`.git/${refPath}`).toString().trim().slice(0, 8);
    }
    return '';
};

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));

const tag = {
    timestamp: timestamp(),
    commit: getCommit()
};

function buildEndPlugin() {
    return {
        name: 'build-end',
        closeBundle() {
            const sourceFile = path.resolve(import.meta.dirname, `src/${ID}.d.ts`);
            const targetFile = path.resolve(import.meta.dirname, `dist/${ID}.d.ts`);
            fs.mkdirSync(path.dirname(targetFile), {
                recursive: true
            });
            fs.copyFileSync(sourceFile, targetFile);
            console.log(`copied types to dist/${ID}.d.ts`);
        }
    };
}


function vitePluginMetadata() {
    let generated = false;
    return {
        name: 'vine-ui-metadata',
        // eslint-disable-next-line complexity
        async buildStart() {
            if (generated) {
                return;
            }
            generated = true;
            const rootDir = path.resolve(import.meta.dirname, './');
            const componentDir = path.resolve(rootDir, 'src/components');
            const examplesDir = path.resolve(rootDir, 'examples/examples');
            const tempDir = path.resolve(rootDir, '.temp');

            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, {
                    recursive: true
                });
            }

            console.log('[vine-ui-metadata] generating components info ...');

            // parse components, keyed by filename stem
            const parsed = {};
            const componentList = fs.readdirSync(componentDir);
            for (const file of componentList) {
                if (!file.endsWith('.vue')) {
                    continue;
                }
                const filePath = path.resolve(componentDir, file);
                const stem = file.slice(0, -4);
                try {
                    const result = await parse(filePath);
                    parsed[stem] = result;
                    if (result.displayName && result.displayName !== stem) {
                        parsed[result.displayName] = result;
                    }
                } catch (e) {
                    console.log(`[vine-ui-metadata] skip component ${file}: ${e.message}`);
                }
            }

            // group example sources by group key (stem before first dot)
            const info = {};
            const exampleList = fs.readdirSync(examplesDir);
            for (const file of exampleList) {
                if (!file.endsWith('.vue')) {
                    continue;
                }
                const key = file.slice(0, -4);
                const groupKey = key.split('.')[0];
                if (!info[groupKey]) {
                    const component = parsed[groupKey] || {};
                    info[groupKey] = {
                        props: component.props || null,
                        events: component.events || null,
                        slots: component.slots || null,
                        expose: component.expose || null,
                        source: {}
                    };
                }
                let source = fs.readFileSync(path.resolve(examplesDir, file), 'utf-8');
                source = source.replace('../vine-ui.js', 'vine-ui');
                info[groupKey].source[file] = source;
            }

            const metadataPath = path.resolve(tempDir, 'metadata.json');
            fs.writeFileSync(metadataPath, JSON.stringify(info, null, 4));
            console.log(`[vine-ui-metadata] metadata generated: ${metadataPath}`);
        }
    };
}

export default defineConfig(({ command, mode }) => {

    const define = {
        'window.TAG': JSON.stringify(Object.values(tag).join('-')),
        'window.VERSION': JSON.stringify(pkg.version)
    };

    if (mode === 'docs') {
        return {
            root: '.',
            base: './',
            publicDir: false,
            define,
            plugins: [vue(), vitePluginMetadata()],
            build: {
                outDir: 'docs',
                emptyOutDir: true,
                sourcemap: false,
                rolldownOptions: {
                    output: {
                        manualChunks(id) {
                            const chunks = {
                                'codemirror': 'codemirror',
                                'lezer': 'lezer',

                                'vue': 'vue',
                                'src': 'vine-ui',

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
            },
            preview: {
                host: '127.0.0.1',
                port: 4173,
                strictPort: false,
                open: true
            }
        };
    }

    if (command === 'serve') {
        return {
            root: '.',
            publicDir: 'public',
            define,
            plugins: [vue(), vitePluginMetadata()],
            server: {
                open: '/'
            }
        };
    }

    // Production build (library)
    return {
        root: '.',
        plugins: [
            vue(),
            cssInjectedByJs(),
            buildEndPlugin()
        ],
        publicDir: false,
        define,
        build: {
            outDir: 'dist',
            lib: {
                entry: path.resolve(import.meta.dirname, 'src/index.js'),
                name: ID,
                formats: ['umd', 'es'],
                fileName: (format) => (format === 'umd' ? `${ID}.js` : `${ID}.esm.js`)
            },
            rolldownOptions: {
                external: ['vue'],
                output: {
                    exports: 'named',
                    globals: {
                        vue: 'Vue'
                    }
                }
            },
            sourcemap: false,
            cssCodeSplit: false,
            emptyOutDir: true
        }
    };
});
