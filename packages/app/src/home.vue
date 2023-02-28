<template>
  <div>
    <div
      v-for="(demo, i) in demos"
      :key="i"
      class="vui-preview-item"
    >
      <div class="vui-preview-title">
        {{ demo.componentName }}
      </div>
      <div
        v-for="(item,j ) in demo.list"
        :key="j"
        class="vui-preview-demo"
      >
        <component :is="item.component" />
      </div>
    </div>
  </div>
</template>
<script setup>

import demos from './demos.js';

</script>
<style>
.vui-preview-item {
    margin-bottom: 20px;
}

.vui-preview-title {
    font-weight: bold;
    font-size: 20px;
}

.vui-preview-demo {
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
}
</style>
