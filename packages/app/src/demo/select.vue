<template>
  <VuiFlex
    spacing="10px"
    direction="column"
  >
    <VuiFlex spacing="10px">
      <VuiSelect
        v-model="selectValue"
        label="prop options:"
        :options="selectOptions"
      />

      <VuiSelect label="slot options:">
        <option>option 1</option>
        <option>option 2</option>
        <option value="3">
          option 3
        </option>
        <option><b>bold</b> text</option>
        <option selected>
          One
        </option>
        <option>Two</option>
      </VuiSelect>

      <VuiSelect
        v-model="selectValue"
        disabled
        label="Disabled:"
      >
        <option>option 1</option>
        <option>option 2</option>
        <option>option 3</option>
      </VuiSelect>

      <VuiSelect label="empty list:" />

      <VuiSelect label="empty value:">
        <div />
      </VuiSelect>
    </VuiFlex>

    <VuiFlex spacing="10px">
      <VuiSelect
        v-model="selectValue"
        label="Select:"
        :options="selectList"
      />
      <VuiSelect
        v-model="selectValue"
        label="200 width:"
        width="200px"
        :options="selectList"
      />
      <VuiSelect
        v-model="selectValue"
        label="Disabled:"
        :options="selectList"
        disabled
      />
    </VuiFlex>

    <VuiFlex spacing="10px">
      <VuiSelect
        v-model="selectValue"
        label="max width:"
      >
        <option />
        <option>dddddddddd ddddddddddddddddd ddddddddddddd5</option>
        <option>10ddddd ddddddddddd</option>
        <option>15ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</option>
        <option>20ddddddd ddddddddddd long test long test long test long test long test long test long test</option>
      </VuiSelect>

      <div class="vui-flex-empty" />

      <VuiSelect
        v-model="selectValue"
        label="Right:"
      >
        <option />
        <option>5</option>
        <option>10</option>
        <option>long test long test long test long</option>
        <option>long test long test long test long test long test</option>
      </VuiSelect>
    </VuiFlex>

    <VuiFlex spacing="10px">
      <VuiSelect
        v-model="selectValue"
        label="Input:"
        :options="selectResults"
        :searchable="true"
        @search="onSelectSearch"
        @remove="onSelectRemove"
      />
      <VuiSelect
        v-model="selectValue"
        label="100 width:"
        width="100px"
        :options="selectResults"
        :searchable="true"
        @remove="onSelectRemove"
      />
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
import { reactive, ref } from 'vue';
const {
    VuiSelect,
    VuiFlex
} = components;


const selectValue = ref('STG');

const selectOptions = reactive([{
    label: 'One'
}, {
    label: 'Two'
}, {
    label: 'Three'
}]);

const selectList = reactive([
    '',
    'DEV',
    'QA',
    'STG',
    'LOCAL'
]);

const selectResults = ref([
    '',
    'Short',
    'Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long',
    "I'm a really long string that I'm going to use to test the ellipsis functionality",
    'QA'
]);

const onSelectSearch = (e) => {

    //console.log(e);
    const value = e.target.value;

    const len = Math.ceil(30 * Math.random());
    const results = [];
    let i = 0;
    while (i < len) {
        const ls = [value];
        ls.length = Math.ceil(12 * Math.random());
        const str = ls.join(' Text');
        results.push({
            label: `${i + 1}, ${str}`,
            removable: true
        });
        i++;
    }
    selectResults.value = results;

    //console.log(v);
};

const onSelectRemove = (item, e) => {
    console.log('onSelectRemove', item, e);
};


</script>
