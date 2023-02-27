<template>
  <VuiFlex
    direction="column"
    class="vui-app"
  >
    <div class="vui-header vui-flex-row">
      <div
        class="vui-title"
        tooltip="Lightweight UI components"
      >
        Vine UI
      </div>
      <div class="vui-sub">
        Based on <a
          href="https://github.com/vuejs/core"
          target="_blank"
        >Vue 3.x</a>
      </div>
      <VuiFlex gap="10px">
        <div class="fps-detector" />
        <a
          href="https://github.com/cenfun/vine-ui"
          target="_blank"
          class="icon-github"
          tooltip="Github"
        />
      </VuiFlex>
    </div>
    <div class="vui-body vui-flex-auto">
      <div
        v-for="(item, i) in list"
        :key="i"
        class="vui-item"
      >
        <div class="vui-item-name">
          {{ item.name }}
        </div>
        <div class="vui-item-demo">
          <component :is="item.Demo" />
        </div>
      </div>
    </div>
  </VuiFlex>
</template>
<script setup>
import VineUI from 'vine-ui';
import FPSDetector from 'fps-detector';
import { onMounted } from 'vue';

console.log('components', VineUI);

const { VuiFlex } = VineUI;

const context = require.context('./demo', true, /\.vue$/);
const demos = {};
const list = [];
const paths = context.keys();
paths.forEach((path) => {
    // console.log(path);
    const fileName = path.split('/').pop();
    const demoName = fileName.split('.').shift();
    const N = demoName.slice(0, 1).toUpperCase() + demoName.slice(1).toLowerCase();
    const Demo = context(path).default;
    demos[`Demo${N}`] = Demo;
    list.push({
        name: `Vui${N}`,
        Demo
    });
});

console.log('demos', demos);

onMounted(() => {
    new FPSDetector('.fps-detector');
});

</script>
<style lang="scss">
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    color: #333;
    font-size: 14px;
    font-family: Helvetica, Arial, sans-serif;
}

.vui-app {
    position: relative;
    width: 100%;
    height: 100%;
}

.vui-header {
    padding: 5px 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    background: #f5f5f5;
}

.vui-title {
    height: 30px;
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
}

.vui-sub {
    flex: 1 1 0%;
    height: 30px;
    padding-left: 10px;
    color: #666;
    line-height: 30px;
}

.icon-github {
    display: block;
    width: 26px;
    height: 26px;
    margin-right: 5px;
    background-image: url("images/github.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 26px 26px;
    opacity: 0.6;
}

.icon-github:hover {
    opacity: 1;
}

.vui-body {
    overflow-y: auto;
}

.vui-item {
    padding: 10px;
    border-bottom: 1px solid #999;
}

.vui-item-name {
    padding: 10px 0;
    color: #000;
    font-weight: bold;
    font-size: 20px;
}

</style>
