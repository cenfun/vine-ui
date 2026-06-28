import { createVNode, render } from 'vue';
import VuiToast from './components/toast.vue';

export const mount = (Component, options) => {

    const vn = createVNode(Component, options.props, options.children);

    if (options.app && options.app._context) {
        vn.appContext = options.app._context;
    }

    let el = options.el;
    if (!el) {
        el = document.createElement('div');
        document.body.appendChild(el);
    }

    render(vn, el);

    const unmount = () => {
        if (el) {
            render(null, el);
            el.remove();
            el = null;
        }
    };

    return {
        el,
        unmount
    };
};


export const initGlobalTooltips = (onEnter, onLeave, getTooltip) => {
    if (typeof onEnter !== 'function' || typeof onLeave !== 'function') {
        return;
    }

    if (typeof getTooltip !== 'function') {
        getTooltip = (target) => {
            return target.getAttribute('tooltip');
        };
    }

    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target;
        const text = getTooltip(target);
        if (text) {
            onEnter(target, text);
        }
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target;
        const text = getTooltip(target);
        if (text) {
            onLeave(target);
        }
    }, true);

};

let toastContainer;

/**
 *
 * @param {*} options: type, content, timeout
 * @param {*} container
 * @returns
 */
export const showToast = (options, container) => {
    if (!container) {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 8px;
            `;
            document.body.appendChild(toastContainer);
        }
        container = toastContainer;
    }

    const el = document.createElement('div');
    container.appendChild(el);

    const vn = mount(VuiToast, {
        el,
        props: {
            type: options.type,
            content: options.content
        }
    });

    setTimeout(() => {
        vn.unmount();
    }, options.timeout || 2000);

    return vn;
};
