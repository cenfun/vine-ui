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
          label="prop options:"
          :options="data.options"
        />

        <VuiSelect
          v-model="data.value"
          label="slot options:"
          width="auto"
          @remove="onSelectRemove"
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
            label="attr removable"
            value="attr"
            removable
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

        <VuiSelect
          v-model="data.value"
          label="disabled:"
          :options="data.list"
          disabled
        />
      </VuiFlex>


      <VuiSelect
        v-model="data.value"
        label="width auto min 100:"
        width="auto"
        min-width="100px"
        :options="data.list"
      />

      <VuiSelect
        v-model="data.value"
        label="width 100%:"
        width="100%"
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
          width="auto"
          max-width="200px"
          label="width auto max 200:"
          :options="data.list"
        />
      </VuiFlex>

      <VuiFlex
        gap="10px"
        wrap
        align="space-between"
      >
        <VuiSelect
          v-model="data.value"
          label="search:"
          :options="data.results"
          :searchable="true"
          @search="onSelectSearch"
          @remove="onSelectRemove"
        />
        <VuiSelect
          v-model="data.value"
          label="search width auto:"
          width="auto"
          max-width="200px"
          :options="data.results"
          :searchable="true"
          :select-on-focus="false"
          tooltip="select-on-focus=false and no @search event"
          @remove="onSelectRemove"
        />
      </VuiFlex>
    </VuiFlex>
  </VuiFlex>
</template>
<script setup>
import VineUI from 'vine-ui';
import { reactive, watch } from 'vue';
const {
    VuiSelect,
    VuiFlex,
    VuiSwitch
} = VineUI;

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

const onSelectSearch = (e) => {

    // console.log(e);
    const value = e.target.value;
    if (!value) {
        return;
    }

    const len = Math.ceil(30 * Math.random());
    const results = [];
    let i = 0;
    while (i < len) {
        const ls = [value];
        ls.length = Math.ceil(12 * Math.random());
        const str = ls.join(' Text');
        results.push({
            // only label
            label: `${i + 1}, ${str}`,
            removable: true
        });
        i++;
    }
    data.results = results;

    // console.log(v);
};

const onSelectRemove = (item) => {
    console.log('onSelectRemove', item);
    const v = item.value;
    data.results = data.results.filter((it) => {
        // no value here
        if (it.label === v) {
            return false;
        }
        return true;
    });
};

</script>
