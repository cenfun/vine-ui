<template>
  <Teleport :to="props.to">
    <div
      v-show="data.visible"
      ref="el"
      :class="classList"
      :style="styleList"
    >
      <transition
        appear
        mode="out-in"
        name="vui-fade"
      >
        <div class="vui-tooltip-content">
          <slot />
        </div>
      </transition>
    </div>
  </Teleport>
</template>
<script setup>
import {
    computed, onMounted, reactive, ref, nextTick, watch, watchEffect
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

    content: {
        validator: (v) => true,
        default: ''
    },

    container: {
        validator: (v) => true,
        default: ''
    },

    disabled: {
        type: Boolean,
        default: false
    },

    to: {
        validator: (v) => true,
        default: 'body'
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
    nextTick(() => {
        updateSync();
    });
};

const updateSync = () => {
    if (!data.visible) {
        return;
    }
    if (!$el) {
        return;
    }

    contentHandler();

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

    const positionInfo = getBestPosition(
        containerRect,
        targetRect,
        rect,
        positions
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
    //pointer-events: none;
    position: absolute;
    z-index: 1000;
    margin: 0;
    visibility: visible;
    opacity: 1;
    transition: opacity 0.2s linear, visibility 0.2s linear;

    .vui-tooltip-content {
        display: inline-block;
        padding: 10px;
        font-size: 14px;
        //IE https://caniuse.com/#feat=wordwrap
        word-wrap: break-word;
        //https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break
        word-break: break-word;
        overflow-wrap: break-word;
    }

    .vui-fade-enter-active,
    .vui-fade-leave-active {
        transition: opacity 0.3s;
    }

    .vui-fade-enter,
    .vui-fade-leave-to {
        opacity: 0;
    }
}
</style>
