<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <div class="vui-example-subtitle">
      Flat options (no groups)
    </div>
    <VuiMultiSelect
      v-model="data.selected"
      label="Languages"
      :options="data.flatOptions"
    />

    <div class="vui-example-subtitle">
      Grouped options
    </div>
    <VuiMultiSelect
      v-model="data.selected"
      label="Frameworks"
      :options="data.groupedOptions"
    />

    <div class="vui-example-subtitle">
      With search (flat)
    </div>
    <VuiMultiSelect
      v-model="data.selected"
      label="Search languages"
      :options="data.flatOptions"
      searchable
      placeholder="Type to search..."
    />

    <div class="vui-example-subtitle">
      Custom width (300px)
    </div>
    <VuiMultiSelect
      v-model="data.selected"
      label="Frameworks"
      :options="data.groupedOptions"
      style="width: 300px"
    />

    <div class="vui-example-subtitle">
      With search (grouped)
    </div>
    <VuiMultiSelect
      v-model="data.selected"
      label="Search frameworks"
      :options="data.groupedOptions"
      searchable
      placeholder="Type to search..."
    />

    <div>
      Selected values: {{ data.selected?.join(', ') || '(none)' }}
    </div>
  </VuiFlex>
</template>

<script setup>
import { reactive } from 'vue';
import { VuiMultiSelect, VuiFlex } from '../vine-ui.js';

const data = reactive({
    selected: ['vue', 'react'],
    flatOptions: [
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
            label: 'Go', value: 'go'
        },
        {
            label: 'Rust', value: 'rust'
        }
    ],
    groupedOptions: [
        {
            label: 'Frontend',
            options: [
                {
                    label: 'Vue', value: 'vue'
                },
                {
                    label: 'React', value: 'react'
                },
                {
                    label: 'Angular', value: 'angular'
                },
                {
                    label: 'Svelte', value: 'svelte'
                }
            ]
        },
        {
            label: 'Backend',
            options: [
                {
                    label: 'Node.js', value: 'node'
                },
                {
                    label: 'Python', value: 'python'
                },
                {
                    label: 'Go', value: 'go'
                },
                {
                    label: 'Rust', value: 'rust'
                }
            ]
        },
        {
            label: 'Database',
            options: [
                {
                    label: 'PostgreSQL', value: 'postgres'
                },
                {
                    label: 'MySQL', value: 'mysql'
                },
                {
                    label: 'MongoDB', value: 'mongodb'
                },
                {
                    label: 'Redis', value: 'redis'
                }
            ]
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
