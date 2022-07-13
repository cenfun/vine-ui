<template>
  <VuiLayout
    width="100%"
    height="300px"
  >
    <div
      class="vui-layout-item"
      style="width: 200px;"
    >
      left
    </div>
    <div
      class="vui-layout-item vui-flex-auto"
      style="min-width: 200px;"
    >
      <VuiLayout
        height="100%"
        direction="column"
        size="10px"
      >
        <div
          class="vui-layout-item"
          style="height: 50px;"
        >
          top
        </div>
        <div
          class="vui-layout-item vui-flex-auto"
        >
          middle
        </div>
        <div
          class="vui-layout-item"
          style="height: 50px;"
        >
          bottom
        </div>
      </VuiLayout>
    </div>
    <div
      class="vui-layout-item"
      style="width: 100px;"
    >
      column
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
    padding: 5px;
    border: thin solid #eee;
}
</style>

