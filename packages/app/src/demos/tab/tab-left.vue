<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <VuiTab
      v-model="tabActive"
      align="left"
    >
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
        <div>
          Tab 1 {{ tabActive }}
        </div>
        <div>Tab 2</div>
        <div tooltip="This is tab tooltip">
          <div class="vui-tab-icon-tools" />
          Tab 3
        </div>
        <div>
          Tab 4 Max Width Long Text Long Text Long Text
        </div>
        <span />
        <div>Tab 6</div>
      </template>
      <template #panes>
        <div>Pane 1 </div>
        <div style="height: 100px;">
          Pane 2 100px height {{ tabActive }}
        </div>
        <div>Pane 3</div>
        <div>
          <VuiButton>
            Button Pane 4
          </VuiButton>
        </div>
        <span />
        <div>Pane 6</div>
      </template>
    </VuiTab>
  </VuiFlex>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiButton,
    VuiFlex,
    VuiTab
} = VineUI;

const tabActive = ref(0);

</script>
<style>
.vui-tab-icon-tools {
    width: 18px;
    height: 18px;
    margin-right: 3px;
    background-image: url("../../images/tools.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 18px 18px;
    pointer-events: none;
}
</style>
