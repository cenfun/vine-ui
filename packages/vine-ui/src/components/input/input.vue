<template>
  <div :class="classMap">
    <label v-if="labelContent">
      <slot>
        {{ props.label }}
      </slot>
    </label>
    <input
      v-model="data.value"
      v-select-on-focus
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :type="props.type"
      :style="styleMap"
      v-bind="bindAttrs(['class'])"
    >
  </div>
</template>
<script setup>
import {
    computed, reactive, watch, watchEffect
} from 'vue';

import {
    useBase, bindAttrs, vSelectOnFocus, getSlot
} from '../../base/base.js';

import { autoPx } from '../../utils/util.js';

const { cid } = useBase('VuiInput');

const classMap = ['vui', 'vui-input', cid];

const props = defineProps({

    label: {
        type: String,
        default: ''
    },

    type: {
        type: String,
        default: 'text'
    },

    width: {
        type: [String, Number],
        default: '80px'
    },

    placeholder: {
        type: String,
        default: ''
    },

    disabled: {
        type: Boolean,
        default: false
    },

    value: {
        type: [String, Number],
        default: ''
    },

    modelValue: {
        type: [String, Number],
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const data = reactive({
    value: ''
});

watchEffect(() => {
    data.value = props.modelValue === null ? props.value : props.modelValue;
});

watch(() => data.value, (v) => {
    emit('update:modelValue', v);
});

const styleMap = computed(() => {
    return {
        width: autoPx(props.width)
    };
});

const labelContent = computed(() => {
    return props.label || getSlot();
});

</script>
<style lang="scss">
.vui-input {
    display: flex;
    flex-direction: row;
    align-items: center;

    label {
        display: inline-block;
        max-width: 200px;
        padding-right: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    input {
        display: inline-block;
        padding: 5px;
        color: #495057;
        font-weight: 400;
        border: 1px solid #aaa;
        border-radius: 5px;
        background-color: #fff;
        background-clip: padding-box;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &:disabled {
            color: gray;
            border: 1px solid #ccc;
        }

        &:not(:disabled):hover {
            border: 1px solid #888;
        }

        &:not(:disabled):focus {
            border-color: #80bdff;
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
        }
    }
}
</style>
