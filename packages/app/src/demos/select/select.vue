<template>
  <div>
    <VuiFlex
      gap="10px"
      padding="5px"
    >
      <VuiSwitch v-model="data.visible">
        v-show
      </VuiSwitch>
    </VuiFlex>
    <div v-show="data.visible">
      <VuiFlex
        gap="10px"
        padding="5px"
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
          @remove="onSelectRemove"
        >
          <option value="">
            empty value
          </option>
          <option>option 1</option>
          <option>option 2</option>
          <option value="3">
            option 3
          </option>
          <option><b>bold</b> text</option>
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

        <VuiSelect
          v-model="data.value"
          label="last l:"
        >
          <option value="">
            Symbol
          </option>
          <option>WC</option>
        </VuiSelect>
      </VuiFlex>

      <VuiFlex
        gap="10px"
        padding="5px"
        wrap
      >
        <VuiSelect
          v-model="data.value"
          :options="data.list"
        />
        <VuiSelect
          v-model="data.value"
          label="width 200:"
          width="200px"
          :options="data.list"
        />
        <VuiSelect
          v-model="data.value"
          label="width auto:"
          width="auto"
          :options="data.list"
        />

        <div class="vui-flex-empty" />

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
        padding="5px"
        wrap
      >
        <VuiSelect
          v-model="data.value"
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
          v-model="data.value"
          label="right:"
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
        padding="5px"
        wrap
      >
        <VuiSelect
          v-model="data.value"
          label="input:"
          :options="data.results"
          :searchable="true"
          @search="onSelectSearch"
          @remove="onSelectRemove"
        />
        <VuiSelect
          v-model="data.value"
          label="width 100:"
          width="100px"
          :options="data.results"
          :searchable="true"
          :select-on-focus="false"
          tooltip="select-on-focus=false and no @search event"
          @remove="onSelectRemove"
        />
      </VuiFlex>
    </div>
  </div>
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
    }, 'Label', 'Symbol'],
    list: [
        '',
        'DEV',
        'QA',
        'STG',
        'LOCAL',
        'Symbol'
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
