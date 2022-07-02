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
            let per = this.percentage;
            if (typeof per === 'string') {
                per = parseFloat(per);
            }

            const st = {
                'width': this.width,
                'height': this.height,
                'border-radius': this.radius,
                'border-color': this.borderColor,
                'background': `linear-gradient(${this.color} 0 0) 0/${per}% no-repeat`
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
