<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <div class="vui-fixed-height">
      <VuiTab
        v-model="tabActive"
        :theme="gstate.tabTheme"
        align="center"
      >
        <template #left>
          <b>Header Title</b>
        </template>
        <template #right>
          <div class="vui-flex-auto" />
          <div
            class="vui-flex-row"
            tooltip="This is toolbar tooltip"
          >
            <div class="vui-tab-icon-plus" />
            Right Header Slot {{ tabActive }}
          </div>
        </template>
        <template #tabs>
          <div>Center Tab 1</div>
          <div>Center Tab 2</div>
          <div>Center Tab 3</div>
        </template>
        <template #panes>
          <div>
            Pane 1 (fixed height: 200px)
          </div>
          <div>
            Pane 2
          </div>
          <div>
            Pane 3
          </div>
        </template>
      </VuiTab>
    </div>
    <VuiFlex
      gap="10px"
      padding="5px"
    >
      <div>Props:</div>
      <VuiSelect
        v-model="gstate.tabTheme"
        tooltip="theme"
      >
        <option>chrome</option>
        <option>simple</option>
      </VuiSelect>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { inject, ref } from 'vue';
import VineUI from 'vine-ui';
const {
    VuiFlex,
    VuiSelect,
    VuiTab
} = VineUI;

const tabActive = ref(0);
const gstate = inject('gstate');

</script>
<style lang="scss">
/*
  style shared for all tab demos
*/

.vui-tab-icon-plus {
    width: 18px;
    height: 18px;
    margin-right: 3px;
    background-image: url("../../images/plus.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 18px 18px;
}

.vui-fixed-height {
    height: 200px;

    .vui-tab-pane {
        padding: 10px;
        border: 1px solid #ccc;
        border-top: none;
    }
}

.vui-tab-header-left,
.vui-tab-header-right {
    padding: 0 10px;
}

.vui-tab-right .vui-tab-header-right,
.vui-tab-left .vui-tab-header-left {
    padding: 0;
}

.vui-tab-right .vui-tab-pane,
.vui-tab-left .vui-tab-pane {
    padding: 10px;
}

</style>
