<template>
  <VuiFlex spacing="10px">
    <VuiCheckbox>
      Checkbox
    </VuiCheckbox>

    <VuiCheckbox checked>
      Checked {{ inputText }}
    </VuiCheckbox>

    <VuiCheckbox v-model="checkboxChecked">
      Checkbox v-model
    </VuiCheckbox>

    <VuiCheckbox
      v-model="checkboxChecked"
      disabled
    >
      Disabled {{ checkboxChecked }}
    </VuiCheckbox>

    <VuiCheckbox />

    <VuiCheckbox :label="'label '+checkboxChecked" />

    <VuiCheckbox>
      this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long!
    </VuiCheckbox>
  </VuiFlex>
</template>

<script setup>
import { ref } from 'vue';
import { components } from 'vine-ui';
const {
    VuiCheckbox,
    VuiFlex
} = components;

const checkboxChecked = ref(true);
const inputText = 'Input Text';

</script>
