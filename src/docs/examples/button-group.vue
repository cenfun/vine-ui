<template>
  <VuiFlex
    gap="20px"
    direction="column"
  >
    <VuiFlex
      gap="10px"
      direction="column"
    >
      <div class="example-label">
        Options mode (v-model: index)
      </div>
      <VuiButtonGroup
        v-model="index1"
        :options="options1"
      />
      <div>Selected index: {{ index1 }}</div>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      direction="column"
    >
      <div class="example-label">
        Options mode with bindValue (v-model: value)
      </div>
      <VuiButtonGroup
        v-model="value1"
        :options="options1"
        bind-value
      />
      <div>Selected value: {{ value1 }}</div>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      direction="column"
    >
      <div class="example-label">
        Slot mode
      </div>
      <VuiButtonGroup v-model="index2">
        <div>Item A</div>
        <div>Item B</div>
        <div>Item C</div>
      </VuiButtonGroup>
      <div>Selected index: {{ index2 }}</div>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { ref } from 'vue';
import { VuiButtonGroup, VuiFlex } from '../vine-ui.js';

const index1 = ref(0);
const value1 = ref('left');
const index2 = ref(1);

const options1 = [
    {
        label: 'Left', value: 'left'
    },
    {
        label: 'Center', value: 'center'
    },
    {
        label: 'Right', value: 'right'
    }
];
</script>
