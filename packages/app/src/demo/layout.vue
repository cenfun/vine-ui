<template>
  <div>
    <VuiFlex>
      <div class="vui-layout-iframe">
        <iframe />
      </div>

      <VuiLayout
        v-model="layoutModel"
        width="50%"
        height="300px"
      >
        <div>
          row left
          <VuiSelect v-model="layoutModel">
            <option>200px,auto</option>
            <option>10%,auto</option>
            <option>20%,auto</option>
            <option>auto,100px</option>
          </VuiSelect>
        </div>
        <div>
          row right auto (layout: {{ layoutModel }})
        </div>
      </VuiLayout>

      <VuiLayout
        width="50%"
        height="300px"
        direction="column"
        :gutter-hover-size="gutterHoverSize"
        :gutter-size="gutterSize"
      >
        <div>
          column top auto
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
        </div>
        <div size="100px">
          column bottom size: 100px
        </div>
      </VuiLayout>
    </VuiFlex>

    <VuiLayout
      v-model="layoutNested"
      width="100%"
      height="300px"
      class="vui-layout-nested"
    >
      <div class="vui-layout-left">
        left
        min-width: 50px
        <VuiSelect v-model="layoutNested">
          <option>20%,auto,auto,20%</option>
          <option>10%,auto</option>
          <option>20%,auto,,</option>
          <option>auto,100px</option>
          <option>auto,100px,,</option>
          <option>,,,100px</option>
          <option />
        </VuiSelect>
      </div>
      <div>
        <VuiLayout
          height="100%"
          direction="column"
          class="vui-layout-custom-gutter"
          gutter-hover-size="0"
          gutter-size="10px"
        >
          <div
            size="50px"
            class="vui-layout-top"
          >
            top
            height: 50px;
            min-height: 50px;
            custom gutter
          </div>
          <div>
            middle
          </div>
          <div size="100px">
            bottom
          </div>
        </VuiLayout>
      </div>
      <div>
        middle-right
      </div>
      <div>
        right
        (layout: {{ layoutNested }})
      </div>
    </VuiLayout>
  </div>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiLayout, VuiFlex, VuiSelect
} = VineUI;

const layoutModel = ref('200px,auto');

const gutterHoverSize = ref('2px');
const gutterSize = ref('6px');

const layoutNested = ref('20%,auto,auto,20%');

</script>
<style lang="scss">
.vui-layout-item {
    border: thin solid #eee;
}

.vui-layout-iframe {
    position: relative;
    width: 100px;
    height: 300px;
    margin-right: 5px;

    &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        content: "iframe mouseup area";
        z-index: 2;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    iframe {
        width: 100%;
        height: 100%;
        border: none;
        background-color: #f5f5f5;
    }
}

.vui-layout-nested {
    margin-top: 10px;
}

.vui-layout-left {
    min-width: 50px;
}

.vui-layout-top {
    min-height: 50px;
}

.vui-layout-custom-gutter {
    .vui-layout-gutter {
        background-image: url("../images/gutter.svg");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 16px 16px;
    }
}
</style>

