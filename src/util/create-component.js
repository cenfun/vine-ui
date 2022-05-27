
import { createApp, h } from 'vue';

const createComponent = function(props, slots, container) {
    const Component = this;
    
    if (typeof slots === 'function') {
        slots = slots.call(this, h);
    }

    // full signature
    // function h(
    //  type: string | Component,
    //  props?: object | null,
    //  children?: Children | Slot | Slots
    // ): VNode
  
    const app = createApp({
        setup() {
            return () => h(Component, props, slots);
        }
    });

    // instance proxy
    let instance;
    
    if (container) {
        instance = app.mount(container);
    } else {
        const temp = document.createElement('div');
        document.body.appendChild(temp);
        instance = app.mount(temp);
        document.body.appendChild(instance.$el);
        temp.remove();
    }

    // console.log(instance);

    //console.log('app', app);

    return app;

};

export default createComponent;