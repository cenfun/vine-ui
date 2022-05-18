export const isInvalid = function(data) {
    if (typeof data === 'undefined' || data === null) {
        return true;
    }
    return false;
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

export const isList = function(data) {
    if (data && data instanceof Array && data.length > 0) {
        return true;
    }
    return false;
};

export const toList = function(data) {
    if (typeof (data) === 'undefined') {
        return [];
    }
    if (data instanceof Array) {
        return data;
    }
    return [data];
};

export const token = function(len, pre = '') {
    let str = Math.random().toString().substr(2);
    if (len) {
        str = str.substr(0, toNum(len));
    }
    return pre + str;
};

export const hasOwn = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

export const getValue = function(data, dotPathStr, defaultValue) {
    if (!dotPathStr) {
        return defaultValue;
    }
    let current = data;
    const list = dotPathStr.split('.');
    const lastKey = list.pop();
    while (current && list.length) {
        const item = list.shift();
        current = current[item];
    }
    if (current && hasOwn(current, lastKey)) {
        const value = current[lastKey];
        if (typeof (value) !== 'undefined') {
            return value;
        }
    }
    return defaultValue;
};

export const clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
};

export default {
    isInvalid,
    toNum,
    isList,
    toList,
    token,
    getValue,
    clamp
};
