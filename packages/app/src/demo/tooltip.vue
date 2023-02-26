<template>
  <div>
    <VuiFlex spacing="20px">
      <VuiButton tooltip="This is tooltip left This is tooltip left This is tooltip left">
        Hover Tooltip
      </VuiButton>

      <VuiSelect v-model="state.borderColor">
        <option value="">
          borderColor
        </option>
        <option>gray</option>
        <option>green</option>
        <option>red</option>
        <option>#000</option>
      </VuiSelect>

      <VuiSelect v-model="state.bgColor">
        <option value="">
          bgColor
        </option>
        <option>gray</option>
        <option>green</option>
        <option>red</option>
      </VuiSelect>

      <VuiSelect v-model="state.color">
        <option value="">
          color
        </option>
        <option>#ffffff</option>
        <option>gray</option>
        <option>green</option>
        <option>red</option>
      </VuiSelect>


      <div class="vui-flex-auto" />

      <VuiButton tooltip="This is tooltip right center">
        Hover Tooltip
      </VuiButton>
      <VuiButton tooltip="This is tooltip right long text">
        Hover Tooltip
      </VuiButton>
    </VuiFlex>

    <div class="vui-tooltip-no-margin">
      <VuiButton
        class="tooltip-target1"
        @mouseenter="state.tooltipVisible=true"
        @mouseleave="state.tooltipVisible=false"
      >
        Tooltip v-modal
      </VuiButton>
      <VuiTooltip
        v-model="state.tooltipVisible"
        target=".tooltip-target1"
      >
        <VuiSwitch checked>
          slots in tooltip
        </VuiSwitch>
      </VuiTooltip>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { components, bindTooltips } from 'vine-ui';

const {
    VuiButton,
    VuiFlex,
    VuiSelect,
    VuiSwitch,
    VuiTooltip
} = components;

const state = reactive({
    borderColor: '',
    bgColor: '',
    color: '',

    tooltipVisible: false
});


onMounted(() => {
    bindTooltips((target, text) => {
        return {
            borderColor: state.borderColor,
            bgColor: state.bgColor,
            color: state.color
        };
    });
});


</script>
<style lang="scss">
.vui-tooltip-no-margin {
    margin: 10px 50%;
}

</style>
