<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <div class="vui-example-subtitle">
      showToast - different types
    </div>
    <VuiFlex
      gap="10px"
      wrap
    >
      <VuiButton @click="show('success')">
        Success
      </VuiButton>
      <VuiButton @click="show('error')">
        Error
      </VuiButton>
      <VuiButton @click="show('info')">
        Info
      </VuiButton>
    </VuiFlex>

    <div class="vui-example-subtitle">
      showToast - custom content
    </div>
    <VuiFlex
      gap="10px"
      wrap
    >
      <VuiButton @click="showCustom">
        Custom message
      </VuiButton>
      <VuiButton @click="showCustomStyle">
        Custom style
      </VuiButton>
      <VuiButton @click="showHtml">
        HTML content
      </VuiButton>
      <VuiButton @click="showComponent">
        Component content
      </VuiButton>
      <VuiButton @click="showVNode">
        VNode content
      </VuiButton>
      <VuiButton @click="showMultiple">
        Multiple toasts
      </VuiButton>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { defineComponent, h } from 'vue';

import {
    VuiButton, VuiFlex, showToast
} from '../vine-ui.js';

const show = (type) => {
    showToast({
        type,
        content: `This is a ${type} toast message!`
    });
};

const showCustom = () => {
    showToast({
        type: 'info',
        content: 'This is a custom toast message with longer content to demonstrate the toast component.'
    });
};

const showCustomStyle = () => {
    showToast({
        type: 'success',
        icon: 'success',
        iconColor: '#fff',
        iconSize: '24px',
        content: 'Toast with a custom border and background',
        color: '#fff',
        border: '1px solid #67c23a',
        background: 'linear-gradient(90deg, #67c23a, #409eff)'
    });
};

const showHtml = () => {
    showToast({
        type: 'success',
        content: '<strong>HTML content</strong><br><span>Rendered with innerHTML</span>',
        html: true
    });
};

const ToastContent = defineComponent({
    name: 'ToastExampleContent',
    setup() {
        return () => h('div', [
            h('strong', 'Component content'),
            h('div', 'Rendered from a Vue component')
        ]);
    }
});

const showComponent = () => {
    showToast({
        type: 'info',
        content: ToastContent
    });
};

const showVNode = () => {
    showToast({
        type: 'success',
        content: h('div', [
            h('strong', 'VNode content'),
            h('div', 'Created directly with h()')
        ])
    });
};

const showMultiple = () => {
    showToast({
        type: 'success', content: 'First toast'
    });
    showToast({
        type: 'error', content: 'Second toast'
    });
    showToast({
        type: 'info', content: 'Third toast'
    });
};
</script>
<style scoped>
.vui-example-subtitle {
  color: #666;
  font-weight: bold;
  font-size: 13px;
  margin-top: 5px;
}
</style>
