export const isNum = function(num) {
    if (typeof num !== 'number' || isNaN(num)) {
        return false;
    }
    const isInvalid = function(n) {
        if (n === Number.MAX_VALUE || n === Number.MIN_VALUE || n === Number.NEGATIVE_INFINITY || n === Number.POSITIVE_INFINITY) {
            return true;
        }
        return false;
    };
    if (isInvalid(num)) {
        return false;
    }
    return true;
};

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

export const zero = function(s, l = 2) {
    s = `${s}`;
    return s.padStart(l, '0');
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

export const kebabToPascalCase = function(text) {
    return (`${text}`).trim()
        .split('-')
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
        .join('');
};

export const pascalToKebabCase = function(text) {
    return (`${text}`).trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\W/g, (m) => ((/[À-ž]/).test(m) ? m : '-'))
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-')
        .toLowerCase();
};

export const uid = function(len = 20, prefix = '') {
    const dict = '0123456789abcdefghijklmnopqrstuvwxyz';
    const dictLen = dict.length;
    let str = prefix;
    while (len--) {
        str += dict[Math.random() * dictLen | 0];
    }
    return str;
};

export const getCID = (name) => {
    // component id, instance id, rui-name-uid
    const kebab = pascalToKebabCase(name);
    const cid = `${kebab}-${uid(5)}`;
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

/** Normalize short direction/position values to full names */
export const normalizeDirection = (value) => {
    if (value === 'r') {
        return 'row';
    }
    if (value === 'c') {
        return 'column';
    }
    return value;
};

export const normalizePosition = (value) => {
    if (value === 'r') {
        return 'right';
    }
    if (value === 'l') {
        return 'left';
    }
    return value;
};

export const vInit = function(el, binding) {
    if (!binding.value) {
        return;
    }
    Object.keys(binding.value).forEach((key) => {
        el.setAttribute(key, binding.value[key]);
    });
};


export const isDate = function(date) {
    if (!date || !(date instanceof Date)) {
        return false;
    }
    // is Date Object but Date {Invalid Date}
    if (isNaN(date.getTime())) {
        return false;
    }
    return true;
};

export const toDate = (input, fixTimezone) => {
    if (isDate(input)) {
        return input;
    }
    const date = new Date(input);
    if (isDate(date)) {
        // fix timezone, toISOString
        if (fixTimezone) {
            return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        }
        return date;
    }
    return new Date();
};


// yyyy-mm-dd
export const YMD = (input, cn) => {

    if (typeof input === 'string') {
        input = input.replace('年', '-');
        input = input.replace('月', '-');
        input = input.replace('日', '');
    }

    const date = toDate(input, true);
    const ts = date.toISOString().slice(0, 10);
    if (!cn) {
        return ts;
    }

    const [y, m, d] = ts.split('-');
    return `${y}年${parseInt(m)}月${parseInt(d)}日`;
};

export const highlightKeywords = (text, keywords) => {

    const highlightPre = '<mark>';
    const highlightPost = '</mark>';

    let keyIndex = 0;
    const nextKey = () => {
        if (keyIndex >= keywords.length) {
            keyIndex = 0;
        }
        return keywords[keyIndex++];
    };

    let key = nextKey();

    const lowText = text.toLowerCase();
    const list = [];
    let startPos = 0;
    const textLength = text.length;
    let hasKeyMatched = false;
    while (startPos < textLength) {
        const index = lowText.indexOf(key, startPos);
        if (index === -1) {
            break;
        }

        list.push(text.slice(startPos, index));
        list.push(highlightPre);

        startPos = index + key.length;
        key = nextKey();
        hasKeyMatched = true;

        list.push(text.slice(index, startPos));
        list.push(highlightPost);

    }

    if (hasKeyMatched) {
        if (startPos < textLength) {
            list.push(text.slice(startPos, textLength));
        }
        text = list.join('');
    }

    return text;
};
