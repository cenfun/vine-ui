<template>
  <VuiFlex spacing="10px">
    <VuiButton @click="openModal()">
      Open Modal
    </VuiButton>
    <VuiButton @click="openModal(true)">
      Open Modal Scrollbar
    </VuiButton>

    <VuiButton @click="state.modalVisible=!state.modalVisible">
      Open Modal Visible
    </VuiButton>

    <VuiModal
      v-model="state.modalVisible"
      title="Modal Visible"
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

const openModal = (scroll) => {
    VuiModal.createComponent({
        title: 'Modal Title'
    }, (h) => {

        const list = [h(VuiCheckbox, {
            label: 'Modal Checkbox'
        }), h(VuiButton, {
            label: 'Modal Button'
        })];

        if (scroll) {
            list.push(h('div', {
                style: 'width:1000px; height: 1000px; background:#f5f5f5'
            }));
        }

        return {
            default: () => {
                return list;
            }
        };
    });
};

</script>
