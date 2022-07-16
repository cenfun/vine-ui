<template>
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
      <div
        ref="content"
        class="vui-tooltip-content"
      >
        <slot>
          <BaseRender :content="text" />
        </slot>
      </div>
    </transition>
  </div>
</template>

<script setup>

import {
    computed, onMounted, onUnmounted, reactive, ref, watchEffect, nextTick
} from 'vue';
import {
    useBase, BaseRender, unmountComponent
} from '../../base/base.js';

import {
    getDefaultPositions, getBestPosition, getRect, getElement
} from '../../base/base-popup.js';

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
        type: Number,
        default: 320
    },

    target: {
        validator: (v) => true,
        default: ''
    },

    bindTarget: {
        type: Boolean,
        default: false
    },

    positions: {
        type: [String, Array],
        default: () => {
            return getDefaultPositions();
        }
    },

    content: {
        validator: (v) => true,
        default: ''
    },

    container: {
        validator: (v) => true,
        default: ''
    },

    visible: {
        type: Boolean,
        default: true
    },

    disabled: {
        type: Boolean,
        default: false
    }

});

const data = reactive({
    visible: false,
    position: 'top',
    align: 'center',
    top: 0,
    left: 0
});

const classList = computed(() => {
    return [
        'vui',
        'vui-popup',
        `vui-popup-${data.position}-${data.align}`,
        'vui-tooltip',
        cid
    ];
});

const styleList = computed(() => {
    return {
        top: `${data.top}px`,
        left: `${data.left}px`,
        'max-width': `${props.maxWidth}px`
    };
});

const el = ref(null);
let $el;
const content = ref(null);
let $target;

const emit = defineEmits(['update', 'close']);

//====================================================================================================

watchEffect(() => {
    data.visible = props.visible;
    if (props.bindTarget) {
        data.visible = false;
    }
    if ($el) {
        visibleHandler();
    }
});


const bindEvents = () => {
    bindTargetEvent();
};

const unbindEvents = () => {
    unbindTargetEvent();
};

const visibleHandler = () => {
    if (data.visible) {
        nextTick(() => {
            update();
        });
    } else {
        emit('close');
    }
};

//=============================================================================

const bindTargetEvent = () => {
    if (!props.bindTarget) {
        return;
    }
    $target = getElement(props.target);
    if ($target) {
        $target.addEventListener('mouseenter', openHandler);
        $target.addEventListener('focus', openHandler);
        $target.addEventListener('mouseleave', closeHandler);
        $target.addEventListener('blur', closeHandler);
    }
};

const unbindTargetEvent = () => {
    if ($target) {
        $target.removeEventListener('mouseenter', openHandler);
        $target.removeEventListener('focus', openHandler);
        $target.removeEventListener('mouseleave', closeHandler);
        $target.removeEventListener('blur', closeHandler);
        $target = null;
    }
};

const openHandler = () => {
    if (data.visible) {
        return;
    }
    if (props.disabled) {
        return;
    }
    data.visible = true;
};

const closeHandler = () => {
    if (!data.visible) {
        return;
    }
    if (props.disabled) {
        return;
    }
    if ($target) {
        data.visible = false;
    } else {
        unmountComponent($el);
    }
};

//=============================================================================

const update = () => {
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

    //fix for arrow size
    const arrowSize = 10;
    targetRect.left -= arrowSize;
    targetRect.top -= arrowSize;
    targetRect.width += arrowSize * 2;
    targetRect.height += arrowSize * 2;

    const rect = getRect(`.${cid}`);

    //console.log(containerRect, targetRect, rect);

    const positionInfo = getBestPosition(
        containerRect,
        targetRect,
        rect,
        props.positions
    );

    //no change
    if (data.position === positionInfo.position
            && data.align === positionInfo.align
            && data.top === positionInfo.top
            && data.left === positionInfo.left) {
        return;
    }

    //console.log(positionInfo);

    data.position = positionInfo.position;
    data.align = positionInfo.align;
    data.top = positionInfo.top;
    data.left = positionInfo.left;

    emit('update');
};


//====================================================================================================


onMounted(() => {
    $el = el.value;
    if (!$el.parentNode) {
        document.body.appendChild($el);
    }

    //console.log(html);
    if (props.html) {
        content.value.innerHTML = props.html;
    }

    bindEvents();
    update();
});

onUnmounted(() => {
    unbindEvents();
    emit('close');
});

</script>

<style lang="scss">
.vui-tooltip {
    //pointer-events: none;
    position: absolute;
    visibility: visible;
    z-index: 1000;
    opacity: 1;
    margin: 0;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 20%);
    transition: opacity 0.2s linear, visibility 0.2s linear;

    .vui-tooltip-content {
        padding: 10px;
        display: inline-block;
        font-size: 14px;
        //https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break
        word-break: break-word;
        overflow-wrap: break-word;
        //IE https://caniuse.com/#feat=wordwrap
        word-wrap: break-word;
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
