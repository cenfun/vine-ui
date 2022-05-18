<template>
  <div :class="['vui','vui-tab', classId]">
    <div class="vui-tab-header vui-flex-row">
      <div
        v-if="position==='right'"
        class="vui-tab-toolbar vui-flex-auto vui-flex-row"
      >
        <slot name="toolbar">
          <BaseRender
            v-if="toolbar"
            :content="toolbar"
          />
        </slot>
      </div>

      <div
        ref="tabs"
        class="vui-tab-tabs vui-flex-row"
      >
        <TabItem
          v-for="(item, i) in tabList"
          :key="i"
          v-model="dataModelValue"
          :content="item"
          :index="i"
          :selected="dataModelValue===i"
          :position="position"
        />
      </div>


      <div
        v-if="position==='left'"
        class="vui-tab-toolbar vui-flex-auto vui-flex-row"
      >
        <slot name="toolbar">
          <BaseRender
            v-if="toolbar"
            :content="toolbar"
          />
        </slot>
      </div>
    </div>
    <div
      ref="panes"
      class="vui-tab-panes"
    >
      <TabPane
        v-for="(item, i) in paneList"
        :key="i"
        :content="item"
        :selected="dataModelValue===i"
      />
    </div>
  </div>
</template>
<script>
import Base from '../../base/base.vue';
import registerComponent from '../../helper/register-component.js';
//import Util from '../../helper/util.js';
import TabItem from './tab-item.vue';
import TabPane from './tab-pane.vue';

const Tab = {

    name: 'Tab',

    components: {
        TabItem,
        TabPane
    },

    extends: Base,

    props: {
        // theme: {
        //     type: String,
        //     default: '',
        //     validator(value) {
        //         return ['', ''].includes(value);
        //     }
        // },
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
        }
    },

    computed: {
        tabList() {
            return this.tabs || this.getSlot('tabs') || [];
        },
        paneList() {
            return this.panes || this.getSlot('panes') || this.getSlot('default') || [];
        }
    }
};

registerComponent(Tab);

export default Tab;
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
