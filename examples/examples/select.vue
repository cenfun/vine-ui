<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <VuiSwitch v-model="data.visible">
      v-show
    </VuiSwitch>

    <VuiFlex
      v-show="data.visible"
      direction="column"
      gap="10px"
    >
      <VuiFlex
        gap="10px"
        wrap
      >
        <VuiSelect
          v-model="data.value"
          label="slot options auto:"
          width="auto"
        >
          <option value="">
            empty value
          </option>
          <option>option 1</option>
          <option>option </option>
          <option value="3">
            option 3
          </option>
          <option>text</option>
          <option
            label="attr"
            value="attr"
          />
          <option selected>
            One
          </option>
          <option>Two</option>
        </VuiSelect>

        <VuiSelect
          v-model="data.value"
          disabled
          label="disabled:"
        >
          <option>Two</option>
          <option>STG</option>
        </VuiSelect>

        <VuiSelect label="empty list:" />

        <VuiSelect
          v-model="data.value"
          label="null value:"
        >
          <option />
        </VuiSelect>
      </VuiFlex>

      <VuiFlex
        gap="10px"
        wrap
      >
        <VuiSelect
          v-model="data.value"
          label="prop options:"
          :options="data.options"
        />

        <VuiSelect
          v-model="data.value"
          label="disabled:"
          :options="data.list"
          disabled
        />
      </VuiFlex>


      <VuiSelect
        v-model="data.value"
        label="width 100 < auto < 100%:"
        width="auto"
        min-width="100px"
        max-width="100%"
        :options="data.list"
      />

      <VuiSelect
        v-model="data.value"
        label="width 100% < 100%:"
        width="100%"
        max-width="100%"
        :options="data.list"
      />

      <VuiFlex
        gap="10px"
        align="space-between"
        wrap
      >
        <VuiSelect
          v-model="data.value"
          label="width 200:"
          width="200px"
          :options="data.list"
        />

        <VuiSelect
          v-model="data.value"
          label="last l:"
          width="auto"
        >
          <option value="">
            Symbol
          </option>
          <option>WC</option>
        </VuiSelect>


        <VuiSelect
          v-model="data.value"
          width="60px"
          label="right width 60:"
        >
          <option />
          <option>5</option>
          <option>10</option>
          <option>long test long test long test long</option>
          <option>long test long test long test long test long test</option>
        </VuiSelect>
      </VuiFlex>

      <VuiFlex
        gap="10px"
        wrap
        align="space-between"
      >
        <VuiSelect
          v-model="data.value"
          label="width default:"
          :options="data.list"
        />

        <VuiSelect
          v-model="data.value"
          label="item slot"
          :options="data.list"
        >
          <template #item="{item}">
            <VuiFlex gap="5px">
              <VuiIcon icon="d-arrow-right" />
              {{ item.label }}
            </VuiFlex>
          </template>
        </VuiSelect>

        <VuiSelect
          v-model="data.value"
          width="auto"
          max-width="200px"
          label="width auto < 200:"
          :options="data.list"
        />
      </VuiFlex>
    </VuiFlex>
  </VuiFlex>
</template>
<script setup>
import { reactive, watch } from 'vue';
import {
    VuiSelect, VuiFlex, VuiSwitch, VuiIcon
} from '../vine-ui.js';

const visible = sessionStorage.getItem('vui-select-visible');

const data = reactive({
    visible: visible ? visible === 'true' : true,
    value: 'STG',
    options: [{
        label: 'One'
    }, {
        label: 'Two'
    }, {
        label: 'Three'
    }, {
        label: 'null',
        value: null
    }, 'Label', 'Symbol', {
    }],
    list: [
        '',
        'DEV',
        'QA',
        'STG',
        'LOCAL',
        'Symbol',
        'Im going to use to test the ellipsis functionality',
        '中文中文😊😊😊很长的中文很长的中文很长的中文很长的中文很长的中文',
        'Im a really long string that Im going to use to test the ellipsis functionality Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long'
    ],
    results: [
        '',
        'Short',
        'Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long',
        "I'm a really long string that I'm going to use to test the ellipsis functionality",
        'QA'
    ]
});

watch(() => data.visible, (v) => {
    sessionStorage.setItem('vui-select-visible', v);
});

</script>
