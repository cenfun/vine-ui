<template>
  <div :class="classList">
    <input
      :id="cid"
      v-model="modelChecked"
      :disabled="props.disabled"
      type="checkbox"
    >
    <label :for="cid">
      <slot>
        <BaseRender :content="props.label" />
      </slot>
    </label>
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useBase, BaseRender } from '../../base/base.js';

const { cid } = useBase('VuiCheckbox');

const classList = ['vui', 'vui-checkbox', cid];

const props = defineProps({
    label: {
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
    modelValue: {
        type: Boolean,
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

const modelChecked = computed({
    get() {
        if (props.modelValue === null) {
            return props.checked;
        }
        return props.modelValue;
    },
    set(v) {
        emit('update:modelValue', v);
    }
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
        padding-left: 25px;
        margin-left: -22px;
        min-height: 30px;
        min-width: 22px;
        max-width: 500px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        &::before {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(3px, -50%);
            display: block;
            width: 16px;
            height: 16px;
            content: "";
            background-color: #fff;
            border: #adb5bd solid 1px;
            border-radius: 3px;
        }

        &::after {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(3px, -50%);
            display: block;
            width: 16px;
            height: 16px;
            content: "";
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 10px 10px;
            background-clip: border-box;
        }
    }

    input {
        display: block;
        width: 22px;
        height: 22px;
        opacity: 0;
        padding: 0;
        margin: 0;

        &:checked {
            ~ label {
                &::before {
                    color: #fff;
                    border-color: #0077cf;
                    background-color: #0077cf;
                }

                &::after {
                    background-image: url("./images/checkbox.svg");
                }
            }
        }

        &:disabled {
            ~ label {
                color: #6c757d;
            }

            ~ label::before {
                background-color: #e9ecef;
            }
        }

        &:focus {
            ~ label::before {
                box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
            }
        }

        &:not(:disabled, :checked, :focus) {
            ~ label:hover::before {
                border-color: #888;
            }
        }

        &:focus:not(:checked) {
            ~ label::before {
                border-color: #80bdff;
            }
        }

        &:disabled:checked {
            ~ label::before {
                background-color: rgb(0 123 255 / 50%);
                border-color: #80bdff;
            }
        }
    }
}

</style>
