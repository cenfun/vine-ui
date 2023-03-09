<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <VuiTab
      :index="1"
      align="right"
      :theme="gstate.tabTheme"
    >
      <template #left>
        <b>Right Tab</b>
      </template>
      <template #tabs>
        <div>Right Tab 1</div>
        <div>Right Tab 2</div>
        <div>Right Tab 3</div>
      </template>
      <template #panes>
        <div>Right Pane 1</div>
        <div>Right Pane 2</div>
        <div>
          <VuiButton>Right Pane 3</VuiButton>
        </div>
      </template>
    </VuiTab>
  </VuiFlex>
</template>

<script setup>
import { inject } from 'vue';
import VineUI from 'vine-ui';
const {
    VuiButton,
    VuiFlex,
    VuiTab
} = VineUI;

const gstate = inject('gstate');

</script>
