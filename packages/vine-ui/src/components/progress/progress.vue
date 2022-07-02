<template>
  <div
    :class="classList"
    :style="styleList"
  />
</template>
<script>
import Base from '../../base/base.vue';

export default {

    name: 'VuiProgress',

    extends: Base,

    props: {
        percentage: {
            type: Number,
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
    },

    computed: {
        classList() {
            const ls = [
                'vui',
                'vui-progress'
            ];
            ls.push(this.cid);
            return ls;
        },

        styleList() {
            const st = {
                'width': this.width,
                'height': this.height,
                'border-radius': this.radius,
                'border-color': this.borderColor,
                'background': `linear-gradient(${this.color} 0 0) 0/${this.percentage}% no-repeat`
            };
            return st;
        }
    }
};

</script>
<style lang="scss">
.vui-progress {
    border-width: thin;
    border-style: solid;
    box-sizing: border-box;
    position: relative;
}
</style>
