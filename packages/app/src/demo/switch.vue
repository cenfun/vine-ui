<template>
  <VuiFlex spacing="10px">
    <VuiSwitch v-model="switchValue">
      switch:
    </VuiSwitch>
    <VuiSwitch checked>
      checked:
    </VuiSwitch>
    <VuiSwitch
      v-model="switchValue"
      disabled
    >
      disabled:
    </VuiSwitch>

    <VuiSwitch
      colors="darkred, green"
    >
      colors:
    </VuiSwitch>

    <VuiSwitch
      v-model="switchValue"
      width="28px"
      height="16px"
      colors=",green"
    >
      small:
    </VuiSwitch>

    <VuiSwitch
      v-model="switchValue"
      tooltip="This is switch tooltip"
    />

    <VuiSwitch
      width="45px"
      height="24px"
      checked
    >
      large: {{ switchValue }}
    </VuiSwitch>
  </VuiFlex>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiSwitch,
    VuiFlex
} = VineUI;

const switchValue = ref(false);

</script>
