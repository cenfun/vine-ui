<template>
  <div
    v-init="{cid}"
    class="vui vui-toast"
    :class="{'vui-toast-closeable': props.close}"
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
    <div
      v-if="props.close"
      class="vui-toast-close"
      @click="emit('close')"
    >
      <Icon icon="close" />
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
    },

    /** Show a manual close button */

    close: {
        type: Boolean,
        default: false
    },

    /** Horizontal animation direction */

    positionX: {
        type: String,
        default: 'center'
    },

    /** Vertical animation direction */

    positionY: {
        type: String,
        default: 'top'
    }

});

const emit = defineEmits(['close']);

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

const horizontalOffsetMap = {
    left: '-100%',
    center: '0',
    right: '100%'
};

const enterVerticalOffsetMap = {
    top: '100%',
    center: '0',
    bottom: '100%'
};

const leaveVerticalOffsetMap = {
    top: '-100%',
    center: '0',
    bottom: '-100%'
};

const getToastStyle = () => {
    const center = props.positionX === 'center' && props.positionY === 'center';
    return {
        color: props.color,
        border: props.border,
        background: props.background,
        '--vui-toast-translate-x': horizontalOffsetMap[props.positionX] || '0',
        '--vui-toast-enter-y': enterVerticalOffsetMap[props.positionY] || '0',
        '--vui-toast-leave-y': leaveVerticalOffsetMap[props.positionY] || '0',
        '--vui-toast-scale': center ? 0.9 : 1
    };
};

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
    data.style = getToastStyle();
});

watch([
    () => props.type,
    () => props.icon,
    () => props.iconColor,
    () => props.iconSize,
    () => props.color,
    () => props.border,
    () => props.background,
    () => props.positionX,
    () => props.positionY
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
@keyframes vui-toast-enter {
    from {
        opacity: 0;
        transform: translate3d(var(--vui-toast-translate-x), var(--vui-toast-enter-y), 0) scale(var(--vui-toast-scale));
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
    }
}

@keyframes vui-toast-leave {
    from {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
    }

    to {
        opacity: 0;
        transform: translate3d(var(--vui-toast-translate-x), var(--vui-toast-leave-y), 0) scale(var(--vui-toast-scale));
    }
}

.vui-toast {
    position: relative;
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 12px 0 rgb(0 0 0 / 8%);
    animation-name: vui-toast-enter;
    animation-duration: 0.2s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
}

.vui-toast-leave {
    pointer-events: none;
    animation-name: vui-toast-leave;
    animation-timing-function: ease-in;
}

.vui-toast-closeable {
    padding-right: 32px;
}

.vui-toast-close {
    position: absolute;
    top: 6px;
    right: 6px;
    display: flex;
    cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
    .vui-toast {
        animation-duration: 0.01ms;
    }
}
</style>
