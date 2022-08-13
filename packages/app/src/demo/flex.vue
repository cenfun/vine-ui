<template>
  <VuiFlex spacing="10px">
    <VuiFlex
      spacing="10px"
      direction="column"
    >
      <VuiSelect v-model="flex.direction">
        <option>row</option>
        <option>column</option>
      </VuiSelect>

      <VuiSwitch v-model="flex.center">
        center
      </VuiSwitch>

      <VuiSelect v-model="flex.spacing">
        <option />
        <option>5px</option>
        <option>10px</option>
        <option>15px</option>
        <option>20px</option>
      </VuiSelect>
      <VuiSelect v-model="flex.width">
        <option>100px</option>
        <option>200px</option>
        <option>300px</option>
        <option>30%</option>
      </VuiSelect>
      <VuiSelect v-model="flex.height">
        <option>100px</option>
        <option>200px</option>
        <option>300px</option>
      </VuiSelect>
    </VuiFlex>

    <VuiFlex
      :direction="flex.direction"
      :center="flex.center"
      :spacing="flex.spacing"
      :width="flex.width"
      :height="flex.height"
      style="background: #ccc;"
    >
      <VuiButton>Button</VuiButton>
      <span>span</span>
      <button>Button</button>
      <div>div</div>
    </VuiFlex>

    <VuiFlex
      :direction="flex.direction"
      :center="flex.center"
      :spacing="flex.spacing"
      :width="flex.width"
      :height="flex.height"
      style="background: #ccc;"
    >
      <VuiButton>Button</VuiButton>
      <div
        class="vui-flex-auto"
        style="background: #eee;"
      >
        <span>auto</span>
        <button>Button</button>
      </div>
      <div>div</div>
    </VuiFlex>

    <VuiFlex
      :direction="flex.direction"
      :center="flex.center"
      :spacing="flex.spacing"
      :width="flex.width"
      :height="flex.height"
      style="background: #ccc;"
    >
      <VuiButton>Button</VuiButton>
      <span>span</span>
      <div
        class="vui-flex-empty"
        style="background: #eee;"
      >
        empty
      </div>
      <button>Button</button>
      <div>div</div>
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
    width: '300px',
    height: '200px'
});

</script>
