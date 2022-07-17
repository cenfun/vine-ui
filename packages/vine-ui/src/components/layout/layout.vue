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
    computed, onMounted, onUnmounted, ref
} from 'vue';
import { useBase, BaseRender } from '../../base/base.js';

import {
    bindEvents, unbindEvents, preventDefault
} from '../../util/util.js';

const { cid } = useBase('VuiLayout');

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
        default: '5px'
    },
    content: {
        validator: (v) => true,
        default: ''
    }
});

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-layout',
        `vui-layout-${props.direction}`,
        `vui-flex-${props.direction}`
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
let $el;
let gutterCL;
let previousIframe;
let option;

let prevNode;
let nextNode;

let prevSize;
let nextSize;

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
            iframeHandler(ee);
            mouseMoveHandler(ee);
        },
        options: true
    },
    mouseup: {
        handler: (ee) => {
            gutterCL.remove('vui-layout-active');
            gutterCL = null;
            mouseUpHandler(ee);
        },
        options: {
            once: true
        }
    }
};

const startHandler = (e) => {

    gutterCL = e.target.classList;
    if (!gutterCL.contains('vui-layout-gutter')) {
        return;
    }

    gutterCL.add('vui-layout-active');

    $el.classList.add('vui-layout-moving');

    initNodes(e);

    option = {
        startX: e.pageX,
        startY: e.pageY,
        offsetX: 0,
        offsetY: 0
    };

    //stop nested layout event
    e.stopImmediatePropagation();
    //console.log('start');
    bindEvents(windowEvents, window);
};

const initNodes = (e) => {
    prevNode = null;
    nextNode = null;

    const _prevNode = e.target.previousElementSibling;
    const _nextNode = e.target.nextElementSibling;

    // const prevStyle = getComputedStyle(_prevNode);
    // const nextStyle = getComputedStyle(_nextNode);
    // console.log('prev:', prevStyle, 'next:', nextStyle);

    const sizeKey = props.direction === 'row' ? 'clientWidth' : 'clientHeight';

    if (_prevNode) {
        prevSize = _prevNode[sizeKey];
        prevNode = _prevNode;
    }

    if (_nextNode) {
        nextSize = _nextNode[sizeKey];
        nextNode = _nextNode;
    }
};

const iframeHandler = function(e) {
    const target = e.target;
    if (target.nodeName !== 'IFRAME') {
        return;
    }
    if (target === previousIframe) {
        return;
    }
    if (previousIframe) {
        previousIframe.classList.remove('vui-pointer-events-none');
    }
    target.classList.add('vui-pointer-events-none');
    previousIframe = target;
};

const mouseMoveHandler = function(e) {
    preventDefault(e);
    option.offsetX = e.pageX - option.startX;
    option.offsetY = e.pageY - option.startY;
    updateHandler(e);
};

const mouseUpHandler = function(e) {
    preventDefault(e);
    clean();
};

const updateHandler = (e) => {

    const offsetKey = props.direction === 'row' ? 'offsetX' : 'offsetY';
    const offset = option[offsetKey];

    //console.log(offset);

    const _prevSize = prevSize + offset;
    const _nextSize = nextSize - offset;
    if (_prevSize < 0 || _nextSize < 0) {
        return;
    }

    if (prevNode) {
        prevNode.style.flexBasis = `${_prevSize}px`;
    }
    if (nextNode) {
        nextNode.style.flexBasis = `${_nextSize}px`;
    }

};

const clean = () => {
    unbindEvents(windowEvents);
    if (previousIframe) {
        previousIframe.classList.remove('vui-pointer-events-none');
        previousIframe = null;
    }
    $el.classList.remove('vui-layout-moving');
    prevNode = null;
    nextNode = null;
};

onMounted(() => {
    $el = el.value;
    const children = Array.from($el.children);
    // console.log(children);
    if (children.length < 2) {
        return;
    }
    children.length -= 1;
    children.forEach((child, i) => {
        const gutter = document.createElement('div');
        gutter.className = 'vui-layout-gutter';
        child.insertAdjacentElement('afterend', gutter);
    });

    bindEvents(mousedownEvents, $el);
});

onUnmounted(() => {
    clean();
    unbindEvents(mousedownEvents);
});

</script>

<style lang="scss">
.vui-layout {
    position: relative;
}

.vui-layout-moving {
    > * {
        pointer-events: none;
    }

    > .vui-layout-active {
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

.vui-layout-row > * {
    height: 100%;
}

.vui-layout-column > * {
    width: 100%;
}

.vui-layout-gutter {
    position: relative;
    z-index: 100;
}

.vui-layout-gutter:hover {
    background-color: #0077cf;
}

.vui-layout-gutter::after {
    content: "";
    position: absolute;
    display: block;
    background-color: transparent;
}

.vui-layout-row > {
    .vui-layout-gutter {
        width: 2px;
        height: 100%;
        cursor: ew-resize;
    }

    .vui-layout-gutter::after {
        width: 10px;
        height: 100%;
        transform: translateX(-50%);
    }
}

.vui-layout-column > {
    .vui-layout-gutter {
        width: 100%;
        height: 2px;
        cursor: ns-resize;
    }

    .vui-layout-gutter::after {
        width: 100%;
        height: 10px;
        transform: translateY(-50%);
    }
}

</style>
