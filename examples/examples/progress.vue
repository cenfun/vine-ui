<template>
  <VuiFlex
    gap="10px"
    wrap
  >
    <VuiProgress />
    <VuiProgress percentage="100%" />
    <VuiProgress
      percentage="50"
      height="10px"
      width="200px"
    />

    <VuiProgress
      percentage="10"
      color="firebrick"
      border-color="darkred"
    />
    <VuiProgress
      percentage="80"
      color="green"
      border-color="darkgreen"
      tooltip="This is progress tooltip"
    />
  </VuiFlex>
</template>

<script setup>
import { VuiProgress, VuiFlex } from '../vine-ui.js';

</script>
