import { h } from 'vue';
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

    vSelectOnFocus
};
