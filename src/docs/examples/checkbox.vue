<template>
  <VuiFlex gap="10px">
    <VuiCheckbox label="Checkbox" />

    <VuiCheckbox
      :checked="checkboxChecked"
      @change="onChange"
    >
      checked {{ checkboxChecked }}
    </VuiCheckbox>

    <VuiCheckbox v-model="checkboxChecked">
      <b>v-model</b>
    </VuiCheckbox>

    <VuiCheckbox
      v-model="checkboxChecked"
      disabled
    >
      Disabled {{ checkboxChecked }}
    </VuiCheckbox>

    <VuiCheckbox />

    <VuiCheckbox :label="'Label ' + checkboxChecked" />

    <VuiCheckbox>
      this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long!
    </VuiCheckbox>
  </VuiFlex>
</template>

<script setup>
import { ref } from 'vue';
import { VuiCheckbox, VuiFlex } from '../vine-ui.js';

const checkboxChecked = ref(true);
const onChange = (checked) => {
    checkboxChecked.value = checked;
};

</script>
