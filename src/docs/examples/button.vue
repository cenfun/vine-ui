<template>
  <VuiFlex
    gap="10px"
    padding="5px"
  >
    <VuiButton
      :label="'Label + ' + count"
      @click="onClick(1)"
    />

    <VuiButton @click="onClick(-1)">
      <b>Slot</b> - {{ count }}
    </VuiButton>

    <VuiButton disabled>
      Disabled
    </VuiButton>


    <VuiButton
      primary
      tooltip="This is Button tooltip"
    >
      Primary
    </VuiButton>
    <VuiButton
      primary
      disabled
    >
      Primary Disabled
    </VuiButton>

    <VuiButton width="120px">
      width: 120px Button
    </VuiButton>
  </VuiFlex>
</template>

<script setup>
import { ref } from 'vue';
import { VuiButton, VuiFlex } from '../vine-ui.js';

const count = ref(0);

const onClick = (num) => {
    count.value += num;
};

</script>
