
import { h, createApp } from 'vue';

const createComponent = function(props, slots, container) {
    const Component = this;
    
    if (typeof slots === 'function') {
        slots = slots.call(this, h);
    }

    const app = createApp({
        setup() {
            return () => h(Component, props, slots);
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

};

export default createComponent;
