import { h, useSlots } from 'vue';

import { pascalToKebabCase } from '../utils/util.js';
import './base.scss';


let _uid = 1;
export const useBase = (name) => {
    // unique id
    const uid = `${_uid++}`;
    // component id, instance id, rui-name-uid
    const kebab = pascalToKebabCase(name);
    const cid = `${kebab}-${uid}`;

    let undef;

    return {
        uid,
        cid,
        undef
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

        // render function
        if (typeof props.content === 'function') {
            return () => {
                return props.content.call(ctx, h, ctx);
            };
        }

        // text node
        return () => props.content;

    }

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

    getSlot,

    vSelectOnFocus
};
