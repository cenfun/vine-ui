export default function(el) {
    el.addEventListener('focus', (e) => {
        if (el.getAttribute('readonly')) {
            return;
        }
        el.select();
    });
}
