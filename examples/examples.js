import { kebabToPascalCase } from '../src/utils/util.js';
const modules = import.meta.glob('./examples/**/*.vue', {
    eager: true
});

const map = {};

const paths = Object.keys(modules);
paths.forEach((path) => {

    const list = path.toLowerCase().split('/');

    // ./examples/button.vue  or  ./examples/layout-2-columns.vue
    const filename = list[2];
    const key = filename.replace(/\.vue$/, '');

    // Group by first segment (e.g. 'layout-2-columns' → group 'layout')
    const groupKey = key.split('.')[0];
    const groupName = kebabToPascalCase(groupKey);

    // componentName: use the group name (e.g. 'layout-2-columns' → 'VuiLayout')
    const componentName = `Vui${groupName}`;

    const Example = modules[path].default;

    const exampleName = `Example${groupName}`;

    let item = map[exampleName];
    if (!item) {
        item = {
            // path both for router and router-link
            path: `/${groupKey}`,

            key: groupKey,
            componentName,
            list: []
        };
        map[exampleName] = item;
    }

    // example list
    item.list.push({
        path: `${list.slice(2).join('/')}`,
        component: Example
    });
});

const examples = Object.values(map);

export default examples;
