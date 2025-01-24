<template>
  <div>
    <div>
      <VuiButton
        primary
        @click="data.visible = true"
      >
        Open Modal
      </VuiButton>
    </div>
    <VuiFlex
      gap="10px"
      padding="5px"
      margin="10px 0 0 0"
    >
      <div>Props:</div>
      <VuiSelect
        v-model="data.title"
        tooltip="title"
      >
        <option>Modal Title</option>
        <option />
      </VuiSelect>

      <VuiSelect
        v-model="data.width"
        tooltip="width"
      >
        <option />
        <option>50%</option>
        <option>80%</option>
        <option>300px</option>
        <option>500px</option>
      </VuiSelect>

      <VuiSwitch v-model="data.closeButton">
        closeButton
      </VuiSwitch>

      <VuiSwitch v-model="data.closeOnClickOut">
        closeOnClickOut
      </VuiSwitch>

      <VuiSelect
        v-model="data.contentHeight"
        tooltip="content height for scrollbar"
      >
        <option />
        <option>100px</option>
        <option>800px</option>
      </VuiSelect>
    </VuiFlex>


    <VuiModal
      v-model="data.visible"
      :title="data.title"
      :width="data.width"
      :close-button="data.closeButton"
      :close-on-click-out="data.closeOnClickOut"
    >
      <VuiButton @click="data.visible=false">
        CLose
      </VuiButton>
      <div :style="'width:500px;height:'+data.contentHeight">
        <VuiFlex
          direction="column"
          padding="30px 0px"
        >
          <VuiButton @click="data.subVisible=true">
            Open Modal in Modal
          </VuiButton>
        </VuiFlex>
      </div>
    </VuiModal>

    <VuiModal
      v-model="data.subVisible"
      width="300px"
      append-to-body
    >
      sub modal
    </VuiModal>
  </div>
</template>
<script setup>
import VineUI from 'vine-ui';
import { reactive } from 'vue';
const {
    VuiButton,
    VuiFlex,
    VuiSwitch,
    VuiSelect,
    VuiModal
} = VineUI;

const data = reactive({
    visible: false,
    title: 'Modal Title',
    width: '50%',
    closeButton: true,
    closeOnClickOut: true,
    contentHeight: ''
});

</script>
