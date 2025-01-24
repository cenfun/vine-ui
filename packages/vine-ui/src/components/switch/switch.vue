<template>
  <div
    :class="classList"
    @click="onClick"
  >
    <div
      v-if="labelContent && props.labelPosition==='left'"
      class="vui-switch-label"
    >
      <slot>
        {{ props.label }}
      </slot>
    </div>
    <div
      class="vui-switch-button"
      :style="buttonStyleList"
    >
      <div
        class="vui-switch-icon"
        :style="iconStyleList"
      />
    </div>
    <div
      v-if="labelContent && props.labelPosition==='right'"
      class="vui-switch-label"
    >
      <slot>
        {{ props.label }}
      </slot>
    </div>
  </div>
</template>
<script setup>
import {
    computed, reactive, watch, watchEffect, useSlots
} from 'vue';
import { getCID, getSlot } from '../../utils/util.js';

const defaultColors = ['#aaaaaa', '#1890ff'];

const cid = getCID('VuiSwitch');

const props = defineProps({

    label: {
        type: String,
        default: ''
    },

    labelPosition: {
        type: String,
        default: 'left',
        validator(value) {
            return ['left', 'right'].includes(value);
        }
    },

    labelClickable: {
        type: Boolean,
        default: false
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
    emit('change', v);
});


const classList = computed(() => {
    const ls = ['vui-switch', cid];
    if (data.checked) {
        ls.push('vui-switch-checked');
    }
    if (props.labelClickable) {
        ls.push('vui-switch-label-clickable');
    }
    if (props.disabled) {
        ls.push('vui-switch-disabled');
    }
    return ls;

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

const slots = useSlots();

const labelContent = computed(() => {
    return props.label || getSlot(slots);
});

const onClick = (e) => {
    if (props.disabled) {
        return;
    }
    if (props.labelClickable || e.target.classList.contains('vui-switch-button')) {
        data.checked = !data.checked;
    }
};

</script>
<style lang="scss">
.vui-switch {
    display: flex;
    gap: 5px;
    align-items: center;
}

.vui-switch-label {
    cursor: default;
}

.vui-switch-button {
    position: relative;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.1s;
}

.vui-switch-icon {
    position: absolute;
    top: 2px;
    height: calc(100% - 4px);
    border-radius: 50%;
    background-color: #fff;
    user-select: none;
    pointer-events: none;
    transition: right 0.1s ease-in-out;
}

.vui-switch-label-clickable {
    cursor: pointer;

    .vui-switch-label {
        cursor: pointer;
        user-select: none;
    }
}

.vui-switch-checked {
    .vui-switch-icon {
        right: 2px;
    }
}

.vui-switch-disabled {
    cursor: default;

    .vui-switch-label {
        cursor: default;
    }

    .vui-switch-button {
        cursor: default;
        opacity: 0.6;
    }
}

</style>
