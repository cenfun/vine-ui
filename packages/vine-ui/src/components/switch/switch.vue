<template>
  <div :class="classList">
    <div
      v-if="labelContent"
      class="vui-switch-label"
    >
      <slot>
        <BaseRender :content="props.label" />
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
    computed, reactive, watchEffect
} from 'vue';
import {
    useBase, BaseRender, getSlot
} from '../../base/base.js';

const { cid } = useBase('VuiSwitch');

const classList = ['vui', 'vui-switch', cid];

const defaultColors = ['#aaaaaa', '#1890ff'];

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

const data = reactive({
    buttonColors: defaultColors,
    checked: false
});


const buttonClassList = computed(() => {
    return {
        'vui-switch-button': true,
        'vui-switch-checked': data.checked,
        'vui-switch-disabled': props.disabled
    };
});

const buttonStyleList = computed(() => {
    return {
        'width': props.width,
        'height': props.height,
        'border-radius': props.height,
        'background-color': data.checked ? data.buttonColors[1] : data.buttonColors[0]
    };
});

const iconStyleList = computed(() => {
    return {
        width: `calc(${props.height} - 4px)`,
        right: data.checked ? '2px' : `calc(${props.width} - ${props.height} + 2px)`
    };
});

const slotDefault = getSlot();
const labelContent = computed(() => {
    return props.label || slotDefault;
});

watchEffect(() => {
    const ls = `${props.colors}`.split(',').map((it) => it.trim());
    data.buttonColors = [ls[0] || defaultColors[0], ls[1] || defaultColors[1]];

    if (props.modelValue === null) {
        data.checked = props.checked;
    } else {
        data.checked = props.modelValue;
    }

});


const emit = defineEmits(['update:modelValue']);

const clickHandler = () => {
    if (props.disabled) {
        return;
    }
    data.checked = !data.checked;
    emit('update:modelValue', data.checked);

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
    cursor: pointer;
    transition: background-color 0.1s;
    position: relative;
}

.vui-switch-icon {
    border-radius: 50%;
    background-color: #fff;
    transition: right 0.1s ease-in-out;
    position: absolute;
    top: 2px;
    height: calc(100% - 4px);
}

.vui-switch-checked {
    .vui-switch-icon {
        right: 2px;
    }
}

</style>
