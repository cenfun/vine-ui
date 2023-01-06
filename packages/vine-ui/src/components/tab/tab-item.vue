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
    const ls = [
        'vui-tab-item',
        'vui-flex-row'
    ];
    if (props.selected) {
        ls.push('vui-tab-selected');
    }
    return ls;
});

</script>

<style lang="scss">
.vui-tab-item {
    position: relative;
    height: var(--vui-tab-height);
    max-width: 200px;
    padding: 0 15px;
    color: #002b36;
    line-height: var(--vui-tab-height);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    cursor: pointer;
    user-select: none;
}

.vui-tab-item::after {
    position: absolute;
    left: 100%;
    bottom: 8px;
    content: "";
    z-index: 0;
    display: block;
    width: 1px;
    height: 20px;
    background-color: #a4a7ab;
}

.vui-tab-item:last-child::after {
    display: none;
}

.vui-tab-item:hover {
    z-index: 2;
    background-color: #ebecef;
}

.vui-tab-item:hover::before,
.vui-tab-item:hover::after {
    position: absolute;
    left: -10px;
    bottom: 0;
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background-color: transparent;
    background-repeat: no-repeat;
    pointer-events: none;
}

.vui-tab-item:hover::before {
    background-image: url("./images/hover-before.svg");
}

.vui-tab-item:hover::after {
    left: 100%;
    background-image: url("./images/hover-after.svg");
}

.vui-tab-item.vui-tab-selected {
    position: relative;
    z-index: 3;
    background-color: #fff;
}

.vui-tab-item.vui-tab-selected::before,
.vui-tab-item.vui-tab-selected::after {
    position: absolute;
    left: -10px;
    bottom: 0;
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    background-color: transparent;
    background-repeat: no-repeat;
    pointer-events: none;
}

.vui-tab-item.vui-tab-selected::before {
    background-image: url("./images/selected-before.svg");
}

.vui-tab-item.vui-tab-selected::after {
    left: 100%;
    background-image: url("./images/selected-after.svg");
}

.vui-tab-item > * {
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
