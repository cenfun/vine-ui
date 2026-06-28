<template>
  <div
    v-show="data.visible"
    ref="el"
    v-init="{cid}"
    :class="classList"
    :style="styleList"
  >
    <div class="vui-tooltip-content">
      <slot />
    </div>
  </div>
</template>
<script setup>
import {
    computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect
} from 'vue';

import {
    getBestPosition, getPositionStyle, getRect
} from 'popover-helper';
import { microtask } from 'async-tick';

import {
    autoPx, getCID, vInit
} from '../utils/util.js';

const cid = getCID('VuiTooltip');

const props = defineProps({

    /** Tooltip content text */


    text: {
        type: String,
        default: ''
    },

    /** Enable HTML content rendering */


    html: {
        type: Boolean,
        default: false
    },

    /** Tooltip maximum width */


    maxWidth: {
        type: [String, Number],
        default: 320
    },

    /** Target element or rect for positioning */


    target: {
        validator: (v) => true,
        default: ''
    },

    /** Preferred positions (comma-separated or array) */


    positions: {
        type: [String, Array],
        default: () => {
            return ['top', 'bottom', 'right', 'center'];
        }
    },

    /** Tooltip border color */


    borderColor: {
        type: String,
        default: ''
    },

    /** Tooltip background color */


    bgColor: {
        type: String,
        default: ''
    },

    /** Tooltip text color */


    color: {
        type: String,
        default: ''
    },

    /** Container element for boundary calculation */


    container: {
        validator: (v) => true,
        default: ''
    },

    /** Disable pointer events (non-interactive tooltip) */


    nonreactive: {
        type: Boolean,
        default: true
    },

    /** Initial visibility (used without v-model) */


    visible: {
        type: Boolean,
        default: true
    }


});

const el = ref(null);
let $el;

const data = reactive({
    visible: props.visible,

    top: 0,
    left: 0,
    background: ''
});

watchEffect(() => {
    data.visible = props.visible;
});

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-tooltip'
    ];
    if (props.nonreactive) {
        ls.push('vui-tooltip-nonreactive');
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
        st['--vui-tooltip-color'] = props.color;
    }
    if (props.maxWidth) {
        st['--vui-tooltip-max-width'] = autoPx(props.maxWidth);
    }
    return st;
});

// ====================================================================================================

const updateSync = () => {
    if (!data.visible) {
        return;
    }

    const selector = `[cid=${cid}]`;

    const containerRect = getRect(props.container || window);
    const targetRect = getRect(props.target);
    const tooltipRect = getRect(selector);
    const positions = props.positions;

    // console.log(containerRect, targetRect, tooltipRect);

    const positionInfo = getBestPosition(
        containerRect,
        targetRect,
        tooltipRect,
        positions
    );

    data.top = positionInfo.top;
    data.left = positionInfo.left;

    const style = getPositionStyle(positionInfo, {
        bgColor: props.bgColor,
        borderColor: props.borderColor
    });

    // console.log(style);
    data.background = style.background;
    data.padding = style.padding;
};

const update = microtask(updateSync);

const render = () => {
    if (!data.visible) {
        return;
    }
    if (!$el) {
        return;
    }
    const $content = $el.querySelector('.vui-tooltip-content');
    if (props.html) {
        $content.innerHTML = props.text;
    } else {
        $content.innerText = props.text;
    }
    update();
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

watch(() => data.visible, (v) => {
    render();
});

onMounted(() => {
    $el = el.value;
    bindContainerEvent();
    render();
});

onUnmounted(() => {
    unbindContainerEvent();
    $el = null;
});

defineExpose({
    update,
    cid
});

</script>

<style lang="scss">
@use "../global.scss";

.vui-tooltip {
    --vui-tooltip-color: inherit;
    --vui-tooltip-max-width: 320px;

    position: fixed;
    z-index: 1000;
    margin: 0;
    padding: 20px;
    color: var(--vui-popover-color);
    border: none;
    filter: drop-shadow(1px 2px 2px rgb(0 0 0 / 20%));

    &.vui-tooltip-nonreactive {
        pointer-events: none;
    }

    .vui-tooltip-content {
        position: relative;
        max-width: var(--vui-tooltip-max-width);
        margin: 10px;
        overflow: hidden;
    }
}
</style>
