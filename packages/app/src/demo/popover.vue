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
      <div style="background: #f5f5f5; margin-top: 10px;">
        <div class="vui-popup-arrow-example" />
      </div>

      <div style="position: relative; width: 520px; height: 360px; border: 1px solid #ccc; margin-top: 10px;">
        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="bottom-right"
          :target="{left:20,top:10}"
          :width="100"
        >
          bottom-right {{ inputText }}
        </VuiPopover>
        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="bottom-center"
          :target="{left:260,top:10}"
          :width="100"
        >
          bottom-center
        </VuiPopover>
        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="bottom-left"
          :target="{left:500,top:10}"
          :width="100"
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
        >
          left-top
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="top-left"
          :target="{left:500,top:350}"
          :width="100"
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
        >
          top-center
        </VuiPopover>

        <VuiPopover
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="top-right"
          :target="{left:20,top:350}"
          :width="100"
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
        >
          right-bottom
        </VuiPopover>
      </div>
    </VuiFlex>
  </div>
</template>

<script setup>
import { components } from 'vine-ui';
const {
    VuiButton,
    VuiCheckbox,
    VuiFlex,
    VuiPopover
} = components;

const inputText = 'Text';

const openPopover = function(e) {
    VuiPopover.createComponent({
        target: e.target,
        title: 'Popover Title'
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
.vui-popover-example .vui-popover-content {
    text-align: center;
}

.vui-popup-arrow-example {
    width: 54px;
    height: 54px;
    background-repeat: no-repeat;
    background-image: url("../../../vine-ui/src/base/images/popup-arrow.svg");
    background-size: 54px 54px;
}
</style>
