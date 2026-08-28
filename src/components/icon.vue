<template>
  <div
    ref="el"
    v-init="{cid}"
    :class="classMap"
    :style="iconStyle"
    :name="props.icon"
  />
</template>
<script setup>
import {
    computed,
    onMounted, ref, watch
} from 'vue';
import { microtask } from 'async-tick';

import { getCID, vInit } from '../utils/util.js';
import { icons } from '../utils/icons.js';

const cid = getCID('VuiIcon');

const el = ref(null);

const props = defineProps({

    /** Icon name (must match an SVG file in icons directory) */

    icon: {
        type: String,
        default: ''
    },

    /** Icon size (width and height) */

    size: {
        type: String,
        default: '16px'
    },

    /** Icon width (overrides size) */

    width: {
        type: String,
        default: ''
    },

    /** Icon height (overrides size) */

    height: {
        type: String,
        default: ''
    },

    /** Icon color (CSS color value) */

    color: {
        type: String,
        default: ''
    },

    /** Enable button mode (clickable with hover effect) */

    button: {
        type: Boolean,
        default: false
    },

    /** Use primary color on hover (only with button mode) */

    primary: {
        type: Boolean,
        default: false
    }


});

const classMap = computed(() => {
    const list = ['vui', 'vui-icon'];
    if (props.button) {
        list.push('vui-icon-button');
        if (props.primary) {
            list.push('vui-icon-primary');
        }
    }
    return list;
});

const loadIcon = () => {

    const $el = el.value;
    if (!$el) {
        return;
    }

    const icon = icons[props.icon];
    if (!icon) {
        return;
    }

    $el.innerHTML = icon;
};

const update = microtask(() => {
    loadIcon();
});

const iconStyle = computed(() => {
    const st = {};
    if (props.size) {
        st['--vui-icon-width'] = props.size;
        st['--vui-icon-height'] = props.size;
    }

    if (props.width) {
        st['--vui-icon-width'] = props.width;
    }
    if (props.height) {
        st['--vui-icon-height'] = props.height;
    }

    if (props.color) {
        st['--vui-icon-color'] = props.color;
    }

    return st;
});

watch([
    () => props.icon,
    () => props.size,
    () => props.color
], () => {
    update();
});

onMounted(() => {
    update();
});

defineExpose({
    cid,
    update
});
</script>
<style lang="scss">
.vui-icon {
    --vui-icon-width: 16px;
    --vui-icon-height: 16px;
    --vui-icon-color: inherit;

    position: relative;
    flex-shrink: 0;
    width: var(--vui-icon-width);
    height: var(--vui-icon-height);
    margin: 0;
    padding: 0;
    color: var(--vui-icon-color);
    overflow: hidden;
    user-select: none;

    svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    }
}

.vui-icon-button {
    cursor: pointer;
    opacity: 0.8;
    transition: var(--vui-opacity-transition);
}

.vui-icon-button:hover {
    opacity: 1;
}

.vui-icon-primary {
    opacity: 1;
    transition: var(--vui-color-transition);
}

.vui-icon-primary:hover {
    color: #0a58ca;
}

</style>
