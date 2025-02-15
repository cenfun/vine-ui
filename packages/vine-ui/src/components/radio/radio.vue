<template>
  <div :class="classList">
    <input
      :id="cid"
      v-model="data.checked"
      :disabled="props.disabled"
      :name="props.name"
      :value="props.value"
      type="radio"
    >
    <label :for="cid">
      <slot>
        {{ props.label }}
      </slot>
    </label>
  </div>
</template>
<script setup>
import {
    reactive, watch, watchEffect
} from 'vue';
import { getCID } from '../../utils/util.js';

const cid = getCID('VuiRadio');

const classList = ['vui-radio', cid];

const props = defineProps({

    label: {
        type: String,
        default: ''
    },

    name: {
        type: String,
        default: ''
    },

    disabled: {
        type: Boolean,
        default: false
    },

    checked: {
        type: Boolean,
        default: false
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

const emit = defineEmits(['update:modelValue', 'change']);

const data = reactive({
    checked: false
});

watchEffect(() => {
    data.checked = props.modelValue === null ? props.checked : props.modelValue;
});

watch(() => data.checked, (v) => {
    emit('update:modelValue', v);
    emit('change', v);
});

</script>
<style lang="scss">
.vui-radio {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    line-height: 30px;

    label {
        position: relative;
        display: block;
        min-width: 22px;
        max-width: 500px;
        min-height: 30px;
        margin-left: -22px;
        padding-left: 25px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        &::before {
            position: absolute;
            top: 50%;
            left: 0;
            content: "";
            display: block;
            width: 16px;
            height: 16px;
            box-sizing: border-box;
            border: #adb5bd solid 1px;
            border-radius: 50%;
            background: #fff;
            transform: translate(3px, -50%);
        }

        &::after {
            position: absolute;
            top: 50%;
            left: 0;
            content: "";
            display: none;
            width: 10px;
            height: 10px;
            box-sizing: border-box;
            border-radius: 50%;
            background: #0077cf;
            transform: translate(6px, -50%);
        }
    }

    input {
        display: block;
        width: 22px;
        height: 22px;
        margin: 0;
        padding: 0;
        opacity: 0;

        &:focus ~ label::before {
            box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
        }

        &:disabled ~ label {
            color: #6c757d;
        }

        &:disabled ~ label::before {
            background-color: #e9ecef;
        }

        &:checked ~ label::before {
            border-color: #0077cf;
        }

        &:checked ~ label::after {
            display: block;
        }

        &:checked:disabled ~ label::before {
            border-color: #80bdff;
        }

        &:checked:disabled ~ label::after {
            background-color: rgb(0 123 255 / 50%);
        }

        &:not(:checked):focus ~ label::before {
            border-color: #80bdff;
        }

        &:not(:disabled, :checked, :focus) ~ label:hover::before {
            border-color: #888;
        }
    }
}

</style>
