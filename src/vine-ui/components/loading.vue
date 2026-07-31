<template>
  <div
    v-init="{cid}"
    :class="classList"
  >
    <div class="vui-loading-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
      ><path
        d="M1,8 A7 7 0 1 1 8 15"
        :stroke="props.color||'#999'"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"
      /></svg>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { getCID, vInit } from '../utils/util.js';

const cid = getCID('VuiLoading');

const props = defineProps({

    /** Center the loading indicator absolutely */

    center: {
        type: Boolean,
        default: false
    },

    /** Use faster animation speed */

    fast: {
        type: Boolean,
        default: false
    },

    /** Spinner stroke color */

    color: {
        type: String,
        default: '#999'
    },

    /** Loading size: s/small,
 m/medium,
 l/large (default: m) */

    size: {
        type: String,
        default: ''
    },

    /** Theme name (reserved for future use) */

    theme: {
        type: String,
        default: ''
    },

    /** Show or hide the loading indicator */

    visible: {
        type: Boolean,
        default: true
    }


});

const classList = computed(() => {
    const ls = ['vui', 'vui-loading'];
    if (props.center) {
        ls.push('vui-loading-center');
    }
    if (props.fast) {
        ls.push('vui-loading-fast');
    }
    const sizeMap = {
        small: 's', medium: 'm', large: 'l'
    };
    const size = sizeMap[props.size] || props.size || 'm';
    ls.push(`vui-loading-${size}`);
    if (props.visible) {
        ls.push('vui-loading-show');
    }
    return ls;
});

defineExpose({
    cid
});

</script>
<style lang="scss">
@use '../global.scss';

.vui-loading {
    position: relative;
    z-index: 1000;
    display: none;
    overflow: hidden;
    pointer-events: none;
}

.vui-loading-show {
    display: inline-block;
}

@keyframes vui-loading-icon-animation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.vui-loading-icon {
    display: block;
    animation: 1s vui-loading-icon-animation linear infinite;
}

.vui-loading-fast .vui-loading-icon {
    animation: 0.382s vui-loading-icon-animation linear infinite;
}

.vui-loading-s .vui-loading-icon {
    width: 16px;
    height: 16px;
}

.vui-loading-m .vui-loading-icon {
    width: 30px;
    height: 30px;
}

.vui-loading-l .vui-loading-icon {
    width: 50px;
    height: 50px;
}

.vui-loading-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.vui-loading-center.vui-loading-show {
    display: block;
}

</style>
