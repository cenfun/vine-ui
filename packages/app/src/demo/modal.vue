<template>
  <VuiFlex spacing="10px">
    <VuiButton @click="openModal()">
      Open Modal
    </VuiButton>

    <VuiButton @click="openModalScrollbar('Modal With Scrollbar')">
      With Scrollbar
    </VuiButton>

    <VuiButton @click="openModalScrollbar()">
      Without Title
    </VuiButton>

    <VuiButton @click="state.modalVisible=!state.modalVisible">
      Open Modal Visible
    </VuiButton>

    <VuiModal
      v-model="state.modalVisible"
      title="Modal Visible"
      :close-button="false"
    >
      <VuiButton @click="state.modalVisible=false">
        CLose
      </VuiButton>
    </VuiModal>
  </VuiFlex>
</template>

<script setup>
import VineUI from 'vine-ui';
import { reactive } from 'vue';
const {
    VuiButton,
    VuiCheckbox,
    VuiFlex,
    VuiModal
} = VineUI;

const state = reactive({
    modalVisible: false
});

const openModal = () => {
    const modal = VuiModal.createComponent({
        props: {
            title: 'Modal Title'
        },
        slots: (h) => {

            const list = [h(VuiCheckbox, {
                label: 'Modal Checkbox'
            }), h(VuiButton, {
                label: 'CLose',
                onClick: () => {
                    modal.unmount();
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

const openModalScrollbar = (title) => {
    VuiModal.createComponent({
        props: {
            title,
            closeOnClickOut: false
        },
        slots: (h) => {

            const list = [h('div', {
                style: 'width:1000px; height: 1000px; background:#f5f5f5'
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
