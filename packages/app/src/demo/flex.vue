<template>
  <VuiFlex spacing="10px">
    <VuiFlex
      spacing="10px"
      direction="column"
    >
      <VuiSelect
        v-model="flex.direction"
        tooltip="direction"
      >
        <option>row</option>
        <option>column</option>
      </VuiSelect>

      <VuiSwitch v-model="flex.center">
        center
      </VuiSwitch>

      <VuiSelect
        v-model="flex.spacing"
        tooltip="spacing"
      >
        <option />
        <option>5px</option>
        <option>10px</option>
        <option>15px</option>
        <option>20px</option>
      </VuiSelect>

      <VuiSelect
        v-model="flex.margin"
        tooltip="margin"
      >
        <option />
        <option>5px</option>
        <option>10px</option>
      </VuiSelect>

      <VuiSelect
        v-model="flex.padding"
        tooltip="padding"
      >
        <option />
        <option>5px</option>
        <option>10px</option>
      </VuiSelect>

      <VuiSelect
        v-model="flex.width"
        tooltip="width"
      >
        <option>100px</option>
        <option>200px</option>
        <option>300px</option>
        <option>400px</option>
        <option>50%</option>
      </VuiSelect>
      <VuiSelect
        v-model="flex.height"
        tooltip="height"
      >
        <option>100px</option>
        <option>200px</option>
        <option>300px</option>
      </VuiSelect>
    </VuiFlex>

    <VuiFlex
      :direction="flex.direction"
      :center="flex.center"
      :spacing="flex.spacing"
      :margin="flex.margin"
      :padding="flex.padding"
      :width="flex.width"
      :height="flex.height"
      class="flex-demo-bg"
    >
      <div class="flex-demo-border">
        div
      </div>
      <VuiButton class="flex-demo-border">
        button
      </VuiButton>
      <span class="flex-demo-border">span</span>
      <div class="flex-demo-border">
        div
      </div>
    </VuiFlex>

    <VuiFlex
      :direction="flex.direction"
      :center="flex.center"
      :spacing="flex.spacing"
      :margin="flex.margin"
      :padding="flex.padding"
      :width="flex.width"
      :height="flex.height"
      class="flex-demo-bg"
    >
      <div class="flex-demo-border">
        div
      </div>
      <VuiButton class="flex-demo-border">
        button
      </VuiButton>
      <div
        class="flex-demo-border"
        :class="flex.spaceClass"
      >
        <VuiSelect v-model="flex.spaceClass">
          <option>vui-flex-auto</option>
          <option>vui-flex-empty</option>
        </VuiSelect>
      </div>
      <span class="flex-demo-border">span</span>
      <div class="flex-demo-border">
        div
      </div>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { reactive } from 'vue';
import VineUI from 'vine-ui';
const {
    VuiButton,
    VuiFlex,
    VuiSelect,
    VuiSwitch
} = VineUI;

const flex = reactive({
    direction: 'column',
    center: false,
    spacing: '5px',
    margin: '5px',
    padding: '5px',
    width: '400px',
    height: '300px',

    spaceClass: 'vui-flex-auto'
});

</script>
<style>
.flex-demo-border {
    box-sizing: border-box;
    border: thin solid #ccc;
}

.flex-demo-bg {
    background-color: #eee;
}

</style>
