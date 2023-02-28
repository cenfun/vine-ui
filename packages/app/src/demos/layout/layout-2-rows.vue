<template>
  <div>
    <VuiLayout
      width="600px"
      height="200px"
      direction="column"
      :gutter-hover-size="gutterHoverSize"
      :gutter-size="gutterSize"
      class="vui-layout-custom-gutter"
    >
      <div>
        top (auto)
      </div>
      <div size="50px">
        bottom (size=50px)
      </div>
    </VuiLayout>
    <VuiFlex
      gap="10px"
      margin="10px 0 0 0"
    >
      <VuiSelect
        v-model="gutterHoverSize"
        label="gutterHoverSize"
      >
        <option>0</option>
        <option>1px</option>
        <option>2px</option>
        <option>3px</option>
        <option>4px</option>
        <option>5px</option>
        <option>6px</option>
      </VuiSelect>
      <VuiSelect
        v-model="gutterSize"
        label="gutterSize"
      >
        <option>0</option>
        <option>2px</option>
        <option>4px</option>
        <option>6px</option>
        <option>10px</option>
        <option>15px</option>
      </VuiSelect>
    </VuiFlex>
  </div>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiLayout, VuiSelect, VuiFlex
} = VineUI;

const gutterHoverSize = ref('0');
const gutterSize = ref('10px');

</script>
<style lang="scss">
.vui-layout-custom-gutter {
    .vui-layout-gutter {
        background-image: url("../../images/gutter.svg");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 16px 16px;
    }
}
</style>
