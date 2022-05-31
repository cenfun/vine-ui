<template>
  <div
    :class="classList"
    :style="styleList"
  >
    <slot>
      <BaseRender
        v-if="content"
        :content="content"
      />
    </slot>
  </div>
</template>

<script>
import Base from '../../base/base.vue';

export default {

    name: 'VuiFlex',

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
        },

        //default support '3', '5', '8', '10', '15', '20', '30'
        //others need override vui-flex-spacing-x by yourself
        spacing: {
            type: String,
            default: ''
        }
    },

    computed: {
        classList() {
            const ls = [
                'vui',
                `vui-flex-${this.direction}`
            ];
            if (this.spacing) {
                ls.push('vui-flex-spacing');
                ls.push(`vui-flex-spacing-${this.spacing}`);
            }
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
.vui-flex-auto {
    flex: 1 1 0%;
    overflow: hidden;
}

.vui-flex-empty {
    flex: 1 1 0%;
    overflow: hidden;
    margin: 0;
}

.vui-flex-spacing-3 > * {
    margin-left: 3px;
    margin-top: 3px;
}

.vui-flex-spacing-5 > * {
    margin-left: 5px;
    margin-top: 5px;
}

.vui-flex-spacing-8 > * {
    margin-left: 8px;
    margin-top: 8px;
}

.vui-flex-spacing-10 > * {
    margin-left: 10px;
    margin-top: 10px;
}

.vui-flex-spacing-15 > * {
    margin-left: 15px;
    margin-top: 15px;
}

.vui-flex-spacing-20 > * {
    margin-left: 20px;
    margin-top: 20px;
}

.vui-flex-spacing-30 > * {
    margin-left: 30px;
    margin-top: 30px;
}

.vui-flex-spacing > *:first-child,
.vui-flex-spacing > .vui-flex-empty,
.vui-flex-spacing > .vui-flex-empty + * {
    margin-left: 0;
    margin-top: 0;
}

.vui-flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;

    &.vui-flex-spacing > * {
        margin-top: 0;
    }
}

.vui-flex-column {
    display: flex;
    flex-direction: column;
    position: relative;

    &.vui-flex-spacing > * {
        margin-left: 0;
    }
}

</style>