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
        Basic slider (drag to scroll)
      </div>
      <VuiSlider
        width="300px"
        height="80px"
      >
        <div class="slider-example-list">
          <div
            v-for="i in 20"
            :key="i"
            class="slider-example-item"
          >
            Item {{ i }}
          </div>
        </div>
      </VuiSlider>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      direction="column"
    >
      <div class="example-label">
        Slider with arrow buttons
      </div>
      <VuiSlider
        button
        width="300px"
        height="80px"
        :step="200"
      >
        <div class="slider-example-list">
          <div
            v-for="i in 20"
            :key="i"
            class="slider-example-item"
          >
            Item {{ i }}
          </div>
        </div>
      </VuiSlider>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      direction="column"
    >
      <div class="example-label">
        Slider with custom width
      </div>
      <VuiSlider
        button
        width="100%"
        height="60px"
      >
        <div class="slider-example-list">
          <div
            v-for="i in 30"
            :key="i"
            class="slider-example-item"
          >
            Item {{ i }}
          </div>
        </div>
      </VuiSlider>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { VuiFlex, VuiSlider } from '../vine-ui.js';
</script>


<style scoped>
.slider-example-list {
    display: flex;
    gap: 8px;
    padding: 8px;
}

.slider-example-item {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 60px;
    color: #333;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #f0f0f0;
    user-select: none;
}
</style>
