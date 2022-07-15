import Util from './util/util.js';
import { createComponent } from './base/base.js';
import generateComponents from './util/generate-components.js';

const context = require.context('./components', true, /\.vue$/);
const components = generateComponents(context);
//console.log(components);

export {
    components,
    Util,
    createComponent
};

export default components;
