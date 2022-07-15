<template>
  <VuiFlex spacing="10px">
    <VuiInput
      v-model="inputText"
      label="Name:"
    />

    <VuiInput
      v-model="inputText"
      placeholder="no label"
      width="150px"
    />

    <VuiInput disabled>
      Disabled {{ inputText }}:
    </VuiInput>

    <VuiInput
      type="number"
      step="10"
    >
      Number:
    </VuiInput>

    <VuiInput
      :label="inputText"
      placeholder="label"
    />
  </VuiFlex>
</template>

<script setup>
import { ref } from 'vue';
import { components } from 'vine-ui';
const {
    VuiInput,
    VuiFlex
} = components;

const inputText = ref('Text');

</script>
