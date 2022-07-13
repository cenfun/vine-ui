<template>
  <div
    :class="classList"
    :style="styleList"
  >
    <slot>
      <BaseRender :content="content" />
    </slot>
  </div>
</template>

<script>
import Base from '../../base/base.vue';

export default {

    name: 'VuiLayout',

    extends: Base,

    props: {
        width: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: ''
        },
        direction: {
            type: String,
            default: 'row',
            validator(value) {
                return ['row', 'column'].includes(value);
            }
        },
        content: {
            validator: (v) => true,
            default: ''
        }
    },

    computed: {
        classList() {
            const ls = [
                'vui',
                'vui-layout',
                `vui-flex-${this.direction}`
            ];
            ls.push(this.cid);
            return ls;
        },

        styleList() {
            const st = {};
            if (this.width) {
                st.width = this.width;
            }
            if (this.height) {
                st.height = this.height;
            }
            return st;
        }
    }
};

</script>

<style lang="scss">
.vui-layout {
    position: relative;
}

</style>
