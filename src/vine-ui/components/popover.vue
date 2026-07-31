<template>
  <div
    v-show="mv"
    ref="el"
    v-init="{cid}"
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
    computed, onMounted, reactive, ref, watch, onUnmounted
} from 'vue';
import {
    getBestPosition, getPositionStyle, getRect, getElement
} from 'popover-helper';
import { microtask } from 'async-tick';

import {
    autoPx, getCID, vInit
} from '../utils/util.js';

const cid = getCID('VuiPopover');

const props = defineProps({

    /** Popover title text */


    title: {
        type: String,
        default: ''
    },

    /** Target element or rect for positioning */


    target: {
        validator: (v) => true,
        default: ''
    },

    /** Show arrow pointing to target */


    arrow: {
        type: Boolean,
        default: true
    },

    /** Popover body padding */


    padding: {
        type: String,
        default: ''
    },

    /** Use fixed positioning (ignore scroll) */


    fixed: {
        type: Boolean,
        default: false
    },

    /** Auto-close on outside click or Escape key */


    autoClose: {
        type: Boolean,
        default: true
    },

    /** Behavior on window resize: "close" or truthy to update */


    bindResize: {
        type: [String, Boolean],
        default: 'close'
    },

    /** Behavior on window scroll: "close" or truthy to update */


    bindScroll: {
        type: [String, Boolean],
        default: 'close'
    },

    /** Popover width */


    width: {
        type: [String, Number],
        default: 200
    },

    /** Popover minimum height */


    minHeight: {
        type: [String, Number],
        default: 20
    },

    /** Popover maximum height */


    maxHeight: {
        type: [String, Number],
        default: 800
    },

    /** Preferred positions (comma-separated or array,
 e.g. "bottom,top") */


    positions: {
        type: [String, Array],
        default: null
    },

    /** Popover border color */


    borderColor: {
        type: String,
        default: ''
    },

    /** Popover background color */


    bgColor: {
        type: String,
        default: ''
    },

    /** Popover text color */


    color: {
        type: String,
        default: ''
    },

    /** Container element for boundary calculation */


    container: {
        validator: (v) => true,
        default: ''
    },

    /** Disable pointer events (non-interactive popover) */


    nonreactive: {
        type: Boolean,
        default: false
    }

});

const mv = defineModel({
    type: Boolean,
    default: false
});

const el = ref(null);
let $el;

const emit = defineEmits(['open', 'update', 'beforeClose', 'close']);

const data = reactive({
    left: 0,
    top: 0,
    background: ''
});

watch(() => mv.value, (v) => {
    render();
    if (!v) {
        emit('close');
    }
});

watch([
    () => props.target,
    () => props.bgColor,
    () => props.borderColor
], () => {
    update();
});

// ====================================================================================================

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-popover'
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
        background: data.background,
        padding: data.padding
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

    if (props.padding) {
        st['--vui-popover-padding'] = props.padding;
    }

    return st;
});

// =============================================================================

const close = () => {
    if (!mv.value) {
        return;
    }
    mv.value = false;
};

const beforeClose = () => {
    emit('beforeClose');

    // async to make sure get previous visible outside
    setTimeout(() => {
        close();
    });
};

// =============================================================================

let positionInfo;
const updateSync = () => {
    if (!mv.value) {
        return;
    }

    const container = props.container || window;
    const containerRect = getRect(container);

    // fix scroll bar width in right
    if (container === window) {
        containerRect.width = document.body.clientWidth;
    }

    const selector = `[cid=${cid}]`;

    const targetRect = getRect(props.target, props.fixed);
    const popoverRect = getRect(selector);
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
    data.left = positionInfo.left;
    data.top = positionInfo.top;

    const style = getPositionStyle(positionInfo, {
        bgColor: props.bgColor,
        borderColor: props.borderColor,
        arrowSize: props.arrow ? 10 : 0
    });

    data.background = style.background;
    data.padding = style.padding;

    emit('update', positionInfo);
};

// do not setTimeout, because we can see popover top left in first time
const update = microtask(updateSync);

// ====================================================================================================

const render = () => {

    if (!mv.value) {
        // clean when closed
        unbindEvents();
        return;
    }

    if (!$el) {
        return;
    }

    emit('open', $el);

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
        beforeClose();
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
        beforeClose();
        return;
    }
    update();
};

// =============================================================================

const bindCloseEvent = () => {
    unbindCloseEvent();
    if (props.autoClose && mv.value) {
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
    beforeClose();
};

const keydownHandler = (e) => {
    if (e.code !== 'Escape') {
        return;
    }
    beforeClose();
};

// =============================================================================

const isInnerElement = (elem) => {
    if ($el === elem || $el.contains(elem)) {
        return true;
    }
    return false;
};

const isParentElement = (elem) => {
    // props.target could be a rect
    const targetElement = getElement(props.target) || $el;
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
@use "../global.scss";

.vui-popover {
    --vui-popover-color: inherit;
    --vui-popover-width: 200px;
    --vui-popover-min-height: 20px;
    --vui-popover-max-height: 800px;
    --vui-popover-padding: 15px;

    position: fixed;
    z-index: 1000;
    margin: 0;
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
        margin: var(--vui-popover-padding);
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
