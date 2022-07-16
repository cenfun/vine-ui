<template>
  <div
    v-if="dataVisible"
    :class="classList"
    :style="styleList"
  >
    <transition
      appear
      mode="out-in"
      name="vui-fade"
    >
      <div
        ref="content"
        class="vui-tooltip-content"
      >
        <slot>
          <BaseRender :content="text" />
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
import Popup from '../../base/base-popup.vue';

export default {

    name: 'VuiTooltip',

    extends: Popup,

    props: {

        text: {
            type: String,
            default: ''
        },

        html: {
            type: String,
            default: ''
        },

        maxWidth: {
            type: Number,
            default: 320
        }

    },

    data() {
        return {
            cid: '',
            //calculation info
            position: 'top',
            align: 'center',
            top: 0,
            left: 0
        };
    },

    computed: {
        classList() {
            return [
                'vui',
                'vui-popup',
                `vui-popup-${this.position}-${this.align}`,
                'vui-tooltip',
                this.cid
            ];
        },

        styleList() {
            return {
                top: `${this.top}px`,
                left: `${this.left}px`,
                'max-width': `${this.maxWidth}px`
            };
        }

    },


    created() {
        if (this.bindTarget) {
            this.dataVisible = false;
        }
    },

    mounted() {
        if (!this.$el.parentNode) {
            document.body.appendChild(this.$el);
        }

        //console.log(this.html);
        if (this.html) {
            this.$refs.content.innerHTML = this.html;
        }

        this.bindEvents();
        this.update();
    },

    beforeUnmount() {
        this.unbindEvents();
        this.$emit('close');
    },

    methods: {
        bindEvents() {
            this.bindTargetEvent();
            //after mounted
            this.$watch('dataVisible', this.visibleHandler);
        },

        unbindEvents() {
            this.unbindTargetEvent();
        },

        visibleHandler() {
            if (this.dataVisible) {
                this.$nextTick(() => {
                    this.update();
                });
            } else {
                this.$emit('close');
            }
        },

        //=============================================================================

        bindTargetEvent() {
            if (!this.bindTarget) {
                return;
            }
            const $target = this.getElement(this.target);
            if ($target) {
                this.$target = $target;
                this.$target.addEventListener('mouseenter', this.openHandler);
                this.$target.addEventListener('focus', this.openHandler);
                this.$target.addEventListener('mouseleave', this.closeHandler);
                this.$target.addEventListener('blur', this.closeHandler);
            }
        },

        unbindTargetEvent() {
            if (this.$target) {
                this.$target.removeEventListener('mouseenter', this.openHandler);
                this.$target.removeEventListener('focus', this.openHandler);
                this.$target.removeEventListener('mouseleave', this.closeHandler);
                this.$target.removeEventListener('blur', this.closeHandler);
                this.$target = null;
            }
        },

        openHandler() {
            if (this.dataVisible) {
                return;
            }
            if (this.disabled) {
                return;
            }
            this.dataVisible = true;
        },

        closeHandler() {
            if (!this.dataVisible) {
                return;
            }
            if (this.disabled) {
                return;
            }
            if (this.$target) {
                this.dataVisible = false;
            } else {
                this.destroy();
            }
        },

        //=============================================================================

        update() {
            this.$nextTick(() => {
                this.updateSync();
            });
            return this;
        },

        updateSync() {
            if (!this.dataVisible) {
                return this;
            }
            const containerRect = this.getRect(this.container || window);
            const targetRect = this.getRect(this.target);

            //fix for arrow size
            const arrowSize = 10;
            targetRect.left -= arrowSize;
            targetRect.top -= arrowSize;
            targetRect.width += arrowSize * 2;
            targetRect.height += arrowSize * 2;

            const rect = this.getRect(`.${this.cid}`);

            //console.log(containerRect, targetRect, rect);

            this.positionInfo = this.getBestPosition(
                containerRect,
                targetRect,
                rect,
                this.positions
            );

            //no change
            if (this.position === this.positionInfo.position
            && this.align === this.positionInfo.align
            && this.top === this.positionInfo.top
            && this.left === this.positionInfo.left) {
                return this;
            }

            //console.log(this.positionInfo);

            this.position = this.positionInfo.position;
            this.align = this.positionInfo.align;
            this.top = this.positionInfo.top;
            this.left = this.positionInfo.left;

            this.$emit('update');
            return this;
        }
    }
};

</script>

<style lang="scss">
.vui-tooltip {
    //pointer-events: none;
    position: absolute;
    visibility: visible;
    z-index: 1000;
    opacity: 1;
    margin: 0;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 20%);
    transition: opacity 0.2s linear, visibility 0.2s linear;

    .vui-tooltip-content {
        padding: 10px;
        display: inline-block;
        font-size: 14px;
        //https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break
        word-break: break-word;
        overflow-wrap: break-word;
        //IE https://caniuse.com/#feat=wordwrap
        word-wrap: break-word;
    }

    .vui-fade-enter-active,
    .vui-fade-leave-active {
        transition: opacity 0.3s;
    }

    .vui-fade-enter,
    .vui-fade-leave-to {
        opacity: 0;
    }
}
</style>
