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

    <VuiButton @click.native="toggleFlyover()">
      Toggle
    </VuiButton>

    <VuiButton @click.native="showFlyover(true)">
      Show
    </VuiButton>

    <VuiButton @click.native="showFlyover(false)">
      Hide
    </VuiButton>

    <VuiButton @click.native="destroyFlyover()">
      Destroy
    </VuiButton>

    <div
      v-if="flyover.position==='right'"
      class="vui-flex-empty"
    />
  </VuiFlex>
</template>

<script setup>
import { reactive } from 'vue';

import VineUI from 'vine-ui';
const {
    VuiButton,
    VuiFlex,
    VuiFlyover,
    VuiSelect
} = VineUI;

const flyover = reactive({
    width: '30%',
    position: 'right',
    visible: false
});


const createFlyover = () => {
    return VuiFlyover.createComponent(flyover, (h) => {
        return {
            default: () => h('div', {
                style: 'padding:10px;'
            }, h(VuiButton, {
                label: 'Close',
                onClick() {
                    flyover.visible = false;
                }
            }))
        };
    });
};

let instance;
const showFlyover = (v) => {
    if (!instance) {
        instance = createFlyover();
    }
    flyover.visible = v;
};

const toggleFlyover = () => {
    let v = !flyover.visible;
    if (!instance) {
        v = true;
    }
    showFlyover(v);
};

const destroyFlyover = () => {
    if (instance) {
        instance.unmount();
        instance = null;
    }
    flyover.visible = false;
};

</script>
