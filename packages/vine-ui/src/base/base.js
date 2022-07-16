import { createApp, h } from 'vue';

import Util from '../util/util.js';
import './base.scss';


let _uid = 1;
export const useBase = (name) => {
    //unique id
    const uid = `${_uid++}`;
    //component id, instance id, rui-name-uid
    const kebab = Util.pascalToKebabCase(name);
    const cid = `${kebab}-${uid}`;

    return {
        uid,
        cid
    };
};

export const BaseRender = {

    props: {
        content: {
            validator: (v) => true,
            default: ''
        }
    },

    setup(props, ctx) {

        //render function
        if (typeof props.content === 'function') {
            return () => {
                return props.content.call(ctx, h, ctx);
            };
        }

        //text node
        return () => props.content;

    }

};

const componentMap = new WeakMap();
export const unmountComponent = function($el) {
    if (!$el) {
        return;
    }
    const app = componentMap.get($el);
    if (app) {
        app.unmount();
    }
};

export const createComponent = function(props, slots, container) {
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

    //console.log(instance);

    componentMap.set(instance.$el, app);

    //console.log('app', app);

    return app;

};

export const vSelectOnFocus = function(el) {
    el.addEventListener('focus', (e) => {
        if (el.getAttribute('readonly')) {
            return;
        }
        el.select();
    });
};


export default {
    useBase,
    BaseRender,

    unmountComponent,
    createComponent,

    vSelectOnFocus
};
