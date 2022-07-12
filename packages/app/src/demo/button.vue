<template>
  <VuiFlex spacing="5px">
    <VuiButton label="Label" />

    <VuiButton :label="'Props ' + text" />

    <VuiButton>
      <b>Slot</b> {{ text }}
    </VuiButton>

    <VuiButton disabled>
      Disabled
    </VuiButton>

    <VuiButton
      primary
      tooltip="This is Button tooltip"
    >
      Button Primary
    </VuiButton>
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
const {
    VuiButton,
    VuiFlex
} = components;

const text = 'Text';

</script>
