<template>
  <div
    v-init="{cid}"
    :class="classList"
  >
    <input
      :id="cid"
      v-model="mv"
      :disabled="props.disabled"
      :name="props.name"
      :value="props.value"
      type="radio"
    >
    <label
      class="vui-radio-control"
      :for="cid"
    >
      <span class="vui-radio-icon" />
      <span
        v-if="labelContent"
        class="vui-radio-label"
      >
        <slot>
          {{ props.label }}
        </slot>
      </span>
    </label>
  </div>
</template>
<script setup>
import {
    computed, useSlots, watch
} from 'vue';
import {
    getCID, getSlot, vInit
} from '../utils/util.js';

const cid = getCID('VuiRadio');

const classList = ['vui', 'vui-radio'];

const props = defineProps({

    /** Radio label text */


    label: {
        type: String,
        default: ''
    },

    /** Radio group name */


    name: {
        type: String,
        default: ''
    },

    /** Disable the radio */


    disabled: {
        type: Boolean,
        default: false
    },

    /** Radio value */


    value: {
        type: String,
        default: ''
    }

});

const mv = defineModel({
    type: String,
    default: null
});

const slots = useSlots();

const labelContent = computed(() => {
    return props.label || getSlot(slots);
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
.vui-radio {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: fit-content;
    max-width: 100%;
    min-width: 0;
    height: 30px;
    line-height: 30px;

    .vui-radio-control {
        display: flex;
        flex: 1 1 auto;
        gap: 3px;
        align-items: center;
        min-width: 0;
        height: 30px;
    }

    .vui-radio-icon {
        position: relative;
        display: block;
        flex: none;
        width: 16px;
        height: 16px;
        margin: 0 3px;
        border: #adb5bd solid 1px;
        border-radius: 50%;
        background-color: #fff;
        transition: var(--vui-color-transition);

        &::after {
            position: absolute;
            top: 50%;
            left: 50%;
            content: "";
            display: none;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: var(--vui-blue-50);
            transform: translate(-50%, -50%);
        }
    }

    .vui-radio-label {
        display: block;
        flex: 1 1 auto;
        min-width: 0;
        min-height: 30px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    input {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        opacity: 0;
        overflow: hidden;
        clip-path: inset(50%);

        &:focus + .vui-radio-control .vui-radio-icon {
            box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
        }

        &:disabled + .vui-radio-control {
            color: #6c757d;
        }

        &:disabled + .vui-radio-control .vui-radio-icon {
            background-color: #e9ecef;
        }

        &:checked + .vui-radio-control .vui-radio-icon {
            border-color: var(--vui-blue-50);
        }

        &:checked + .vui-radio-control .vui-radio-icon::after {
            display: block;
        }

        &:checked:disabled + .vui-radio-control .vui-radio-icon {
            border-color: #80bdff;
        }

        &:checked:disabled + .vui-radio-control .vui-radio-icon::after {
            background-color: rgb(0 123 255 / 50%);
        }

        &:not(:checked):focus + .vui-radio-control .vui-radio-icon {
            border-color: #80bdff;
        }
    }

    &:hover input:not(:disabled, :checked, :focus) + .vui-radio-control .vui-radio-icon {
        border-color: #888;
    }
}

</style>
