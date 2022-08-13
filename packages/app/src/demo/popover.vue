<template>
  <div class="vui-popover-example">
    <VuiFlex spacing="20px">
      <VuiButton @click.native="openPopover">
        Open Popover
      </VuiButton>
      <VuiButton @click.native="openPopover">
        Open Popover
      </VuiButton>
      <div class="vui-flex-empty" />
      <VuiButton @click.native="openPopover">
        Open Popover
      </VuiButton>
      <VuiButton @click.native="openPopover">
        Open Popover
      </VuiButton>
    </VuiFlex>

    <VuiFlex spacing="10px">
      <div>12 positions:</div>
      <div style="position: relative; width: 520px; height: 360px; border: 1px solid #999;">
        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="bottom-right"
          :target="{left:10,top:10}"
          :width="100"
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
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
          :border-color="borderColor"
          :bg-color="bgColor"
        >
          right-bottom
        </VuiPopover>
      </div>

      <VuiSelect
        v-model="borderColor"
        label="border color:"
      >
        <option />
        <option>gray</option>
        <option>green</option>
        <option>red</option>
        <option>#000</option>
      </VuiSelect>

      <VuiSelect
        v-model="bgColor"
        label="bg color:"
      >
        <option />
        <option>gray</option>
        <option>green</option>
        <option>red</option>
      </VuiSelect>
    </VuiFlex>
  </div>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiButton,
    VuiCheckbox,
    VuiFlex,
    VuiPopover,
    VuiSelect
} = VineUI;

const borderColor = ref('');
const bgColor = ref('');

const openPopover = function(e) {
    VuiPopover.createComponent({
        target: e.target,
        title: 'Popover Title',
        borderColor: borderColor.value,
        bgColor: bgColor.value
    }, (h) => {
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
    });
};

</script>
<style>
.vui-popover-example > *:first-child {
    margin-bottom: 10px;
}

.vui-popover-example .vui-popover-content {
    text-align: center;
}

</style>
