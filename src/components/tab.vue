<template>
  <div
    v-init="{cid}"
    :class="classMap"
    :style="styleMap"
  >
    <slot name="left" />
    <div class="vui-tab-list">
      <slot>
        <div
          v-for="(item, i) in data.options"
          :key="i"
          :class="['vui-tab-item', item.selected ? 'vui-tab-selected' : '', item.disabled ? 'vui-tab-disabled' : '']"
          @click="onTabClick(item)"
        >
          <div class="vui-tab-label">
            {{ item.label }}
          </div>
        </div>
      </slot>
    </div>
    <slot name="right" />
  </div>
</template>

<script setup>
import {
    computed,
    onMounted, reactive, watch
} from 'vue';
import { microtask } from 'async-tick';

import {
    getCID, vInit, normalizePosition
} from '../utils/util.js';

const cid = getCID('VuiTab');

const mv = defineModel({
    type: [Number, String],
    default: 0
});

const props = defineProps({

    /** Array of tab options [{label, value, disabled}] */

    options: {
        type: Array,
        default: () => []
    },


    /**
     * {background: "#e8e8e8", separator: "#666", hover: "#e0e0e0", selected: "#fff", simpleBorder: "#ccc", simpleSelected: "#333"}
     */
    colors: {
        type: Object,
        default: () => ({})
    },

    /** Tab alignment: left,
 center,
 or right */


    align: {
        type: String,
        default: '',
        validator: (value) => {
            return ['left', 'center', 'right', 'l', 'r', ''].includes(value);
        }
    },


    /** Use the simple underline-only style */
    simple: {
        type: Boolean,
        default: false
    }

});

const data = reactive({
    options: []
});

const tabAlign = computed(() => normalizePosition(props.align));

const classMap = computed(() => {
    const ls = ['vui', 'vui-tab'];
    if (tabAlign.value) {
        ls.push(`vui-tab-align-${tabAlign.value}`);
    }
    if (props.simple) {
        ls.push('vui-tab-simple');
    }
    return ls;
});

const styleMap = computed(() => {
    const st = {};
    const {
        background, separator, hover, selected, simpleBorder, simpleSelected
    } = props.colors;
    if (background) {
        st['--vui-tab-color-background'] = background;
    }
    if (separator) {
        st['--vui-tab-color-separator'] = separator;
    }
    if (hover) {
        st['--vui-tab-color-hover'] = hover;
    }
    if (selected) {
        st['--vui-tab-color-selected'] = selected;
    }
    if (simpleBorder) {
        st['--vui-tab-color-simple-border'] = simpleBorder;
    }
    if (simpleSelected) {
        st['--vui-tab-color-simple-selected'] = simpleSelected;
    }

    return st;
});

const update = microtask(() => {
    const options = props.options.map((option, i) => {
        if (typeof option === 'string') {
            return {
                label: option,
                value: i
            };
        }
        return option;
    });
    const selectedOption = options.find((option) => option.value === mv.value);
    if (selectedOption) {
        options.forEach((option) => {
            option.selected = false;
        });
        selectedOption.selected = true;
    }

    data.options = options;
});

const onTabClick = (item) => {
    if (item.disabled) {
        return;
    }
    mv.value = item.value;
};

watch([
    mv,
    () => props.options
], (options) => {
    update();
});

onMounted(() => {
    update();
});

defineExpose({
    update,
    cid
});
</script>


<style lang="scss">
.vui-tab {
    --vui-tab-color-background: #e8e8e8;
    --vui-tab-color-separator: #666;
    --vui-tab-color-hover: #e0e0e0;
    --vui-tab-color-selected: #fff;
    --vui-tab-color-simple-border: #ccc;
    --vui-tab-color-simple-selected: #333;
    --vui-tab-path-left: path("M0,10 h11 v-10 h-1 Q10,10 0,10 z");
    --vui-tab-path-right: path("M11,10 h-11 v-10 h1 Q1,10 11,10 z");

    position: relative;
    display: flex;
    gap: 10px;
    align-items: center;
    background-color: var(--vui-tab-color-background);
}

.vui-tab-list {
    display: flex;
    gap: 0;
    align-items: flex-end;
    min-height: 36px;
    padding: 8px 10px 0;
    overflow: auto hidden;
    user-select: none;
}

.vui-tab-align-center {
    justify-content: center;
}

.vui-tab-align-right {
    justify-content: flex-end;
}

.vui-tab-label {
    position: relative;
    display: block;
    min-width: 60px;
    max-width: 200px;
    padding: 10px 15px;
    white-space: nowrap;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
}

.vui-tab-item {
    position: relative;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    cursor: pointer;

    &:not(:first-child)::before {
        position: absolute;
        left: 0;
        bottom: 50%;
        content: "";
        width: 1px;
        height: 16px;
        background-color: var(--vui-tab-color-separator);
        transform: translateY(50%);
    }

    &.vui-tab-selected {
        position: relative;
        z-index: 1000;
        background-color: var(--vui-tab-color-selected);

        & + .vui-tab-item::before {
            display: none;
        }

        &::before {
            position: absolute;
            left: -10px;
            bottom: 0;
            content: "";
            width: 11px;
            height: 10px;
            background-color: var(--vui-tab-color-selected);
            transform: none;
            clip-path: var(--vui-tab-path-left);
        }

        &::after {
            position: absolute;
            bottom: 0;
            right: -10px;
            content: "";
            width: 11px;
            height: 10px;
            background-color: var(--vui-tab-color-selected);
            transform: none;
            clip-path: var(--vui-tab-path-right);
        }
    }

    &.vui-tab-disabled {
        cursor: default;
        opacity: 0.5;
    }

    &:hover:not(.vui-tab-selected) {
        z-index: 100;
        background-color: var(--vui-tab-color-hover);

        &::before {
            position: absolute;
            left: -10px;
            bottom: 0;
            content: "";
            width: 11px;
            height: 10px;
            background-color: var(--vui-tab-color-hover);
            transform: none;
            clip-path: var(--vui-tab-path-left);
        }

        &::after {
            position: absolute;
            bottom: 0;
            right: -10px;
            content: "";
            width: 11px;
            height: 10px;
            background-color: var(--vui-tab-color-hover);
            transform: none;
            clip-path: var(--vui-tab-path-right);
        }

        & + .vui-tab-item:not(.vui-tab-selected)::before {
            display: none;
        }
    }
}

.vui-tab.vui-tab-simple {
    border-bottom: 1px solid var(--vui-tab-color-simple-border);
    background-color: transparent;

    .vui-tab-list {
        padding: 0;
    }

    .vui-tab-item {
        border-radius: 0;

        &::before,
        &::after {
            content: none;
        }

        &.vui-tab-selected {
            background-color: transparent;

            &::after {
                position: absolute;
                left: 0;
                bottom: -1px;
                right: 0;
                content: "";
                display: block;
                width: auto;
                height: 4px;
                background-color: var(--vui-tab-color-simple-selected);
                clip-path: none;
            }
        }

        &:hover:not(.vui-tab-selected) {
            background-color: transparent;
        }
    }
}

</style>
