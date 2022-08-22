<template>
  <div
    ref="el"
    :class="classList"
    :style="styleList"
  >
    <slot>
      <BaseRender :content="props.content" />
    </slot>
  </div>
</template>

<script setup>
import {
    computed, onMounted, onUnmounted, ref, shallowReactive, watch
} from 'vue';
import { useBase, BaseRender } from '../../base/base.js';

import {
    clamp, bindEvents, unbindEvents, preventDefault
} from '../../util/util.js';

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

    content: {
        validator: (v) => true,
        default: ''
    },
    modelValue: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const { cid } = useBase('VuiLayout');
const el = ref(null);

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

const state = shallowReactive({
    $el: null,

    children: null,
    indexMap: new WeakMap(),
    layout: [],
    autoNum: 0,

    //offset include border, but client not
    sizeKey: props.direction === 'row' ? 'offsetWidth' : 'offsetHeight',
    clientKey: props.direction === 'row' ? 'clientWidth' : 'clientHeight',
    offsetKey: props.direction === 'row' ? 'offsetX' : 'offsetY',

    moveGutter: null,
    moveInfo: null,
    totalSize: 0,
    prevInfo: null,
    nextInfo: null

});

const layout = computed({
    get() {
        return state.layout.join(',');
    },
    set(v) {
        emit('update:modelValue', v.join(','));
    }
});

const mousedownEvents = {
    mousedown: {
        handler: (e) => {
            startHandler(e);
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

//=======================================================================================

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
            size += $elem[state.sizeKey];
        }
    });
    return size;
};

const getBorderSize = function($elem) {
    const size = getSize($elem);
    const clientSize = $elem[state.clientKey];
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
    const index = state.indexMap.get($elemItem);
    const size = state.layout[index];
    if (isAutoSize(size)) {
        return getSize($elemItem) - getBorderSize($elemItem) + getMax($elemItem, key);
    }
    return 0;
};

const getPercentSize = (size) => {
    if (!state.totalSize) {
        return '0%';
    }
    const percent = (size / state.totalSize * 100).toFixed(2);
    return `${percent}%`;
};

const getAutoSize = ($elem) => {
    const size = getSize($elem);
    return getPercentSize(size);
};

const updateTotalSize = () => {
    state.totalSize = getSize(state.$el);
};

//=======================================================================================

const startHandler = (e) => {

    const $elem = e.target;
    if (!$elem.classList.contains('vui-layout-gutter')) {
        return;
    }

    //stop nested layout event
    e.stopImmediatePropagation();

    state.moveGutter = null;
    state.prevInfo = null;
    state.nextInfo = null;

    const moveGutter = $elem;
    const prevNode = moveGutter.previousElementSibling;
    const nextNode = moveGutter.nextElementSibling;

    if (!prevNode || !nextNode) {
        return;
    }

    state.moveGutter = moveGutter;
    moveGutter.classList.add('vui-layout-active');
    state.$el.classList.add('vui-layout-moving');

    initMoveInfo(e, prevNode, nextNode);

};

const initMoveInfo = (e, prevNode, nextNode) => {

    state.moveInfo = {
        startX: e.pageX,
        startY: e.pageY,
        offsetX: 0,
        offsetY: 0
    };

    //console.log('start');
    bindEvents(windowEvents, window);

    //for percent
    updateTotalSize();
    //console.log(state.totalSize);

    const prevInfo = {
        node: prevNode
    };
    const nextInfo = {
        node: nextNode
    };

    //min
    prevInfo.min = getBorderSize(prevNode);
    nextInfo.min = getBorderSize(nextNode);

    //max
    const maxSize = getSize(prevNode, nextNode);
    //console.log('maxSize', maxSize);

    const nextMax = getMax(nextNode, 'nextElementSibling');
    const prevMax = getMax(prevNode, 'previousElementSibling');

    prevInfo.max = maxSize + nextMax - nextInfo.min;
    nextInfo.max = maxSize + prevMax - prevInfo.min;

    //size
    prevInfo.size = getSize(prevNode);
    nextInfo.size = getSize(nextNode);

    //console.log(prevInfo, nextInfo);

    initNodeInfo(prevNode, nextNode, prevInfo, nextInfo);

};

const removeAuto = ($elem, index) => {
    //at least one auto could be left
    if (state.autoNum < 2) {
        return;
    }
    const percent = getAutoSize($elem);
    state.layout[index] = percent;
    $elem.style.flexBasis = percent;
    $elem.classList.remove('vui-layout-auto');
};

const initNodeInfo = (prevNode, nextNode, prevInfo, nextInfo) => {
    const prevIndex = state.indexMap.get(prevNode);
    const nextIndex = state.indexMap.get(nextNode);
    const prevSize = state.layout[prevIndex];
    const nextSize = state.layout[nextIndex];

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

    state.prevInfo = prevInfo;
    state.nextInfo = nextInfo;

};

