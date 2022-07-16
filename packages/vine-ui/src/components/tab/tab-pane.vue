<template>
  <div :class="classList">
    <BaseRender :content="props.content" />
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { BaseRender } from '../../base/base.js';

const props = defineProps({
    content: {
        validator: (v) => true,
        default: ''
    },
    selected: {
        type: Boolean,
        default: false
    }
});

const classList = computed(() => {
    const ls = ['vui-tab-pane'];
    if (props.selected) {
        ls.push('vui-tab-selected');
    }
    return ls;
});

</script>

<style lang="scss">
.vui-tab-pane {
    position: relative;
    display: none;
    padding: 10px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.vui-tab-pane.vui-tab-selected {
    display: block;
}

</style>
