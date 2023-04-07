<template>
  <div
    ref="el"
    :class="classList"
    :style="styleList"
  >
    <div
      v-if="data.resizable"
      class="vui-flyover-resizer"
    />
    <slot />
  </div>
</template>

<script setup>
import {
    ref, computed, watch, watchEffect, onMounted, onUnmounted, reactive
} from 'vue';
import { microtask } from 'async-tick';
import { useBase } from '../../base/base.js';

import {
    autoPx, bindEvents, unbindEvents, preventDefault, clamp
} from '../../utils/util.js';

const { cid } = useBase('VuiFlyover');

const props = defineProps({

    position: {
        type: String,
        default: 'right',
        validator(value) {
            return ['right', 'left'].includes(value);
        }
    },

    width: {
        type: [String, Number],
        default: '50%'
    },

    minWidth: {
        type: [String, Number],
        default: '10%'
    },

    maxWidth: {
        type: [String, Number],
        default: '100%'
    },

    resizable: {
        type: Boolean,
        default: true
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

const emit = defineEmits(['update:modelValue', 'start', 'end', 'resize']);

const data = reactive({
    visible: props.visible,
    position: props.position,
    width: props.width,
    resizable: props.resizable,

    hasStarted: false,
    resizeInfo: null
});

watchEffect(() => {
    data.visible = props.modelValue === null ? props.visible : props.modelValue;
});

watch(() => data.visible, (nv, ov) => {
    // console.log('visible change', ov, nv);
    onStart(ov, nv);
    emit('update:modelValue', nv);
});

watchEffect(() => {
    data.position = props.position;
});
watchEffect(() => {
    data.width = props.width;
});
watchEffect(() => {
    data.resizable = props.resizable;
});

watch(() => data.resizable, () => {
    bindResizeEvents();
});

const el = ref(null);
let $el;

const classList = computed(() => {
    const cls = [
        'vui',
        'vui-flyover',
        cid,
        `vui-flyover-${props.position}`
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
        cl.add(`vui-slide-in-${props.position}`, 'vui-flyover-show');
        data.width = props.width;
    } else {
        cl.add(`vui-slide-out-${props.position}`);
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
        cl.remove(`vui-slide-in-${props.position}`);
    } else {
        cl.remove(`vui-slide-out-${props.position}`, 'vui-flyover-show');
        data.width = '0';
    }

    emit('end', v);
};

const animationEvents = {
    animationend: {
        handler: (e) => {
            onEnd(data.visible);
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

    const offsetFactor = data.position === 'right' ? -1 : 1;
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
    if (data.resizable) {
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
    if (data.visible) {
        onStart(false, true);
    }
    bindResizeEvents();
});

onUnmounted(() => {
    unbindAnimationEvents();
    unbindEvents(mousedownEvents);
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
