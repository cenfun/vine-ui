<template>
  <div :class="classMap">
    <label v-if="labelContent">
      <slot>
        {{ props.label }}
      </slot>
    </label>
    <input
      v-model="data.value"
      v-select-on-focus="props.selectOnFocus"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :type="props.type"
      :style="styleMap"
      v-bind="bindAttrs(attrs, ['class'])"
    >
  </div>
</template>
<script setup>
import {
    computed, reactive, watch, watchEffect, useSlots, useAttrs
} from 'vue';

import {
    autoPx, getCID, bindAttrs, vSelectOnFocus, getSlot
} from '../../utils/util.js';

const cid = getCID('VuiInput');

const classMap = ['vui-input', cid];

const attrs = useAttrs();

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

    selectOnFocus: {
        type: Boolean,
        default: true
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

const emit = defineEmits(['update:modelValue', 'change']);

const data = reactive({
    value: ''
});

watchEffect(() => {
    data.value = props.modelValue === null ? props.value : props.modelValue;
});

watch(() => data.value, (v) => {
    emit('update:modelValue', v);
    emit('change', v);
});

const styleMap = computed(() => {
    return {
        width: autoPx(props.width)
    };
});

const slots = useSlots();

const labelContent = computed(() => {
    return props.label || getSlot(slots);
});

</script>
<style lang="scss">
.vui-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: inherit;

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
