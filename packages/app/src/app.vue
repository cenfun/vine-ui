<template>
  <VuiFlex
    direction="column"
    class="vui-app"
  >
    <div class="vui-header vui-flex-row">
      <div class="vui-title">
        Vine UI
      </div>
      <div class="vui-sub">
        Based on <a
          href="https://github.com/vuejs/core"
          target="_blank"
        >Vue 3.x</a>
      </div>
      <div>
        <a
          href="https://github.com/cenfun/vine-ui"
          target="_blank"
          class="icon-github"
        />
      </div>
    </div>
    <div class="vui-body vui-flex-auto">
      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiButton
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <DemoButton />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiCheckbox
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <DemoCheckbox />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiFlex
        </div>
        <div class="vui-item-example vui-flex-auto">
          <DemoFlex />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiFlyover
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <DemoFlyover />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiInput
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <DemoInput />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiLoading
        </div>
        <div class="vui-item-example vui-flex-auto">
          <DemoLoading />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiModal
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <DemoModal />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiPopover
        </div>
        <div class="vui-item-example vui-flex-auto vui-popover-example">
          <DemoPopover />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiProgress
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <DemoProgress />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiRadio
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <DemoRadio />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiSelect
        </div>
        <div class="vui-item-example vui-flex-auto">
          <DemoSelect />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiSwitch
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <DemoSwitch />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiTab
        </div>
        <div class="vui-item-example vui-flex-auto">
          <DemoTab />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div
          class="vui-item-name"
          tooltip="This is VuiTooltip left This is VuiTooltip left"
        >
          VuiTooltip
        </div>
        <div class="vui-item-example vui-flex-auto">
          <DemoTooltip />
        </div>
      </div>
    </div>
  </VuiFlex>
</template>
<script>
import DemoButton from './demo/button.vue';
import DemoCheckbox from './demo/checkbox.vue';
import DemoFlex from './demo/flex.vue';
import DemoFlyover from './demo/flyover.vue';
import DemoInput from './demo/input.vue';
import DemoLoading from './demo/loading.vue';
import DemoModal from './demo/modal.vue';
import DemoPopover from './demo/popover.vue';
import DemoProgress from './demo/progress.vue';
import DemoRadio from './demo/radio.vue';
import DemoSelect from './demo/select.vue';
import DemoSwitch from './demo/switch.vue';
import DemoTab from './demo/tab.vue';
import DemoTooltip from './demo/tooltip.vue';

import { components, createComponent } from 'vine-ui';

console.log('components', components);

const { VuiFlex } = components;

const App = {

    createComponent,

    components: {
        DemoButton,
        DemoCheckbox,
        DemoFlex,
        DemoFlyover,
        DemoInput,
        DemoLoading,
        DemoModal,
        DemoPopover,
        DemoProgress,
        DemoRadio,
        DemoSelect,
        DemoSwitch,
        DemoTab,
        DemoTooltip,
        VuiFlex
    }
};

export default App;
</script>
<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #333;
}

.vui-app {
    width: 100%;
    height: 100%;
    position: relative;
}

.vui-header {
    padding: 5px 10px;
    background: #f5f5f5;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
}

.vui-title {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
}

.vui-sub {
    padding-left: 10px;
    color: #666;
    height: 30px;
    line-height: 30px;
    flex: 1;
}

.icon-github {
    display: block;
    margin-right: 5px;
    width: 26px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 26px 26px;
    background-image: url("images/github.svg");
    opacity: 0.6;
}

.icon-github:hover {
    opacity: 1;
}

.vui-body {
    overflow-y: auto;
    padding: 10px;
}

.vui-item {
    border-bottom: 1px dotted #ccc;
    padding: 5px;
}

.vui-item-name {
    width: 90px;
    padding: 5px 5px 5px 0;
    overflow: hidden;
    color: #000;
}

.vui-item-example {
    border-left: 1px solid #ccc;
    padding: 5px 5px 5px 10px;
}

</style>
