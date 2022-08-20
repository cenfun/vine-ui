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
    padding: 0 15px;
    max-width: 200px;
    height: var(--vui-tab-height);
    line-height: var(--vui-tab-height);
    cursor: pointer;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    user-select: none;
    color: #002b36;
}

.vui-tab-item::after {
    background-color: #a4a7ab;
    display: block;
    position: absolute;
    bottom: 8px;
    left: 100%;
    width: 1px;
    height: 20px;
    content: "";
    z-index: 0;
}

.vui-tab-item:last-child::after {
    display: none;
}

.vui-tab-item:hover {
    background-color: #ebecef;
    z-index: 2;
}

.vui-tab-item:hover::before,
.vui-tab-item:hover::after {
    background-repeat: no-repeat;
    background-color: transparent;
    position: absolute;
    bottom: 0;
    left: -10px;
    display: block;
    width: 10px;
    height: 10px;
    pointer-events: none;
    content: "";
}

.vui-tab-item:hover::before {
    background-image: url("./images/hover-before.svg");
}

.vui-tab-item:hover::after {
    left: 100%;
    background-image: url("./images/hover-after.svg");
}

.vui-tab-item.vui-tab-selected {
    background-color: #fff;
    position: relative;
    z-index: 3;
}

.vui-tab-item.vui-tab-selected::before,
.vui-tab-item.vui-tab-selected::after {
    background-repeat: no-repeat;
    background-color: transparent;
    position: absolute;
    bottom: 0;
    left: -10px;
    display: block;
    width: 10px;
    height: 10px;
    pointer-events: none;
    content: "";
}

.vui-tab-item.vui-tab-selected::before {
    background-image: url("./images/selected-before.svg");
}

.vui-tab-item.vui-tab-selected::after {
    left: 100%;
    background-image: url("./images/selected-after.svg");
}

.vui-tab-item > * {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
