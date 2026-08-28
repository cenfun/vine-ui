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
