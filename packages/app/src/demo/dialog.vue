<template>
  <VuiFlex spacing="10px">
    <VuiButton @click="openDialog()">
      Open Dialog
    </VuiButton>

    <VuiButton @click="state.dialogVisible=!state.dialogVisible">
      Open Dialog Visible
    </VuiButton>

    <VuiDialog
      v-model="state.dialogVisible"
      :fast-close="false"
    >
      <VuiFlex
        direction="column"
        spacing="0"
      >
        <h3>Do you want to remove all?</h3>
        <div>
          <VuiFlex spacing="10px">
            <VuiButton
              primary
              width="80px"
              @click="state.dialogVisible=false"
            >
              Ok
            </VuiButton>
            <VuiButton
              width="80px"
              @click="state.dialogVisible=false"
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

const state = reactive({
    dialogVisible: false
});

const openDialog = () => {
    const dialog = VuiDialog.createComponent({
        props: {
            message: 'Do you want to save?'
        },
        slots: (h) => {

            const list = [h(VuiButton, {
                label: 'Save',
                onclick: () => {
                    console.log('saved');
                    dialog.unmount();
                }
            }), h(VuiButton, {
                label: 'Cancel',
                onclick: () => {
                    dialog.unmount();
                }
            })];

            return {
                default: () => {
                    return list;
                }
            };
        }
    });
};

</script>
