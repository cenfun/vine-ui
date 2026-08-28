<template>
  <div
    v-init="{cid}"
    class="vui vui-toast"
    :style="data.style"
  >
    <Icon
      v-if="data.settings.icon"
      :icon="data.settings.icon"
      :color="data.settings.color"
      :size="data.settings.size"
    />
    <div class="vui-toast-content">
      <VuiContentRenderer
        :content="props.content"
        :html="props.html"
      />
    </div>
  </div>
</template>
<script setup>
import {
    onMounted, reactive, watch
} from 'vue';
import { microtask } from 'async-tick';

import VuiContentRenderer from './content-renderer.vue';
import Icon from './icon.vue';

import { getCID, vInit } from '../utils/util.js';

const cid = getCID('VuiToast');

const props = defineProps({

    /** Toast type: success, error, or info */

    type: {
        type: String,
        default: ''
    },

    /** Custom icon name */

    icon: {
        type: String,
        default: ''
    },

    /** Custom icon color */

    iconColor: {
        type: String,
        default: ''
    },

    /** Custom icon size */

    iconSize: {
        type: String,
        default: ''
    },

    /** Toast message content or Vue component */

    content: {
        type: [String, Object, Function],
        default: ''
    },

    /** Render string content as HTML */

    html: {
        type: Boolean,
        default: false
    },

    /** Toast text color */

    color: {
        type: String,
        default: ''
    },

    /** CSS border shorthand */

    border: {
        type: String,
        default: ''
    },

    /** CSS background shorthand */

    background: {
        type: String,
        default: ''
    }


});

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

const data = reactive({
    settings: {},
    style: {}
});

const update = microtask(() => {
    const defaults = iconMap[props.type] || iconMap.info;
    const settings = {
        ... defaults
    };

    if (props.icon) {
        settings.icon = props.icon;
    }
    if (props.iconColor) {
        settings.color = props.iconColor;
    }
    if (props.iconSize) {
        settings.size = props.iconSize;
    }

    data.settings = settings;
    data.style = {
        color: props.color,
        border: props.border,
        background: props.background
    };
});

watch([
    () => props.type,
    () => props.icon,
    () => props.iconColor,
    () => props.iconSize,
    () => props.color,
    () => props.border,
    () => props.background
], () => {
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
