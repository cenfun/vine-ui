export const toNum = function(num, toInt) {
    if (typeof (num) !== 'number') {
        num = parseFloat(num);
    }
    if (isNaN(num)) {
        num = 0;
    }
    if (toInt) {
        num = Math.round(num);
    }
    return num;
};

export const clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
};

export const toStr = function(input) {
    return `${input}`;
};

export const isList = function(data) {
    if (data && data instanceof Array && data.length > 0) {
        return true;
    }
    return false;
};

export const hasOwn = function(obj, key) {
    if (!obj) {
        return false;
    }
    return Object.prototype.hasOwnProperty.call(obj, key);
};

export const autoPx = function(value) {
    if (typeof value === 'string' || typeof value === 'number') {
        // exclude: 10%, 10em, 10px, 10.1(no float)
        // include 10, "10" (only int for px)
        const s = `${value}`.trim();
        if (parseInt(s).toString() === s && s !== '0') {
            return `${s}px`;
        }
    }
    return value;
};

export const unbindEvents = function(events) {
    if (!events) {
        return;
    }
    Object.keys(events).forEach((type) => {
        const item = events[type];
        if (item.currentTarget) {
            item.currentTarget.removeEventListener(type, item.handler, item.options);
            // remove current target reference for rebind, not target
            item.currentTarget = null;
        }
    });
};

/**
 *
 * @param events = {
    event_type: {
        handler: (e) => { }
        options: {}
        target: null
    }
}
 * @param target common target
 * @returns
 */
export const bindEvents = function(events, target) {
    if (!events) {
        return;
    }
    unbindEvents(events);
    Object.keys(events).forEach((type) => {
        const item = events[type];
        const currentTarget = item.target || target;
        currentTarget.addEventListener(type, item.handler, item.options);
        item.currentTarget = currentTarget;
    });
};

export const preventDefault = function(e) {
    if (e && typeof e.preventDefault === 'function' && e.cancelable) {
        e.preventDefault();
    }
};

export const pascalToKebabCase = function(text) {
    return (`${text}`).trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\W/g, (m) => ((/[À-ž]/).test(m) ? m : '-'))
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-')
        .toLowerCase();
};


let _uid = 1;
export const getCID = (name) => {
    // unique id
    const uid = `${_uid++}`;
    // component id, instance id, rui-name-uid
    const kebab = pascalToKebabCase(name);
    const cid = `${kebab}-${uid}`;
    return cid;
};

export const bindAttrs = function(attrs, excludes) {
    if (isList(excludes)) {
        const filtered = {};
        Object.keys(attrs).filter((k) => !excludes.includes(k)).forEach((k) => {
            filtered[k] = attrs[k];
        });
        return filtered;
    }
    return attrs;
};

export const getSlot = function(slots, name) {
    const fun = slots[name || 'default'];
    if (typeof fun === 'function') {
        return fun();
    }
};

export const vSelectOnFocus = function(el, binding) {
    if (!binding.value) {
        return;
    }
    el.addEventListener('focus', (e) => {
        if (el.getAttribute('readonly') !== null || !el.value) {
            return;
        }
        el.select();
    });
};
