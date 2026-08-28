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
    <label
      class="vui-checkbox-control"
      :for="cid"
    >
      <span class="vui-checkbox-icon" />
      <span
        v-if="hasLabel()"
        class="vui-checkbox-label"
      >
        <slot>
          {{ props.label }}
        </slot>
      </span>
    </label>
  </div>
</template>

<script setup>
import { useSlots, watch } from 'vue';
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

const slots = useSlots();

const hasLabel = () => {
    return Boolean(props.label || slots.default);
};

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
    width: fit-content;
    max-width: 100%;
    min-width: 0;
    height: 30px;
    line-height: 30px;

    .vui-checkbox-control {
        display: flex;
        flex: 1 1 auto;
        gap: 3px;
        align-items: center;
        min-width: 0;
        height: 30px;
    }

    .vui-checkbox-icon {
        display: block;
        flex: none;
        width: 16px;
        height: 16px;
        margin: 0 3px;
        border: #adb5bd solid 1px;
        border-radius: 3px;
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 10px;
        background-clip: border-box;
        transition: var(--vui-color-transition);
    }

    .vui-checkbox-label {
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

        &:focus + .vui-checkbox-control .vui-checkbox-icon {
            box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
        }

        &:disabled + .vui-checkbox-control {
            color: #6c757d;
        }

        &:disabled + .vui-checkbox-control .vui-checkbox-icon {
            background-color: #e9ecef;
        }

        &:checked + .vui-checkbox-control .vui-checkbox-icon {
            color: #fff;
            border-color: var(--vui-blue-50);
            background-color: var(--vui-blue-50);
            background-image: url("../images/checkbox.svg");
        }

        &:checked:disabled + .vui-checkbox-control .vui-checkbox-icon {
            border-color: #80bdff;
            background-color: rgb(0 123 255 / 50%);
        }

        &:not(:checked):focus + .vui-checkbox-control .vui-checkbox-icon {
            border-color: #80bdff;
        }
    }

    &:hover input:not(:disabled, :checked, :focus) + .vui-checkbox-control .vui-checkbox-icon {
        border-color: #888;
    }
}

</style>
