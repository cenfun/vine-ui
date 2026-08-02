<template>
  <div>
    <VuiFlex
      gap="10px"
      padding="5px"
      wrap
    >
      <div>radioName1</div>

      <VuiSelect v-model="radioValue1">
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </VuiSelect>

      <VuiRadio
        v-model="radioValue1"
        name="radioName1"
        value="1"
        label="Radio"
      />

      <VuiRadio
        v-model="radioValue1"
        name="radioName1"
        value="2"
      >
        model checked
      </VuiRadio>

      <VuiRadio
        v-model="radioValue1"
        name="radioName1"
        value="3"
      />
    </VuiFlex>

    <VuiFlex
      gap="10px"
      padding="5px"
      wrap
    >
      <div>radioName2</div>

      <VuiSelect v-model="radioValue2">
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </VuiSelect>

      <VuiRadio
        v-model="radioValue2"
        disabled
        name="radioName2"
        value="1"
      >
        <b>Disabled</b> {{ radioValue2 }}
      </VuiRadio>

      <VuiRadio
        v-model="radioValue2"
        name="radioName2"
        value="2"
        :label="'Props ' + radioValue2"
      />

      <VuiRadio
        v-model="radioValue2"
        value="3"
        name="radioName2"
      >
        this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long! this label is long!
      </VuiRadio>
    </VuiFlex>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
    VuiRadio, VuiFlex, VuiSelect
} from '../vine-ui.js';

const radioValue1 = ref('');
const radioValue2 = ref('');
</script>
