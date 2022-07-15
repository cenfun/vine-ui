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
    ref, computed, watchEffect, onMounted
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
    attachToBody: {
        type: Boolean,
        default: true
    }
});

const classList = computed(() => {
    return [
        'vui',
        'vui-flyover',
        `vui-flyover-${props.position}`,
        cid
    ];
});

const dataWidth = ref(props.width);
const dataVisible = ref(props.visible);

const styleList = computed(() => {
    return {
        width: dataWidth.value
    };
});

const el = ref(null);
let $el;
onMounted(() => {
    $el = el.value;
    onStart();
});

const getBodyClass = () => {
    if (props.position === 'left') {
        return '';
    }
    if (props.attachToBody || !$el.parentNode) {
        return 'vui-flyover-overflow-hidden';
    }
    return '';
};

const lockBody = (lock) => {
    const bc = getBodyClass();
    if (!bc) {
        return;
    }
    //for body hide scrollbar when animation
    const cl = document.body.classList;
    if (lock) {
        cl.add(bc);
    } else {
        cl.remove(bc);
    }
};


const animationHandler = () => {
    onEnd(dataVisible.value);
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


let hasStarted = false;
const onStart = () => {

    const nv = props.visible;
    const ov = dataVisible.value;

    if (hasStarted) {
        onEnd(ov);
    }
    lockBody(true);
    unbindEvents();
    const cl = $el.classList;
    if (nv) {
        cl.add(`vui-slide-in-${props.position}`, 'vui-flyover-show');
        dataWidth.value = props.width;
    } else {
        cl.add(`vui-slide-out-${props.position}`);
    }
    hasStarted = true;
    bindEvents();
};

const onEnd = (v) => {
    hasStarted = false;
    lockBody(false);
    unbindEvents();
    const cl = $el.classList;
    if (v) {
        cl.remove(`vui-slide-in-${props.position}`);
    } else {
        cl.remove(`vui-slide-out-${props.position}`, 'vui-flyover-show');
        dataWidth.value = '0px';
    }
};

watchEffect(() => {
    dataWidth.value = props.width;
    if ($el) {
        onStart();
    }
    dataVisible.value = props.visible;
});

</script>

<style lang="scss">
.vui-flyover {
    position: absolute;
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

.vui-flyover-overflow-hidden {
    overflow: hidden;
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
