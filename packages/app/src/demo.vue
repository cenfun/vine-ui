<template>
  <div v-if="data.demo">
    <div
      v-if="data.props"
      class="vui-demo-item vui-demo-props"
    >
      <div class="vui-demo-title">
        {{ data.demo.componentName }} Props
      </div>
      <table class="vui-demo-table">
        <tr>
          <th>name</th>
          <th>type</th>
          <th>default</th>
        </tr>
        <tr
          v-for="(item, key) in data.props"
          :key="key"
        >
          <td>{{ getPropKey(item,key) }}</td>
          <td>{{ getPropType(item, key) }}</td>
          <td>{{ getPropDefault(item, key) }}</td>
        </tr>
        <template v-if="data.emits">
          <tr
            v-for="(item, key) in data.emits"
            :key="key"
          >
            <td>@{{ item }}</td>
            <td>[event]</td>
            <td />
          </tr>
        </template>
      </table>
    </div>
    <div
      v-for="(item,i ) in data.demo.list"
      :key="i"
      class="vui-demo-item"
    >
      <div class="vui-demo-title">
        {{ data.demo.componentName }} Demo <span>{{ item.path }}</span>
      </div>
      <component :is="item.component" />
      <div class="vui-demo-source">
        source
      </div>
    </div>
  </div>
</template>
<script setup>
import {
    onMounted, watch, shallowReactive
} from 'vue';
import { useRoute } from 'vue-router';

import components from 'vine-ui';

import demos from './demos.js';
import { isList } from 'vine-ui/src/utils/util';

const route = useRoute();
watch(() => route.path, (v) => {
    update();
});

const data = shallowReactive({
    demo: null,
    props: null,
    emits: null
});

let previousKey;
const getPropKey = (item, key) => {
    if (key === 'modelValue') {
        return `v-model (${previousKey})`;
    }
    previousKey = key;
    return key;
};

const getPropType = (item, key) => {

    let types = item.type;
    if (!(types instanceof Array)) {
        types = [types];
    }

    const list = types.map((t) => {
        if (typeof t === 'undefined') {
            return '[undefined]';
        }
        return t.name;
    });

    return list.join(', ');
};

const getPropDefault = (item, key) => {
    if (typeof item.default === 'undefined') {
        return '[undefined]';
    }
    if (typeof item.default === 'function') {
        return '[function]';
    }

    if (item.default === null) {
        return 'null';
    }
    if (typeof item.default === 'string') {
        return `'${item.default}'`;
    }
    return item.default;
};


const update = () => {
    const item = demos.find((it) => it.path === route.path);
    // console.log(item);

    const component = components[item.componentName];
    // console.log(component);

    const emits = [];
    if (component.emits) {
        component.emits.forEach((t) => {
            if (t !== 'update:modelValue') {
                emits.push(t);
            }
        });
    }

    if (isList(emits)) {
        data.emits = emits;
    } else {
        data.emits = null;
    }

    data.props = component.props;

    data.demo = item;
};

onMounted(() => {
    update();
});

</script>
<style lang="scss">
.vui-demo-item {
    margin-top: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
}

.vui-demo-props {
    margin-top: 5px;
}

.vui-demo-title {
    padding-bottom: 10px;
    color: #000;
    font-weight: bold;
    font-size: 20px;

    span {
        color: gray;
        font-weight: normal;
        font-size: 14px;
    }
}

.vui-demo-table {
    min-width: 500px;
    border-collapse: collapse;

    th {
        white-space: nowrap;
        text-align: left;
        background-color: #f5f5f5;
    }

    td,
    th {
        padding: 8px;
        border: 1px solid #eee;
    }
}

.vui-demo-source {
    margin-top: 10px;
}

</style>
