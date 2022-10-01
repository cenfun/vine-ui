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
    ref, computed, watchEffect, onMounted, onUnmounted, reactive
} from 'vue';
import { useBase, BaseRender } from '../../base/base.js';

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
    }
});

const emit = defineEmits(['start', 'end']);

const { cid } = useBase('VuiFlyover');

const classList = computed(() => {
    return [
        'vui',
        'vui-flyover',
        `vui-flyover-${props.position}`,
        cid
    ];
});

const el = ref(null);

const state = reactive({
    hasStarted: false,
    locked: false,
    $el: null,
    visible: props.visible
});

const dataWidth = ref(props.width);

const styleList = computed(() => {
    return {
        width: dataWidth.value
    };
});

const animationHandler = () => {
    onEnd(state.visible);
};

const bindEvents = () => {
    if (state.$el) {
        state.$el.addEventListener('animationend', animationHandler);
    }
};

const unbindEvents = () => {
    if (state.$el) {
        state.$el.removeEventListener('animationend', animationHandler);
    }
};

const onStart = () => {

    const nv = props.visible;
    const ov = state.visible;

    if (nv === ov) {
        return;
    }

    if (state.hasStarted) {
        onEnd(ov);
    }
    unbindEvents();
    const cl = state.$el.classList;
    if (nv) {
        cl.add(`vui-slide-in-${props.position}`, 'vui-flyover-show');
        dataWidth.value = props.width;
    } else {
        cl.add(`vui-slide-out-${props.position}`);
    }
    state.hasStarted = true;
    bindEvents();
    emit('start', nv);
};

const onEnd = (v) => {
    state.hasStarted = false;
    unbindEvents();
    const cl = state.$el.classList;
    if (v) {
        cl.remove(`vui-slide-in-${props.position}`);
    } else {
        cl.remove(`vui-slide-out-${props.position}`, 'vui-flyover-show');
        dataWidth.value = '0px';
    }
    emit('end', v);
};

watchEffect(() => {
    dataWidth.value = props.width;
    if (state.$el) {
        onStart();
    }
    state.visible = props.visible;
});

onMounted(() => {
    state.$el = el.value;
    onStart();
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
    height: 100%;
    width: 0;
    display: none;
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
    pointer-events: none;
    content: "";
    position: absolute;
    top: 0;
    z-index: 10;
    display: block;
    height: 100%;
    width: 10px;
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
        transform: translate3d(100%, 0, 0);
        visibility: visible;
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
        transform: translate3d(-100%, 0, 0);
        visibility: visible;
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
