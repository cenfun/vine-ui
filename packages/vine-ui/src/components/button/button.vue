<template>
  <button
    :type="props.type"
    :class="classList"
    :style="styleMap"
    :disabled="props.disabled"
  >
    <slot>
      <BaseRender :content="props.label" />
    </slot>
  </button>
</template>
<script setup>
import { computed } from 'vue';
import { useBase, BaseRender } from '../../base/base.js';
import { autoPx } from '../../util/util.js';

const props = defineProps({

    label: {
        type: String,
        default: ''
    },

    primary: {
        type: Boolean,
        default: false
    },

    type: {
        type: String,
        default: 'button'
    },

    width: {
        type: [String, Number],
        default: ''
    },

    disabled: {
        type: Boolean,
        default: false
    }
});

const { cid } = useBase('VuiButton');

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-button'
    ];
    if (props.primary) {
        ls.push('vui-button-primary');
    }
    ls.push(cid);
    return ls;
});

const styleMap = computed(() => {
    const st = {};
    if (props.width) {
        st.width = autoPx(props.width);
    }
    return st;
});

</script>
<style lang="scss">
.vui-button {
    display: inline-block;
    min-width: 50px;
    max-width: 200px;
    padding: 5px 8px;
    color: #6c757d;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    text-overflow: ellipsis;
    vertical-align: middle;
    border: 1px solid transparent;
    border-color: #6c757d;
    border-radius: 5px;
    background-color: #f5f5f5;
    overflow: hidden;
    user-select: none;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;

    &:focus {
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
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
        border-color: #007bff;
        background-color: #007bff;

        &:hover {
            color: #fff;
            border-color: #0062cc;
            background-color: #0069d9;
        }

        &:focus {
            box-shadow: 0 0 0 0.2rem rgb(38 143 255 / 50%);
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
