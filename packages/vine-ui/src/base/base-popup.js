
import { toNum } from '../util/util.js';
import './base-popup.scss';

const isWindow = (obj) => {
    return Boolean(obj && obj === obj.window);
};

const isDocument = (obj) => {
    return Boolean(obj && obj.nodeType === 9);
};

const isElement = (obj) => {
    return Boolean(obj && obj.nodeType === 1);
};

export const toRect = (obj) => {
    if (obj) {
        return {
            left: toNum(obj.left),
            top: toNum(obj.top),
            width: toNum(obj.width),
            height: toNum(obj.height)
        };
    }
    return {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };
};

export const getElement = (selector) => {
    if (typeof selector === 'string' && selector) {
        if (selector.startsWith('#')) {
            return document.getElementById(selector.slice(1));
        }
        return document.querySelector(selector);
    }

    if (isDocument(selector)) {
        return selector.body;
    }
    if (isElement(selector)) {
        return selector;
    }
};

export const getRect = (target, padding = 0) => {
    if (!target) {
        return toRect();
    }

    if (isWindow(target)) {
        return {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    const elem = getElement(target);
    if (!elem) {
        return toRect(target);
    }

    const br = elem.getBoundingClientRect();
    const rect = toRect(br);

    // fix offset
    rect.left += window.pageXOffset;
    rect.top += window.pageYOffset;
    rect.width = elem.offsetWidth;
    rect.height = elem.offsetHeight;

    // fix padding
    if (padding) {
        rect.left -= padding;
        rect.top -= padding;
        rect.width += padding * 2;
        rect.height += padding * 2;
    }

    // console.log(elem.tagName, rect);

    return rect;
};

// ===========================================================================================

export const defaultPositions = {

    'bottom-center': {
        direction: 'h',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = containerRect.top + containerRect.height - targetRect.top - targetRect.height - rect.height;
            info.top = targetRect.top + targetRect.height;
            info.left = Math.round(targetRect.left + targetRect.width * 0.5 - rect.width * 0.5);
        }
    },

    'bottom-right': {
        direction: 'h',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = containerRect.top + containerRect.height - targetRect.top - targetRect.height - rect.height;
            info.top = targetRect.top + targetRect.height;
            info.left = Math.round(targetRect.left + targetRect.width * 0.5);
        }
    },

    'bottom-left': {
        direction: 'h',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = containerRect.top + containerRect.height - targetRect.top - targetRect.height - rect.height;
            info.top = targetRect.top + targetRect.height;
            info.left = Math.round(targetRect.left + targetRect.width * 0.5 - rect.width);
        }
    },

    // ===========================================================================================

    'top-center': {
        direction: 'h',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = targetRect.top - rect.height - containerRect.top;
            info.top = targetRect.top - rect.height;
            info.left = Math.round(targetRect.left + targetRect.width * 0.5 - rect.width * 0.5);
        }
    },

    'top-right': {
        direction: 'h',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = targetRect.top - rect.height - containerRect.top;
            info.top = targetRect.top - rect.height;
            info.left = Math.round(targetRect.left + targetRect.width * 0.5);
        }
    },

    'top-left': {
        direction: 'h',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = targetRect.top - rect.height - containerRect.top;
            info.top = targetRect.top - rect.height;
            info.left = Math.round(targetRect.left + targetRect.width * 0.5 - rect.width);
        }
    },

    // ===========================================================================================

    'right-center': {
        direction: 'v',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = containerRect.left + containerRect.width - targetRect.left - targetRect.width - rect.width;
            info.top = Math.round(targetRect.top + targetRect.height * 0.5 - rect.height * 0.5);
            info.left = targetRect.left + targetRect.width;
        }
    },

    'right-bottom': {
        direction: 'v',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = containerRect.left + containerRect.width - targetRect.left - targetRect.width - rect.width;
            info.top = Math.round(targetRect.top + targetRect.height * 0.5);
            info.left = targetRect.left + targetRect.width;
        }
    },

    'right-top': {
        direction: 'v',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = containerRect.left + containerRect.width - targetRect.left - targetRect.width - rect.width;
            info.top = Math.round(targetRect.top + targetRect.height * 0.5 - rect.height);
            info.left = targetRect.left + targetRect.width;
        }
    },

    // ===========================================================================================

    'left-center': {
        direction: 'v',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = targetRect.left - rect.width - containerRect.left;
            info.top = Math.round(targetRect.top + targetRect.height * 0.5 - rect.height * 0.5);
            info.left = targetRect.left - rect.width;
        }
    },

    'left-bottom': {
        direction: 'v',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = targetRect.left - rect.width - containerRect.left;
            info.top = Math.round(targetRect.top + targetRect.height * 0.5);
            info.left = targetRect.left - rect.width;
        }
    },

    'left-top': {
        direction: 'v',
        calculate: (info, containerRect, targetRect, rect) => {
            info.spacePosition = targetRect.left - rect.width - containerRect.left;
            info.top = Math.round(targetRect.top + targetRect.height * 0.5 - rect.height);
            info.left = targetRect.left - rect.width;
        }
    }
};

