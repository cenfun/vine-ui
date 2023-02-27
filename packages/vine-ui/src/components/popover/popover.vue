<template>
  <div
    v-show="data.visible"
    ref="el"
    :class="classList"
    :style="styleList"
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
  </div>
</template>

<script setup>
import {
    computed, onMounted, reactive, ref, watch, watchEffect, nextTick
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

watchEffect(() => {
    data.visible = props.modelValue === null ? props.visible : props.modelValue;
});

watch(() => data.visible, () => {
    visibleChangeHandler();
    emit('update:modelValue', data.visible);
});

const el = ref(null);
let $el;
let positionInfo;

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

const visibleChangeHandler = () => {
    if (!$el) {
        return;
    }

    if (data.visible) {
        // start showing
        bindEvents();
        update();
    } else {
        // clean when closed
        unbindEvents();
        positionInfo = null;
    }
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
    // do not setTimeout, because we can see popover top left in first time
    nextTick(() => {
        updateSync();
    });
};

// ====================================================================================================

onMounted(() => {
    $el = el.value;
    visibleChangeHandler();
});

defineExpose({
    cid,
    update
});

</script>

<style lang="scss">
.vui-popover {
    position: fixed;
    z-index: 1000;
    margin: 0;
    padding: 16px;

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
}
</style>
