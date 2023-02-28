<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <VuiTab
      :index="1"
      align="right"
      background="#cdcdcd"
      left="Left Header Props"
      :tabs="tabs"
      :panes="tabPanes"
    />
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

const tabs = ['Right Tab 1', 'Right Tab 2', 'Right Tab 3'];

const tabPanes = ref(['Pane 1', 'Pane 2', function(h) {
    return h(VuiButton, {
        label: 'Label'
    });
}]);

</script>
