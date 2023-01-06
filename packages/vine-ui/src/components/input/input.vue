<template>
  <div :class="classMap">
    <label v-if="labelContent">
      <slot>
        <BaseRender :content="props.label" />
      </slot>
    </label>
    <input
      v-model="value"
      v-select-on-focus
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      :type="props.type"
      :style="styleMap"
      :title="props.title"
    >
  </div>
</template>
<script setup>
import { computed } from 'vue';
import {
    useBase, BaseRender, vSelectOnFocus, getSlot
} from '../../base/base.js';

const { cid } = useBase('VuiInput');

const classMap = ['vui', 'vui-input', cid];
const styleMap = computed(() => {
    return {
        width: props.width
    };
});

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },

    type: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '80px'
    },

    value: {
        type: String,
        default: ''
    },
    modelValue: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
    get() {
        if (props.modelValue === null) {
            return props.value;
        }
        return props.modelValue;
    },
    set(v) {
        emit('update:modelValue', v);
    }
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
