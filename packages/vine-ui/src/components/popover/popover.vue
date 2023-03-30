<template>
  <div
    v-show="data.visible"
    ref="el"
    :class="classList"
    :style="styleList"
  >
    <div class="vui-popover-body">
      <div
        v-if="props.title"
        class="vui-popover-header"
      >
        <slot name="header">
          <div
            class="vui-popover-title"
            v-text="props.title"
          />
        </slot>
      </div>
      <div class="vui-popover-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
    computed, onMounted, reactive, ref, watch, watchEffect, onUnmounted
} from 'vue';
import {
    getBestPosition, getPositionStyle, getRect, getElement
} from 'popover-helper';
import { microtask } from 'async-tick';

import { useBase } from '../../base/base.js';

import { autoPx } from '../../utils/util.js';

const { cid } = useBase('VuiPopover');

const props = defineProps({

    title: {
        type: String,
        default: ''
    },

    target: {
        validator: (v) => true,
        default: ''
    },

    autoClose: {
        type: Boolean,
        default: true
    },

    bindResize: {
        type: [String, Boolean],
        default: 'close'
    },

    bindScroll: {
        type: [String, Boolean],
        default: 'close'
    },

    width: {
        type: [String, Number],
        default: 200
    },

    minHeight: {
        type: [String, Number],
        default: 20
    },

    maxHeight: {
        type: [String, Number],
        default: 800
    },

    positions: {
        type: [String, Array],
        default: null
    },

    borderColor: {
        type: String,
        default: ''
    },

    bgColor: {
        type: String,
        default: ''
    },

    color: {
        type: String,
        default: ''
    },

    container: {
        validator: (v) => true,
        default: ''
    },

    nonreactive: {
        type: Boolean,
        default: false
    },

    visible: {
        type: Boolean,
        default: false
    },

    modelValue: {
        type: Boolean,
        default: null
    }

});

const emit = defineEmits(['update:modelValue', 'update', 'beforeClose', 'close']);

const data = reactive({
    visible: false,

    left: 0,
    top: 0,
    background: ''
});

watchEffect(() => {
    data.visible = props.modelValue === null ? props.visible : props.modelValue;
});

watch(() => data.visible, (v) => {
    render();
    emit('update:modelValue', v);
});

watch([
    () => props.target,
    () => props.bgColor,
    () => props.borderColor
], () => {
    update();
});

const el = ref(null);
let $el;

// ====================================================================================================

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-popover',
        cid
    ];

    if (props.nonreactive) {
        ls.push('vui-popover-nonreactive');
    }
    return ls;
});

const styleList = computed(() => {
    const st = {
        top: `${data.top}px`,
        left: `${data.left}px`,
        background: data.background
    };

    if (props.color) {
        st['--vui-popover-color'] = props.color;
    }
    if (props.width) {
        st['--vui-popover-width'] = autoPx(props.width);
    }
    if (props.minHeight) {
        st['--vui-popover-min-height'] = autoPx(props.minHeight);
    }
    if (props.maxHeight) {
        st['--vui-popover-max-height'] = autoPx(props.maxHeight);
    }

    return st;
});

// =============================================================================

let positionInfo;
const updateSync = () => {
    if (!data.visible) {
        return;
    }
    const containerRect = getRect(props.container || window);
    const targetRect = getRect(props.target);
    const popoverRect = getRect(`.${cid}`);
    const positions = props.positions;

    // console.log('containerRect', containerRect);
    // console.log('targetRect', targetRect);
    // console.log('popoverRect', popoverRect);

    positionInfo = getBestPosition(
        containerRect,
        targetRect,
        popoverRect,
        positions,
        // previous position info for keeping position if has animation (dynamic size)
        positionInfo
    );

    // console.table('positionInfo', positionInfo);
    if (positionInfo.changed) {
        data.left = positionInfo.left;
        data.top = positionInfo.top;
    }

    const style = getPositionStyle(positionInfo, {
        bgColor: props.bgColor,
        borderColor: props.borderColor
    });
    if (style.changed) {
        data.background = style.background;
    }

    emit('update');
};

// do not setTimeout, because we can see popover top left in first time
const update = microtask(updateSync);

// ====================================================================================================

