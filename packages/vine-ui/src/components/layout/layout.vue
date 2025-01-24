<template>
  <div
    ref="el"
    :class="classList"
    :style="styleList"
  >
    <slot />
  </div>
</template>

<script setup>
import {
    computed, onMounted, ref, shallowReactive, watch, watchEffect
} from 'vue';

import {
    clamp, bindEvents, unbindEvents, preventDefault, getCID
} from '../../utils/util.js';

const cid = getCID('VuiLayout');

const props = defineProps({

    width: {
        type: String,
        default: ''
    },

    height: {
        type: String,
        default: ''
    },

    direction: {
        type: String,
        default: 'row',
        validator(value) {
            return ['row', 'column'].includes(value);
        }
    },

    gutterHoverSize: {
        type: String,
        default: '2px'
    },

    gutterSize: {
        type: String,
        default: '4px'
    },

    layout: {
        type: String,
        default: ''
    },

    modelValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const data = shallowReactive({

    layout: '',
    layoutList: [],
    layoutReset: false,

    children: null,
    indexMap: new WeakMap(),
    autoNum: 0,

    // offset include border, but client not
    sizeKey: props.direction === 'row' ? 'offsetWidth' : 'offsetHeight',
    clientKey: props.direction === 'row' ? 'clientWidth' : 'clientHeight',
    offsetKey: props.direction === 'row' ? 'offsetX' : 'offsetY',

    moveGutter: null,
    moveInfo: null,
    totalSize: 0,
    prevInfo: null,
    nextInfo: null

});

watchEffect(() => {
    data.layout = props.modelValue === null ? props.layout : props.modelValue;
});

watch(() => data.layout, (v) => {
    layoutChangeHandler();
    emit('update:modelValue', v);
});

watch(() => data.layoutList, (v) => {
    layoutListChangeHandler();
});

const el = ref(null);
let $el;

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-layout',
        `vui-layout-${props.direction}`
    ];
    ls.push(cid);
    return ls;
});

const styleList = computed(() => {
    const st = {};
    if (props.width) {
        st.width = props.width;
    }
    if (props.height) {
        st.height = props.height;
    }
    if (props.gutterHoverSize) {
        st['--vui-gutter-hover-size'] = props.gutterHoverSize;
    }
    if (props.gutterSize) {
        st['--vui-gutter-size'] = props.gutterSize;
    }
    return st;
});

const mousedownEvents = {
    mousedown: {
        handler: (e) => {
            mouseDownHandler(e);
        }
    }
};

const windowEvents = {
    mousemove: {
        handler: (ee) => {
            mouseMoveHandler(ee);
        },
        options: true
    },
    mouseup: {
        handler: (ee) => {
            mouseUpHandler(ee);
        },
        options: {
            once: true
        }
    }
};

// =======================================================================================

const isAutoSize = (size) => {
    if (!size) {
        return true;
    }
    if (size === 'auto' || size === '*') {
        return true;
    }
    return false;
};

const getSize = function() {
    let size = 0;
    Array.from(arguments).forEach(($elem) => {
        if ($elem) {
            size += $elem[data.sizeKey];
        }
    });
    return size;
};

const getBorderSize = function($elem) {
    const size = getSize($elem);
    const clientSize = $elem[data.clientKey];
    return size - clientSize;
};

const getMax = ($elem, key) => {
    const $elemGutter = $elem[key];
    if (!$elemGutter) {
        return 0;
    }
    const $elemItem = $elemGutter[key];
    if (!$elemItem) {
        return 0;
    }
    const index = data.indexMap.get($elemItem);
    const size = data.layoutList[index];
    if (isAutoSize(size)) {
        return getSize($elemItem) - getBorderSize($elemItem) + getMax($elemItem, key);
    }
    return 0;
};

const getPercentSize = (size) => {
    if (!data.totalSize) {
        return '0%';
    }
    const percent = (size / data.totalSize * 100).toFixed(2);
    return `${percent}%`;
};

const getAutoSize = ($elem) => {
    const size = getSize($elem);
    return getPercentSize(size);
};

const updateTotalSize = () => {
    data.totalSize = getSize($el);
};

// =======================================================================================

const mouseDownHandler = (e) => {

    const $elem = e.target;
    if (!$elem.classList.contains('vui-layout-gutter')) {
        return;
    }

    // stop nested layout event
    e.stopImmediatePropagation();

    data.moveGutter = null;
    data.prevInfo = null;
    data.nextInfo = null;

    const moveGutter = $elem;
    const prevNode = moveGutter.previousElementSibling;
    const nextNode = moveGutter.nextElementSibling;

    if (!prevNode || !nextNode) {
        return;
    }

    data.moveGutter = moveGutter;
    moveGutter.classList.add('vui-layout-active');
    $el.classList.add('vui-layout-moving');

    initMoveInfo(e, prevNode, nextNode);

};

