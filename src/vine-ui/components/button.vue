<template>
  <button
    v-init="{cid}"
    :type="props.type"
    :class="classList"
    :style="styleMap"
    :disabled="props.disabled"
  >
    <slot>
      {{ props.label }}
    </slot>
  </button>
</template>
<script setup>
import { computed } from 'vue';
import {
    autoPx, getCID, vInit
} from '../utils/util.js';

const cid = getCID('VuiButton');

const props = defineProps({

    /** Button text content */


    label: {
        type: String,
        default: ''
    },

    /** Use primary style (blue background) */


    primary: {
        type: Boolean,
        default: false
    },

    /** Button type attribute (button,
 submit,
 reset) */


    type: {
        type: String,
        default: 'button'
    },

    /** Button width (supports px or number) */


    width: {
        type: [String, Number],
        default: ''
    },

    /** Disable the button */


    disabled: {
        type: Boolean,
        default: false
    }


});

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-button'
    ];
    if (props.primary) {
        ls.push('vui-button-primary');
    }
    return ls;
});

const styleMap = computed(() => {
    const st = {};
    if (props.width) {
        st.width = autoPx(props.width);
    }
    return st;
});

defineExpose({
    cid
});
</script>
<style lang="scss">
@use "../global.scss";

.vui-button {
    display: inline-block;
    min-width: 16px;
    max-width: 200px;
    padding: 5px 8px;
    color: #6c757d;
    font-weight: 400;
    line-height: 1;
    white-space: nowrap;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid #6c757d;
    border-radius: 5px;
    background-color: #f5f5f5;
    overflow: hidden;
    user-select: none;
    transition: var(--vui-color-transition);

    &:focus {
        outline: 1px solid var(--vui-neutral-60);
        outline-offset: -1px;
    }

    &:disabled {
        opacity: 0.65;
    }

    &:not(:disabled) {
        cursor: pointer;
    }

    &:not(:disabled):hover {
        color: #fff;
        border-color: #6c757d;
        background-color: #6c757d;
    }

    &.vui-button-primary {
        color: #fff;
        border-color: var(--vui-blue-50);
        background-color: var(--vui-blue-50);

        &:hover {
            color: #fff;
            border-color: var(--vui-blue-60);
            background-color: var(--vui-blue-60);
        }

        &:focus {
            outline: 1px solid var(--vui-blue-70);
        }

        &:disabled {
            color: #fff;
            border-color: #6c757d;
            background-color: #6c757d;
            opacity: 0.65;
        }
    }
}
</style>
