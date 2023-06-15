import { useSlots, useAttrs } from 'vue';
import { isList, pascalToKebabCase } from '../utils/util.js';
import './base.scss';


let _uid = 1;
export const useBase = (name) => {
    // unique id
    const uid = `${_uid++}`;
    // component id, instance id, rui-name-uid
    const kebab = pascalToKebabCase(name);
    const cid = `${kebab}-${uid}`;

    return {
        uid,
        cid
    };
};

export const bindAttrs = function(excludes) {
    const attrs = useAttrs();
    if (isList(excludes)) {
        const filtered = {};
        Object.keys(attrs).filter((k) => !excludes.includes(k)).forEach((k) => {
            filtered[k] = attrs[k];
        });
        return filtered;
    }
    return attrs;
};

export const getSlot = function(name) {
    const slots = useSlots();
    const fun = slots[name || 'default'];
    if (typeof fun === 'function') {
        return fun();
    }
};

export const vSelectOnFocus = function(el, binding) {
    if (!binding.value) {
        return;
    }
    el.addEventListener('focus', (e) => {
        if (el.getAttribute('readonly') !== null || !el.value) {
            return;
        }
        el.select();
    });
};

export default {
    useBase,

    getSlot,

    vSelectOnFocus
};
