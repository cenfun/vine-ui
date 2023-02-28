<template>
  <div>
    <div style=" position: relative;height: 80px; margin-top: 5px; border: 1px solid #eee;">
      <VuiLoading
        :size="loading.size"
        :color="loading.color"
        :fast="loading.fast"
        :center="loading.center"
        :visible="loading.visible"
      />
    </div>

    <VuiFlex
      gap="10px"
      padding="5px"
      margin="10px 0 0 0"
    >
      <div>Props:</div>
      <VuiSelect
        v-model="loading.color"
        label="Color"
      >
        <option />
        <option>red</option>
        <option>green</option>
        <option>#666</option>
      </VuiSelect>
      <VuiSelect
        v-model="loading.size"
        label="Size"
      >
        <option />
        <option>s</option>
        <option>m</option>
        <option>l</option>
      </VuiSelect>
      <VuiCheckbox v-model="loading.fast">
        Fast
      </VuiCheckbox>
      <VuiCheckbox v-model="loading.center">
        Center
      </VuiCheckbox>
      <VuiCheckbox v-model="loading.visible">
        Visible
      </VuiCheckbox>
    </VuiFlex>
  </div>
</template>

<script setup>
import VineUI from 'vine-ui';
import { reactive } from 'vue';
const {
    VuiCheckbox,
    VuiFlex,
    VuiLoading,
    VuiSelect
} = VineUI;

const loading = reactive({
    color: '',
    size: 'l',
    fast: false,
    center: true,
    visible: true
});

</script>
