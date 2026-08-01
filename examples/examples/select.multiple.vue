<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <div class="vui-example-subtitle">
      Prop options (multiple)
    </div>
    <VuiSelect
      v-model="data.selected"
      label="Languages:"
      :options="data.options"
      multiple
    />

    <div class="vui-example-subtitle">
      Slot options (multiple)
    </div>
    <VuiSelect
      v-model="data.selected"
      label="Frameworks:"
      multiple
    >
      <option value="vue">
        Vue
      </option>
      <option value="react">
        React
      </option>
      <option value="angular">
        Angular
      </option>
      <option value="svelte">
        Svelte
      </option>
    </VuiSelect>

    <div class="vui-example-subtitle">
      Multiple with index (v-model binds option index)
    </div>
    <VuiSelect
      v-model="data.indexed"
      label="Indexes:"
      :options="data.options"
      multiple
      index
    />

    <div class="vui-example-subtitle">
      Disabled (multiple)
    </div>
    <VuiSelect
      v-model="data.selected"
      label="Disabled:"
      :options="data.options"
      multiple
      disabled
    />

    <div class="vui-example-subtitle">
      Width 300px (multiple)
    </div>
    <VuiSelect
      v-model="data.selected"
      label="Width:"
      :options="data.options"
      width="300px"
      multiple
    />

    <div>
      Selected values: {{ data.selected?.join(', ') || '(none)' }}
    </div>
    <div>
      Selected indexes: {{ data.indexed?.join(', ') || '(none)' }}
    </div>
  </VuiFlex>
</template>
<script setup>
import { reactive } from 'vue';
import { VuiSelect, VuiFlex } from '../vine-ui.js';

const data = reactive({
    selected: ['vue', 'rust'],
    indexed: [1, 3],
    options: [
        {
            label: 'JavaScript', value: 'js'
        },
        {
            label: 'TypeScript', value: 'ts'
        },
        {
            label: 'Python', value: 'python'
        },
        {
            label: 'Vue', value: 'vue'
        },
        {
            label: 'React', value: 'react'
        },
        {
            label: 'Rust', value: 'rust'
        }
    ]
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
