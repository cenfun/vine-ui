<template>
  <div :class="classList">
    <VuiFlex class="vui-tab-header">
      <VuiFlex
        v-if="leftContent"
        wrap
        gap="10px"
        class="vui-tab-header-left"
      >
        <slot name="left" />
      </VuiFlex>

      <div
        ref="tabs"
        class="vui-tab-tabs vui-flex vui-flex-row vui-flex-auto"
        :style="alignStyle"
        @click="onTabClick"
      >
        <slot name="tabs" />
      </div>

      <VuiFlex
        v-if="rightContent"
        wrap
        gap="10px"
        class="vui-tab-header-right"
      >
        <slot name="right" />
      </VuiFlex>
    </VuiFlex>
    <div
      ref="panes"
      class="vui-tab-panes"
    >
      <slot name="panes" />
    </div>
  </div>
</template>
<script setup>
import {
    computed, watch, watchEffect, reactive, onMounted, ref, useSlots
} from 'vue';

import {
    toNum, getCID, getSlot
} from '../../utils/util.js';
import VuiFlex from '../flex/flex.vue';

const cid = getCID('VuiTab');

const props = defineProps({
    align: {
        type: String,
        default: 'left',
        validator(value) {
            return ['left', 'center', 'right'].includes(value);
        }
    },

    theme: {
        type: String,
        default: 'chrome',
        validator(value) {
            return ['chrome', 'simple'].includes(value);
        }
    },

    index: {
        type: [Number, String],
        default: 0
    },

    modelValue: {
        type: [Number, String],
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'change']);

const data = reactive({
    index: 0
});

watchEffect(() => {
    data.index = toNum(props.modelValue === null ? props.index : props.modelValue);
});

watch(() => data.index, (v) => {
    emit('update:modelValue', v);
    emit('change', v);
});

const tabs = ref(null);
const panes = ref(null);

const slots = useSlots();

const leftContent = computed(() => {
    return getSlot(slots, 'left');
});

const rightContent = computed(() => {
    return getSlot(slots, 'right');
});

const alignStyle = computed(() => {
    return `--vui-flex-align: ${props.align};`;
});

const classList = computed(() => {
    return [
        'vui',
        'vui-tab',
        `vui-tab-${props.theme}`,
        cid
    ];
});

const onTabClick = (e) => {
    let tabItem;
    let target = e.target;
    while (target) {
        if (target.classList && target.classList.contains('vui-tab-item')) {
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
};

watch(() => data.index, (v) => {

    const $panes = panes.value.children;
    const $tabs = tabs.value.children;

    Array.from($panes).forEach((elem, i) => {
        if (v === i) {
            elem.classList.add('vui-tab-selected');
        } else {
            elem.classList.remove('vui-tab-selected');
        }
    });
    Array.from($tabs).forEach((elem, i) => {
        if (v === i) {
            elem.classList.add('vui-tab-selected');
        } else {
            elem.classList.remove('vui-tab-selected');
        }
    });

});

onMounted(() => {

    const $panes = panes.value.children;
    const $tabs = tabs.value.children;

    Array.from($panes).forEach((elem, i) => {
        elem.setAttribute('index', i);
        elem.classList.add('vui-tab-pane');
        if (i === data.index) {
            elem.classList.add('vui-tab-selected');
        }
    });
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
    overflow: visible;
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
    margin: 0 10px;
    overflow: visible;
}

.vui-tab-item {
    position: relative;
    padding: 0 15px;
    color: #002b36;
    cursor: pointer;
    user-select: none;
}

.vui-tab-item:not(:first-child)::before {
    position: absolute;
    left: 0;
    bottom: 8px;
    content: "";
    z-index: 0;
    display: block;
    width: 1px;
    height: 20px;
    background-color: #a4a7ab;
}

.vui-tab-item:hover + .vui-tab-item::before,
.vui-tab-item.vui-tab-selected + .vui-tab-item::before {
    display: none;
}

.vui-tab-item:hover {
    z-index: 2;
}

.vui-tab-item.vui-tab-selected {
    position: relative;
    z-index: 3;
    background-color: #fff;
}

.vui-tab-item > * {
    text-overflow: ellipsis;
    overflow: hidden;
}

.vui-tab-chrome > .vui-tab-header .vui-tab-item {
    height: 36px;
    line-height: 36px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.vui-tab-simple > .vui-tab-header .vui-tab-item {
    height: 36px;
    line-height: 36px;
    border: 1px solid transparent;
    border-bottom: none;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.vui-tab-chrome > .vui-tab-header {
    background: #dee1e6;

    .vui-tab-tabs {
        padding-top: 8px;
    }

    .vui-tab-item:not(.vui-tab-selected):hover {
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
}

.vui-tab-simple > .vui-tab-header {
    border-bottom: 1px solid #ccc;

    .vui-tab-tabs {
        margin-bottom: -1px;
    }

    .vui-tab-item.vui-tab-selected {
        border-color: #ccc;
    }

    .vui-tab-item:not(.vui-tab-selected):hover {
        border-color: #ccc;
    }

    .vui-tab-item:hover::before,
    .vui-tab-item.vui-tab-selected::before {
        display: none;
    }
}

</style>
