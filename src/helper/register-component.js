
import createElement from './create-element.js';

const registerComponent = (Component) => {
    if (!Component) {
        return;
    }
    Component.create = function(option, container) {
        return createElement(Component, option, container);
    };
};

export default registerComponent;