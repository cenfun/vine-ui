<template>
  <VuiFlex gap="10px">
    <div
      v-if="data.position==='left'"
      class="vui-flex-empty"
    />
    <VuiSelect v-model="data.width">
      <option>30%</option>
      <option>50%</option>
      <option>60%</option>
      <option>100px</option>
    </VuiSelect>

    <VuiSelect v-model="data.position">
      <option>right</option>
      <option>left</option>
    </VuiSelect>

    <VuiButton @click="createFlyover()">
      createComponent
    </VuiButton>

    <VuiButton @click="data.visible=true">
      show
    </VuiButton>

    <VuiButton @click="data.visible=false">
      hide
    </VuiButton>

    <VuiButton @click="destroyFlyover()">
      destroy
    </VuiButton>

    <VuiButton @click="data.modelVisible=!data.modelVisible">
      Flyover v-model
    </VuiButton>

    <div
      v-if="data.position==='right'"
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

const data = reactive({
    width: '30%',
    position: 'right',
    visible: true,

    modelVisible: false
});


let flyover;
const createFlyover = () => {
    destroyFlyover();
    flyover = VuiFlyover.createComponent({
        props: {
            width: data.width,
            position: data.position,
            visible: data.visible,
            onStart: (v) => {
                console.log(`flyover start: ${v}`);
            },
            onEnd: (v) => {
                console.log(`flyover end: ${v}`);
            }
        },
        slots: (h) => {
            return {
                default: () => h('div', {
                    style: 'padding:10px;'
                }, h(VuiButton, {
                    label: 'Close',
                    onClick() {
                        // data.visible = false;
                    }
                }))
            };
        }
    });
};

const destroyFlyover = () => {
    if (flyover) {
        flyover.unmount();
        flyover = null;
    }
};

</script>
