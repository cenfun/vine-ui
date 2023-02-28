const context = require.context('./demos', true, /\.vue$/);

const map = {};

const paths = context.keys();
paths.forEach((path) => {

    const list = path.toLowerCase().split('/');

    // ./button/button.vue
    const key = list[1];

    const N = key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase();

    const Demo = context(path).default;

    const demoName = `Demo${N}`;
    const componentName = `Vui${N}`;

    let item = map[demoName];
    if (!item) {
        item = {
            // path both for router and router-link
            path: `/${key}`,

            key,
            componentName,
            list: []
        };
        map[demoName] = item;
    }

    // demo list
    item.list.push({
        path: `demos/${list.slice(1).join('/')}`,
        component: Demo
    });
});

const demos = Object.values(map);

export default demos;