export const getDefaultPositions = (sortKeys) => {
    const list = Object.keys(defaultPositions);

    if (sortKeys) {
        list.sort((a, b) => {
            // part left
            const al = a.split('-');
            const bl = b.split('-');
            let av = al.shift();
            let bv = bl.shift();
            let ai = sortKeys.indexOf(av);
            let bi = sortKeys.indexOf(bv);
            ai = ai === -1 ? 4 : ai;
            bi = bi === -1 ? 4 : bi;
            if (ai === bi) {
                // right part
                av = al.shift();
                bv = bl.shift();
                ai = sortKeys.indexOf(av);
                bi = sortKeys.indexOf(bv);
                ai = ai === -1 ? 4 : ai;
                bi = bi === -1 ? 4 : bi;
            }
            return ai - bi;
        });
    }

    return list;
};

// ===========================================================================================

const getSpaceAlign = (containerStart, containerSize, start, size) => {
    const s = start - containerStart;
    const e = (containerStart + containerSize) - (start + size);
    return Math.min(s, e);
};

const calculateSpace = (info, containerRect) => {
    if (info.direction === 'h') {
        info.spaceAlign += getSpaceAlign(containerRect.left, containerRect.width, info.left, info.width);
    } else {
        info.spaceAlign += getSpaceAlign(containerRect.top, containerRect.height, info.top, info.height);
    }
    info.space = Math.min(info.spacePosition, info.spaceAlign);
    return info;
};

const calculatePriority = (info) => {
    if (info.spacePosition >= 0) {
        info.priority += 1;
    }
    if (info.spaceAlign >= 0) {
        info.priority += 1;
    }
    return info;
};

const calculateChange = (info, previousInfo) => {
    if (!previousInfo) {
        return info;
    }
    // no change if type no change with previous
    if (info.type === previousInfo.type) {
        return info;
    }
    const ax = info.left + info.width * 0.5;
    const ay = info.top + info.height * 0.5;
    const bx = previousInfo.left + previousInfo.width * 0.5;
    const by = previousInfo.top + previousInfo.height * 0.5;
    const dx = Math.abs(ax - bx);
    const dy = Math.abs(ay - by);
    info.change = Math.round(Math.sqrt(dx * dx + dy * dy));
    return info;
};

const calculatePositionInfo = (defaultInfo, index, type, containerRect, targetRect, rect, previousInfo) => {
    const [position, align] = type.split('-');
    let info = {
        ... defaultInfo,
        type,
        position,
        align,
        top: 0,
        left: 0,
        width: rect.width,
        height: rect.height,
        spacePosition: 0,
        spaceAlign: 0,
        priority: 0,
        change: 0,
        space: 0,
        index
    };
    info.calculate(info, containerRect, targetRect, rect);
    delete info.calculate;
    info = calculateSpace(info, containerRect);
    info = calculatePriority(info);
    info = calculateChange(info, previousInfo);
    return info;
};

const getTypeList = (positions, defaultList) => {
    if (!positions) {
        return;
    }
    if (!(positions instanceof Array)) {
        positions = [positions];
    }
    const map = {};
    positions.forEach((item) => {
        item = (`${item}`).trim().toLowerCase();
        if (defaultPositions[item]) {
            map[item] = true;
            return;
        }
        if (!item) {
            return;
        }
        defaultList.forEach((pd) => {
            if (pd.indexOf(item) !== -1) {
                map[pd] = true;
            }
        });
    });
    const list = Object.keys(map);
    if (!list.length) {
        return;
    }
    return list;
};

export const getBestPosition = (containerRect, targetRect, rect, positions, previousInfo) => {

    const defaultList = getDefaultPositions();

    let withOrder = true;
    let typeList = getTypeList(positions, defaultList);
    if (!typeList) {
        typeList = defaultList;
        withOrder = false;
    }

    // console.log('typeList', typeList);
    // console.log('withOrder', withOrder);

    const infoList = typeList.map((type, i) => {
        return calculatePositionInfo(defaultPositions[type], i, type, containerRect, targetRect, rect, previousInfo);
    });

    infoList.sort((a, b) => {
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        if (previousInfo && a.priority === 2) {
            return a.change - b.change;
        }
        if (withOrder) {
            return a.index - b.index;
        }
        if (a.space !== b.space) {
            return b.space - a.space;
        }
        return a.index - b.index;
    });

    // console.table(infoList);

    return infoList[0];
};
