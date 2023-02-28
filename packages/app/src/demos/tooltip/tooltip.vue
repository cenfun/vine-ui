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

    <VuiTooltip
      :visible="data.visible"
      :target="data.target"
      :text="data.text"
      :html="data.html"
      :border-color="data.borderColor"
      :bg-color="data.bgColor"
      :color="data.color"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { components, generateTooltips } from 'vine-ui';

const {
    VuiButton,
    VuiFlex,
    VuiSelect,
    VuiTooltip
} = components;

const data = reactive({
    visible: false,
    target: '',
    text: '',
    html: '',
    borderColor: '',
    bgColor: '',
    color: ''

});

const onHtml = (e) => {
    if (e.type === 'mouseenter') {
        data.visible = true;
        data.target = e.target;
        data.html = '<b>this is bold text</b>';
    } else {
        data.visible = false;
        // must be removed to let text works next
        data.html = '';
    }
};

onMounted(() => {
    generateTooltips((target, text) => {
        data.visible = true;
        data.target = target;
        data.text = text;
    }, (target) => {
        data.visible = false;
        data.text = '';
    });
});

</script>
