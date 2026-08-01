<template>
  <div
    v-if="data.example"
    class="vui-example-list"
  >
    <div
      v-if="data.props"
      class="vui-example-item vui-example-props"
    >
      <div class="vui-example-title">
        {{ data.example.componentName }}
      </div>
      <table class="vui-example-table">
        <thead>
          <tr>
            <th>Props</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, key) in data.props"
            :key="key"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.type && item.type.name }}</td>
            <td>{{ item.defaultValue.value }}</td>
            <td>{{ getPropDescription(item) }}</td>
          </tr>
          <template v-if="data.events">
            <tr>
              <th colspan="4">
                Events
              </th>
            </tr>
            <tr
              v-for="(item, key) in data.events"
              :key="key"
            >
              <td>
                @{{ item.name }}
              </td>
              <td colspan="2" />
              <td />
            </tr>
          </template>
          <template v-if="data.slots">
            <tr>
              <th colspan="4">
                Slots
              </th>
            </tr>
            <tr
              v-for="(item, key) in data.slots"
              :key="key"
            >
              <td>
                {{ item.name }}
              </td>
              <td colspan="2" />
              <td />
            </tr>
          </template>
          <template v-if="data.expose">
            <tr>
              <th colspan="4">
                Expose
              </th>
            </tr>
            <tr
              v-for="(item, key) in data.expose"
              :key="key"
            >
              <td>
                {{ item.name }}
              </td>
              <td colspan="2" />
              <td />
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      v-for="(item,i ) in data.example.list"
      :key="i"
      class="vui-example-item"
    >
      <div class="vui-example-title">
        {{ getExampleTitle(item) }} <span>{{ item.path }}</span>
      </div>
      <component :is="item.component" />
      <div
        class="vui-example-source"
        :path="item.path"
      />
    </div>
  </div>
</template>
<script setup>
import { isList } from '../vine-ui/utils/util.js';
import {
    onMounted, watch, shallowReactive
} from 'vue';
import { useRoute } from 'vue-router';

import Editor from './utils/editor.js';

import examples from './examples.js';

import metadata from '../../.temp/metadata.json';

const route = useRoute();
watch(() => route.path, (v) => {
    update();
});

const data = shallowReactive({
    example: null
});

const getPropDescription = (item) => {
    const vs = item.values;
    if (vs) {
        return vs;
    }
    return item.description;
};

const getExampleTitle = (item) => {
    const list = item.path.split('/');
    const title = list.pop().slice(0, -4).split('-').join(' ');
    return `Example ${title}`;
};

const update = () => {
    const item = examples.find((it) => it.path === route.path);
    // console.log(item);
    data.example = item;

    const info = metadata[item.key];

    // console.log(info);

    data.props = info.props;

    const events = info.events;
    data.events = isList(events) ? events : null;

    data.slots = info.slots;

    data.expose = info.expose;

    data.source = info.source;

    setTimeout(() => {
        sourceHandler(item.list);
    });

};

const sourceHandler = (list) => {

    list.forEach((item) => {

        const container = document.querySelector(`.vui-example-source[path="${item.path}"]`);
        // console.log(container);

        if (!container) {
            return;
        }

        container.innerHTML = '';

        if (!data.source) {
            return;
        }

        const content = data.source[item.path];

        if (!content) {
            return;
        }

        Editor({
            container,
            content
        });

    });
};

onMounted(() => {
    update();
});

</script>
<style lang="scss">
.vui-example-list {
    padding-bottom: 10px;
}

.vui-example-item {
    margin-top: 15px;
    padding-bottom: 10px;

    &:not(:last-child) {
        border-bottom: 1px solid #ccc;
    }
}

.vui-example-props {
    margin-top: 5px;
}

.vui-example-title {
    padding-bottom: 10px;
    color: #000;
    font-weight: bold;
    font-size: 20px;

    span {
        color: #666;
        font-weight: normal;
        font-size: 14px;
    }
}

.vui-example-table {
    min-width: 600px;
    border-collapse: collapse;

    tr:hover {
        background-color: #f8f8f8;
    }

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

.vui-example-source {
    margin-top: 10px;

    .cm-editor {
        min-width: 600px;
        max-width: 1200px;
        max-height: 350px;
    }

    .cm-scroller {
        overflow: auto;
    }
}

</style>
