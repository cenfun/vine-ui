<template>
  <div
    v-init="{cid}"
    :class="classMap"
    :style="styleMap"
    @click="onClick"
  >
    <Icon
      v-bind="iconProps"
    />
    <span
      v-if="props.label"
      class="vui-icon-label-text"
    >
      {{ props.label }}
    </span>
    <slot />
  </div>
</template>
<script setup>
import { computed } from 'vue';
import Icon from './icon.vue';
import { getCID, vInit } from '../utils/util.js';

const cid = getCID('VuiIconLabel');

const props = defineProps({

    /** Icon name */

    icon: {
        type: String,
        default: ''
    },

    /** Icon size */

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

    /** Icon color */

    color: {
        type: String,
        default: ''
    },

    /** Label text displayed next to the icon */

    label: {
        type: String,
        default: ''
    },

    /** Enable button mode (clickable with hover effect) */

    button: {
        type: Boolean,
        default: false
    },

    /** Use primary color on hover */

    primary: {
        type: Boolean,
        default: false
    },

    /** Gap between icon and label */

    gap: {
        type: String,
        default: '4px'
    }


});

const emit = defineEmits(['click']);

const iconProps = computed(() => {
    return {
        icon: props.icon,
        size: props.size,
        width: props.width,
        height: props.height,
        color: props.color,
        button: props.button,
        primary: props.primary
    };
});

const classMap = computed(() => {
    const list = ['vui', 'vui-icon-label'];
    if (props.button) {
        list.push('vui-icon-label-button');
    }
    return list;
});

const styleMap = computed(() => {
    const st = {};
    if (props.gap) {
        st['--vui-icon-label-gap'] = props.gap;
    }
    return st;
});

const onClick = (e) => {
    emit('click', e);
};

defineExpose({
    cid
});
</script>
<style lang="scss">
.vui-icon-label {
    --vui-icon-label-gap: 4px;

    display: inline-flex;
    gap: var(--vui-icon-label-gap);
    justify-content: center;
    align-items: center;
}

.vui-icon-label-button {
    cursor: pointer;
    opacity: 0.8;
    transition: var(--vui-opacity-transition);

    &:hover {
        opacity: 1;
    }
}

.vui-icon-label-text {
    white-space: nowrap;
    user-select: none;
}
</style>
