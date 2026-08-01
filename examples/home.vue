<template>
  <div>
    <div
      v-for="(example, i) in examples"
      :key="i"
      class="vui-preview-item"
    >
      <div class="vui-preview-title">
        {{ example.componentName }}
      </div>
      <div
        v-for="(item,j ) in example.list"
        :key="j"
        class="vui-preview-example"
      >
        <component :is="item.component" />
      </div>
    </div>
  </div>
</template>
<script setup>

import examples from './examples.js';

</script>
<style>
.vui-preview-item {
    margin-bottom: 20px;
}

.vui-preview-title {
    font-weight: bold;
    font-size: 20px;
}

.vui-preview-example {
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
}
</style>
