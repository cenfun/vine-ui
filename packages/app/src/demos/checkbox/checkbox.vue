<template>
  <VuiFlex gap="10px">
    <VuiCheckbox>
      Checkbox
    </VuiCheckbox>

    <VuiCheckbox
      :checked="checkboxChecked"
      @change="onChange"
    >
      checked {{ checkboxChecked }}
    </VuiCheckbox>

    <VuiCheckbox v-model="checkboxChecked">
      v-model
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
import VineUI from 'vine-ui';
const {
    VuiCheckbox,
    VuiFlex
} = VineUI;

const checkboxChecked = ref(true);
const onChange = (e) => {
    checkboxChecked.value = e.target.checked;
};

</script>
