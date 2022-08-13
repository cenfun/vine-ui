<template>
  <VuiFlex
    direction="column"
    spacing="10px"
  >
    <VuiTab
      v-model="tabActive"
      position="left"
    >
      <template #toolbar>
        <div class="vui-flex-auto" />
        <div
          class="vui-tab-icon vui-tab-icon-plus"
          tooltip="This is toolbar tooltip"
        >
          Left Toolbar Slot {{ tabActive }}
        </div>
      </template>
      <template #tabs>
        <div>
          Tab 1 {{ tabActive }}
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
          Pane 2 100px height {{ tabActive }}
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
      :toolbar="'Right Toolbar Props ' + tabActive"
      :tabs="['Tab 1', 'Tab 2', 'Tab 3']"
      :panes="tabPanes"
    />
  </VuiFlex>
</template>

<script setup>
import VineUI from 'vine-ui';
import { ref } from 'vue';
const {
    VuiButton,
    VuiFlex,
    VuiTab
} = VineUI;

const tabActive = ref(1);

const tabPanes = ref(['Pane 1', 'Pane 2', function(h) {
    return h(VuiButton, {
        label: 'Label'
    });
}]);

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
