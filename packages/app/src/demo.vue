<template>
  <div
    v-if="data.demo"
    class="vui-demo-list"
  >
    <div
      v-if="data.props"
      class="vui-demo-item vui-demo-props"
    >
      <div class="vui-demo-title">
        {{ data.demo.componentName }}
      </div>
      <table class="vui-demo-table">
        <tr>
          <th>Props</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
        <tr
          v-for="(item, key) in data.props"
          :key="key"
        >
          <td>{{ getPropKey(item) }}</td>
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
      </table>
    </div>
    <div
      v-for="(item,i ) in data.demo.list"
      :key="i"
      class="vui-demo-item"
    >
      <div class="vui-demo-title">
        Demo <span>{{ item.path }}</span>
      </div>
      <component :is="item.component" />
      <div
        class="vui-demo-source"
        :path="item.path"
      />
    </div>
  </div>
</template>
<script setup>
import { isList } from 'vine-ui/src/utils/util';
import {
    onMounted, watch, shallowReactive
} from 'vue';
import { useRoute } from 'vue-router';

import Editor from './utils/editor.js';

import demos from './demos.js';

import metadata from './metadata.json';

const route = useRoute();
watch(() => route.path, (v) => {
    update();
});

const data = shallowReactive({
    demo: null
});

let previousName;
const getPropKey = (item) => {
    const name = item.name;
    if (name === 'modelValue') {
        return `v-model (${previousName})`;
    }
    previousName = name;
    return name;
};

const getPropDescription = (item) => {
    const vs = item.values;
    if (vs) {
        return vs;
    }
    return item.description;
};

const update = () => {
    const item = demos.find((it) => it.path === route.path);
    // console.log(item);
    data.demo = item;

    const info = metadata[item.key];

    // console.log(info);

    data.props = info.props;

    let events = info.events;
    if (events) {
        events = events.filter((it) => it.name !== 'update:modelValue');
    }
    data.events = isList(events) ? events : null;

    data.slots = info.slots;

    data.expose = info.expose;

    data.source = info.source;

    setTimeout(() => {
        sourceHandler(item.list);
    });

};

// const setEditorContent = (content) => {
//     const text = editor.state.doc.toString();
//     const transaction = editor.state.update({
//         changes: {
//             from: 0,
//             to: text.length,
//             insert: content
//         }
//     });

//     editor.dispatch(transaction);
// };

const sourceHandler = (list) => {

    list.forEach((item) => {

        const container = document.querySelector(`.vui-demo-source[path="${item.path}"]`);
        // console.log(container);

        container.innerHTML = '';

        const content = data.source[item.path];

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
.vui-demo-item {
    margin-top: 15px;
    padding-bottom: 10px;

    &:not(:last-child) {
        border-bottom: 1px solid #ccc;
    }
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
        color: #666;
        font-weight: normal;
        font-size: 14px;
    }
}

.vui-demo-table {
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

.vui-demo-source {
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
