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
    computed, onMounted, reactive, ref, watch, watchEffect, nextTick
} from 'vue';
import { useBase } from '../../base/base.js';

import {
    getDefaultPositions, getBestPosition, getRect
} from '../../base/base-popup.js';

import { autoPx } from '../../utils/util.js';

const { cid } = useBase('VuiTooltip');

const props = defineProps({

    text: {
        type: String,
        default: ''
    },

    html: {
        type: String,
        default: ''
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
            return getDefaultPositions(['center', 'top', 'bottom', 'right']);
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

    visible: {
        type: Boolean,
        default: true
    }

});

const el = ref(null);
let $el;
let positionInfo;

const data = reactive({
    visible: props.visible,
    position: 'top',
    align: 'center',
    top: 0,
    left: 0
});

watchEffect(() => {
    data.visible = props.visible;
});

const classList = computed(() => {
    return [
        'vui',
        'vui-popup',
        `vui-popup-${data.position}`,
        `vui-popup-${data.position}-${data.align}`,
        'vui-tooltip',
        cid
    ];
});

const styleList = computed(() => {
    const st = {
        top: `${data.top}px`,
        left: `${data.left}px`,
        'max-width': autoPx(props.maxWidth)
    };
    if (props.borderColor) {
        st['--vui-popup-border-color'] = props.borderColor;
    }
    if (props.bgColor) {
        st['--vui-popup-bg-color'] = props.bgColor;
    }
    if (props.color) {
        st['--vui-popup-color'] = props.color;
    }
    return st;
});

// ====================================================================================================

watch(() => data.visible, () => {
    update();
});

const update = () => {
    contentHandler();
    // do not setTimeout, because we can see popover top left in first time
    nextTick(() => {
        updateSync();
    });
};

const updateSync = () => {
    if (!data.visible) {
        return;
    }
    const containerRect = getRect(props.container || window);
    const targetRect = getRect(props.target);

    // fix for arrow size
    const arrowSize = 10;
    targetRect.left -= arrowSize;
    targetRect.top -= arrowSize;
    targetRect.width += arrowSize * 2;
    targetRect.height += arrowSize * 2;

    const rect = getRect(`.${cid}`);
    const positions = props.positions;

    // console.log(containerRect, targetRect, rect);

    positionInfo = getBestPosition(
        containerRect,
        targetRect,
        rect,
        positions,
        positionInfo
    );

    // no change
    if (data.position === positionInfo.position
            && data.align === positionInfo.align
            && data.top === positionInfo.top
            && data.left === positionInfo.left) {
        return;
    }

    // console.log(positionInfo);

    data.position = positionInfo.position;
    data.align = positionInfo.align;
    data.top = positionInfo.top;
    data.left = positionInfo.left;
};

const contentHandler = () => {
    if (!$el) {
        return;
    }
    const $content = $el.querySelector('.vui-tooltip-content');
    if (props.html) {
        $content.innerHTML = props.html;
        return;
    }
    $content.innerText = props.text;
};

// ====================================================================================================

onMounted(() => {
    $el = el.value;
    update();
});

</script>

<style lang="scss">
.vui-tooltip {
    position: fixed;
    z-index: 1000;
    margin: 0;
    pointer-events: none;

    .vui-tooltip-content {
        display: inline-block;
        padding: 10px;
        //IE https://caniuse.com/#feat=wordwrap
        word-wrap: break-word;
        //https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break
        word-break: break-word;
        overflow-wrap: break-word;
    }
}
</style>
