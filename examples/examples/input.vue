<template>
  <VuiFlex
    direction="column"
    gap="10px"
    wrap
  >
    <div class="vui-example-subtitle">
      Basic
    </div>
    <VuiFlex
      gap="10px"
      padding="5px"
      wrap
    >
      <VuiInput
        v-model="inputText"
        label="Name:"
      />

      <VuiInput
        v-model="inputText"
        placeholder="no label"
        width="80px"
      />

      <VuiInput disabled>
        Disabled {{ inputText }}:
      </VuiInput>

      <VuiInput
        v-model="inputNumber"
        class="vui-input-number"
        type="number"
        step="10"
      >
        <b>Number:</b>
      </VuiInput>

      <VuiInput
        :label="inputText"
        placeholder="label"
      />

      <VuiInput
        value="selectOnFocus=false"
        :select-on-focus="false"
        width="150px"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      With icon (left)
    </div>
    <VuiFlex
      gap="10px"
      padding="5px"
      wrap
    >
      <VuiInput
        v-model="inputText"
        icon="search"
        placeholder="Search..."
        width="200px"
      />
      <VuiInput
        v-model="inputText"
        icon="error"
        icon-color="#dc3545"
        placeholder="Error input..."
        width="200px"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      With icon (right)
    </div>
    <VuiFlex
      gap="10px"
      padding="5px"
      wrap
    >
      <VuiInput
        v-model="inputText"
        icon-right="search"
        placeholder="Search..."
        width="200px"
      />
      <VuiInput
        v-model="inputText"
        icon-right="arrow-down"
        placeholder="Select..."
        width="200px"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      With both icons
    </div>
    <VuiFlex
      gap="10px"
      padding="5px"
    >
      <VuiInput
        v-model="inputText"
        icon="search"
        icon-right="arrow-down"
        placeholder="Search..."
        width="250px"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Clickable icons
    </div>
    <VuiFlex
      gap="10px"
      padding="5px"
      wrap
    >
      <VuiInput
        v-model="inputText"
        icon="search"
        icon-clickable
        placeholder="Click search icon..."
        width="200px"
        @icon-click="onIconClick"
      />
      <VuiInput
        v-model="inputText"
        icon-right="arrow-down"
        icon-right-clickable
        placeholder="Click arrow icon..."
        width="200px"
        @icon-click="onIconClick"
      />
    </VuiFlex>

    <div class="vui-example-subtitle">
      Cleanable (click X to clear)
    </div>
    <VuiFlex
      gap="10px"
      padding="5px"
      wrap
    >
      <VuiInput
        v-model="inputText"
        cleanable
        placeholder="Type something..."
        width="200px"
      />
      <VuiInput
        v-model="inputText"
        icon="search"
        cleanable
        placeholder="Search..."
        width="250px"
      />
      <VuiInput
        v-model="inputText"
        icon="search"
        icon-right="arrow-down"
        cleanable
        placeholder="Search..."
        width="280px"
      />
    </VuiFlex>

    <VuiPopover
      v-model="popover.visible"
      :target="popover.target"
      positions="bottom,top"
    >
      <div style="padding: 5px 10px;white-space: nowrap;">
        Icon: <b>{{ popover.iconName }}</b>
      </div>
    </VuiPopover>
  </VuiFlex>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {
    VuiInput, VuiFlex, VuiPopover
} from '../vine-ui.js';

const inputText = ref('Text');
const inputNumber = ref(0);

const popover = reactive({
    visible: false,
    target: null,
    iconName: ''
});


const onIconClick = (e) => {
    popover.iconName = e.currentTarget.getAttribute('name');
    popover.target = e.currentTarget;
    popover.visible = true;
};

</script>
<style scoped>
.vui-example-subtitle {
    margin-top: 5px;
    color: #666;
    font-weight: bold;
    font-size: 13px;
}
</style>
