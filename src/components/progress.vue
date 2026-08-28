<template>
  <div
    v-init="{cid}"
    :class="classList"
    :style="styleList"
  />
</template>
<script setup>
import { computed } from 'vue';
import { getCID, vInit } from '../utils/util.js';

const cid = getCID('VuiProgress');

const props = defineProps({

    /** Progress percentage (0-100) */

    percentage: {
        type: [Number, String],
        default: 0
    },

    /** Progress bar width */

    width: {
        type: String,
        default: '100px'
    },

    /** Progress bar height */

    height: {
        type: String,
        default: '15px'
    },

    /** Border radius */

    radius: {
        type: String,
        default: '3px'
    },

    /** Progress fill color */

    color: {
        type: String,
        default: '#ccc'
    },

    /** Progress bar border color */

    borderColor: {
        type: String,
        default: '#aaa'
    }


});

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-progress'
    ];
    return ls;
});

const styleList = computed(() => {
    let per = props.percentage;
    if (typeof per === 'string') {
        per = parseFloat(per);
    }
    const st = {
        'width': props.width,
        'height': props.height,
        'border-radius': props.radius,
        'border-color': props.borderColor,
        'background': `linear-gradient(${props.color} 0 0) 0/${per}% no-repeat`
    };
    return st;
});

defineExpose({
    cid
});
</script>
<style lang="scss">
.vui-progress {
    position: relative;
    border-style: solid;
    border-width: thin;
}
</style>
