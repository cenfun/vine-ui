<template>
  <VuiFlex
    direction="column"
    gap="20px"
  >
    <VuiFlex
      gap="10px"
      direction="column"
    >
      <VuiFlex gap="10px">
        <div class="example-label">
          Basic tabs (options as strings)
        </div>
        <VuiSelect v-model="tabAlign">
          <option value="">
            Default (left)
          </option>
          <option value="left">
            Left
          </option>
          <option value="center">
            Center
          </option>
          <option value="right">
            Right
          </option>
        </VuiSelect>
      </VuiFlex>

      <div>
        <VuiTab
          v-model="tab1"
          :options="['Tab A', 'Tab B', 'Tab C']"
          :align="tabAlign"
        >
          <template #left>
            <div>
              Left
            </div>
          </template>
          <template #right>
            <div>
              Right
            </div>
          </template>
        </VuiTab>
        <div class="tab-pane">
          Content for {{ tab1 }}
        </div>
      </div>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      direction="column"
    >
      <div class="example-label">
        Tabs with value and disabled option
      </div>
      <div>
        <VuiTab
          v-model="tab2"
          :options="options2"
          :align="tabAlign"
        />
        <div class="tab-pane">
          Selected value: <b>{{ tab2 }}</b>
        </div>
      </div>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      direction="column"
    >
      <div class="example-label">
        Tabs with custom colors (background, separator, hover, selected)
      </div>
      <div>
        <VuiTab
          v-model="tab3"
          :options="['Red', 'Green', 'Blue']"
          :colors="{ background: '#ccc', separator: '#dc3545', hover: '#f8d7da', selected: '#fff3cd' }"
          :align="tabAlign"
        />
        <div class="tab-pane">
          Selected: {{ ['Red', 'Green', 'Blue'][tab3] }}
        </div>
      </div>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      direction="column"
    >
      <div class="example-label">
        Nested tabs
      </div>
      <div>
        <VuiTab
          v-model="tab4"
          :options="['Outer 1', 'Outer 2']"
          :align="tabAlign"
        />
        <div
          v-if="tab4===0"
          class="tab-pane"
        >
          <VuiTab
            v-model="subTab"
            :options="['Sub A', 'Sub B']"
            :align="tabAlign"
          />
          <div class="tab-pane">
            Sub selected: {{ ['Sub A', 'Sub B'][subTab] }}
          </div>
        </div>
        <div
          v-else-if="tab4===1"
          class="tab-pane"
        >
          Outer 2 content
        </div>
      </div>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { ref } from 'vue';
import {
    VuiFlex, VuiSelect, VuiTab
} from '../vine-ui.js';


const tabAlign = ref('');
const tab1 = ref(0);
const tab2 = ref('option2');
const tab3 = ref(0);
const tab4 = ref(0);
const subTab = ref(0);

const options2 = [
    {
        label: 'Option 1', value: 'option1'
    },
    {
        label: 'Option 2', value: 'option2'
    },
    {
        label: 'Option 3 (disabled)', value: 'option3', disabled: true
    },
    {
        label: 'Option 4', value: 'option4'
    }
];
</script>

<style scoped>
.tab-pane {
    padding: 16px 10px;
    border: 1px solid #ddd;
    border-top: none;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
}
</style>
