<template>
  <VuiFlex spacing="10px">
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
import { components } from 'vine-ui';
const {
    VuiCheckbox,
    VuiFlex
} = components;

const checkboxChecked = ref(true);
const onChange = (e) => {
    checkboxChecked.value = e.target.checked;
};

</script>
