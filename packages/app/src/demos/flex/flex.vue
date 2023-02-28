<template>
  <div>
    <VuiFlex gap="10px">
      <VuiFlex
        :direction="flex.direction"

        :gap="flex.gap"
        :margin="flex.margin"
        :padding="flex.padding"
        :width="flex.width"
        :height="flex.height"

        :center="flex.center"
        :wrap="flex.wrap"

        class="vui-demo-flex"
      >
        <div>
          div
        </div>
        <VuiButton>
          button
        </VuiButton>
        <div>
          long text long text long text long text for row wrap
        </div>
        <span>span</span>
        <div>
          div
        </div>
      </VuiFlex>

      <VuiFlex
        :direction="flex.direction"

        :gap="flex.gap"
        :margin="flex.margin"
        :padding="flex.padding"
        :width="flex.width"
        :height="flex.height"

        :center="flex.center"
        :wrap="flex.wrap"

        class="vui-demo-flex"
      >
        <div>
          div
        </div>
        <VuiButton>
          button
        </VuiButton>
        <div class="vui-flex-auto">
          vui-flex-auto
        </div>
        <div>
          long text long text long text long text for row wrap
        </div>
        <span>span</span>
        <div>
          div
        </div>
      </VuiFlex>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      padding="5px"
      margin="10px 0 0 0"
    >
      <div>Props:</div>
      <VuiSelect
        v-model="flex.direction"
        tooltip="direction"
      >
        <option>row</option>
        <option>column</option>
      </VuiSelect>

      <VuiSelect
        v-model="flex.gap"
        tooltip="gap"
      >
        <option />
        <option>5px</option>
        <option>10px</option>
        <option>15px</option>
        <option>20px</option>
        <option>10px 5px</option>
      </VuiSelect>

      <VuiSelect
        v-model="flex.margin"
        tooltip="margin"
      >
        <option />
        <option>5px</option>
        <option>10px</option>
      </VuiSelect>

      <VuiSelect
        v-model="flex.padding"
        tooltip="padding"
      >
        <option />
        <option>5px</option>
        <option>10px</option>
      </VuiSelect>

      <VuiSelect
        v-model="flex.width"
        tooltip="width"
      >
        <option />
        <option>100px</option>
        <option>200px</option>
        <option>300px</option>
        <option>400px</option>
        <option>50%</option>
      </VuiSelect>
      <VuiSelect
        v-model="flex.height"
        tooltip="height"
      >
        <option />
        <option>100px</option>
        <option>200px</option>
        <option>300px</option>
      </VuiSelect>

      <VuiSwitch v-model="flex.center">
        center
      </VuiSwitch>

      <VuiSwitch v-model="flex.wrap">
        wrap
      </VuiSwitch>
    </VuiFlex>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import VineUI from 'vine-ui';
const {
    VuiButton,
    VuiFlex,
    VuiSelect,
    VuiSwitch
} = VineUI;

const flex = reactive({
    direction: 'column',

    gap: '5px',
    margin: '',
    padding: '',
    width: '400px',
    height: '300px',

    center: false,
    wrap: false
});

</script>
<style lang="scss">
.vui-demo-flex {
    background-color: #eee;

    > * {
        box-sizing: border-box;
        border: thin solid #ccc;
    }

    .vui-flex-auto {
        border: none;
        background-color: #f8f8f8;
    }
}

</style>
