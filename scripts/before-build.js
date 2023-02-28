const fs = require('fs');
const path = require('path');

module.exports = async (item, Util) => {

    if (item.name !== 'app') {
        return 0;
    }

    const DG = require('vue-docgen-api');
    console.log('generating components info ...');

    const demosPath = path.resolve(item.componentPath, '../vine-ui/src/components');
    // console.log(demosPath);

    const list = [];
    Util.forEachFile(demosPath, ['.vue'], (filename, dir) => {

        // ignore sub .vue file
        const folder = dir.split(/\/|\\/).pop();
        if (filename !== `${folder}.vue`) {
            return;
        }

        const filePath = path.resolve(dir, filename);
        list.push(filePath);
    });

    const info = {};
    for (const p of list) {
        const res = await DG.parse(p);
        info[res.displayName] = res;
        console.log(`metadata generated ${res.displayName}: ${p}`);
    }

    const infoStr = JSON.stringify(info, null, 4);

    fs.writeFileSync(path.resolve(item.componentPath, 'src/metadata.json'), infoStr);

    return 0;
};
