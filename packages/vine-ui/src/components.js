import generateComponents from './utils/generate-components.js';
const context = require.context('./components', true, /\.vue$/);
const components = generateComponents(context);
// console.log(components);

export default components;
