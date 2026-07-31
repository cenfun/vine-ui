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
      <VuiButton @click="showMultiple">
        Multiple toasts
      </VuiButton>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
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
