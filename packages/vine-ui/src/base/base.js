import {
    createApp, h, useSlots
} from 'vue';

import { pascalToKebabCase } from '../util/util.js';
import './base.scss';

import Portal from './portal.vue';


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
    if (typeof $el === 'string') {
        $el = document.querySelector($el);
    }
    const component = componentMap.get($el);
    if (component) {
        component.unmount();
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

    //container state
    const hasContainer = Boolean(container);

    let instance;
    const instanceRender = () => {
        instance = h(Component, props, slots);
        return instance;
    };

    const app = createApp({
        setup() {
            //async
            if (hasContainer) {
                return instanceRender;
            }
            return () => h(Portal, {}, {
                default: instanceRender
            });
        }
    });

    let portalContainer;
    if (!hasContainer) {
        portalContainer = document.createElement('div');
        container = portalContainer;
    }

    const component = app.mount(container);

    //custom unmount for component
    component.unmount = () => {
        app.unmount();
        if (portalContainer) {
            portalContainer.remove();
            portalContainer = null;
        }
    };

    //component.$el is componentContainer.firstChild
    //console.log(component.$el, componentContainer.firstChild);

    //console.log(instance.el);

    componentMap.set(instance.el, component);

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
