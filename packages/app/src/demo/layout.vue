<template>
  <VuiLayout width="100%">
    <div
      class="vui-layout-item"
      style="width: 200px;"
    >
      left
    </div>
    <div class="vui-layout-item vui-flex-auto">
      middle
    </div>
    <div
      class="vui-layout-item"
      style="width: 200px;"
    >
      right
    </div>
  </VuiLayout>
</template>

<script setup>
import { components } from 'vine-ui';
const { VuiLayout } = components;

</script>
<style>
.vui-layout-item {
    padding: 10px;
    border: thin solid #eee;
}
</style>
