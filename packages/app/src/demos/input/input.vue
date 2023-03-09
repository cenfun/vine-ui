<template>
  <VuiFlex
    gap="10px"
    padding="5px"
  >
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
      v-model="inputNumber"
      class="vui-input-number"
      type="number"
      step="10"
    >
      <b>Number:</b>
    </VuiInput>

    <VuiInput
      :label="inputText"
      placeholder="label"
    />
  </VuiFlex>
</template>

<script setup>
import { ref } from 'vue';
import VineUI from 'vine-ui';
const {
    VuiInput,
    VuiFlex
} = VineUI;

const inputText = ref('Text');
const inputNumber = ref(0);

</script>
