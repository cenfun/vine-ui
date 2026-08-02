<template>
  <VuiFlex
    gap="10px"
    wrap
  >
    <VuiCheckbox label="Checkbox" />

    <VuiCheckbox v-model="checkboxChecked">
      checked {{ checkboxChecked }}
    </VuiCheckbox>

    <VuiCheckbox
      v-model="checkboxChecked"
      disabled
    >
      Disabled {{ checkboxChecked }}
    </VuiCheckbox>

    <VuiCheckbox />

    <VuiCheckbox
      v-model="checkboxChecked"
      :label="'Label ' + checkboxChecked"
    />

    <VuiCheckbox>
      this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long!
    </VuiCheckbox>
  </VuiFlex>
</template>

<script setup>
import { ref } from 'vue';
import { VuiCheckbox, VuiFlex } from '../vine-ui.js';

const checkboxChecked = ref(true);

</script>