const mouseMoveHandler = function(e) {
    preventDefault(e);

    const buttonPressed = e.buttons;
    if (!buttonPressed) {
        mouseUpHandler(e);
        return;
    }

    state.moveInfo.offsetX = e.pageX - state.moveInfo.startX;
    state.moveInfo.offsetY = e.pageY - state.moveInfo.startY;
    updateHandler(e);
};

const mouseUpHandler = function(e) {
    preventDefault(e);

    updateLayout();

    clean();
};

const updateHandler = (e) => {

    const offset = state.moveInfo[state.offsetKey];
    //console.log(offset);

    updateNodeInfo(state.prevInfo, offset);
    updateNodeInfo(state.nextInfo, -offset);

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

const updateLayout = () => {
    const newLayout = [];
    const children = state.children;
    children.forEach((child, i) => {
        const size = state.layout[i];
        if (isAutoSize(size)) {
            newLayout.push('auto');
        } else {
            const basis = child.style.flexBasis;
            newLayout.push(basis || size);
        }
    });

    state.layout = newLayout;
    layout.value = newLayout;

};

const clean = () => {
    unbindEvents(windowEvents);
    if (state.moveGutter) {
        state.moveGutter.classList.remove('vui-layout-active');
        state.moveGutter = null;
    }
    state.$el.classList.remove('vui-layout-moving');
    state.prevInfo = null;
    state.nextInfo = null;
};

const initChildren = () => {

    const children = Array.from(state.$el.children).filter((child) => {
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

    state.children = children;

    children.forEach((child, i) => {
        child.classList.add('vui-layout-item');
        state.indexMap.set(child, i);

        if (i < total - 1) {
            const gutter = document.createElement('div');
            gutter.className = 'vui-layout-gutter';
            child.insertAdjacentElement('afterend', gutter);
        }

    });

    bindEvents(mousedownEvents, state.$el);

};

const getLayoutFromChildren = () => {
    const ls = [];

    const children = state.children;
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

const setChildrenLayout = (resetLayout) => {

    const children = state.children;
    if (!children) {
        return;
    }

    if (resetLayout) {
        children.forEach((child, i) => {
            child.classList.remove('vui-layout-auto');
        });
    }

    children.forEach((child, i) => {
        const size = state.layout[i];
        if (isAutoSize(size)) {
            child.classList.add('vui-layout-auto');
            child.style.removeProperty('flexBasis');
        } else {
            child.style.flexBasis = size;
        }
    });

};

const initLayout = (ls) => {
    if (!ls) {
        state.autoNum = 0;
        return [];
    }

    //console.log(cid, ls);

    if (!Array.isArray(ls)) {
        ls = `${ls}`.split(',');
    }

    //console.log(cid, ls);

    let autoNum = 0;

    ls = ls.map((item) => {
        item = `${item}`.trim();
        if (isAutoSize(item)) {
            autoNum += 1;
            return 'auto';
        }
        return item;
    });

    //console.log(cid, ls);

    state.autoNum = autoNum;

    return ls;

};

watch(() => props.modelValue, () => {

    state.layout = initLayout(props.modelValue);

    //console.log(cid, 'watch props.modelValue', state.layout);

    updateTotalSize();
    setChildrenLayout(true);

});

onMounted(() => {
    state.$el = el.value;

    initChildren();

    if (props.modelValue) {
        state.layout = initLayout(props.modelValue);
    } else {
        state.layout = initLayout(getLayoutFromChildren());
    }

    updateTotalSize();
    setChildrenLayout();

});

onUnmounted(() => {
    clean();
    unbindEvents(mousedownEvents);
    state.children = null;
    state.indexMap = null;
});

</script>

<style lang="scss">
.vui-layout {
    --vui-gutter-hover-size: 2px;
    --vui-gutter-size: 4px;

    overflow: hidden;
    position: relative;
    display: flex;
    align-items: stretch;
}

.vui-layout-row {
    flex-direction: row;
}

.vui-layout-column {
    flex-direction: column;
}

.vui-layout-item {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0;
    margin: 0;
    flex: 0 0 auto;
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
    content: "";
    position: absolute;
    background-color: #0077cf;
    width: 100%;
    height: 100%;
    display: none;
}

.vui-layout-gutter::after {
    content: "";
    position: absolute;
    display: block;
    background-color: black;
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
}

.vui-layout-row > {
    .vui-layout-gutter {
        width: var(--vui-gutter-size);
        cursor: ew-resize;
    }

    .vui-layout-gutter::before {
        width: var(--vui-gutter-hover-size);
        left: 50%;
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
        height: var(--vui-gutter-hover-size);
        top: 50%;
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
