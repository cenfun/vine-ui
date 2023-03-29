<template>
  <div>
    <VuiFlex
      gap="20px"
      padding="5px"
    >
      <VuiButton @click="openPopover">
        Popover top left
      </VuiButton>

      <div class="vui-flex-auto">
        <VuiFlex
          center
          padding="5px"
        >
          <VuiButton @click="openPopover">
            Popover top center
          </VuiButton>
        </VuiFlex>
      </div>

      <VuiButton @click="openPopover">
        Popover top right
      </VuiButton>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      margin="10px 0"
    >
      <div>12 positions:</div>
      <div class="vui-popover-positions">
        <VuiPopover
          positions="bottom"
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          :target="{left:0,top:0}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          bottom-right
        </VuiPopover>
        <VuiPopover
          positions="bottom"
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          :target="{left:260,top:0}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          bottom-center
        </VuiPopover>
        <VuiPopover
          positions="bottom"
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          :target="{left:510,top:0}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          bottom-left
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="left-bottom"
          :target="{left:510,top:90}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          left-bottom
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="left-center"
          :target="{left:510,top:180}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          left-center
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="left-top"
          :target="{left:510,top:270}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          left-top
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="top-left"
          :target="{left:510,top:350}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          top-left
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="top-center"
          :target="{left:260,top:350}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          top-center
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="top-right"
          :target="{left:10,top:350}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          top-right
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="right-top"
          :target="{left:10,top:270}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          right-top
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="right-center"
          :target="{left:10,top:180}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          right-center
        </VuiPopover>

        <VuiPopover
          :visible="true"
          :auto-close="false"
          :bind-resize="false"
          :bind-scroll="false"
          positions="right-bottom"
          :target="{left:10,top:90}"
          :width="100"
          :border-color="data.borderColor"
          :bg-color="data.bgColor"
          :color="data.color"
        >
          right-bottom
        </VuiPopover>
      </div>
    </VuiFlex>


    <VuiFlex
      gap="20px"
      padding="5px"
    >
      <VuiButton @click="openPopover">
        Popover bottom left
      </VuiButton>

      <div class="vui-flex-auto">
        <VuiFlex
          center
          padding="5px"
        >
          <VuiButton @click="openPopover">
            Popover bottom center
          </VuiButton>
        </VuiFlex>
      </div>

      <VuiButton @click="openPopover">
        Popover bottom right
      </VuiButton>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      margin="10px 0 0 0"
    >
      <div>Props:</div>
      <VuiSelect
        v-model="data.title"
        tooltip="title"
      >
        <option>Popover Title</option>
        <option />
      </VuiSelect>


      <VuiSelect
        v-model="data.borderColor"
        tooltip="borderColor"
      >
        <option />
        <option>gray</option>
        <option>green</option>
        <option>red</option>
        <option>#000</option>
      </VuiSelect>

      <VuiSelect
        v-model="data.bgColor"
        tooltip="bgColor"
      >
        <option />
        <option>gray</option>
        <option>green</option>
        <option>red</option>
      </VuiSelect>

      <VuiSelect
        v-model="data.color"
        tooltip="color"
      >
        <option />
        <option>#ffffff</option>
        <option>gray</option>
        <option>green</option>
        <option>red</option>
      </VuiSelect>
    </VuiFlex>

    <VuiPopover
      v-model="data.visible"
      :target="data.target"
      :title="data.title"
      :border-color="data.borderColor"
      :bg-color="data.bgColor"
      :color="data.color"
    >
      <VuiCheckbox>Popover Checkbox 1</VuiCheckbox>
      <VuiCheckbox>Popover Checkbox 2</VuiCheckbox>
      <VuiCheckbox>Popover Checkbox 3</VuiCheckbox>
      <VuiButton @click="onChangeSize">
        Dynamic changing size
      </VuiButton>
      <div :style="data.dynamicSize" />
    </VuiPopover>
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

const data = reactive({
    visible: false,
    target: null,
    title: 'Popover Title',
    borderColor: '',
    bgColor: '',
    color: '',

    dynamicSize: ''
});

let previousTarget;
const openPopover = function(e) {
    const target = e.target;
    // check previous visible
    if (data.visible) {
        if (target === previousTarget) {
            return;
        }
        setTimeout(() => {
            data.target = target;
            data.visible = true;
        });
    } else {
        data.target = target;
        data.visible = true;
    }
    previousTarget = target;
};

const onChangeSize = () => {
    if (data.dynamicSize) {
        data.dynamicSize = '';
    } else {
        data.dynamicSize = 'width:350px;height:200px;';
    }
};

</script>
<style lang="scss">
.vui-popover-positions {
    position: relative;
    z-index: 0;
    width: 520px;
    height: 360px;
    border: 1px solid #999;

    .vui-popover {
        position: absolute;
    }

    .vui-popover-content {
        text-align: center;
    }
}

</style>
