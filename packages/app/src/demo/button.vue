<template>
  <VuiFlex spacing="10px">
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
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
import { ref } from 'vue';
const {
    VuiButton,
    VuiFlex
} = components;

const count = ref(0);

const onClick = (v, e) => {
    count.value += v;
};

</script>
