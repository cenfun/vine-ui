<template>
  <div
    v-show="data.visible"
    ref="el"
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

import { autoPx, getCID } from '../../utils/util.js';

const cid = getCID('VuiTooltip');

const props = defineProps({

    text: {
        type: String,
        default: ''
    },

    html: {
        type: Boolean,
        default: false
    },

    maxWidth: {
        type: [String, Number],
        default: 320
    },

    target: {
        validator: (v) => true,
        default: ''
    },

    positions: {
        type: [String, Array],
        default: () => {
            return ['top', 'bottom', 'right', 'center'];
        }
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
        default: true
    },

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
        'vui-tooltip',
        cid
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
        background: data.background
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
    const containerRect = getRect(props.container || window);
    const targetRect = getRect(props.target);
    const tooltipRect = getRect(`.${cid}`);
    const positions = props.positions;

    // console.log(containerRect, targetRect, tooltipRect);

    const positionInfo = getBestPosition(
        containerRect,
        targetRect,
        tooltipRect,
        positions
    );

    if (positionInfo.changed) {
        data.top = positionInfo.top;
        data.left = positionInfo.left;
    }

    const style = getPositionStyle(positionInfo, {
        bgColor: props.bgColor,
        borderColor: props.borderColor
    });
    if (style.changed) {
        data.background = style.background;
    }
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
.vui-tooltip {
    --vui-tooltip-color: inherit;
    --vui-tooltip-max-width: 320px;

    position: fixed;
    z-index: 1000;
    margin: 0;
    padding: 20px;
    box-sizing: border-box;
    color: var(--vui-popover-color);
    border: none;
    filter: drop-shadow(1px 2px 2px rgb(0 0 0 / 20%));

    &.vui-tooltip-nonreactive {
        pointer-events: none;
    }

    .vui-tooltip-content {
        position: relative;
        max-width: var(--vui-tooltip-max-width);
        overflow: hidden;
    }
}
</style>
