<template>
  <VuiFlex spacing="10px">
    <VuiSwitch v-model="switchValue">
      switch:
    </VuiSwitch>
    <VuiSwitch checked>
      checked:
    </VuiSwitch>
    <VuiSwitch disabled>
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
      width="45px"
      height="24px"
      checked
    >
      large:
    </VuiSwitch>
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
import { ref } from 'vue';
const {
    VuiSwitch,
    VuiFlex
} = components;

const switchValue = ref(false);

</script>
