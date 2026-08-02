<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <div class="vui-example-subtitle">
      Custom icons via setIcons()
    </div>
    <p>
      Find free icons from <a
        href="https://cenfun.github.io/open-icons/"
        target="_blank"
      >https://cenfun.github.io/open-icons/</a>
    </p>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIcon
        icon="custom-star"
        size="24px"
        color="#ffc107"
      />
      <VuiIcon
        icon="custom-heart"
        size="24px"
        color="#dc3545"
      />
      <VuiIcon
        icon="custom-check"
        size="24px"
        color="#198754"
      />
      <VuiIcon
        icon="custom-close"
        size="24px"
        color="#6c757d"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Mix built-in and custom icons
    </div>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIcon
        icon="arrow-left"
        size="20px"
      />
      <VuiIcon
        icon="custom-star"
        size="20px"
        color="#ffc107"
      />
      <VuiIcon
        icon="arrow-right"
        size="20px"
      />
      <VuiIcon
        icon="custom-heart"
        size="20px"
        color="#dc3545"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Custom icons in IconLabel
    </div>
    <VuiFlex
      gap="10px"
      wrap
      align="center"
    >
      <VuiIconLabel
        icon="custom-star"
        label="Favorite"
        button
        color="#ffc107"
      />
      <VuiIconLabel
        icon="custom-heart"
        label="Like"
        button
        color="#dc3545"
      />
      <VuiIconLabel
        icon="custom-check"
        label="Done"
        button
        color="#198754"
      />
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import {
    VuiIcon, VuiIconLabel, VuiFlex, setIcons
} from '../vine-ui.js';

// Register custom SVG icons
setIcons({
    'custom-star': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    'custom-heart': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    'custom-check': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    'custom-close': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
});
</script>
<style scoped>
.vui-example-subtitle {
    margin-top: 5px;
    color: #666;
    font-weight: bold;
    font-size: 13px;
}
</style>
