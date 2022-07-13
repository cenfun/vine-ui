<template>
  <VuiFlex
    direction="column"
    spacing="10px"
  >
    <VuiTab
      v-model="tabActive"
      position="left"
      @change="onTabChange"
    >
      <template #toolbar>
        <div class="vui-flex-auto" />
        <div
          class="vui-tab-icon vui-tab-icon-plus"
          tooltip="This is toolbar tooltip"
        >
          Left Toolbar Slot {{ inputText }}
        </div>
      </template>
      <template #tabs>
        <div>
          Tab 1 {{ inputText }}
        </div>
        <div>Tab 2</div>

        <div
          class="vui-tab-icon vui-tab-icon-tools"
          tooltip="This is tab tooltip"
        >
          Tab 3
        </div>

        <div>
          Tab 4 Max Width Long Text Long Text Long Text
        </div>
        <div>Tab 5</div>
        <span />
      </template>
      <template #panes>
        <div>Pane 1 </div>
        <div style="height: 100px;">
          Pane 2 100px height {{ inputText }}
        </div>
        <div>Pane 3</div>
        <VuiButton>
          Button Pane 4
        </VuiButton>
        <div>Pane 5</div>
        <span />
      </template>
    </VuiTab>
    <VuiTab
      v-model="tabActive"
      position="right"
      :toolbar="'Right Toolbar Props ' + inputText"
      :tabs="['Tab 1', 'Tab 2', 'Tab 3']"
      :panes="tabPanes"
      @change="onTabChange"
    />
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
import { ref } from 'vue';
const {
    VuiButton,
    VuiFlex,
    VuiTab
} = components;

const tabActive = ref(1);
const inputText = ref(1);

const tabPanes = ref(['Pane 1', 'Pane 2', function(h) {
    return h(VuiButton, {
        label: 'Label'
    });
}]);

const onTabChange = (index) => {
    inputText.value = index;
    console.log(`tab change: ${index}`);
};


</script>
<style>
.vui-tab-icon {
    padding-left: 25px;
    background-repeat: no-repeat;
    background-position: 2px center;
    background-size: 18px 18px;
    padding-right: 8px;
}

.vui-tab-icon-tools {
    background-image: url("../images/tools.svg");
}

.vui-tab-icon-plus {
    background-image: url("../images/plus.svg");
}
</style>
