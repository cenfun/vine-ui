<template>
  <VuiFlex spacing="20px">
    <VuiButton tooltip="This is tooltip left This is tooltip left This is tooltip left">
      Hover Tooltip
    </VuiButton>

    <VuiSelect
      v-model="borderColor"
      label="border color:"
    >
      <option />
      <option>gray</option>
      <option>green</option>
      <option>red</option>
      <option>#000</option>
    </VuiSelect>

    <VuiSelect
      v-model="bgColor"
      label="bg color:"
    >
      <option />
      <option>gray</option>
      <option>green</option>
      <option>red</option>
    </VuiSelect>

    <div class="vui-flex-auto">
      <VuiFlex
        spacing="50px"
        center
      >
        <VuiButton tooltip="This is tooltip center left">
          Hover Tooltip
        </VuiButton>
        <VuiButton tooltip="This is tooltip center right">
          Hover Tooltip
        </VuiButton>
      </VuiFlex>
    </div>

    <VuiButton tooltip="This is tooltip right center">
      Hover Tooltip
    </VuiButton>
    <VuiButton tooltip="This is tooltip right long text">
      Hover Tooltip
    </VuiButton>
  </VuiFlex>
</template>

<script setup>
import VineUI from 'vine-ui';
import { onMounted, ref } from 'vue';
const {
    VuiButton,
    VuiFlex,
    VuiSelect,
    VuiTooltip
} = VineUI;

const borderColor = ref('');
const bgColor = ref('');

const showTooltip = function(elem) {
    const text = elem.getAttribute('tooltip');
    if (!text) {
        return;
    }
    hideTooltip(elem);
    if (elem.$tooltip) {
        return;
    }
    elem.$tooltip = VuiTooltip.createComponent({
        target: elem,
        borderColor: borderColor.value,
        bgColor: bgColor.value,
        html: `<div>${text}</div>`
    });
};

const hideTooltip = function(elem) {
    if (!elem.$tooltip) {
        return;
    }
    if (elem.$tooltip.disabled) {
        return;
    }
    elem.$tooltip.unmount();
    elem.$tooltip = null;
};

const pinTooltip = function(elem) {
    if (!elem.$tooltip || elem.nodeName !== 'BUTTON') {
        return;
    }
    elem.$tooltip.disabled = !elem.$tooltip.disabled;
};

const initTooltip = () => {
    setTimeout(() => {
        const tooltips = Array.from(document.querySelectorAll('[tooltip]'));
        tooltips.forEach((item) => {
            item.addEventListener('click', () => {
                pinTooltip(item);
            });
            item.addEventListener('mouseenter', () => {
                showTooltip(item);
            });
            item.addEventListener('mouseleave', () => {
                hideTooltip(item);
            });
        });
    }, 100);
};

onMounted(() => {
    initTooltip();
});


</script>
