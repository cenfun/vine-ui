<template>
  <div>
    <VuiFlex>
      <div class="vui-layout-iframe">
        <iframe />
      </div>
      <VuiLayout
        v-model="layoutNested"
        height="300px"
        class="vui-flex-auto"
      >
        <div class="vui-layout-left">
          left
          min-width: 50px
        </div>
        <div class="vui-layout-nested-item">
          <VuiLayout
            height="100%"
            direction="column"
          >
            <div
              size="50px"
              class="vui-layout-top"
            >
              top
              height: 50px;
              min-height: 50px;
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
        </div>
      </VuiLayout>
    </VuiFlex>
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
    VuiLayout, VuiFlex, VuiSelect
} = VineUI;

const layoutNested = ref('20%,auto,auto,20%');

</script>
<style lang="scss">
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

.vui-layout-nested-item {
    border: none;
}

.vui-layout-left {
    min-width: 50px;
}

.vui-layout-top {
    min-height: 50px;
}

</style>

