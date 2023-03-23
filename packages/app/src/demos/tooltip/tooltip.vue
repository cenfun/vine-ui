<template>
  <div>
    <VuiFlex
      gap="20px"
      padding="5px"
    >
      <VuiButton tooltip="This is tooltip left This is tooltip left This is tooltip left">
        Hover Tooltip
      </VuiButton>

      <VuiButton
        @mouseenter="onHtml"
        @mouseleave="onHtml"
      >
        html
      </VuiButton>

      <div class="vui-flex-auto" />

      <VuiButton tooltip="This is tooltip right center">
        Hover Tooltip
      </VuiButton>
      <VuiButton tooltip="This is tooltip right long text">
        Hover Tooltip
      </VuiButton>
    </VuiFlex>

    <VuiFlex
      gap="10px"
      padding="5px"
      margin="10px 0 0 0"
    >
      <div>Props:</div>
      <VuiSelect
        v-model="tooltip.borderColor"
        tooltip="borderColor"
      >
        <option />
        <option>gray</option>
        <option>green</option>
        <option>red</option>
        <option>#000</option>
      </VuiSelect>

      <VuiSelect
        v-model="tooltip.bgColor"
        tooltip="bgColor"
      >
        <option />
        <option>gray</option>
        <option>green</option>
        <option>red</option>
      </VuiSelect>

      <VuiSelect
        v-model="tooltip.color"
        tooltip="color"
      >
        <option />
        <option>#ffffff</option>
        <option>gray</option>
        <option>green</option>
        <option>red</option>
      </VuiSelect>

      <VuiSwitch v-model="tooltip.html">
        html
      </VuiSwitch>
    </VuiFlex>

    <!--
      check app.vue for global tooltip
      <VuiTooltip
      :visible="tooltip.visible"
      :target="tooltip.target"
      :text="tooltip.text"
      :html="tooltip.html"
      :border-color="tooltip.borderColor"
      :bg-color="tooltip.bgColor"
      :color="tooltip.color"
    />
    -->
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { components } from 'vine-ui';

const {
    VuiButton,
    VuiFlex,
    VuiSelect,
    VuiSwitch
} = components;

// global tooltip
const tooltip = inject('tooltip');

const onHtml = (e) => {
    if (e.type === 'mouseenter') {
        tooltip.visible = true;
        tooltip.target = e.target;
        tooltip.text = '<b>this is bold text</b>';
        tooltip.html = true;
    } else {
        tooltip.visible = false;
        // must be removed to let text works next
        tooltip.text = '';
        tooltip.html = false;
    }
};

</script>
