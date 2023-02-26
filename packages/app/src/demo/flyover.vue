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

    <VuiButton @click="toggleFlyover()">
      Toggle
    </VuiButton>

    <VuiButton @click="showFlyover(true)">
      Show
    </VuiButton>

    <VuiButton @click="showFlyover(false)">
      Hide
    </VuiButton>

    <VuiButton
      tooltip="Destroy Flyover"
      @click="destroyFlyover()"
    >
      Destroy
    </VuiButton>

    <div
      v-if="flyover.position==='right'"
      class="vui-flex-empty"
    />
  </VuiFlex>
</template>

<script setup>
import { shallowReactive } from 'vue';

import VineUI from 'vine-ui';
const {
    VuiButton,
    VuiFlex,
    VuiFlyover,
    VuiSelect
} = VineUI;

const flyover = shallowReactive({
    width: '30%',
    position: 'right',
    visible: false,
    onStart: (v) => {
        console.log(`flyover start: ${v}`);
    },
    onEnd: (v) => {
        console.log(`flyover end: ${v}`);
    }
});


const createFlyover = () => {
    return VuiFlyover.createComponent({
        props: flyover,
        slots: (h) => {
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
        }
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
