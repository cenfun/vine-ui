
import { createComponent, destroyComponent } from './base/base.js';
import generateComponents from './util/generate-components.js';

const context = require.context('./components', true, /\.vue$/);
const components = generateComponents(context);
// console.log(components);

export {
    components,
    createComponent,
    destroyComponent
};

export default components;
