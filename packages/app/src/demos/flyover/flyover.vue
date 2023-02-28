<template>
  <div>
    <VuiFlex
      gap="10px"
      padding="5px"
    >
      <VuiButton @click="data.visible=true">
        show Flyover
      </VuiButton>

      <VuiButton @click="data.visible=false">
        hide Flyover
      </VuiButton>

      <VuiButton @click="data.visible=!data.visible">
        toggle Flyover
      </VuiButton>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      padding="5px"
      margin="10px 0 0 0"
    >
      <div
        v-if="data.position==='left'"
        class="vui-flex-empty"
      />
      <div>Props:</div>
      <VuiSelect
        v-model="data.width"
        tooltip="width"
      >
        <option>30%</option>
        <option>50%</option>
        <option>60%</option>
        <option>100px</option>
      </VuiSelect>

      <VuiSelect
        v-model="data.position"
        tooltip="position"
      >
        <option>right</option>
        <option>left</option>
      </VuiSelect>

      <VuiSwitch v-model="data.visible">
        visible on start
      </VuiSwitch>

      <div
        v-if="data.position==='right'"
        class="vui-flex-empty"
      />
    </VuiFlex>


    <VuiFlyover
      v-model="data.visible"
      :width="data.width"
      :position="data.position"
      @start="onStart"
      @end="onEnd"
    >
      <VuiFlex
        margin="20px"
        gap="20px"
      >
        <div>This is Flyover</div>
        <div class="vui-flex-auto" />
        <VuiButton @click="data.visible=false">
          Close
        </VuiButton>
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
    visible: visible
});

watch(() => data.visible, (v) => {
    sessionStorage.setItem('vui-flyover-visible', v);
});

const onStart = () => {
    console.log('start');
};

const onEnd = () => {
    console.log('end');
};


</script>
