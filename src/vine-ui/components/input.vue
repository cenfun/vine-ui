<template>
  <div
    v-init="{cid}"
    :class="classMap"
  >
    <label v-if="labelContent">
      <slot>
        {{ props.label }}
      </slot>
    </label>
    <div
      class="vui-input-wrapper"
      :style="wrapperStyle"
    >
      <Icon
        v-if="props.icon"
        :icon="props.icon"
        size="16px"
        :color="props.iconColor"
        :class="['vui-input-icon', 'vui-input-icon-left', props.iconClickable ? 'vui-input-icon-clickable' : '']"
        @click.stop="onIconClick"
      />
      <input
        v-model="mv"
        v-select-on-focus="props.selectOnFocus"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :type="props.type"
        :class="inputClassList"
        v-bind="bindAttrs(attrs, ['class'])"
        @keyup.enter="onKeyupEnter"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @click="onClick"
      >
      <Icon
        v-if="props.iconRight"
        :icon="props.iconRight"
        size="16px"
        :color="props.iconColor"
        :class="['vui-input-icon', 'vui-input-icon-right', props.iconRightClickable ? 'vui-input-icon-clickable' : '']"
        @click.stop="onIconClick"
      />
      <Icon
        v-if="showClean"
        icon="close"
        size="16px"
        class="vui-input-icon vui-input-icon-clear"
        @click.stop="onClear"
      />
    </div>
  </div>
</template>
<script setup>
import {
    computed, useSlots, useAttrs,
    onMounted,
    watch
} from 'vue';
import { microtask } from 'async-tick';

import Icon from './icon.vue';
import {
    autoPx, getCID, bindAttrs, vSelectOnFocus, getSlot, vInit
} from '../utils/util.js';

const cid = getCID('VuiInput');

const classMap = ['vui', 'vui-input'];

const attrs = useAttrs();

const props = defineProps({

    /** Input label text */
    label: {
        type: String,
        default: ''
    },

    /** Input type (text,
 number,
 password,
 etc.) */
    type: {
        type: String,
        default: 'text'
    },

    /** Input width */
    width: {
        type: [String, Number],
        default: '80px'
    },

    /** Placeholder text */
    placeholder: {
        type: String,
        default: ''
    },

    /** Auto-select all text on focus */
    selectOnFocus: {
        type: Boolean,
        default: true
    },

    /** Disable the input */
    disabled: {
        type: Boolean,
        default: false
    },

    /** Make the input read-only */
    readonly: {
        type: Boolean,
        default: false
    },

    /** Icon name to show on the left side */
    icon: {
        type: String,
        default: ''
    },

    /** Icon name to show on the right side */
    iconRight: {
        type: String,
        default: ''
    },

    /** Icon color */
    iconColor: {
        type: String,
        default: ''
    },

    /** Show a clear button when input has value */
    cleanable: {
        type: Boolean,
        default: false
    },

    /** Make the left icon clickable */
    iconClickable: {
        type: Boolean,
        default: false
    },

    /** Make the right icon clickable */
    iconRightClickable: {
        type: Boolean,
        default: false
    },

    /** Initial value (used without v-model) */
    value: {
        type: [String, Number],
        default: ''
    }

});

const emit = defineEmits(['enter', 'input', 'focus', 'blur', 'click', 'icon-click']);

const mv = defineModel({
    type: [String, Number],
    default: ''
});

const onKeyupEnter = (e) => {
    emit('enter', e);
};

const onInput = (e) => {
    emit('input', e);
};

const onFocus = (e) => {
    emit('focus', e);
};

const onBlur = (e) => {
    emit('blur', e);
};

const onClick = (e) => {
    emit('click', e);
};

const showClean = computed(() => {
    return props.cleanable && !props.disabled && !props.readonly && mv.value !== '';
});

const onClear = () => {
    mv.value = '';
};

const onIconClick = (e) => {
    emit('icon-click', e);
};

const wrapperStyle = computed(() => {
    return {
        width: autoPx(props.width)
    };
});

const inputClassList = computed(() => {
    const list = [];
    if (props.icon) {
        list.push('vui-input-has-icon-left');
    }
    if (props.iconRight) {
        list.push('vui-input-has-icon-right');
    }
    if (props.cleanable) {
        list.push('vui-input-cleanable');
    }
    return list;
});

const slots = useSlots();

const labelContent = computed(() => {
    return props.label || getSlot(slots);
});

const update = microtask(() => {
    mv.value = props.value;
});

watch(() => props.value, () => {
    update();
});

onMounted(() => {
    update();
});

defineExpose({
    cid
});
</script>
<style lang="scss">
@use "../global.scss";

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
}

.vui-input-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;

    .vui-input-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        z-index: 1;
    }

    .vui-input-icon-clickable {
        cursor: pointer;
        pointer-events: auto;
    }

    .vui-input-icon-left {
        left: 7px;
    }

    .vui-input-icon-right {
        right: 7px;
    }

    .vui-input-icon-clear {
        right: 7px;
        cursor: pointer;
        pointer-events: auto;
        z-index: 2;

        &:hover {
            opacity: 0.7;
        }
    }

    .vui-input-icon-right + .vui-input-icon-clear {
        right: 30px;
    }

    input {
        display: inline-block;
        width: 100%;
        padding: 5px;
        color: #495057;
        font-weight: 400;
        border: 1px solid #aaa;
        border-radius: 5px;
        background-color: #fff;
        background-clip: padding-box;
        transition: var(--vui-color-transition);

        &:disabled {
            color: gray;
            border: 1px solid #ccc;
        }

        &:not(:disabled):hover {
            border: 1px solid #888;
        }

        &:not(:disabled):focus {
            outline: 1px solid var(--vui-neutral-60);
            outline-offset: -1px;
        }

        &.vui-input-has-icon-left {
            padding-left: 28px;
        }

        &.vui-input-has-icon-right {
            padding-right: 28px;
        }

        &.vui-input-cleanable {
            padding-right: 28px;
        }

        &.vui-input-has-icon-right.vui-input-cleanable {
            padding-right: 52px;
        }
    }
}
</style>
