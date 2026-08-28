<template>
  <div
    v-init="{cid}"
    :class="classList"
  >
    <input
      :id="cid"
      v-model="mv"
      :disabled="props.disabled"
      type="checkbox"
    >
    <label :for="cid">
      <slot>
        {{ props.label }}
      </slot>
    </label>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { getCID, vInit } from '../utils/util.js';

const cid = getCID('VuiCheckbox');

const classList = ['vui', 'vui-checkbox'];

const props = defineProps({

    /** Checkbox label text */


    label: {
        type: String,
        default: ''
    },

    /** Disable the checkbox */


    disabled: {
        type: Boolean,
        default: false
    }

});

const mv = defineModel({
    type: Boolean,
    default: null
});

const emit = defineEmits(['change']);

watch(() => mv.value, (v) => {
    emit('change', v);
});

defineExpose({
    cid
});
</script>

<style lang="scss">
.vui-checkbox {
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
            border: #adb5bd solid 1px;
            border-radius: 3px;
            background-color: #fff;
            transform: translate(3px, -50%);
            transition: var(--vui-color-transition);
        }

        &::after {
            position: absolute;
            top: 50%;
            left: 0;
            content: "";
            display: block;
            width: 16px;
            height: 16px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 10px;
            background-clip: border-box;
            transform: translate(3px, -50%);
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
            color: #fff;
            border-color: var(--vui-blue-50);
            background-color: var(--vui-blue-50);
        }

        &:checked ~ label::after {
            background-image: url("../images/checkbox.svg");
        }

        &:checked:disabled ~ label::before {
            border-color: #80bdff;
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
