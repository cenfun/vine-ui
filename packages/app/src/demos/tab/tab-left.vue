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
          class="vui-tab-icon vui-tab-icon-plus"
          tooltip="This is toolbar tooltip"
        >
          Right Header Slot {{ tabActive }}
        </div>
      </template>
      <template #tabs>
        <div>
          Tab 1 {{ tabActive }}
        </div>
        <div>Tab 2</div>
        <div
          class="vui-tab-icon vui-tab-icon-tools"
          tooltip="This is tab tooltip"
        >
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
        <VuiButton>
          Button Pane 4
        </VuiButton>
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
