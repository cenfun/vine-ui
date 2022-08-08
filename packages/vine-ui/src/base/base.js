import {
    createApp, h, useSlots
} from 'vue';

import { pascalToKebabCase } from '../util/util.js';
import './base.scss';


let _uid = 1;
export const useBase = (name) => {
    //unique id
    const uid = `${_uid++}`;
    //component id, instance id, rui-name-uid
    const kebab = pascalToKebabCase(name);
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
export const destroyComponent = function($el) {
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
    let component;

    if (container) {
        component = app.mount(container);
    } else {
        const temp = document.createElement('div');
        document.body.appendChild(temp);
        component = app.mount(temp);
        document.body.appendChild(component.$el);
        temp.remove();
    }

    //console.log(instance);

    componentMap.set(component.$el, app);

    //console.log('app', app);
    component.unmount = () => {
        app.unmount();
    };

    return component;

};

export const getSlot = function(name) {
    const slots = useSlots();
    const fun = slots[name || 'default'];
    if (typeof fun === 'function') {
        return fun();
    }
};

export const vSelectOnFocus = function(el) {
    el.addEventListener('focus', (e) => {
        if (el.getAttribute('readonly') !== null || !el.value) {
            return;
        }
        el.select();
    });
};


export default {
    useBase,
    BaseRender,

    destroyComponent,
    createComponent,

    getSlot,

    vSelectOnFocus
};
