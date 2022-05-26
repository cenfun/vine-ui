import Util from './util/util.js';
import registerComponent from './util/register-component.js';
import VuiBase from './base/base.vue';

import generateComponents from './util/generate-components.js';

const context = require.context('./components', true, /\.vue$/);
const components = generateComponents(context);
//console.log(components);

export {
    components,
    Util,
    registerComponent,
    VuiBase
};

export default components;
