<template>
  <VuiFlex spacing="10px">
    <VuiButton @click.native="openModal()">
      Open Modal
    </VuiButton>
    <VuiButton @click.native="openModal(true)">
      Open Modal Scrollbar
    </VuiButton>
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
const {
    VuiButton,
    VuiCheckbox,
    VuiFlex,
    VuiModal
} = components;

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
