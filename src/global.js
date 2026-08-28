import { createVNode, render } from 'vue';
import VuiToast from './components/toast.vue';

// example createApp/h: props, events, v-model, and slots
// const modelExample = () => {
//     const div = document.createElement('div');
//     document.body.appendChild(div);
//
//     const app = createApp({
//         data() {
//             return {
//                 value: 'Initial value'
//             };
//         },
//         methods: {
//             handleCustomEvent(payload) {
//                 console.log('xxx-xxx:', payload);
//             }
//         },
//         render() {
//             return h(MyComponent, {
//                 // Normal props
//                 title: 'Example',
//
//                 // @xxx-xxx="handleCustomEvent"
//                 onXxxXxx: this.handleCustomEvent,
//
//                 // v-model:value="value"
//                 value: this.value,
//                 'onUpdate:value': (newValue) => {
//                     this.value = newValue;
//                 }
//             }, {
//                 // Component slots
//                 default: () => [
//                     'Default slot content',
//                     h('span', null, 'Child element')
//                 ]
//             });
//         }
//     });
//
//     const vm = app.mount(div);
//
//     const unmount = () => {
//         app.unmount();
//         div.remove();
//     };
//
//     return {
//         el: vm.$el,
//         unmount
//     };
// };

/**
 * Mounts a Vue component or native element to a DOM element.
 *
 * - If `options.el` is not provided, a div is created and appended to document.body.
 * - If `options.app` is provided, the component inherits the Vue app context,
 *   including plugins, global components, and provided values.
 * - Call `unmount` on the returned object to unmount the component and remove its element.
 * - Pass event listeners through `options.props` using Vue's `onXxx` naming convention.
 * - To use `v-model`, pass its model prop and corresponding `onUpdate:modelName` listener.
 *
 * @param {*} Component The Vue component or native element to mount
 * @param {Object} options The mount options
 * @param {HTMLElement} [options.el] The target element
 * @param {Object} [options.props] Props passed to the component
 * @param {*} [options.children] Child nodes or slots. Use a string for text content, an
 *   array for multiple element children, or a slots object with functions for component children.
 * @param {import('vue').App} [options.app] The Vue app whose context should be inherited
 * @returns {{ el: HTMLElement, unmount: Function }} The target element and unmount function
 *
 * @example
 * // Create the target element automatically.
 * const toast = mount(VuiToast, {
 *     props: {
 *         type: 'success',
 *         content: 'Saved successfully'
 *     }
 * });
 *
 * // Unmount the component and remove its element when it is no longer needed.
 * toast.unmount();
 *
 * @example
 * // For a native element, pass its child VNodes as an array.
 * const element = mount('div', {
 *     children: [
 *         createVNode('span', null, 'First child'),
 *         createVNode('span', null, 'Second child')
 *     ]
 * });
 *
 * @example
 * // For a component, pass its slots as an object whose values are functions.
 * // The component can also inherit the context of an existing Vue app.
 * const result = mount(MyComponent, {
 *     el: document.querySelector('#component-container'),
 *     app,
 *     props: { title: 'Example' },
 *     children: {
 *         default: () => 'Default slot content'
 *     }
 * });
 *
 * @example
 * // Pass event listeners as props. `onClick` handles a native click event.
 * const button = mount('button', {
 *     props: {
 *         onClick: (event) => {
 *             console.log('Clicked:', event);
 *         }
 *     },
 *     children: 'Click me'
 * });
 *
 * // Convert kebab-case component event names to camelCase after the `on` prefix.
 * // For example, `@xxx-xxx="handler"` becomes `onXxxXxx: handler`.
 * const component = mount(MyComponent, {
 *     props: {
 *         onXxxXxx: (payload) => {
 *             console.log('xxx-xxx:', payload);
 *         }
 *     }
 * });
 *
 * @example
 * // The examples below show how v-model is represented as props and listeners.
 * // A direct mount does not create a reactive parent, so changing the local
 * // variable captures the emitted value but does not rerender the VNode.
 * // `v-model="value"` passes `modelValue` and listens for `update:modelValue`.
 * let value = 'Initial value';
 * const input = mount(MyInput, {
 *     props: {
 *         modelValue: value,
 *         'onUpdate:modelValue': (newValue) => {
 *             value = newValue;
 *         }
 *     }
 * });
 *
 * @example
 * // `v-model:value="value"` uses `value` as the prop and `update:value` as the event.
 * let selectedValue = 'Initial value';
 * const namedModel = mount(MyInput, {
 *     props: {
 *         value: selectedValue,
 *         'onUpdate:value': (newValue) => {
 *             selectedValue = newValue;
 *         }
 *     }
 * });
 */
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

// initGlobalTooltips((target) => {
//     const text = target.getAttribute('tooltip');
//     if (!text) {
//         if (target.clientWidth < target.scrollWidth) {
//             showTooltip(target, target.innerText);
//         }
//         return;
//     }
//     showTooltip(target, text);
// }, (target) => {
//     hideTooltip();
// });

export const initGlobalTooltips = (onEnter, onLeave) => {
    if (typeof onEnter !== 'function' || typeof onLeave !== 'function') {
        return;
    }

    const hasTooltip = (target) => {
        return target && target.hasAttribute('tooltip');
    };

    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target;
        if (hasTooltip(target)) {
            onEnter(target);
        }
    }, true);

    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target;
        if (hasTooltip(target)) {
            onLeave(target);
        }
    }, true);

};

let toastContainer;

/**
 * Shows a toast notification. A timeout of 0 disables auto-dismiss.
 * Calling the returned unmount function cancels any pending auto-dismiss timer.
 *
 * @param {*} options: type, icon, iconColor, iconSize, content, html, color, border, background, timeout
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
            icon: options.icon,
            iconColor: options.iconColor,
            iconSize: options.iconSize,
            content: options.content,
            html: options.html,
            color: options.color,
            border: options.border,
            background: options.background
        }
    });

    let timeoutId = null;
    let unmounted = false;
    const unmount = () => {
        if (unmounted) {
            return;
        }
        unmounted = true;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        vn.unmount();
    };

    const timeout = options.timeout ?? 2000;
    if (timeout !== 0) {
        timeoutId = setTimeout(unmount, timeout);
    }

    return {
        el: vn.el,
        unmount
    };
};
