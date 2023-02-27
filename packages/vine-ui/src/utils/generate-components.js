
export default function(context) {

    const components = {};

    const paths = context.keys();
    // console.log(paths);

    paths.forEach((path) => {

        // console.log(path);

        // get folder name
        // kebab case, custom element names must contain a hyphen.
        const list = path.toLowerCase().split('/');

        // file and folder should be same
        const fileName = list.pop();
        const folderName = list.pop();

        // "./vui-button/vui-button.vue"

        // entry file name must be same with folder name
        if (fileName !== `${folderName}.vue`) {
            // console.log(`ignore ${path}`);
            return;
        }

        const N = folderName.slice(0, 1).toUpperCase() + folderName.slice(1).toLowerCase();
        const componentName = `Vui${N}`;

        // esModule default
        const Component = context(path).default;
        // console.log(context(path));

        // no private component
        if (Component.private) {
            return;
        }

        components[componentName] = Component;
    });

    // console.log(components);
    return components;
}
