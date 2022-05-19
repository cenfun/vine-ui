
import { h, createApp } from 'vue';
import { hasOwn } from './util.js';

function createElement(rootComponent, rootProps, container) {

    if (typeof rootProps === 'function') {
        rootProps = rootProps.call(this, h);
    }

    let slots;
    if (hasOwn(rootProps, 'slots')) {
        slots = rootProps.slots;
        delete rootProps.slots;
    }

    //console.log(rootProps);

    const app = createApp({
        setup() {
            return () => h(rootComponent, rootProps, slots);
        }
    });
    //console.log('app', app);
    
    if (container) {
        app.mount(container);
    } else {
        const instance = app.mount(document.createDocumentFragment());
        document.body.appendChild(instance.$el);
    }

    return app;
}

const registerComponent = (Component) => {
    if (!Component) {
        console.log(`Failed to register component: ${Component}`);
        return;
    }
    Component.create = function(rootProps, container) {
        return createElement(Component, rootProps, container);
    };
};

export default registerComponent;
