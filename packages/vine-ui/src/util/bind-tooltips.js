import components from '../components.js';

const { VuiTooltip } = components;

const showTooltip = function(target, text, options = {}) {
    hideTooltip(target);

    if (typeof options === 'function') {
        options = options(target, text);
    }

    const props = {
        target,
        text,
        ... options
    };

    target.$tooltip = VuiTooltip.createComponent({
        props
    });
};

const hideTooltip = function(target) {
    if (!target.$tooltip) {
        return;
    }
    target.$tooltip.unmount();
    target.$tooltip = null;
};

export default (options, attrName = 'tooltip') => {
    if (!attrName) {
        return;
    }
    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target;
        const text = target.getAttribute(attrName);
        if (text) {
            showTooltip(target, text, options);
        }
    }, true);
    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target;
        hideTooltip(target);
    }, true);
};
