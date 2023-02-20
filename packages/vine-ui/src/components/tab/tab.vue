<template>
  <div
    :class="classList"
    :style="styleList"
  >
    <div class="vui-tab-header vui-flex-row">
      <div class="vui-tab-header-left vui-flex-row">
        <slot name="left">
          <BaseRender :content="props.left" />
        </slot>
      </div>
      <div class="vui-tab-tabs vui-flex-row">
        <TabItem
          v-for="(item, i) in tabList"
          :key="i"
          :content="item"
          :selected="modelData===i"
          @click="clickHandler(i)"
        />
      </div>
      <div class="vui-tab-header-right vui-flex-row">
        <slot name="right">
          <BaseRender :content="props.right" />
        </slot>
      </div>
    </div>
    <div class="vui-tab-panes">
      <TabPane
        v-for="(item, i) in paneList"
        :key="i"
        :content="item"
        :selected="modelData===i"
      />
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import {
    useBase, BaseRender, getSlot
} from '../../base/base.js';

import TabItem from './tab-item.vue';
import TabPane from './tab-pane.vue';

const props = defineProps({
    align: {
        type: String,
        default: 'left',
        validator(value) {
            return ['left', 'center', 'right'].includes(value);
        }
    },
    left: {
        validator: (v) => true,
        default: ''
    },
    right: {
        validator: (v) => true,
        default: ''
    },
    tabs: {
        type: Array,
        default: () => null
    },
    panes: {
        type: Array,
        default: () => null
    },
    background: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: ''
    },
    modelValue: {
        type: Number,
        default: 0
    }
});

const { cid } = useBase('VuiTab');

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

const tabList = computed(() => {
    return props.tabs || getSlot('tabs') || [];
});

const paneList = computed(() => {
    return props.panes || getSlot('panes') || getSlot() || [];
});

const emit = defineEmits(['update:modelValue']);

const modelData = computed({
    get() {
        return props.modelValue;
    },
    set(v) {
        emit('update:modelValue', v);
    }
});

const clickHandler = (index) => {
    modelData.value = index;
};

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

    &.vui-tab-left {
        .vui-tab-header-right {
            flex: auto;
        }
    }

    &.vui-tab-center {
        .vui-tab-header-left {
            flex: 1 1 50%;
        }

        .vui-tab-header-right {
            flex: 1 1 50%;
        }
    }

    &.vui-tab-right {
        .vui-tab-header-left {
            flex: auto;
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

    .vui-tab-panes {
        position: relative;
        flex: auto;
        overflow: hidden;
    }
}
</style>