const initMoveInfo = (e, prevNode, nextNode) => {

    data.moveInfo = {
        startX: e.pageX,
        startY: e.pageY,
        offsetX: 0,
        offsetY: 0
    };

    // console.log('start');
    bindEvents(windowEvents, window);

    // for percent
    updateTotalSize();
    // console.log(data.totalSize);

    const prevInfo = {
        node: prevNode
    };
    const nextInfo = {
        node: nextNode
    };

    // min
    prevInfo.min = getBorderSize(prevNode);
    nextInfo.min = getBorderSize(nextNode);

    // max
    const maxSize = getSize(prevNode, nextNode);
    // console.log('maxSize', maxSize);

    const nextMax = getMax(nextNode, 'nextElementSibling');
    const prevMax = getMax(prevNode, 'previousElementSibling');

    prevInfo.max = maxSize + nextMax - nextInfo.min;
    nextInfo.max = maxSize + prevMax - prevInfo.min;

    // size
    prevInfo.size = getSize(prevNode);
    nextInfo.size = getSize(nextNode);

    // console.log(prevInfo, nextInfo);

    initNodeInfo(prevNode, nextNode, prevInfo, nextInfo);

};

const removeAuto = ($elem, index) => {
    // at least one auto could be left
    if (data.autoNum < 2) {
        return;
    }
    const percent = getAutoSize($elem);
    data.layoutList[index] = percent;
    $elem.style.flexBasis = percent;
    $elem.classList.remove('vui-layout-auto');
};

const initNodeInfo = (prevNode, nextNode, prevInfo, nextInfo) => {
    const prevIndex = data.indexMap.get(prevNode);
    const nextIndex = data.indexMap.get(nextNode);
    const prevSize = data.layoutList[prevIndex];
    const nextSize = data.layoutList[nextIndex];

    const prevAuto = isAutoSize(prevSize);
    const nextAuto = isAutoSize(nextSize);

    if (prevAuto) {
        removeAuto(prevNode, prevIndex);
    }

    if (nextAuto) {
        removeAuto(nextNode, nextIndex);
    }

    if (prevAuto || prevSize.endsWith('%')) {
        prevInfo.percent = true;
    }

    if (nextAuto || nextSize.endsWith('%')) {
        nextInfo.percent = true;
    }

    data.prevInfo = prevInfo;
    data.nextInfo = nextInfo;

};

// =======================================================================================

const mouseMoveHandler = function(e) {
    preventDefault(e);

    const buttonPressed = e.buttons;
    if (!buttonPressed) {
        mouseUpHandler(e);
        return;
    }

    data.moveInfo.offsetX = e.pageX - data.moveInfo.startX;
    data.moveInfo.offsetY = e.pageY - data.moveInfo.startY;
    updateHandler(e);
};

const updateHandler = (e) => {

    const offset = data.moveInfo[data.offsetKey];
    // console.log(offset);

    updateNodeInfo(data.prevInfo, offset);
    updateNodeInfo(data.nextInfo, -offset);

};

const updateNodeInfo = (info, offset) => {
    if (!info) {
        return;
    }
    const newSize = clamp(info.size + offset, info.min, info.max);
    let basis = `${newSize}px`;
    if (info.percent) {
        basis = getPercentSize(newSize);
    }
    info.node.style.flexBasis = basis;
};

// =======================================================================================

const mouseUpHandler = function(e) {
    preventDefault(e);

    unbindEvents(windowEvents);

    if (data.moveGutter) {
        data.moveGutter.classList.remove('vui-layout-active');
        data.moveGutter = null;
    }

    $el.classList.remove('vui-layout-moving');
    data.prevInfo = null;
    data.nextInfo = null;

    updateLayoutList();

};

const updateLayoutList = () => {
    const oldLayout = data.layoutList;
    const newLayout = [];
    const children = data.children;
    children.forEach((child, i) => {
        const size = oldLayout[i];
        if (isAutoSize(size)) {
            newLayout.push('auto');
        } else {
            const basis = child.style.flexBasis;
            newLayout.push(basis || size);
        }
    });

    data.layoutList = newLayout;
    // console.log(cid, oldLayout, newLayout);
};

// =======================================================================================

