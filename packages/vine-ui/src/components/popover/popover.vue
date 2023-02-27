<template>
  <div
    v-show="modelVisible"
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
        class="vui-popover-body"
        :style="styleBody"
      >
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
        <div :class="classContent">
          <slot>
            <BaseRender :content="props.content" />
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
    computed, onMounted, onUnmounted, reactive, ref, nextTick, watch
} from 'vue';
import { useBase, BaseRender } from '../../base/base.js';

import {
    getBestPosition, getRect, getElement, toRect
} from '../../base/base-popup.js';

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
        type: Number,
        default: 0
    },

    maxHeight: {
        type: Number,
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

    modelValue: {
        type: Boolean,
        default: null
    }

});

const emit = defineEmits(['update:modelValue', 'update', 'beforeClose', 'close']);

const modelVisible = computed({
    get() {
        if (props.modelValue === null) {
            return props.visible;
        }
        return props.modelValue;
    },
    set(v) {
        emit('update:modelValue', v);
    }
});

const el = ref(null);
let $el;

let positionInfo;
let timeout_close;

const data = reactive({
    visible: modelVisible,
    contentOverflow: false,
    // calculation info
    info: {
        position: 'bottom',
        align: 'center',
        top: 0,
        left: 0,
        width: 'auto',
        height: 'auto'
    }
});

// ====================================================================================================

const classList = computed(() => {
    return [
        'vui',
        'vui-popup',
        `vui-popup-${data.info.position}`,
        `vui-popup-${data.info.position}-${data.info.align}`,
        'vui-popover',
        cid
    ];
});

const styleList = computed(() => {
    const st = {
        top: `${data.info.top}px`,
        left: `${data.info.left}px`,
        width: `${data.info.width}px`,
        height: `${data.info.height}px`
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

const styleBody = computed(() => {
    return {
        width: autoPx(props.width)
    };
});

const classContent = computed(() => {
    const list = [
        'vui-popover-content'
    ];
    if (data.contentOverflow) {
        list.push('vui-popover-content-overflow');
    }
    return list;
});

// ====================================================================================================

watch(() => data.visible, () => {
    if (!$el) {
        return;
    }

    if (data.visible) {
        bindResizeEvent();
        bindScrollEvent();
        bindCloseEvent();
        update();
    } else {
        unbindResizeEvent();
        unbindScrollEvent();
        unbindCloseEvent();
        positionInfo = null;
        emit('close');
    }
});

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
        timeout_close = setTimeout(() => {
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
};

// =============================================================================
const updateContentHeight = () => {
    $el.style.height = 'auto';
    const elem = $el.querySelector('.vui-popover-content');
    elem.style.height = 'auto';

    const br = elem.getBoundingClientRect();
    const rect = toRect(br);
    const ch = rect.height;

    data.contentOverflow = false;
    // fix for min/max height
    if (ch > props.maxHeight) {
        elem.style.height = `${props.maxHeight}px`;
        data.contentOverflow = true;
    } else if (ch < props.minHeight) {
        elem.style.height = `${props.minHeight}px`;
    }

};

const updateSync = () => {
    if (!data.visible) {
        return;
    }
    const containerRect = getRect(props.container || window);
    const arrowSize = 10;
    const targetRect = getRect(props.target, arrowSize);

    updateContentHeight();

    const rect = getRect(`.${cid}`);
    const positions = props.positions;

    // console.log('containerRect', containerRect);
    // console.log('targetRect', targetRect);
    // console.log('rect', rect);

    positionInfo = getBestPosition(
        containerRect,
        targetRect,
        rect,
        positions,
        // previous position info for keeping position if has animation (dynamic size)
        positionInfo
    );

    // console.log('positionInfo', positionInfo);

    let noChange = true;
    for (const k in data.info) {
        if (data.info[k] !== positionInfo[k]) {
            noChange = false;
            break;
        }
    }
    if (noChange) {
        return;
    }

    for (const k in data.info) {
        data.info[k] = positionInfo[k];
    }
    emit('update');
};

const update = () => {
    nextTick(() => {
        updateSync();
    });
};

// ====================================================================================================

onMounted(() => {
    $el = el.value;
    if (!$el.parentNode) {
        document.body.appendChild($el);
    }
    bindEvents();
    update();
});

onUnmounted(() => {
    clearTimeout(timeout_close);
    unbindEvents();
    positionInfo = null;
    emit('close');
});

</script>

<style lang="scss">
.vui-popover {
    position: absolute;
    z-index: 1000;
    margin: 0;
    padding: 16px;
    visibility: visible;
    opacity: 1;
    transition: opacity 0.2s linear, visibility 0.2s linear;

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
        margin: 0;
        padding: 0;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .vui-popover-content-overflow {
        overflow-y: auto;
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
