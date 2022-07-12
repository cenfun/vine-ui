<template>
  <VuiFlex spacing="5px">
    <VuiButton label="Label" />

    <VuiButton :label="'Props ' + inputText" />

    <VuiButton>
      Slot {{ inputText }}
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

const inputText = 'Input Text';

</script>