const setChildrenLayout = () => {
    // console.log(cid, 'setChildrenLayout', data.children);

    // console.log(cid, 'setChildrenLayout', data.layoutList);

    const children = data.children;
    if (!children) {
        return;
    }

    if (data.layoutReset) {
        children.forEach((child, i) => {
            child.classList.remove('vui-layout-auto');
        });
    } else {
        data.layoutReset = true;
    }

    children.forEach((child, i) => {
        const size = data.layoutList[i];
        if (isAutoSize(size)) {
            child.classList.add('vui-layout-auto');
            child.style.removeProperty('flexBasis');
        } else {
            child.style.flexBasis = size;
        }
    });

};

// =======================================================================================

const initChildrenAndEvents = () => {

    const children = Array.from($el.children).filter((child) => {
        if (child.classList.contains('vui-layout-gutter')) {
            child.remove();
            return false;
        }
        return true;
    });
    // console.log(children);

    const total = children.length;
    if (total < 2) {
        return;
    }

    data.children = children;

    children.forEach((child, i) => {
        child.classList.add('vui-layout-item');
        data.indexMap.set(child, i);

        if (i < total - 1) {
            const gutter = document.createElement('div');
            gutter.className = 'vui-layout-gutter';
            child.insertAdjacentElement('afterend', gutter);
        }

    });

    bindEvents(mousedownEvents, $el);

};

const getLayoutFromChildren = () => {
    const ls = [];

    const children = data.children;
    if (!children) {
        return ls;
    }

    children.forEach((child) => {
        const size = child.getAttribute('size');
        if (isAutoSize(size)) {
            ls.push('auto');
        } else {
            ls.push(size);
        }
    });

    return ls;
};

const layoutChangeHandler = () => {

    // need same size
    const list = getLayoutFromChildren();

    // merge with layout string
    if (data.layout) {
        `${data.layout}`.split(',').forEach((item, i) => {
            item = `${item}`.trim();
            if (isAutoSize(item)) {
                item = 'auto';
            }
            list[i] = item;
        });
    }

    // console.log(cid, ls);

    let autoNum = 0;
    list.forEach((item) => {
        if (isAutoSize(item)) {
            autoNum += 1;
        }
    });

    // console.log(cid, ls);

    data.autoNum = autoNum;
    data.layoutList = list;
};

const layoutListChangeHandler = () => {
    // update layout back
    data.layout = data.layoutList.join(',');

    updateTotalSize();
    setChildrenLayout();
};

onMounted(() => {
    $el = el.value;
    initChildrenAndEvents();

    // console.log(cid, 'onMounted');
    layoutChangeHandler();
});
</script>

<style lang="scss">
.vui-layout {
    --vui-gutter-hover-size: 2px;
    --vui-gutter-size: 4px;

    position: relative;
    display: flex;
    align-items: stretch;
    overflow: hidden;
}

.vui-layout-row {
    flex-direction: row;
}

.vui-layout-column {
    flex-direction: column;
}

.vui-layout-item {
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
}

.vui-layout-auto {
    flex: 1 1 auto;
}

.vui-layout-gutter {
    position: relative;
    z-index: 100;
    flex: none;
}

.vui-layout-gutter::before {
    position: absolute;
    content: "";
    display: none;
    width: 100%;
    height: 100%;
    background-color: #0077cf;
}

.vui-layout-gutter::after {
    position: absolute;
    content: "";
    z-index: 2;
    display: block;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0;
}

.vui-layout-row > {
    .vui-layout-gutter {
        width: var(--vui-gutter-size);
        cursor: ew-resize;
    }

    .vui-layout-gutter::before {
        left: 50%;
        width: var(--vui-gutter-hover-size);
        transform: translateX(-50%);
    }

    .vui-layout-gutter::after {
        width: calc(100% + 6px);
        transform: translateX(-3px);
    }
}

.vui-layout-column > {
    .vui-layout-gutter {
        height: var(--vui-gutter-size);
        cursor: ns-resize;
    }

    .vui-layout-gutter::before {
        top: 50%;
        height: var(--vui-gutter-hover-size);
        transform: translateY(-50%);
    }

    .vui-layout-gutter::after {
        height: calc(100% + 8px);
        transform: translateY(-4px);
    }
}

.vui-layout-moving {
    .vui-layout-item,
    .vui-layout-gutter {
        pointer-events: none;
    }

    .vui-layout-active {
        pointer-events: auto;
    }

    &.vui-layout-row {
        cursor: ew-resize;
    }

    &.vui-layout-column {
        cursor: ns-resize;
    }
}

.vui-layout-gutter:hover::before,
.vui-layout-active::before {
    display: block;
}

</style>
