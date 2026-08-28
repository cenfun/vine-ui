<template>
  <div
    ref="el"
    v-init="{cid}"
    :class="classList"
    :style="styleList"
  >
    <div
      v-if="props.resizable"
      class="vui-flyover-resizer"
    />
    <slot />
  </div>
</template>

<script setup>
import {
    ref, computed, watch, onMounted, onUnmounted, reactive
} from 'vue';
import { microtask } from 'async-tick';
import {
    autoPx, bindEvents, unbindEvents, preventDefault, clamp, getCID, vInit, normalizePosition
} from '../utils/util.js';

const cid = getCID('VuiFlyover');

const props = defineProps({

    /** Slide position: right or left */


    position: {
        type: String,
        default: 'right',
        validator(value) {
            return ['right', 'left', 'r', 'l'].includes(value);
        }
    },

    /** Flyover width (px or %) */


    width: {
        type: [String, Number],
        default: '50%'
    },

    /** Minimum width when resizing */


    minWidth: {
        type: [String, Number],
        default: '10%'
    },

    /** Maximum width when resizing */


    maxWidth: {
        type: [String, Number],
        default: '100%'
    },

    /** Enable drag resize handle */


    resizable: {
        type: Boolean,
        default: true
    }

});

const mv = defineModel({
    type: Boolean,
    default: false
});

const emit = defineEmits(['start', 'end', 'resize']);

const pos = computed(() => normalizePosition(props.position));

const data = reactive({
    width: props.width,

    hasStarted: false,
    resizeInfo: null
});

watch(() => mv.value, (nv, ov) => {
    // console.log('visible change', ov, nv);
    onStart(ov, nv);
});

watch(() => props.resizable, () => {
    bindResizeEvents();
});

const el = ref(null);
let $el;

const classList = computed(() => {
    const cls = [
        'vui',
        'vui-flyover',
        `vui-flyover-${pos.value}`
    ];

    // keep visible state onEnd
    if ($el) {
        if ($el.classList.contains('vui-flyover-show')) {
            cls.push('vui-flyover-show');
        }
    }

    return cls;
});

const styleList = computed(() => {
    return {
        width: autoPx(data.width)
    };
});


// ==============================================================================================

const onStart = (ov, nv) => {

    if (nv === ov) {
        return;
    }

    if (data.hasStarted) {
        onEnd(ov);
    }
    unbindAnimationEvents();
    const cl = $el.classList;
    if (nv) {
        cl.add(`vui-slide-in-${pos.value}`, 'vui-flyover-show');
        data.width = props.width;
    } else {
        cl.add(`vui-slide-out-${pos.value}`);
    }
    data.hasStarted = true;

    bindAnimationEvents();

    emit('start', nv);
};


const onEnd = (v) => {
    data.hasStarted = false;
    unbindAnimationEvents();
    const cl = $el.classList;
    if (v) {
        cl.remove(`vui-slide-in-${pos.value}`);
    } else {
        cl.remove(`vui-slide-out-${pos.value}`, 'vui-flyover-show');
        data.width = '0';
    }

    emit('end', v);
};

const animationEvents = {
    animationend: {
        handler: (e) => {
            onEnd(mv.value);
        }
    }
};


const bindAnimationEvents = () => {
    bindEvents(animationEvents, $el);
};

const unbindAnimationEvents = () => {
    unbindEvents(animationEvents);
};

// ==============================================================================================

const getWidthInfo = (w, maxWidth, defaultWidth) => {
    let ws = autoPx(w);
    if (typeof ws !== 'string' || !ws) {
        ws = defaultWidth;
    }
    let width = parseFloat(ws);
    let unit = 'px';
    if (ws.endsWith('%')) {
        unit = '%';
        width = width / 100 * maxWidth;
    }
    return {
        width,
        unit
    };
};

const mouseDownHandler = (e) => {
    // prevent select text
    preventDefault(e);

    const maxWidth = window.innerWidth;

    const startWidth = getWidthInfo(data.width, maxWidth, '50%');

    const startMinWidth = getWidthInfo(props.minWidth, maxWidth, '10%');
    startMinWidth.width = clamp(startMinWidth.width, 0, startWidth.width);

    const startMaxWidth = getWidthInfo(props.maxWidth, maxWidth, '100%');
    startMaxWidth.width = clamp(startMaxWidth.width, startWidth.width, maxWidth);

    data.resizeInfo = {
        maxWidth,
        startX: e.pageX,
        startWidth,
        startMinWidth,
        startMaxWidth
    };
    bindEvents(windowEvents, window);
};

