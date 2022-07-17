<template>
  <VuiFlex spacing="20px">
    <VuiButton tooltip="This is VuiTooltip left This is VuiTooltip left">
      Hover Tooltip
    </VuiButton>

    <div class="vui-flex-auto">
      <VuiFlex
        spacing="50px"
        center
      >
        <VuiButton tooltip="This is VuiTooltip left">
          Hover Tooltip
        </VuiButton>
        <VuiButton tooltip="This is VuiTooltip center">
          Hover Tooltip
        </VuiButton>
      </VuiFlex>
    </div>

    <VuiButton tooltip="This is VuiTooltip center">
      Hover Tooltip
    </VuiButton>
    <VuiButton tooltip="This is VuiTooltip right">
      Hover Tooltip
    </VuiButton>
  </VuiFlex>
</template>

<script setup>
import { components } from 'vine-ui';
import { onMounted } from 'vue';
const {
    VuiButton,
    VuiFlex,
    VuiTooltip
} = components;

const showTooltip = function(elem) {
    hideTooltip(elem);
    if (elem.$tooltip) {
        return;
    }
    elem.$tooltip = VuiTooltip.createComponent({
        target: elem,
        html: `<div>${elem.getAttribute('tooltip')}</div>`
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
