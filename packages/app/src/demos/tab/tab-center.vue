<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <div class="vui-fixed-height">
      <VuiTab
        v-model="tabActive"
        align="center"
        height="40px"
      >
        <template #left>
          <div class="vui-tab-header-title">
            Header Title
          </div>
        </template>
        <template #right>
          <div class="vui-flex-auto" />
          <div
            class="vui-tab-icon vui-tab-icon-plus"
            tooltip="This is toolbar tooltip"
          >
            Right Header Slot {{ tabActive }}
          </div>
        </template>
        <template #tabs>
          <div>Center Tab 1</div>
          <div>Center Tab 2</div>
          <div>Center Tab 3</div>
        </template>
        <template #panes>
          <div class="vui-fixed-pane">
            Pane 1
          </div>
          <div class="vui-fixed-pane">
            Pane 2
          </div>
          <div class="vui-fixed-pane">
            Pane 3
          </div>
        </template>
      </VuiTab>
    </div>
  </VuiFlex>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiFlex,
    VuiTab
} = VineUI;

const tabActive = ref(0);

</script>
<style lang="scss">
/*
  style shared for all tab demos
*/
.vui-tab-icon {
    padding-right: 8px;
    padding-left: 25px;
    background-repeat: no-repeat;
    background-position: 2px center;
    background-size: 18px 18px;
}

.vui-tab-icon-tools {
    background-image: url("../../images/tools.svg");
}

.vui-tab-icon-plus {
    background-image: url("../../images/plus.svg");
}

.vui-fixed-height {
    height: 200px;
}

.vui-fixed-pane {
    height: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-top: none;
}

.vui-tab-header-title {
    padding: 10px;
    font-weight: bold;
    font-size: 18px;
}

.vui-tab-header-left,
.vui-tab-header-right {
    padding: 5px;
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
