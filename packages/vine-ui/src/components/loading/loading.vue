<template>
  <div :class="classList">
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
import { getCID } from '../../utils/util.js';

const cid = getCID('VuiLoading');

const props = defineProps({
    center: {
        type: Boolean,
        default: false
    },
    fast: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: '#999'
    },
    size: {
        type: String,
        default: 'm',
        validator(value) {
            return ['', 's', 'm', 'l'].includes(value);
        }
    },
    theme: {
        type: String,
        default: ''
    },
    visible: {
        type: Boolean,
        default: true
    }

});

const classList = computed(() => {
    const ls = ['vui-loading'];
    if (props.center) {
        ls.push('vui-loading-center');
    }
    if (props.fast) {
        ls.push('vui-loading-fast');
    }
    ls.push(`vui-loading-${props.size || 'm'}`);
    if (props.visible) {
        ls.push('vui-loading-show');
    }
    ls.push(cid);
    return ls;
});


</script>
<style lang="scss">
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
