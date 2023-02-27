export default (onEnter, onLeave) => {
    if (typeof onEnter !== 'function' || typeof onLeave !== 'function') {
        return;
    }
    document.body.addEventListener('mouseenter', (e) => {
        const target = e.target;
        const text = target.getAttribute('tooltip');
        if (text) {
            onEnter(target, text);
        }
    }, true);
    document.body.addEventListener('mouseleave', (e) => {
        const target = e.target;
        onLeave(target);
    }, true);
};
