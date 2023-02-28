const fs = require('fs');
const path = require('path');

module.exports = async (item, Util) => {

    if (item.name !== 'app') {
        return 0;
    }

    const DG = require('vue-docgen-api');
    console.log('generating components info ...');

    const componentPathList = [];
    const componentsPath = path.resolve(item.componentPath, '../vine-ui/src/components');
    Util.forEachFile(componentsPath, ['.vue'], (filename, dir) => {

        // ignore sub .vue file
        const folder = dir.split(/\/|\\/).pop();
        if (filename !== `${folder}.vue`) {
            return;
        }

        const filePath = path.resolve(dir, filename);
        componentPathList.push(filePath);
    });

    const demoPathList = [];
    const demosPath = path.resolve(item.componentPath, 'src/demos');
    Util.forEachFile(demosPath, ['.vue'], (filename, dir) => {
        const filePath = path.resolve(dir, filename);
        demoPathList.push(filePath);
    });

    const info = {};

    // component info
    for (const p of componentPathList) {
        const res = await DG.parse(p);
        info[res.displayName] = res;
        console.log(`metadata generated ${res.displayName}: ${p}`);
    }

    // demo source
    for (const p of demoPathList) {
        const source = fs.readFileSync(p).toString('utf-8');
        const list = p.split(/\/|\\/).slice(-3);
        const displayName = list[1];
        const sourcePath = list.join('/');
        // console.log(sourcePath);
        if (!info[displayName].source) {
            info[displayName].source = {};
        }
        info[displayName].source[sourcePath] = source;
        console.log(`source generated ${displayName}: ${sourcePath}`);
    }

    // save metadata
    const infoStr = JSON.stringify(info, null, 4);

    fs.writeFileSync(path.resolve(item.componentPath, 'src/metadata.json'), infoStr);

    return 0;
};