const render = () => {

    if (!data.visible) {
        // clean when closed
        unbindEvents();
        return;
    }

    if (!$el) {
        return;
    }

    // start showing
    bindEvents();
    update();

};

const bindEvents = () => {
    bindResizeEvent();
    bindScrollEvent();
    bindCloseEvent();
};

const unbindEvents = () => {
    unbindResizeEvent();
    unbindScrollEvent();
    unbindCloseEvent();
};

// =============================================================================

const bindResizeEvent = () => {
    if (!props.bindResize) {
        return;
    }
    unbindResizeEvent();
    window.addEventListener('resize', resizeHandler);
};

const unbindResizeEvent = () => {
    window.removeEventListener('resize', resizeHandler);
};

const resizeHandler = () => {
    if (props.bindResize === 'close') {
        close();
        return;
    }
    update();
};

// =============================================================================

const bindScrollEvent = () => {
    if (!props.bindScroll) {
        return;
    }
    unbindScrollEvent();
    window.addEventListener('scroll', scrollHandler, true);
};

const unbindScrollEvent = () => {
    window.removeEventListener('scroll', scrollHandler, true);
};

const scrollHandler = (e) => {
    if (isInnerElement(e.target)) {
        return;
    }
    if (!isParentElement(e.target)) {
        return;
    }
    if (props.bindScroll === 'close') {
        close();
        return;
    }
    update();
};

// =============================================================================

const bindCloseEvent = () => {
    unbindCloseEvent();
    if (props.autoClose && data.visible) {
        setTimeout(() => {
            window.addEventListener('click', clickHandler, true);
            window.addEventListener('keydown', keydownHandler);
        }, 10);
    }
};

const unbindCloseEvent = () => {
    window.removeEventListener('click', clickHandler, true);
    window.removeEventListener('keydown', keydownHandler);
};

const clickHandler = (e) => {
    if (isInnerElement(e.target)) {
        return;
    }
    emit('beforeClose');

    // async to make sure get previous visible outside
    setTimeout(() => {
        close();
    });
};

const keydownHandler = (e) => {
    // ESC
    if (e.keyCode !== 27) {
        return;
    }
    close();
};

// =============================================================================

const isInnerElement = (elem) => {
    if ($el === elem || $el.contains(elem)) {
        return true;
    }
    return false;
};

const isParentElement = (elem) => {

    const targetElement = getElement(props.target);
    if (!targetElement) {
        return false;
    }
    let parent = targetElement.parentNode;
    while (parent) {
        if (parent === elem) {
            return true;
        }
        parent = parent.parentNode;
    }
    return false;
};

// =============================================================================

const close = () => {
    if (!data.visible) {
        return;
    }
    data.visible = false;
    emit('close');
};


// ====================================================================================================

let resizeObserver;
const bindContainerEvent = () => {
    resizeObserver = new ResizeObserver((entries) => {
        update();
    });
    resizeObserver.observe($el);
};

const unbindContainerEvent = () => {
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
};

// ====================================================================================================

onMounted(() => {
    $el = el.value;
    bindContainerEvent();
    render();
});

onUnmounted(() => {
    unbindContainerEvent();
    unbindEvents();
    $el = null;
    positionInfo = null;
});

defineExpose({
    update,
    cid
});

</script>

<style lang="scss">
.vui-popover {
    --vui-popover-color: inherit;
    --vui-popover-width: 200px;
    --vui-popover-min-height: 20px;
    --vui-popover-max-height: 800px;

    position: fixed;
    z-index: 1000;
    margin: 0;
    padding: 20px;
    box-sizing: border-box;
    color: var(--vui-popover-color);
    border: none;
    filter: drop-shadow(1px 2px 2px rgb(0 0 0 / 20%));

    &.vui-popover-nonreactive {
        pointer-events: none;
    }

    .vui-popover-body {
        position: relative;
        width: var(--vui-popover-width);
        min-height: var(--vui-popover-min-height);
        max-height: var(--vui-popover-max-height);
        padding: 5px;
        overflow: hidden;
    }

    .vui-popover-header {
        margin-bottom: 5px;
        padding-bottom: 5px;
        border-bottom: 1px solid #333;

        .vui-popover-title {
            font-weight: bold;
            font-size: 16px;
        }
    }

    .vui-popover-content {
        position: relative;
        margin: 0;
        padding: 0;
    }
}
</style>
