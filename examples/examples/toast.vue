<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <VuiSelect
      v-model="data.timeout"
      label="timeout:"
      :options="data.timeoutOptions"
    />

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
import {
    defineComponent, h, onUnmounted, reactive
} from 'vue';

import {
    VuiButton, VuiFlex, VuiSelect, showToast
} from '../vine-ui.js';

const data = reactive({
    timeout: 2000,
    timeoutOptions: ['', 0, 1000, 2000, 3000, 10000].map((value) => ({
        label: `${value}`,
        value
    }))
});

const toastInstances = new Set();

const openToast = (options) => {
    const toast = showToast({
        ... options,
        timeout: data.timeout
    });
    toastInstances.add(toast);
    return toast;
};

onUnmounted(() => {
    toastInstances.forEach((toast) => {
        toast.unmount();
    });
    toastInstances.clear();
});

const show = (type) => {
    openToast({
        type,
        content: `This is a ${type} toast message!`
    });
};

const showCustom = () => {
    openToast({
        type: 'info',
        content: 'This is a custom toast message with longer content to demonstrate the toast component.'
    });
};

const showCustomStyle = () => {
    openToast({
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
    openToast({
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
    openToast({
        type: 'info',
        content: ToastContent
    });
};

const showVNode = () => {
    openToast({
        type: 'success',
        content: h('div', [
            h('strong', 'VNode content'),
            h('div', 'Created directly with h()')
        ])
    });
};

const showMultiple = () => {
    openToast({
        type: 'success', content: 'First toast'
    });
    openToast({
        type: 'error', content: 'Second toast'
    });
    openToast({
        type: 'info', content: 'Third toast'
    });
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
