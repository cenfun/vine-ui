<template>
  <div>
    <VuiLayout
      v-model="layoutModel"
      width="600px"
      height="100px"
    >
      <div>
        left
      </div>
      <div>
        right
      </div>
    </VuiLayout>

    <VuiFlex
      gap="10px"
      margin="10px 0 0 0"
    >
      <div>layout</div>
      <VuiSelect v-model="layoutModel">
        <option>200px,auto</option>
        <option>10%,auto</option>
        <option>20%,auto</option>
        <option>auto,100px</option>
      </VuiSelect>
      <div>{{ layoutModel }}</div>
    </VuiFlex>
  </div>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiLayout, VuiSelect, VuiFlex
} = VineUI;

const layoutModel = ref('200px,auto');

</script>
<style>
.vui-layout-item {
    border: thin solid #ccc;
}
</style>
