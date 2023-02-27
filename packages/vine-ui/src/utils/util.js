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
        if (item.target) {
            item.target.removeEventListener(type, item.handler, item.options);
        }
    });
};

export const bindEvents = function(events, target) {
    if (!events) {
        return;
    }
    unbindEvents(events);
    Object.keys(events).forEach((type) => {
        const item = events[type];
        item.target = item.target || target;
        item.target.addEventListener(type, item.handler, item.options);
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
