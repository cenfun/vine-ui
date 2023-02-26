<template>
  <div class="vui-popover-example">
    <VuiFlex spacing="20px">
      <VuiButton @click="openPopover">
        Open Popover
      </VuiButton>
      <VuiButton @click="openPopover">
        Open Popover
      </VuiButton>
      <div class="vui-flex-empty" />
      <VuiButton @click="openPopover">
        Open Popover
      </VuiButton>
      <VuiButton @click="openPopover">
        Open Popover
      </VuiButton>
    </VuiFlex>

    <VuiFlex spacing="10px">
      <div>12 positions:</div>
      <div class="vui-popover-positions">
        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="bottom-right"
          :target="{left:10,top:10}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          bottom-right
        </VuiPopover>
        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="bottom-center"
          :target="{left:260,top:10}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          bottom-center
        </VuiPopover>
        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="bottom-left"
          :target="{left:510,top:10}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          bottom-left
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="left-bottom"
          :target="{left:510,top:90}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          left-bottom
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="left-center"
          :target="{left:510,top:180}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          left-center
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="left-top"
          :target="{left:510,top:270}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          left-top
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="top-left"
          :target="{left:510,top:350}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          top-left
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="top-center"
          :target="{left:260,top:350}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          top-center
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="top-right"
          :target="{left:10,top:350}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          top-right
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="right-top"
          :target="{left:10,top:270}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          right-top
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="right-center"
          :target="{left:10,top:180}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          right-center
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="right-bottom"
          :target="{left:10,top:90}"
          :width="100"
          :border-color="state.borderColor"
          :bg-color="state.bgColor"
        >
          right-bottom
        </VuiPopover>
      </div>

      <VuiSelect
        v-model="state.borderColor"
        label="border color:"
      >
        <option />
        <option>gray</option>
        <option>green</option>
        <option>red</option>
        <option>#000</option>
      </VuiSelect>

      <VuiSelect
        v-model="state.bgColor"
        label="bg color:"
      >
        <option />
        <option>gray</option>
        <option>green</option>
        <option>red</option>
      </VuiSelect>
    </VuiFlex>


    <VuiFlex spacing="20px">
      <VuiButton
        class="target1"
        @click="onPopoverVisibleClick1"
      >
        Popover v-modal 1
      </VuiButton>
      <div class="vui-flex-empty" />
      <VuiButton
        class="target2"
        @click="onPopoverVisibleClick2"
      >
        Popover v-modal 2
      </VuiButton>
    </VuiFlex>

    <div class="vui-popover-no-margin">
      <VuiPopover
        v-model="state.popoverVisible1"
        target=".target1"
      >
        Popover v-modal 1
      </VuiPopover>
      <VuiPopover
        v-model="state.popoverVisible2"
        target=".target2"
        title="Popover Title"
      >
        <VuiCheckbox>Popover Checkbox 1</VuiCheckbox>
        <VuiCheckbox>Popover Checkbox 2</VuiCheckbox>
        <VuiCheckbox>Popover Checkbox 3</VuiCheckbox>
      </VuiPopover>
    </div>
  </div>
</template>

<script setup>
import VineUI from 'vine-ui';
import { reactive } from 'vue';
const {
    VuiButton,
    VuiCheckbox,
    VuiFlex,
    VuiPopover,
    VuiSelect
} = VineUI;

const state = reactive({
    borderColor: '',
    bgColor: '',

    popoverVisible1: false,
    popoverVisible2: false
});

let popover;
let popoverTarget;
const openPopover = function(e) {
    if (popover && popoverTarget === e.target) {
        return;
    }

    popoverTarget = e.target;
    popover = VuiPopover.createComponent({
        props: {
            target: popoverTarget,
            title: 'Popover Title',
            borderColor: state.borderColor,
            bgColor: state.bgColor,
            onBeforeClose: () => {
                console.log('before close');
            },
            onClose: () => {
                popover = null;
                popoverTarget = null;
            }
        },
        slots: (h) => {
            return {
                default: () => {
                    return [h(VuiCheckbox, {
                        label: 'Popover Checkbox 1'
                    }), h(VuiCheckbox, {
                        label: 'Popover Checkbox 2'
                    }), h(VuiCheckbox, {
                        label: 'Popover Checkbox 3'
                    })];
                }
            };
        }
    });
};

const onPopoverVisibleClick1 = (e) => {
    state.popoverVisible1 = !state.popoverVisible1;
};

const onPopoverVisibleClick2 = (e) => {
    state.popoverVisible2 = !state.popoverVisible2;
    // openPopover(e);
};

</script>
<style>
.vui-popover-example > *:not(:first-child) {
    margin-top: 10px;
}

.vui-popover-no-margin {
    margin: 0;
}

.vui-popover-example .vui-popover-content {
    text-align: center;
}

.vui-popover-positions {
    position: relative;
    z-index: 0;
    width: 520px;
    height: 360px;
    border: 1px solid #999;
}

</style>
