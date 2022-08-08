<template>
  <div :class="classList">
    <div class="vui-tab-header vui-flex-row">
      <div
        v-if="props.position==='right'"
        class="vui-tab-toolbar vui-flex-auto vui-flex-row"
      >
        <slot name="toolbar">
          <BaseRender :content="props.toolbar" />
        </slot>
      </div>

      <div class="vui-tab-tabs vui-flex-row">
        <TabItem
          v-for="(item, i) in tabList"
          :key="i"
          :content="item"
          :selected="modelData===i"
          :position="props.position"
          @click="clickHandler(i)"
        />
      </div>


      <div
        v-if="props.position==='left'"
        class="vui-tab-toolbar vui-flex-auto vui-flex-row"
      >
        <slot name="toolbar">
          <BaseRender :content="props.toolbar" />
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

const { cid } = useBase('VuiTab');

const classList = ['vui', 'vui-tab', cid];

const props = defineProps({
    position: {
        type: String,
        default: 'left',
        validator(value) {
            return ['left', 'right'].includes(value);
        }
    },
    toolbar: {
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
    modelValue: {
        type: Number,
        default: null
    }
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
    position: relative;
    width: 100%;
    height: 100%;

    .vui-tab-header {
        position: relative;
        background: #dee1e6;
        width: 100%;
        border-top: 1px solid #fff;
        z-index: 10;
        white-space: nowrap;
        overflow: hidden;
    }

    .vui-tab-toolbar {
        position: relative;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 0 10px;

        > * {
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .vui-tab-tabs {
        position: relative;
        height: 100%;
        margin: 0 10px;
        align-items: flex-end;
        padding-top: 5px;
    }

    .vui-tab-panes {
        position: relative;
        overflow: hidden;
    }
}
</style>
