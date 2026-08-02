<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <VuiFlex
      gap="10px"
      wrap
    >
      <VuiSwitch
        v-model="state.value"
        label="switch"
        :label-position="state.labelPosition"
        :label-clickable="state.labelClickable"
      />

      <VuiSwitch
        v-model="state.value"
        :label-position="state.labelPosition"
        :label-clickable="state.labelClickable"
        disabled
      >
        disabled
      </VuiSwitch>

      <VuiSwitch
        colors="darkred, green"
        :label-position="state.labelPosition"
        :label-clickable="state.labelClickable"
      >
        <b>colors</b>
      </VuiSwitch>

      <VuiSwitch
        v-model="state.value"
        :label-position="state.labelPosition"
        :label-clickable="state.labelClickable"
        width="28px"
        height="16px"
        colors=",green"
      >
        small
      </VuiSwitch>

      <VuiSwitch
        v-model="state.value"
        :label-position="state.labelPosition"
        :label-clickable="state.labelClickable"
        tooltip="This is switch tooltip"
      />

      <VuiSwitch
        v-model="state.value"
        :label-position="state.labelPosition"
        :label-clickable="state.labelClickable"
        width="45px"
        height="24px"
      >
        large {{ state.value }}
      </VuiSwitch>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      padding="5px"
    >
      <div>Props:</div>

      <VuiSelect
        v-model="state.labelPosition"
        tooltip="label position"
      >
        <option>left</option>
        <option>right</option>
      </VuiSelect>

      <VuiSwitch
        v-model="state.labelClickable"
        :label-position="state.labelPosition"
        :label-clickable="state.labelClickable"
      >
        label clickable
      </VuiSwitch>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { reactive } from 'vue';
import {
    VuiSwitch, VuiFlex, VuiSelect
} from '../vine-ui.js';

const state = reactive({
    value: false,
    labelPosition: 'left',
    labelClickable: false
});

</script>
