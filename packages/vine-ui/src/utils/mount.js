import { createVNode, render } from 'vue';

export default function mount(Component, options) {

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
}
