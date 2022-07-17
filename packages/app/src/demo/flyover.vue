<template>
  <VuiFlex spacing="10px">
    <div
      v-if="flyover.position==='left'"
      class="vui-flex-empty"
    />
    <VuiSelect v-model="flyover.width">
      <option>30%</option>
      <option>50%</option>
      <option>60%</option>
      <option>100px</option>
    </VuiSelect>

    <VuiSelect v-model="flyover.position">
      <option>right</option>
      <option>left</option>
    </VuiSelect>

    <VuiButton @click.native="flyover.visible=!flyover.visible">
      Toggle
    </VuiButton>

    <VuiButton @click.native="flyover.visible=true">
      Show
    </VuiButton>

    <VuiButton @click.native="flyover.visible=false">
      Hide
    </VuiButton>

    <div
      v-if="flyover.position==='right'"
      class="vui-flex-empty"
    />
  </VuiFlex>
</template>

<script setup>
import { onMounted, reactive } from 'vue';

import { components } from 'vine-ui';
const {
    VuiButton,
    VuiFlex,
    VuiFlyover,
    VuiSelect
} = components;

const flyover = reactive({
    width: '30%',
    position: 'right',
    visible: false
});

onMounted(() => {
    VuiFlyover.createComponent(flyover, (h) => {
        return {
            default: () => h('div', {
                style: 'padding:10px;'
            }, h(VuiButton, {
                label: 'Close',
                onClick() {
                    flyover.visible = !flyover.visible;
                }
            }))
        };
    });
});

</script>
