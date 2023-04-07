<template>
  <div :class="classList">
    <div
      v-if="labelContent"
      class="vui-switch-label"
    >
      <slot>
        {{ props.label }}
      </slot>
    </div>
    <div
      :class="buttonClassList"
      :style="buttonStyleList"
      @click="clickHandler"
    >
      <div
        class="vui-switch-icon"
        :style="iconStyleList"
      />
    </div>
  </div>
</template>
<script setup>
import {
    computed, reactive, watch, watchEffect
} from 'vue';
import { useBase, getSlot } from '../../base/base.js';

const defaultColors = ['#aaaaaa', '#1890ff'];

const { cid } = useBase('VuiSwitch');

const classList = ['vui', 'vui-switch', cid];

const props = defineProps({

    label: {
        type: String,
        default: ''
    },

    colors: {
        type: String,
        default: '#aaaaaa,#1890ff'
    },

    width: {
        type: String,
        default: '35px'
    },

    height: {
        type: String,
        default: '20px'
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

const emit = defineEmits(['update:modelValue', 'change']);

const data = reactive({
    checked: false
});

watchEffect(() => {
    data.checked = props.modelValue === null ? props.checked : props.modelValue;
});

watch(() => data.checked, (v) => {
    emit('update:modelValue', v);
});


const buttonClassList = computed(() => {
    return {
        'vui-switch-button': true,
        'vui-switch-checked': data.checked,
        'vui-switch-disabled': props.disabled
    };
});

const buttonStyleList = computed(() => {

    let bgc = data.checked ? defaultColors[1] : defaultColors[0];
    if (props.colors) {
        const ls = `${props.colors}`.split(',').map((it) => it.trim());
        if (data.checked && ls[1]) {
            bgc = ls[1];
        } else if (ls[0]) {
            bgc = ls[0];
        }
    }

    return {
        'width': props.width,
        'height': props.height,
        'border-radius': props.height,
        'background-color': bgc
    };
});

const iconStyleList = computed(() => {
    return {
        width: `calc(${props.height} - 4px)`,
        right: data.checked ? '2px' : `calc(${props.width} - ${props.height} + 2px)`
    };
});

const labelContent = computed(() => {
    return props.label || getSlot();
});

const clickHandler = () => {
    if (props.disabled) {
        return;
    }
    data.checked = !data.checked;
    emit('change', data.checked);
};

</script>
<style lang="scss">
.vui-switch {
    display: flex;
    align-items: center;

    .vui-switch-disabled {
        cursor: default;
        opacity: 0.5;
    }
}

.vui-switch-label {
    margin-right: 5px;
}

.vui-switch-button {
    position: relative;
    cursor: pointer;
    transition: background-color 0.1s;
}

.vui-switch-icon {
    position: absolute;
    top: 2px;
    height: calc(100% - 4px);
    border-radius: 50%;
    background-color: #fff;
    user-select: none;
    transition: right 0.1s ease-in-out;
}

.vui-switch-checked {
    .vui-switch-icon {
        right: 2px;
    }
}

</style>
