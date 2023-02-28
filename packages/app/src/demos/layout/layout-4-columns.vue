<template>
  <div>
    <VuiLayout
      v-model="layoutNested"
      width="100%"
      height="200px"
      class="vui-layout-nested"
    >
      <div class="vui-layout-left">
        left
        min-width: 50px
      </div>
      <div>
        middle-left
      </div>
      <div>
        middle-right
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
      <VuiSelect v-model="layoutNested">
        <option>20%,auto,auto,20%</option>
        <option>10%,auto</option>
        <option>20%,auto,,</option>
        <option>auto,100px</option>
        <option>auto,100px,,</option>
        <option>,,,100px</option>
        <option />
      </VuiSelect>
      <div>{{ layoutNested }}</div>
    </VuiFlex>
  </div>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiLayout, VuiSelect, VuiFlex
} = VineUI;

const layoutNested = ref('20%,auto,auto,20%');

</script>
<style lang="scss">
.vui-layout-nested {
    margin-top: 10px;
}

.vui-layout-left {
    min-width: 50px;
}
</style>

