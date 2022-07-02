<template>
  <div :class="classList">
    <div
      v-if="labelContent"
      class="vui-switch-label"
    >
      <slot>
        <BaseRender
          v-if="label"
          :content="label"
        />
      </slot>
    </div>
    <div
      :class="buttonClassList"
      :style="buttonStyleList"
      @click="clickHandler"
    >
      <div
        class="vui-switch-icon"
        :style="iconStyleList"
      />
    </div>
  </div>
</template>
<script>
import Base from '../../base/base.vue';
import Util from '../../util/util.js';

const defaultColors = ['#aaaaaa', '#1890ff'];

export default {

    name: 'VuiSwitch',

    extends: Base,

    props: {
        checked: {
            type: Boolean,
            default: false
        },
        colors: {
            type: String,
            default: '#aaaaaa,#1890ff'
        },
        width: {
            type: String,
            default: '35px'
        },
        height: {
            type: String,
            default: '20px'
        }
    },

    data() {
        return {
            buttonColors: defaultColors
        };
    },

    computed: {
        classList() {
            const ls = [
                'vui',
                'vui-switch'
            ];
            ls.push(this.cid);
            return ls;
        },

        buttonClassList() {
            return {
                'vui-switch-button': true,
                'vui-switch-checked': this.dataModelValue,
                'vui-switch-disabled': this.disabled
            };
        },

        buttonStyleList() {
            return {
                'width': this.width,
                'height': this.height,
                'border-radius': this.height,
                'background-color': this.dataModelValue ? this.buttonColors[1] : this.buttonColors[0]
            };
        },

        iconStyleList() {
            return {
                width: `calc(${this.height} - 4px)`,
                right: this.dataModelValue ? '2px' : `calc(${this.width} - ${this.height} + 2px)`
            };
        },

        labelContent() {
            return this.label || this.$slots.default;
        }
    },

    created() {
        const ls = `${this.colors}`.split(',').map((it) => it.trim());
        this.buttonColors = [ls[0] || defaultColors[0], ls[1] || defaultColors[1]];

        if (Util.isInvalid(this.dataModelValue)) {
            this.dataModelValue = this.checked;
        }
    },

    methods: {
        clickHandler() {
            if (this.disabled) {
                return;
            }
            this.dataModelValue = !this.dataModelValue;
        }
    }
};

</script>
<style lang="scss">
.vui-switch {
    display: flex;
    align-items: center;

    .vui-switch-disabled {
        cursor: default;
        opacity: 0.5;
    }
}

.vui-switch-label {
    margin-right: 5px;
}

.vui-switch-button {
    cursor: pointer;
    transition: background-color 0.1s;
    position: relative;
}

.vui-switch-icon {
    border-radius: 50%;
    background-color: #fff;
    transition: right 0.1s ease-in-out;
    position: absolute;
    top: 2px;
    height: calc(100% - 4px);
}

.vui-switch-checked {
    .vui-switch-icon {
        right: 2px;
    }
}

</style>
