<template>
  <div
    :class="classList"
    :style="styleList"
  />
</template>
<script setup>
import { computed } from 'vue';
import { getCID } from '../../utils/util.js';

const cid = getCID('VuiProgress');

const props = defineProps({
    percentage: {
        type: [Number, String],
        default: 0
    },
    width: {
        type: String,
        default: '100px'
    },
    height: {
        type: String,
        default: '15px'
    },
    radius: {
        type: String,
        default: '3px'
    },
    color: {
        type: String,
        default: '#ccc'
    },
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
    ls.push(cid);
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

</script>
<style lang="scss">
.vui-progress {
    position: relative;
    box-sizing: border-box;
    border-style: solid;
    border-width: thin;
}
</style>
