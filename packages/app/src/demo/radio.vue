<template>
  <VuiFlex spacing="10px">
    <VuiRadio
      v-model="radioValue"
      name="radioName1"
      value="1"
    >
      Radio
    </VuiRadio>

    <VuiRadio
      name="radioName1"
      value="2"
      checked
    >
      no model checked
    </VuiRadio>

    <VuiRadio
      v-model="radioValue"
      name="radioName1"
      value="3"
    />

    <VuiRadio
      v-model="radioValue"
      disabled
      name="radioName2"
      value="1"
    >
      Disabled {{ radioValue }}
    </VuiRadio>

    <VuiRadio
      v-model="radioValue"
      name="radioName2"
      value="2"
      :label="'Props ' + radioValue"
    />

    <VuiRadio
      v-model="radioValue"
      value="3"
      name="radioName2"
    >
      this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long!
    </VuiRadio>
  </VuiFlex>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiRadio,
    VuiFlex
} = VineUI;

const radioValue = ref('');

</script>
