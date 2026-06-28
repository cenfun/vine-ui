<template>
  <VuiFlex
    gap="10px"
    padding="5px"
    class="vui-example-dialog"
  >
    <VuiButton
      primary
      @click="data.visible=true"
    >
      Open Dialog
    </VuiButton>

    <VuiDialog
      v-model="data.visible"
      :fast-close="false"
      class="vui-dialog-custom-model"
    >
      <VuiFlex
        direction="column"
        gap="0"
      >
        <p>Do you want to remove all?</p>
        <div>
          <VuiFlex gap="10px">
            <VuiButton
              primary
              width="80px"
              @click="onOkClick"
            >
              Ok
            </VuiButton>
            <VuiButton
              width="80px"
              @click="data.visible=false"
            >
              Cancel
            </VuiButton>
          </VuiFlex>
        </div>
      </VuiFlex>
    </VuiDialog>
  </VuiFlex>
</template>
<script setup>
import { reactive } from 'vue';
import {
    VuiButton, VuiFlex, VuiDialog
} from '../vine-ui.js';

const data = reactive({
    visible: false
});

const onOkClick = () => {
    console.log('ok');
    data.visible = false;
};

</script>
<style>
/*
  test dialog position: fixed;
*/
.vui-example-dialog {
    position: relative;
    overflow: hidden;
}
</style>
