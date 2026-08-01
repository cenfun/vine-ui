<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <div class="vui-example-subtitle">
      All icons (default 16px)
    </div>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIcon
        v-for="name in iconNames"
        :key="name"
        :icon="name"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Different sizes
    </div>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIcon
        icon="arrow-right"
        size="12px"
      />
      <VuiIcon
        icon="arrow-right"
        size="16px"
      />
      <VuiIcon
        icon="arrow-right"
        size="24px"
      />
      <VuiIcon
        icon="arrow-right"
        size="32px"
      />
      <VuiIcon
        icon="arrow-right"
        size="48px"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Custom colors
    </div>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIcon
        icon="arrow-down"
        size="24px"
        color="#0a58ca"
      />
      <VuiIcon
        icon="arrow-down"
        size="24px"
        color="#198754"
      />
      <VuiIcon
        icon="arrow-down"
        size="24px"
        color="#dc3545"
      />
      <VuiIcon
        icon="arrow-down"
        size="24px"
        color="#ffc107"
      />
      <VuiIcon
        icon="arrow-down"
        size="24px"
        color="#6f42c1"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Button mode
    </div>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIcon
        icon="arrow-left"
        size="24px"
        button
      />
      <VuiIcon
        icon="arrow-right"
        size="24px"
        button
      />
      <VuiIcon
        icon="arrow-up"
        size="24px"
        button
      />
      <VuiIcon
        icon="arrow-down"
        size="24px"
        button
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Primary button mode
    </div>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIcon
        icon="d-arrow-left"
        size="24px"
        button
        primary
      />
      <VuiIcon
        icon="d-arrow-right"
        size="24px"
        button
        primary
      />
      <VuiIcon
        icon="arrow-left"
        size="24px"
        button
        primary
        color="#dc3545"
      />
      <VuiIcon
        icon="arrow-right"
        size="24px"
        button
        primary
        color="#198754"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Custom width / height
    </div>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIcon
        icon="arrow-right"
        width="40px"
        height="16px"
      />
      <VuiIcon
        icon="arrow-right"
        width="16px"
        height="40px"
      />
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import {
    VuiIcon, VuiFlex, defaultIcons
} from '../vine-ui.js';

const iconNames = Object.keys(defaultIcons);
</script>
<style scoped>
.vui-example-subtitle {
    margin-top: 5px;
    color: #666;
    font-weight: bold;
    font-size: 13px;
}
</style>
