<template>
  <VuiFlex spacing="10px">
    <VuiRadio
      v-model="radioValue"
      name="radioName"
      value="1"
    >
      Radio 1
    </VuiRadio>

    <VuiRadio
      v-model="radioValue"
      name="radioName"
      value="2"
    >
      Radio 2 {{ inputText }}
    </VuiRadio>

    <VuiRadio
      checked
      name="radioDisabledName"
      value="3"
    />

    <VuiRadio
      v-model="radioValue"
      disabled
      name="radioDisabledName"
      value="1"
    >
      Disabled {{ radioValue }}
    </VuiRadio>

    <VuiRadio
      v-model="radioValue"
      checked
      disabled
      name="radioDisabledName"
      value="2"
      :label="'Props ' + radioValue"
    />

    <VuiRadio name="radioDisabledName">
      this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long!
    </VuiRadio>
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
import { ref } from 'vue';
const {
    VuiRadio,
    VuiFlex
} = components;

const inputText = ref('Text');
const radioValue = ref('');

</script>
