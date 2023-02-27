<template>
  <div
    ref="el"
    :class="classList"
    :style="styleList"
  >
    <slot>
      <BaseRender :content="props.content" />
    </slot>
  </div>
</template>

<script setup>
import {
    ref, computed, watch, watchEffect, onMounted, onUnmounted, reactive
} from 'vue';
import { useBase, BaseRender } from '../../base/base.js';

const { cid } = useBase('VuiFlyover');

const props = defineProps({

    width: {
        type: String,
        default: '50%'
    },

    position: {
        type: String,
        default: 'right',
        validator(value) {
            return ['right', 'left'].includes(value);
        }
    },

    content: {
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

const emit = defineEmits(['update:modelValue', 'start', 'end']);

const data = reactive({
    visible: props.visible,
    width: props.width,
    position: props.position,
    hasStarted: false
});

watchEffect(() => {
    data.visible = props.modelValue === null ? props.visible : props.modelValue;
});

watch(() => data.visible, (nv, ov) => {
    console.log('visible change', ov, nv);
    onStart(ov, nv);
    emit('update:modelValue', data.visible);
});

watchEffect(() => {
    data.width = props.width;
});
watchEffect(() => {
    data.position = props.position;
});

const el = ref(null);
let $el;

const classList = computed(() => {
    return [
        'vui',
        'vui-flyover',
        `vui-flyover-${props.position}`,
        cid
    ];
});


const styleList = computed(() => {
    return {
        width: data.width
    };
});

const animationHandler = () => {
    onEnd(data.visible);
};

const bindEvents = () => {
    if ($el) {
        $el.addEventListener('animationend', animationHandler);
    }
};

const unbindEvents = () => {
    if ($el) {
        $el.removeEventListener('animationend', animationHandler);
    }
};

const onStart = (ov, nv) => {

    if (nv === ov) {
        return;
    }

    if (data.hasStarted) {
        onEnd(ov);
    }
    unbindEvents();
    const cl = $el.classList;
    if (nv) {
        cl.add(`vui-slide-in-${props.position}`, 'vui-flyover-show');
        data.width = props.width;
    } else {
        cl.add(`vui-slide-out-${props.position}`);
    }
    data.hasStarted = true;
    bindEvents();
    emit('start', nv);
};

const onEnd = (v) => {
    data.hasStarted = false;
    unbindEvents();
    const cl = $el.classList;
    if (v) {
        cl.remove(`vui-slide-in-${props.position}`);
    } else {
        cl.remove(`vui-slide-out-${props.position}`, 'vui-flyover-show');
        data.width = '0px';
    }
    emit('end', v);
};

onMounted(() => {
    $el = el.value;
    if (data.visible) {
        onStart(false, true);
    }
});

onUnmounted(() => {
    unbindEvents();
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

.vui-flyover-right {
    right: 0;
}

.vui-flyover-left {
    left: 0;
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
