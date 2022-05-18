
import { h, createApp } from 'vue';
//import Util from './util.js';

function createElement(vNode, option, container) {

    if (typeof (option) === 'function') {
        option = option.call(this, h);
    }

    const vn = createApp(vNode, option).mount(container);
    
    return vn;
}


const registerComponent = (Component) => {
    if (!Component) {
        return;
    }
    Component.create = function(option, container) {
        return createElement(Component, option, container);
    };
};

export default registerComponent;
