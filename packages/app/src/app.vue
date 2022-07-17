<template>
  <VuiFlex
    direction="column"
    class="vui-app"
  >
    <div class="vui-header vui-flex-row">
      <div class="vui-title">
        Vine UI
      </div>
      <div class="vui-sub">
        Based on <a
          href="https://github.com/vuejs/core"
          target="_blank"
        >Vue 3.x</a>
      </div>
      <div>
        <a
          href="https://github.com/cenfun/vine-ui"
          target="_blank"
          class="icon-github"
        />
      </div>
    </div>
    <div class="vui-body vui-flex-auto">
      <div
        v-for="(item, i) in list"
        :key="i"
        class="vui-item vui-flex-row"
      >
        <div class="vui-item-name">
          {{ item.name }}
        </div>
        <div class="vui-item-example vui-flex-auto">
          <component :is="item.Demo" />
        </div>
      </div>
    </div>
  </VuiFlex>
</template>
<script>
import { components, createComponent } from 'vine-ui';

console.log('components', components);

const { VuiFlex } = components;

const context = require.context('./demo', true, /\.vue$/);
const demos = {};
const list = [];
const paths = context.keys();
paths.forEach((path) => {
    //console.log(path);
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

const App = {

    createComponent,

    components: {
        VuiFlex,
        ... demos
    },

    setup: () => {
        return {
            list
        };
    }
};

export default App;
</script>
<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #333;
}

.vui-app {
    width: 100%;
    height: 100%;
    position: relative;
}

.vui-header {
    padding: 5px 10px;
    background: #f5f5f5;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
}

.vui-title {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
}

.vui-sub {
    padding-left: 10px;
    color: #666;
    height: 30px;
    line-height: 30px;
    flex: 1 1 0%;
}

.icon-github {
    display: block;
    margin-right: 5px;
    width: 26px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 26px 26px;
    background-image: url("images/github.svg");
    opacity: 0.6;
}

.icon-github:hover {
    opacity: 1;
}

.vui-body {
    overflow-y: auto;
    padding: 10px;
}

.vui-item {
    border-bottom: 1px dotted #ccc;
    padding: 5px;
}

.vui-item-name {
    width: 99px;
    padding: 5px 5px 5px 0;
    overflow: hidden;
    color: #000;
}

.vui-item-example {
    border-left: 1px solid #ccc;
    padding: 5px 5px 5px 10px;
}

</style>
