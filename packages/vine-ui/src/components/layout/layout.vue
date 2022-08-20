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
    computed, onMounted, onUnmounted, ref, shallowReactive
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
    size: {
        type: String,
        default: '2px'
    },
    content: {
        validator: (v) => true,
        default: ''
    }
});

const { cid } = useBase('VuiLayout');

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
    if (props.size) {
        st['--vui-gutter-size'] = props.size;
    }
    return st;
});

const el = ref(null);

const state = shallowReactive({
    $el: null,
    $gutter: null,

    options: null,

    //offset include border, but client not
    sizeKey: props.direction === 'row' ? 'offsetWidth' : 'offsetHeight',
    clientKey: props.direction === 'row' ? 'clientWidth' : 'clientHeight',
    offsetKey: props.direction === 'row' ? 'offsetX' : 'offsetY',

    children: new WeakMap(),

    prevNode: null,
    nextNode: null,
    prevSize: null,
    nextSize: null,

    prevMin: 0,
    prevMax: 0,
    nextMin: 0,
    nextMax: 0
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

const startHandler = (e) => {

    const $elem = e.target;
    if (!$elem.classList.contains('vui-layout-gutter')) {
        return;
    }

    //stop nested layout event
    e.stopImmediatePropagation();

    state.$gutter = $elem;

    $elem.classList.add('vui-layout-active');
    state.$el.classList.add('vui-layout-moving');

    initNodes();

    state.options = {
        startX: e.pageX,
        startY: e.pageY,
        offsetX: 0,
        offsetY: 0
    };

    //console.log('start');
    bindEvents(windowEvents, window);
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
    if (!$elemItem || state.children.get($elemItem)) {
        return 0;
    }
    return getSize($elemItem) - getBorderSize($elemItem) + getMax($elemItem, key);
};

const initNodes = () => {

    const $gutter = state.$gutter;

    state.prevNode = null;
    state.nextNode = null;

    const _prevNode = $gutter.previousElementSibling;
    const _nextNode = $gutter.nextElementSibling;

    if (!_prevNode || !_nextNode) {
        return;
    }

    state.prevMin = getBorderSize(_prevNode);
    state.nextMin = getBorderSize(_nextNode);
    //console.log(state.prevMin, state.nextMin);

    const maxSize = getSize(_prevNode, _nextNode);
    //console.log('maxSize', maxSize);

    const nextMax = getMax(_nextNode, 'nextElementSibling');
    const prevMax = getMax(_prevNode, 'previousElementSibling');

    state.prevMax = maxSize + nextMax - state.nextMin;
    state.nextMax = maxSize + prevMax - state.prevMin;

    //console.log(state.prevMax, state.nextMax);

    //console.log(state);

    const _prevSize = state.children.get(_prevNode);
    const _nextSize = state.children.get(_nextNode);

    //both auto
    if (!_prevSize && !_nextSize) {
        state.prevSize = getSize(_prevNode);
        state.prevNode = _prevNode;
        state.nextSize = getSize(_nextNode);
        state.nextNode = _nextNode;
        return;
    }

    if (_prevSize) {
        state.prevSize = getSize(_prevNode);
        state.prevNode = _prevNode;
    }

    if (_nextSize) {
        state.nextSize = getSize(_nextNode);
        state.nextNode = _nextNode;
    }
};

const mouseMoveHandler = function(e) {
    preventDefault(e);
    state.options.offsetX = e.pageX - state.options.startX;
    state.options.offsetY = e.pageY - state.options.startY;
    updateHandler(e);
};

const mouseUpHandler = function(e) {
    preventDefault(e);
    clean();
};

const updateHandler = (e) => {

    const offset = state.options[state.offsetKey];

    //console.log(offset);

    if (state.prevNode) {
        const _prevSize = clamp(state.prevSize + offset, state.prevMin, state.prevMax);
        state.prevNode.style.flexBasis = `${_prevSize}px`;
    }
    if (state.nextNode) {
        const _nextSize = clamp(state.nextSize - offset, state.nextMin, state.nextMax);
        state.nextNode.style.flexBasis = `${_nextSize}px`;
    }

};

const clean = () => {
    unbindEvents(windowEvents);
    if (state.$gutter) {
        state.$gutter.classList.remove('vui-layout-active');
        state.$gutter = null;
    }
    state.$el.classList.remove('vui-layout-moving');
    state.prevNode = null;
    state.nextNode = null;
};

onMounted(() => {
    state.$el = el.value;
    const children = Array.from(state.$el.children);
    // console.log(children);
    children.forEach((child) => {
        child.classList.add('vui-layout-item');
        const size = child.getAttribute('size');
        if (size) {
            child.style.flex = `0 0 ${size}`;
        } else {
            child.classList.add('vui-layout-auto');
        }
        state.children.set(child, size);
    });

    if (children.length < 2) {
        return;
    }
    children.length -= 1;
    children.forEach((child, i) => {
        const gutter = document.createElement('div');
        gutter.className = 'vui-layout-gutter';
        child.insertAdjacentElement('afterend', gutter);
    });

    bindEvents(mousedownEvents, state.$el);
});

onUnmounted(() => {
    clean();
    unbindEvents(mousedownEvents);
});

</script>

<style lang="scss">
.vui-layout {
    --vui-gutter-size: 2px;

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
}

.vui-layout-auto {
    flex: auto;
}

.vui-layout-gutter {
    position: relative;
    z-index: 100;
    flex: none;
}

.vui-layout-gutter:hover {
    background-color: #0077cf;
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

    .vui-layout-gutter::after {
        width: calc(100% + 8px);
        transform: translateX(-4px);
    }
}

.vui-layout-column > {
    .vui-layout-gutter {
        height: var(--vui-gutter-size);
        cursor: ns-resize;
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
        background-color: #0077cf;
        pointer-events: auto;
    }

    &.vui-layout-row {
        cursor: ew-resize;
    }

    &.vui-layout-column {
        cursor: ns-resize;
    }
}

</style>
