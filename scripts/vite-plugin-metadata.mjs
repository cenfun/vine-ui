import fs from 'fs';
import { resolve } from 'path';
import { parse } from 'vue-docgen-api';

export default function vitePluginMetadata() {
    let generated = false;
    return {
        name: 'vine-ui-metadata',
        async buildStart() {
            if (generated) {
                return;
            }
            generated = true;
            const rootDir = resolve(import.meta.dirname, '../');
            const componentDir = resolve(rootDir, 'src/vine-ui/components');
            const examplesDir = resolve(rootDir, 'src/docs/examples');
            const tempDir = resolve(rootDir, '.temp');

            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }

            console.log('[vine-ui-metadata] generating components info ...');

            // Find component .vue files
            const componentPathList = [];
            const componentList = fs.readdirSync(componentDir);
            componentList.forEach((f) => {
                const path = resolve(componentDir, f);
                if (fs.statSync(path).isFile() && f.endsWith('.vue')) {
                    componentPathList.push(path);
                }
            });

            // Find example .vue files
            const examplePathList = [];
            const exampleList = fs.readdirSync(examplesDir);
            exampleList.forEach((f) => {
                const path = resolve(examplesDir, f);
                if (fs.statSync(path).isFile() && f.endsWith('.vue')) {
                    examplePathList.push(path);
                }
            });

            const info = {};

            // component info
            for (const p of componentPathList) {
                const res = await parse(p);
                info[res.displayName] = res;
            }

            // example source
            for (const p of examplePathList) {
                let source = fs.readFileSync(p, 'utf-8');
                source = source.replace('../vine-ui.js', 'vine-ui');

                const parts = p.split(/[/\\]/);
                const filename = parts[parts.length - 1];
                const key = filename.replace(/\.vue$/, '');
                // Try full key first (multi-word names like "date-picker"),
                // then fall back to first segment (e.g. "layout.2-columns" → "layout")
                const displayName = info[key] ? key : key.split(/[.-]/)[0];
                if (!info[displayName]) {
                    continue;
                }
                if (!info[displayName].source) {
                    info[displayName].source = {};
                }
                info[displayName].source[filename] = source;
            }

            // save metadata
            const infoStr = JSON.stringify(info, null, 4);
            const metadataPath = resolve(tempDir, 'metadata.json');
            fs.writeFileSync(metadataPath, infoStr);

            console.log(`[vine-ui-metadata] metadata generated: ${metadataPath}`);
        }
    };
}
