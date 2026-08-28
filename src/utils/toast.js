import VuiToast from '../components/toast.vue';
import { autoPx, isNum } from './util.js';
import { mount } from './mount.js';

let defaultToastContainer;
const toastUnmountsByContainer = new WeakMap();
let maxToastCount = 10;
const toastAnimationDuration = 200;
let toastContainerPosition = {
    x: 'center',
    y: 'top',
    gap: '20px'
};

const horizontalPositionMap = {
    l: 'left',
    left: 'left',
    c: 'center',
    center: 'center',
    r: 'right',
    right: 'right'
};

const verticalPositionMap = {
    t: 'top',
    top: 'top',
    c: 'center',
    center: 'center',
    b: 'bottom',
    bottom: 'bottom'
};

const normalizeToastPosition = (position, positionMap) => {
    if (typeof position !== 'string') {
        return '';
    }
    return positionMap[position.trim().toLowerCase()] || '';
};

const normalizeToastGap = (gap) => {
    if (isNum(gap)) {
        return `${Math.max(10, gap)}px`;
    }
    if (typeof gap !== 'string' || !gap.trim()) {
        return '';
    }
    return `max(10px, ${autoPx(gap.trim())})`;
};

const updateToastContainerPosition = () => {
    if (!defaultToastContainer) {
        return;
    }

    const {
        x, y, gap
    } = toastContainerPosition;
    const offset = gap;
    const transforms = [];
    const style = defaultToastContainer.style;

    style.top = '';
    style.right = '';
    style.bottom = '';
    style.left = '';
    style.transform = '';

    if (x === 'center') {
        style.left = '50%';
        transforms.push('translateX(-50%)');
    } else {
        style[x] = offset;
    }

    if (y === 'center') {
        style.top = '50%';
        transforms.push('translateY(-50%)');
    } else {
        style[y] = offset;
    }

    style.transform = transforms.join(' ');
};

/** Set the position of the built-in Toast container. The minimum gap is 10px. */
export const setToastContainerPosition = (x = 'center', y = 'top', gap = 20) => {
    x = normalizeToastPosition(x, horizontalPositionMap);
    y = normalizeToastPosition(y, verticalPositionMap);
    gap = normalizeToastGap(gap);
    if (!x || !y || !gap) {
        return;
    }
    toastContainerPosition = {
        x,
        y,
        gap
    };
    updateToastContainerPosition();
};

const getToastContainer = (container) => {
    if (container) {
        return container;
    }
    if (!defaultToastContainer) {
        defaultToastContainer = document.createElement('div');
        defaultToastContainer.style.cssText = `
        position: fixed;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        `;
        document.body.appendChild(defaultToastContainer);
        updateToastContainerPosition();
    }
    return defaultToastContainer;
};

/** Set the maximum number of toasts retained by each container. */
export const setMaxToastCount = (count) => {
    if (!isNum(count) || !Number.isInteger(count) || count < 1) {
        return;
    }
    maxToastCount = count;
};

/**
 * Shows a toast notification. An invalid timeout uses the 2000ms default; 0 disables auto-dismiss.
 * Toasts that do not auto-dismiss or last longer than one minute show a manual close button.
 * Toasts animate into and out of the direction configured for the built-in container.
 * Each container retains at most the configured number of recently added toasts (10 by default).
 * Adding another toast dismisses the oldest one and cancels its pending timer.
 * A per-call container is not affected by setToastContainerPosition.
 * Calling the returned unmount function cancels any pending auto-dismiss timer.
 *
 * @param {*} options: type, icon, iconColor, iconSize, content, html, color, border, background, timeout
 * @param {*} container
 * @returns
 */
export const showToast = (options, container) => {
    const useDefaultContainer = !container;
    container = getToastContainer(container);

    let toastUnmounts = toastUnmountsByContainer.get(container);
    if (!toastUnmounts) {
        toastUnmounts = [];
        toastUnmountsByContainer.set(container, toastUnmounts);
    }

    const el = document.createElement('div');
    container.appendChild(el);

    const timeout = isNum(options.timeout) && options.timeout >= 0 ? options.timeout : 2000;
    const close = timeout === 0 || timeout > 60000;
    const position = useDefaultContainer ? toastContainerPosition : {
        x: 'center',
        y: 'top'
    };
    let vn = null;
    let timeoutId = null;
    let leaveTimeoutId = null;
    let unmounted = false;
    let animationEndHandler = null;

    const finishUnmount = () => {
        if (leaveTimeoutId !== null) {
            clearTimeout(leaveTimeoutId);
            leaveTimeoutId = null;
        }
        const toastEl = vn.el.querySelector('.vui-toast');
        if (toastEl && animationEndHandler) {
            toastEl.removeEventListener('animationend', animationEndHandler);
        }
        vn.unmount();
    };

    const unmount = () => {
        if (unmounted) {
            return;
        }
        unmounted = true;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        const index = toastUnmounts.indexOf(unmount);
        if (index !== -1) {
            toastUnmounts.splice(index, 1);
        }

        const toastEl = vn.el.querySelector('.vui-toast');
        if (!toastEl) {
            finishUnmount();
            return;
        }
        animationEndHandler = (e) => {
            if (e.target === toastEl && e.animationName === 'vui-toast-leave') {
                finishUnmount();
            }
        };
        toastEl.addEventListener('animationend', animationEndHandler);
        toastEl.classList.add('vui-toast-leave');
        leaveTimeoutId = setTimeout(finishUnmount, toastAnimationDuration + 50);
    };

    vn = mount(VuiToast, {
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
            background: options.background,
            close,
            positionX: position.x,
            positionY: position.y,
            onClose: unmount
        }
    });

    if (timeout !== 0) {
        timeoutId = setTimeout(unmount, timeout);
    }

    toastUnmounts.push(unmount);
    while (toastUnmounts.length > maxToastCount) {
        toastUnmounts[0]();
    }

    return {
        el: vn.el,
        unmount
    };
};
