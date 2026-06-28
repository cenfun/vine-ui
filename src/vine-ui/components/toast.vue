<template>
  <div
    v-init="{cid}"
    class="vui vui-toast"
  >
    <Icon
      v-if="data.icon"
      :icon="data.icon"
      :color="data.color"
      :size="data.size"
    />
    <div class="vui-toast-content">
      {{ props.content }}
    </div>
  </div>
</template>
<script setup>
import {
    onMounted, reactive, watch
} from 'vue';
import { microtask } from 'async-tick';

import Icon from './icon.vue';

import { getCID, vInit } from '../utils/util.js';

const cid = getCID('VuiToast');

const props = defineProps({

    /** Toast type: success,
 error,
 info,
 or custom */

    type: {
        type: String,
        default: ''
    },

    /** Toast message content */

    content: {
        type: String,
        default: ''
    }


});

const data = reactive({
    icon: ''
});

const update = microtask(() => {
    const iconMap = {
        success: {
            icon: 'success',
            color: '#67C23A',
            size: '24px'
        },
        error: {
            icon: 'error',
            color: '#FF0000',
            size: '24px'
        },
        info: {
            icon: 'info',
            color: '#1e1e1e',
            size: '24px'
        }
    };
    Object.assign(data, iconMap[props.type] || iconMap.success);

});

watch(() => props.type, () => {
    update();
});

onMounted(() => {
    update();
});

defineExpose({
    update,
    cid
});
</script>
<style lang="scss">
@use "../global.scss";

@keyframes vui-toast-slide-in-up {
    from {
        visibility: visible;
        transform: translate3d(0, 100%, 0);
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}

.vui-toast {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
    animation-name: vui-toast-slide-in-up;
    animation-duration: 0.2s;
    animation-fill-mode: both;
}
</style>
