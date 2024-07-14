
export default (onEnter, onLeave, getTooltip) => {
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
