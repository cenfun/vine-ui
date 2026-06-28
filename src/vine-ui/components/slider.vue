<template>
  <div
    ref="el"
    v-init="{cid}"
    :class="classList"
    :style="styleList"
  >
    <div
      v-if="props.button"
      :class="['vui-slider-button', data.left ? '' : 'disabled']"
      @click="onButtonClick(-1)"
    >
      <Icon
        icon="arrow-left"
        size="20px"
      />
    </div>
    <div class="vui-slider-main">
      <div :class="['vui-slider-inner', data.enable ? 'vui-slider-enable' : '']">
        <slot />
      </div>
    </div>
    <div
      v-if="props.button"
      :class="['vui-slider-button', data.right ? '' : 'disabled']"
      @click="onButtonClick(1)"
    >
      <Icon
        icon="arrow-right"
        size="20px"
      />
    </div>
  </div>
</template>
<script setup>
import {
    computed, onMounted, onUnmounted, reactive, ref, watch
} from 'vue';
import { microtask } from 'async-tick';

import Icon from './icon.vue';

import {
    autoPx, getCID, vInit
} from '../utils/util.js';
import { StartMoveEnd } from '../utils/start-move-end.js';

const cid = getCID('VuiSlider');
const el = ref();

const emit = defineEmits(['update']);
const props = defineProps({

    /** Show left/right navigation buttons */

    button: {
        type: Boolean,
        default: false
    },

    /** Slider container width */

    width: {
        type: String,
        default: ''
    },

    /** Slider container height */

    height: {
        type: String,
        default: ''
    },

    /** Update token — change this value to trigger re-layout */

    token: {
        type: [String, Number],
        default: ''
    },

    /** Scroll step size in pixels when using buttons */

    step: {
        type: [Number, String],
        default: 100
    }


});

const data = reactive({

});

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-slider'
    ];
    if (data.left) {
        ls.push('vui-slider-left');
    }
    if (data.right) {
        ls.push('vui-slider-right');
    }
    return ls;
});

const styleList = computed(() => {
    const st = {};
    if (props.width) {
        st.width = autoPx(props.width);
    }
    if (props.height) {
        st.height = autoPx(props.height);
    }
    return st;
});

const update = microtask(() => {

    if (!el.value) {
        return;
    }

    const $inner = el.value.querySelector('.vui-slider-inner');

    const clientWidth = $inner.clientWidth;
    const scrollWidth = $inner.scrollWidth;
    const scrollLeft = Math.ceil($inner.scrollLeft);

    // console.log(clientWidth, scrollWidth, scrollLeft, $inner.scrollLeft);

    data.enable = false;
    data.left = false;
    data.right = false;
    if (scrollWidth > clientWidth) {
        data.enable = true;

        if (Math.abs(scrollLeft) > 2) {
            data.left = true;
        }
        if (Math.abs(scrollLeft + clientWidth - scrollWidth) > 2) {
            data.right = true;
        }
    }

    emit('update', data);

    // console.log('update', data.left, data.right, data.enable);

});

let sme;
const bindMouseEvents = () => {

    const $inner = el.value.querySelector('.vui-slider-inner');

    sme = new StartMoveEnd($inner);
    sme.bind(StartMoveEnd.START, (ce) => {
        // console.log('sme start');
        data.moving = true;
        data.startValue = $inner.scrollLeft;
    });
    sme.bind(StartMoveEnd.MOVE, (ce) => {
        if (!data.moving) {
            return;
        }
        // console.log('sme move');
        const ed = ce.detail;
        const offsetX = ed.offsetX;
        $inner.scrollTo(data.startValue - offsetX, 0);
        update();
    });
    sme.bind(StartMoveEnd.END, (ce) => {
        // console.log('sme end');
        data.moving = false;
    });
};

const unbindMouseEvents = () => {
    if (sme) {
        sme.destroy();
        sme = null;
    }
};

let mObserver;
let rObserver;
const bindContainerEvent = () => {
    mObserver = new MutationObserver(() => {
        update();
    });
    mObserver.observe(el.value, {
        childList: true,
        subtree: true
    });
    rObserver = new ResizeObserver(() => {
        update();
    });
    rObserver.observe(el.value);
};

const unbindContainerEvent = () => {
    if (mObserver) {
        mObserver.disconnect();
        mObserver = null;
    }
    if (rObserver) {
        rObserver.disconnect();
        rObserver = null;
    }
};

const onButtonClick = (direction) => {
    const $inner = el.value.querySelector('.vui-slider-inner');
    const step = Number(props.step) || 100;
    $inner.scrollBy({
        left: direction * step,
        behavior: 'smooth'
    });
    $inner.addEventListener('scrollend', (e) => {
        update();
    }, {
        once: true
    });
};

watch([
    () => props.width,
    () => props.height,
    () => props.token
], () => {
    update();
});

onMounted(() => {
    bindContainerEvent();
    bindMouseEvents();
    update();
});
onUnmounted(() => {
    unbindContainerEvent();
    unbindMouseEvents();
});

defineExpose({
    update,
    cid
});
</script>
<style lang="scss">
@use "../global.scss";

.vui-slider {
    position: relative;
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 0;
    overflow: hidden;
}

.vui-slider-button {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    color: #5e5e5e;
    border: 1px solid #5e5e5e;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;
    transition: var(--vui-color-transition);

    &:hover {
        color: #000;
        border-color: #000;
    }
}

.vui-slider-button.disabled {
    color: #ccc;
    border-color: #ccc;
}

.vui-slider-main {
    position: relative;
    flex: auto;
    overflow: hidden;
}

.vui-slider-inner {
    position: relative;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.vui-slider-enable {
    cursor: pointer;
    user-select: none;
}

.vui-slider-left .vui-slider-main::before {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 10;
    display: block;
    width: 50px;
    height: 100%;
    background-image: linear-gradient(to right, #fff, rgb(255 255 255 / 0%));
    pointer-events: none;
}

.vui-slider-right .vui-slider-main::after {
    position: absolute;
    top: 0;
    right: 0;
    content: "";
    z-index: 10;
    display: block;
    width: 50px;
    height: 100%;
    background-image: linear-gradient(to left, #fff, rgb(255 255 255 / 0%));
    pointer-events: none;
}
</style>
