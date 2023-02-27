<template>
  <VuiFlex gap="10px">
    <VuiFlex
      gap="10px"
      direction="column"
    >
      <VuiSelect
        v-model="flex.direction"
        tooltip="direction"
      >
        <option>row</option>
        <option>column</option>
      </VuiSelect>

      <VuiSelect
        v-model="flex.gap"
        tooltip="gap"
      >
        <option />
        <option>5px</option>
        <option>10px</option>
        <option>15px</option>
        <option>20px</option>
        <option>10px 5px</option>
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
        <option />
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
        <option />
        <option>100px</option>
        <option>200px</option>
        <option>300px</option>
      </VuiSelect>

      <VuiSwitch v-model="flex.center">
        center
      </VuiSwitch>

      <VuiSwitch v-model="flex.wrap">
        wrap
      </VuiSwitch>
    </VuiFlex>

    <VuiFlex
      :direction="flex.direction"

      :gap="flex.gap"
      :margin="flex.margin"
      :padding="flex.padding"
      :width="flex.width"
      :height="flex.height"

      :center="flex.center"
      :wrap="flex.wrap"

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

      :gap="flex.gap"
      :margin="flex.margin"
      :padding="flex.padding"
      :width="flex.width"
      :height="flex.height"

      :center="flex.center"
      :wrap="flex.wrap"

      class="flex-demo-bg"
    >
      <div class="flex-demo-border">
        div
      </div>
      <VuiButton class="flex-demo-border">
        button
      </VuiButton>
      <div
        class="vui-flex-auto flex-demo-border"
      >
        vui-flex-auto
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

    gap: '5px',
    margin: '',
    padding: '',
    width: '400px',
    height: '300px',

    center: false,
    wrap: false
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
