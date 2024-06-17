<template>
  <VuiFlex
    direction="column"
    gap="10px"
  >
    <div :class="state.fixedHeight?'vui-fixed-height':''">
      <VuiTab
        v-model="state.index"
        :theme="state.theme"
        :align="state.align"
      >
        <template #left>
          <b>Tab Title</b>
        </template>
        <template #right>
          <div>Right</div>
          <VuiFlex tooltip="This is toolbar tooltip">
            <div class="vui-tab-icon-plus" />
            Slot {{ state.index }}
          </VuiFlex>
        </template>
        <template #tabs>
          <div>
            Tab in Tab {{ state.index }}
          </div>
          <div>Tab 2</div>
          <div tooltip="This is tab tooltip">
            <div class="vui-tab-icon-tools" />
            Tab 3
          </div>
          <div>
            Tab 4 Max Width Long Text Long Text Long Text
          </div>
          <span />
          <div>Tab 6</div>
        </template>
        <template #panes>
          <div>
            <VuiTab v-model="state.subIndex">
              <template #tabs>
                <div>Sub Tab 1</div>
                <div>Sub Tab 2</div>
              </template>
              <template #panes>
                <div>Sub Pane 1</div>
                <div>Sub Pane 2</div>
              </template>
            </VuiTab>
          </div>
          <div style="height: 100px;">
            Pane 2 100px height {{ state.index }}
          </div>
          <div>Pane 3</div>
          <div>
            <VuiButton>
              Button Pane 4
            </VuiButton>
          </div>
          <span />
          <div>
            Pane 6
          </div>
        </template>
      </VuiTab>
    </div>

    <VuiFlex
      gap="10px"
      padding="5px"
    >
      <div>Props:</div>

      <VuiSelect
        v-model="state.index"
        tooltip="index"
      >
        <option>0</option>
        <option>1</option>
        <option>2</option>
      </VuiSelect>

      <VuiSelect
        v-model="state.align"
        tooltip="align"
      >
        <option>left</option>
        <option>center</option>
        <option>right</option>
      </VuiSelect>

      <VuiSelect
        v-model="state.theme"
        tooltip="theme"
      >
        <option>chrome</option>
        <option>simple</option>
      </VuiSelect>


      <VuiSwitch v-model="state.fixedHeight">
        fixed container height 200px
      </VuiSwitch>
    </VuiFlex>
  </VuiFlex>
</template>

<script setup>
import { reactive } from 'vue';
import VineUI from 'vine-ui';
const {
    VuiButton,
    VuiFlex,
    VuiSelect,
    VuiSwitch,
    VuiTab
} = VineUI;

const state = reactive({
    index: 0,
    align: 'left',
    theme: 'chrome',
    subIndex: 0
});

</script>
<style lang="scss">
.vui-tab-icon-tools {
    width: 18px;
    height: 18px;
    margin-right: 3px;
    background-image: url("../../images/tools.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 18px 18px;
}

.vui-tab-icon-plus {
    width: 18px;
    height: 18px;
    margin-right: 3px;
    background-image: url("../../images/plus.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 18px 18px;
}

.vui-tab-pane {
    padding: 10px;
}

.vui-fixed-height {
    height: 200px;

    .vui-tab-pane {
        padding: 10px;
        border: 1px solid #ccc;
        border-top: none;
    }
}

.vui-tab-header-left,
.vui-tab-header-right {
    padding: 0 10px;
}

</style>
