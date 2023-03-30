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

    <div class="vui-popover-positions">
      <VuiFlex center>
        <VuiSwitch v-model="data.movable">
          mouse move in container
        </VuiSwitch>
      </VuiFlex>
    </div>

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
      :container="data.container"
      :nonreactive="data.nonreactive"
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
import { reactive, watch } from 'vue';
const {
    VuiButton,
    VuiCheckbox,
    VuiFlex,
    VuiPopover,
    VuiSelect,
    VuiSwitch
} = VineUI;

const data = reactive({
    visible: false,
    target: null,

    title: 'Popover Title',
    borderColor: '',
    bgColor: '',
    color: '',

    movable: false,
    container: null,
    nonreactive: false,

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
        data.dynamicSize = 'width:350px;height:900px;';
    }
};

const mouseMoveHandler = (e) => {
    if (!data.movable) {
        return;
    }
    data.target = {
        x: e.pageX - 10,
        y: e.pageY - 10,
        width: 20,
        height: 20
    };
    data.container = '.vui-popover-positions';
    data.nonreactive = true;
    data.visible = true;
};


watch(() => data.movable, (v) => {
    if (v) {
        window.addEventListener('mousemove', mouseMoveHandler);
    } else {
        window.removeEventListener('mousemove', mouseMoveHandler);
        data.visible = false;
        data.container = null;
        data.nonreactive = false;
    }
});


</script>
<style lang="scss">
.vui-popover-positions {
    width: 520px;
    height: 360px;
    margin: 10px auto;
    line-height: 360px;
    text-align: center;
    border: 1px solid #999;

    .vui-popover {
        position: absolute;
    }

    .vui-popover-content {
        text-align: center;
    }
}

</style>
