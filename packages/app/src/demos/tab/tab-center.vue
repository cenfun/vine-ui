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