const mouseMoveHandler = function(e) {
    preventDefault(e);

    const buttonPressed = e.buttons;
    if (!buttonPressed) {
        mouseUpHandler(e);
        return;
    }

    updateSize(e);

};


const updateSize = (e) => {
    // update width
    const {
        startWidth, startMinWidth, startMaxWidth, startX
    } = data.resizeInfo;

    const offsetFactor = pos.value === 'right' ? -1 : 1;
    const offsetX = (e.pageX - startX) * offsetFactor;

    // console.log(offsetX, startWidth);

    const maxWidth = window.innerWidth;
    const newWidth = clamp(startWidth.width + offsetX, startMinWidth.width, startMaxWidth.width);

    if (startWidth.unit === '%') {
        const newPercent = (newWidth / maxWidth * 100).toFixed(2);
        data.width = `${newPercent}%`;
    } else {
        data.width = `${Math.round(newWidth)}px`;
    }

    emit('resize', data.width);
};

const mouseUpHandler = function(e) {
    preventDefault(e);
    unbindEvents(windowEvents);
};

const windowEvents = {
    mousemove: {
        handler: (ee) => {
            mouseMoveHandler(ee);
        },
        options: true
    },
    mouseup: {
        handler: (ee) => {
            mouseUpHandler(ee);
        },
        options: {
            once: true
        }
    }
};

const mousedownEvents = {
    mousedown: {
        handler: (e) => {
            mouseDownHandler(e);
        }
    }
};

const bindResizeEvents = () => {
    unbindEvents(mousedownEvents);
    if (props.resizable) {
        bindResizeAsync();
    }
};

const bindResizeAsync = microtask(() => {
    const $resizer = $el.querySelector('.vui-flyover-resizer');
    bindEvents(mousedownEvents, $resizer);
});

// ==============================================================================================

onMounted(() => {
    $el = el.value;
    if (mv.value) {
        onStart(false, true);
    }
    bindResizeEvents();
});

onUnmounted(() => {
    unbindAnimationEvents();
    unbindEvents(mousedownEvents);
});

defineExpose({
    cid
});
</script>

<style lang="scss">
.vui-flyover {
    position: fixed;
    top: 0;
    z-index: 1000;
    display: none;
    width: 0;
    height: 100%;
    background-color: #fff;
    animation-duration: 0.2s;
    animation-fill-mode: both;
}

.vui-flyover-resizer {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 6px;
    height: 100%;
    cursor: ew-resize;
}

.vui-flyover-right {
    right: 0;

    .vui-flyover-resizer {
        left: -3px;
    }
}

.vui-flyover-left {
    left: 0;

    .vui-flyover-resizer {
        right: -3px;
    }
}

.vui-flyover-show {
    display: block;
}

.vui-flyover-show::before {
    position: absolute;
    top: 0;
    content: "";
    z-index: 10;
    display: block;
    width: 10px;
    height: 100%;
    pointer-events: none;
}

.vui-flyover-right.vui-flyover-show::before {
    left: -10px;
    background-image: linear-gradient(to left, rgb(0 0 0 / 20%), rgb(0 0 0 / 0%));
}

.vui-flyover-left.vui-flyover-show::before {
    left: 100%;
    background-image: linear-gradient(to right, rgb(0 0 0 / 20%), rgb(0 0 0 / 0%));
}

@keyframes vui-slide-in-right {
    from {
        visibility: visible;
        transform: translate3d(100%, 0, 0);
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}

.vui-slide-in-right {
    animation-name: vui-slide-in-right;
}

@keyframes vui-slide-out-right {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        visibility: hidden;
        transform: translate3d(100%, 0, 0);
    }
}

.vui-slide-out-right {
    animation-name: vui-slide-out-right;
}

@keyframes vui-slide-in-left {
    from {
        visibility: visible;
        transform: translate3d(-100%, 0, 0);
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}

.vui-slide-in-left {
    animation-name: vui-slide-in-left;
}

@keyframes vui-slide-out-left {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        visibility: hidden;
        transform: translate3d(-100%, 0, 0);
    }
}

.vui-slide-out-left {
    animation-name: vui-slide-out-left;
}
</style>
