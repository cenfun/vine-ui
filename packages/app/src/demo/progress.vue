<template>
  <VuiFlex spacing="10px">
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
    />
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
const {
    VuiProgress,
    VuiFlex
} = components;

</script>
