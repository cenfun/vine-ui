<template>
  <VuiFlex
    gap="10px"
    padding="5px"
    class="vui-demo-dialog"
  >
    <VuiButton @click="data.visible=true">
      open Dialog
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
import VineUI from 'vine-ui';
import { reactive } from 'vue';
const {
    VuiButton,
    VuiFlex,
    VuiDialog
} = VineUI;

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
.vui-demo-dialog {
    position: relative;
    overflow: hidden;
}
</style>
