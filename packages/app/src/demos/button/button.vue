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
      Button Primary
    </VuiButton>

    <VuiButton width="120px">
      width: 120px Button
    </VuiButton>
  </VuiFlex>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiButton,
    VuiFlex
} = VineUI;

const count = ref(0);

const onClick = (v, e) => {
    count.value += v;
};

</script>
