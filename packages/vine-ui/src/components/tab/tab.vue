<template>
  <div
    ref="el"
    :class="classList"
    :style="styleList"
  >
    <div class="vui-tab-header vui-flex-row">
      <div class="vui-tab-header-left vui-flex-row">
        <slot name="left" />
      </div>
      <div
        class="vui-tab-tabs vui-flex-row"
        @click="onTabClick"
      >
        <slot name="tabs" />
      </div>
      <div class="vui-tab-header-right vui-flex-row">
        <slot name="right" />
      </div>
    </div>
    <div class="vui-tab-panes">
      <slot name="panes" />
    </div>
  </div>
</template>
<script setup>
import {
    computed, watch, watchEffect, reactive, onMounted, ref
} from 'vue';
import { useBase } from '../../base/base.js';
import { toNum } from '../../utils/util.js';

const { cid } = useBase('VuiTab');

const props = defineProps({
    align: {
        type: String,
        default: 'left',
        validator(value) {
            return ['left', 'center', 'right'].includes(value);
        }
    },

    background: {
        type: String,
        default: ''
    },

    height: {
        type: String,
        default: ''
    },

    theme: {
        type: String,
        default: 'chrome',
        validator(value) {
            return ['chrome', 'simple'].includes(value);
        }
    },

    index: {
        type: Number,
        default: 0
    },

    modelValue: {
        type: Number,
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'change']);

const data = reactive({
    index: 0
});

watchEffect(() => {
    data.index = props.modelValue === null ? props.index : props.modelValue;
});

watch(() => data.index, (v) => {
    emit('update:modelValue', v);
});

const el = ref(null);
let $el;

const classList = computed(() => {
    return [
        'vui',
        'vui-tab',
        `vui-tab-${props.align}`,
        cid
    ];
});

const styleList = computed(() => {
    const st = {};
    if (props.background) {
        st['--vui-tab-background'] = props.background;
    }
    if (props.height) {
        st['--vui-tab-height'] = props.height;
    }
    return st;
});

const onTabClick = (e) => {
    let tabItem;
    let target = e.target;
    while (target) {
        if (target.classList.contains('vui-tab-item')) {
            tabItem = target;
            break;
        }
        target = target.parentNode;
    }

    if (!tabItem) {
        return;
    }
    const index = toNum(tabItem.getAttribute('index'));
    if (index === data.index) {
        return;
    }
    data.index = index;
    emit('change', index);
};

watch(() => data.index, (v) => {
    const $selected = $el.querySelectorAll('.vui-tab-selected');
    Array.from($selected).forEach((elem) => {
        elem.classList.remove('vui-tab-selected');
    });
    [`.vui-tab-item[index="${v}"]`, `.vui-tab-pane[index="${v}"]`].forEach((selector) => {
        const elem = $el.querySelector(selector);
        if (elem) {
            elem.classList.add('vui-tab-selected');
        }
    });
});

onMounted(() => {
    $el = el.value;

    const $panes = $el.querySelectorAll('.vui-tab-panes > *');
    Array.from($panes).forEach((elem, i) => {
        elem.setAttribute('index', i);
        elem.classList.add('vui-tab-pane');
        if (i === data.index) {
            elem.classList.add('vui-tab-selected');
        }
    });

    const $tabs = $el.querySelectorAll('.vui-tab-tabs > *');
    Array.from($tabs).forEach((elem, i) => {
        elem.setAttribute('index', i);
        elem.classList.add('vui-tab-item', 'vui-flex-row');
        if (i === data.index) {
            elem.classList.add('vui-tab-selected');
        }
    });

});

</script>
<style lang="scss">
.vui-tab {
    --vui-tab-background: #dee1e6;
    --vui-tab-height: 36px;

    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.vui-tab-header {
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    width: 100%;
    white-space: nowrap;
    background: var(--vui-tab-background);
    overflow: hidden;
}

.vui-tab-header-left,
.vui-tab-header-right {
    text-overflow: ellipsis;
    overflow: hidden;

    > * {
        text-overflow: ellipsis;
        overflow: hidden;
    }
}

.vui-tab-left {
    .vui-tab-header-right {
        flex: auto;
    }
}

.vui-tab-center {
    .vui-tab-header-left {
        flex: 1 1 50%;
    }

    .vui-tab-header-right {
        flex: 1 1 50%;
    }
}

.vui-tab-right {
    .vui-tab-header-left {
        flex: auto;
    }
}

.vui-tab-panes {
    position: relative;
    flex: auto;
    overflow: hidden;

    > * {
        display: none;
    }

    .vui-tab-pane {
        position: relative;
        display: none;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .vui-tab-selected {
        display: block;
    }
}

.vui-tab-tabs {
    position: relative;
    align-items: flex-end;
    align-self: flex-end;
    height: 100%;
    margin: 0 10px;
    padding-top: 5px;
}

.vui-tab-item {
    position: relative;
    height: var(--vui-tab-height);
    padding: 0 15px;
    color: #002b36;
    line-height: var(--vui-tab-height);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    cursor: pointer;
    user-select: none;
}

.vui-tab-item::after {
    position: absolute;
    left: 100%;
    bottom: 8px;
    content: "";
    z-index: 0;
    display: block;
    width: 1px;
    height: 20px;
    background-color: #a4a7ab;
}

.vui-tab-item:last-child::after {
    display: none;
}

.vui-tab-item:hover {
    z-index: 2;
    background-color: #ebecef;
}

.vui-tab-item:hover::before,
.vui-tab-item:hover::after {
    position: absolute;
    left: -10px;
    bottom: 0;
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background-color: transparent;
    background-repeat: no-repeat;
    pointer-events: none;
}

.vui-tab-item:hover::before {
    background-image: url("../../images/hover-before.svg");
}

.vui-tab-item:hover::after {
    left: 100%;
    background-image: url("../../images/hover-after.svg");
}

.vui-tab-item.vui-tab-selected {
    position: relative;
    z-index: 3;
    background-color: #fff;
}

.vui-tab-item.vui-tab-selected::before,
.vui-tab-item.vui-tab-selected::after {
    position: absolute;
    left: -10px;
    bottom: 0;
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background-color: transparent;
    background-repeat: no-repeat;
    pointer-events: none;
}

.vui-tab-item.vui-tab-selected::before {
    background-image: url("../../images/selected-before.svg");
}

.vui-tab-item.vui-tab-selected::after {
    left: 100%;
    background-image: url("../../images/selected-after.svg");
}

.vui-tab-item > * {
    text-overflow: ellipsis;
    overflow: hidden;
}

</style>
