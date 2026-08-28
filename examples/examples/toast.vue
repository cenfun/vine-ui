<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <VuiFlex
      gap="10px"
      wrap
    >
      <VuiSelect
        v-model="data.timeout"
        label="timeout:"
        :options="data.timeoutOptions"
      />
      <VuiSelect
        v-model="data.maxToastCount"
        label="max toast count:"
        :options="data.maxToastCountOptions"
      />
      <VuiSelect
        v-model="data.positionX"
        label="position x:"
        :options="data.positionXOptions"
      />
      <VuiSelect
        v-model="data.positionY"
        label="position y:"
        :options="data.positionYOptions"
      />
      <VuiSelect
        v-model="data.positionGap"
        label="position gap:"
        :options="data.positionGapOptions"
      />
    </VuiFlex>

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
    defineComponent, h, onUnmounted, reactive, watch
} from 'vue';

import {
    VuiButton, VuiFlex, VuiSelect,
    setMaxToastCount, setToastContainerPosition, showToast
} from '../vine-ui.js';

const toOptions = (list) => list.map((value) => ({
    label: `${value}`,
    value
}));

const data = reactive({
    timeout: 2000,
    timeoutOptions: toOptions(['', 0, 1000, 2000, 3000, 10000]),
    maxToastCount: 10,
    maxToastCountOptions: toOptions([10, 5, 3]),
    positionX: 'center',
    positionXOptions: ['left', 'center', 'right'],
    positionY: 'top',
    positionYOptions: ['top', 'center', 'bottom'],
    positionGap: 20,
    positionGapOptions: toOptions([10, 20, 50])
});

watch(() => data.maxToastCount, (count) => {
    setMaxToastCount(count);
});

watch([
    () => data.positionX,
    () => data.positionY,
    () => data.positionGap
], ([x, y, gap]) => {
    setToastContainerPosition(x, y, gap);
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
    setMaxToastCount(10);
    setToastContainerPosition();
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
