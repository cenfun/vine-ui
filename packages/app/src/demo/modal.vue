<template>
  <VuiButton @click.native="openModal">
    Open Modal
  </VuiButton>
</template>

<script setup>
import { components } from 'vine-ui';
const {
    VuiButton,
    VuiCheckbox,
    VuiModal
} = components;

const openModal = () => {
    VuiModal.createComponent({
        title: 'Modal Title'
    }, (h) => {
        return {
            default: () => {
                return [h(VuiCheckbox, {
                    label: 'Modal Checkbox'
                }), h(VuiButton, {
                    label: 'Modal Button'
                })];
            }
        };
    });
};

</script>
