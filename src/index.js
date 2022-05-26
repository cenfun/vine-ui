import Util from './util/util.js';
import VuiBase from './base/base.vue';
import createComponent from './util/create-component.js';

import generateComponents from './util/generate-components.js';

const context = require.context('./components', true, /\.vue$/);
const components = generateComponents(context);
//console.log(components);

export {
    components,
    Util,
    VuiBase,
    createComponent
};

export default components;
