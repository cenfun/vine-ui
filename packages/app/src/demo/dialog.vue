<template>
  <VuiFlex spacing="10px">
    <VuiButton @click="openDialog()">
      createComponent Dialog
    </VuiButton>

    <VuiButton @click="state.dialogVisible=!state.dialogVisible">
      Dialog v-model
    </VuiButton>

    <VuiDialog
      v-model="state.dialogVisible"
      :fast-close="false"
      class="vui-dialog-custom-model"
    >
      <VuiFlex
        direction="column"
        spacing="0"
      >
        <p>Do you want to remove all?</p>
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
            return {
                default: () => {
                    return h(VuiFlex, {
                        spacing: '10px',
                        padding: '10px 0'
                    }, {
                        default: () => {
                            return [h(VuiButton, {
                                label: 'Save',
                                primary: true,
                                width: 80,
                                onclick: () => {
                                    console.log('saved');
                                    dialog.unmount();
                                }
                            }), h(VuiButton, {
                                label: 'Close',
                                width: 80,
                                onclick: () => {
                                    dialog.unmount();
                                }
                            })];
                        }
                    });
                }
            };
        }
    });
};

</script>
<style lang="scss">
.vui-dialog-custom-create {
    .vui-dialog-message {
        padding: 10px;
    }
}

</style>
