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
        size: {
            type: String,
            default: '5px'
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
                `vui-layout-${this.direction}`,
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
            if (this.size) {
                st['--vui-gutter-size'] = this.size;
            }
            return st;
        }
    },

    mounted() {
        const children = Array.from(this.$el.children);
        console.log(children);
        if (children.length < 2) {
            return;
        }
        children.length -= 1;
        const gutterList = [];
        children.forEach((child, i) => {
            const gutter = document.createElement('div');
            gutter.className = 'vui-layout-gutter';
            child.insertAdjacentElement('afterend', gutter);
            gutterList.push(gutter);
        });


    }
};

</script>

<style lang="scss">
.vui-layout {
    position: relative;
}

.vui-layout-row > * {
    height: 100%;
}

.vui-layout-column > * {
    width: 100%;
}

.vui-layout-gutter {
    position: relative;
}

.vui-layout-gutter:hover {
    background-color: #0077cf;
}

.vui-layout-gutter::after {
    content: "";
    position: absolute;
    display: block;
    transform: translate(-50%, -50%);
}

.vui-layout-row > {
    .vui-layout-gutter {
        width: 2px;
        height: 100%;
        cursor: ew-resize;
    }

    .vui-layout-gutter::after {
        width: 10px;
        height: 100%;
    }
}

.vui-layout-column > {
    .vui-layout-gutter {
        width: 100%;
        height: 2px;
        cursor: ns-resize;
    }

    .vui-layout-gutter::after {
        width: 100%;
        height: 10px;
    }
}

</style>
