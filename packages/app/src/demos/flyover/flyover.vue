<template>
  <div>
    <VuiFlex
      gap="10px"
      padding="5px"
      :align="data.position==='left'?'right':'left'"
    >
      <VuiButton
        primary
        @click="data.visible=!data.visible"
      >
        Toggle Flyover
      </VuiButton>

      <VuiButton @click="data.visible=true">
        Show
      </VuiButton>

      <VuiButton @click="data.visible=false">
        Hide
      </VuiButton>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      padding="5px"
      margin="10px 0 0 0"
      :align="data.position==='left'?'right':'left'"
    >
      <div>Props:</div>

      <VuiSelect
        v-model="data.position"
        tooltip="position"
      >
        <option>right</option>
        <option>left</option>
      </VuiSelect>

      <VuiSelect
        v-model="data.width"
        tooltip="width"
      >
        <option>30%</option>
        <option>50%</option>
        <option>60%</option>
        <option>100px</option>
      </VuiSelect>

      <div>{{ data.width }}</div>

      <VuiSwitch v-model="data.resizable">
        resizable
      </VuiSwitch>

      <VuiSwitch v-model="data.visible">
        visible on start
      </VuiSwitch>
    </VuiFlex>

    <VuiFlyover
      v-model="data.visible"
      :resizable="data.resizable"
      :width="data.width"
      :position="data.position"
      @start="onStart"
      @end="onEnd"
      @resize="onResize"
    >
      <VuiFlex
        direction="column"
        class="demo-flyover"
      >
        <VuiFlex
          class="demo-flyover-head"
          gap="10px"
          padding="10px"
        >
          <div>This is Flyover</div>
          <div class="vui-flex-auto" />
          <VuiButton @click="data.visible=false">
            Close
          </VuiButton>
        </VuiFlex>
        <div class="demo-flyover-content vui-flex-auto">
          <VuiSelect v-model="data.contentHeight">
            <option />
            <option>500px</option>
            <option>1000px</option>
            <option>2000px</option>
          </VuiSelect>
          <div :style="'background:#f5f5f5;height:'+data.contentHeight" />
        </div>
      </VuiFlex>
    </VuiFlyover>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

import VineUI from 'vine-ui';
const {
    VuiButton,
    VuiFlex,
    VuiFlyover,
    VuiSelect,
    VuiSwitch
} = VineUI;

const visible = sessionStorage.getItem('vui-flyover-visible') === 'true';

const data = reactive({
    width: '30%',
    position: 'right',
    resizable: true,
    visible: visible,

    contentHeight: ''
});

watch(() => data.visible, (v) => {
    sessionStorage.setItem('vui-flyover-visible', v);
});

const onStart = (v) => {
    console.log('start', v);
};

const onEnd = (v) => {
    console.log('end', v);
};

const onResize = (width) => {
    // console.log(width);
    data.width = width;
};

</script>
<style>
.demo-flyover {
    height: 100%;
}

.demo-flyover-head {
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    background-color: #eee;
}

.demo-flyover-content {
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>
