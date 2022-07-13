<template>
  <VuiLayout
    width="100%"
    height="300px"
  >
    <div class="vui-layout-item vui-layout-left">
      left
      width: 200px;
      min-width: 50px;
      max-width: 300px;
    </div>
    <div class="vui-layout-item vui-flex-auto">
      <VuiLayout
        height="100%"
        direction="column"
        size="10px"
      >
        <div class="vui-layout-item vui-layout-top">
          top
          height: 50px;
          min-height: 50px;
        </div>
        <div
          class="vui-layout-item vui-flex-auto"
        >
          middle
        </div>
        <div class="vui-layout-item">
          bottom
        </div>
      </VuiLayout>
    </div>
    <div class="vui-layout-item">
      middle-right
    </div>
    <div class="vui-layout-item vui-layout-right">
      right
      width: 200px;
    </div>
  </VuiLayout>
</template>

<script setup>
import { components } from 'vine-ui';
const { VuiLayout } = components;

</script>
<style>
.vui-layout-item {
    padding: 5px;
    border: thin solid #eee;
    overflow: hidden;
}

.vui-layout-left {
    width: 200px;
    min-width: 50px;
    max-width: 300px;
    white-space: pre-line;
}

.vui-layout-top {
    height: 50px;
    min-height: 50px;
}

.vui-layout-right {
    width: 200px;
}
</style>

