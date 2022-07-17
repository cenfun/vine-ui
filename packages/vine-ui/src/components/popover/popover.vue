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
        class="vui-popover-body"
        :style="styleBody"
      >
        <div
          v-if="data.headerVisible"
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
    computed, onMounted, onUnmounted, reactive, ref, watchEffect, nextTick
} from 'vue';
import {
    useBase, BaseRender, destroyComponent
} from '../../base/base.js';

import {
    getDefaultPositions, getBestPosition, getRect, getElement, toRect
} from '../../base/base-popup.js';

const { cid } = useBase('VuiPopover');


const props = defineProps({

    title: {
        type: String,
        default: ''
    },

    autoClose: {
        type: Boolean,
        default: true
    },

    hasHeader: {
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
        type: Number,
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
    }

});

const data = reactive({
    visible: false,
    headerVisible: true,
    contentOverflow: false,
    //calculation info
    info: {
        position: 'bottom',
        align: 'center',
        top: 0,
        left: 0,
        width: 'auto',
        height: 'auto'
    }
});

const classList = computed(() => {
    return [
        'vui',
        'vui-popup',
        `vui-popup-${data.info.position}-${data.info.align}`,
        'vui-popover',
        cid
    ];
});

const styleList = computed(() => {
    return {
        top: `${data.info.top}px`,
        left: `${data.info.left}px`,
        width: `${data.info.width}px`,
        height: `${data.info.height}px`
    };
});

const styleBody = computed(() => {
    return {
        //TODO px
        width: `${props.width}px`
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

//====================================================================================================

const el = ref(null);
let $el;

const emit = defineEmits(['update', 'close']);

let positionInfo;
let $target;
let timeout_close;

//====================================================================================================
watchEffect(() => {
    data.headerVisible = props.hasHeader;
    if (data.headerVisible && !props.title) {
        data.headerVisible = false;
    }
    data.visible = props.visible;
    if ($el) {
        visibleHandler();
    }
});


const visibleHandler = () => {
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
};

const bindEvents = () => {
    bindTargetEvent();
    bindResizeEvent();
    bindScrollEvent();
    bindCloseEvent();
};

const unbindEvents = () => {
    unbindTargetEvent();
    unbindResizeEvent();
    unbindScrollEvent();
    unbindCloseEvent();
};

//=============================================================================

const bindTargetEvent = () => {
    if (!props.bindTarget) {
        return;
    }
    $target = getElement(props.target);
    if ($target) {
        $target.addEventListener('click', openHandler);
    }
};

const unbindTargetEvent = () => {
    if ($target) {
        $target.removeEventListener('click', openHandler);
        $target = null;
    }
};

const openHandler = () => {
    if (data.visible) {
        return;
    }
    data.visible = true;
};

//=============================================================================

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

//=============================================================================

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

//=============================================================================

const bindCloseEvent = () => {
    unbindCloseEvent();
    if (props.autoClose && data.visible) {
        timeout_close = setTimeout(() => {
            window.addEventListener('mousedown', clickHandler);
            window.addEventListener('keydown', keydownHandler);
        }, 10);
    }
};

const unbindCloseEvent = () => {
    window.removeEventListener('mousedown', clickHandler);
    window.removeEventListener('keydown', keydownHandler);
};

const clickHandler = (e) => {
    if (isInnerElement(e.target)) {
        return;
    }
    close();
};

const keydownHandler = (e) => {
    //ESC
    if (e.keyCode !== 27) {
        return;
    }
    close();
};

//=============================================================================

const isInnerElement = (elem) => {
    if ($el === elem) {
        return true;
    }
    return $el.contains(elem);
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

const close = () => {
    if (!data.visible) {
        return;
    }
    if ($target) {
        data.visible = false;
    } else {
        destroyComponent($el);
    }
};

//=============================================================================
const updateContentHeight = () => {
    $el.style.height = 'auto';
    const elem = $el.querySelector('.vui-popover-content');
    elem.style.height = 'auto';

    const br = elem.getBoundingClientRect();
    const rect = toRect(br);
    const ch = rect.height;

    data.contentOverflow = false;
    //fix for min/max height
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
    const targetRect = getRect(props.target);

    //fix for arrow size
    const arrowSize = 10;
    targetRect.left -= arrowSize;
    targetRect.top -= arrowSize;
    targetRect.width += arrowSize * 2;
    targetRect.height += arrowSize * 2;

    updateContentHeight();

    const rect = getRect(`.${cid}`);
    const positions = props.positions;

    //console.log(containerRect, targetRect, rect);

    positionInfo = getBestPosition(
        containerRect,
        targetRect,
        rect,
        positions,
        //previous position info for keeping position if has animation (dynamic size)
        positionInfo
    );

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

//====================================================================================================

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
    visibility: visible;
    z-index: 1000;
    opacity: 1;
    margin: 0;
    padding: 16px;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 20%);
    transition: opacity 0.2s linear, visibility 0.2s linear;

    .vui-popover-header {
        padding-bottom: 5px;
        border-bottom: 1px solid #333;
        margin-bottom: 5px;

        .vui-popover-title {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .vui-popover-content {
        margin: 0;
        padding: 0;
        overflow: hidden;
        text-overflow: ellipsis;
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
