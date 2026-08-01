<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <VuiFlex

      direction="column"
      gap="10px"
    >
      <VuiFlex
        gap="10px"
        wrap
        align="center"
      >
        <VuiIconLabel
          icon="arrow-left"
          label="Back"
        />

        <VuiIconLabel
          icon="arrow-right"
          label="Forward"
          button
          @click="onClick"
        />

        <VuiIconLabel
          icon="arrow-down"
          size="20px"
          color="#0a58ca"
          label="Download"
          button
        />
      </VuiFlex>

      <VuiFlex
        gap="10px"
        wrap
        align="center"
      >
        <VuiIconLabel
          icon="arrow-left"
          size="23px"
          button
          primary
        />

        <VuiIconLabel
          icon="arrow-right"
          size="23px"
          button
          primary
        />

        <VuiIconLabel
          icon="arrow-up"
          size="28px"
          button
          color="#dc3545"
        />

        <VuiIconLabel
          icon="arrow-down"
          size="28px"
          button
          color="#198754"
        />
      </VuiFlex>

      <VuiFlex
        gap="10px"
        wrap
        align="center"
      >
        <VuiIconLabel
          icon="arrow-left"
          label="With slot"
          button
        >
          <b>bold text</b>
        </VuiIconLabel>

        <VuiIconLabel
          icon="arrow-right"
          button
          gap="8px"
        >
          gap 8px
        </VuiIconLabel>

        <VuiIconLabel
          icon="d-arrow-left"
          button
          label="Double"
        />

        <VuiIconLabel
          icon="d-arrow-right"
          button
          label="Double"
        />
      </VuiFlex>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { VuiIconLabel, VuiFlex } from '../vine-ui.js';

const onClick = () => {
    console.log('IconLabel clicked');
};
</script>
