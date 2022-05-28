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
        class="vui-popover-body"
        :style="styleBody"
      >
        <div
          v-if="showHeader"
          class="vui-popover-header"
        >
          <slot name="header">
            <div
              class="vui-popover-title"
              v-text="title"
            />
          </slot>
        </div>
        <div :class="classContent">
          <slot>
            <BaseRender
              v-if="content"
              :content="content"
            />
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Popup from '../../base/base-popup.vue';

export default {

    name: 'VuiPopover',

    extends: Popup,

    props: {

        title: {
            type: String,
            default: ''
        },

        autoClose: {
            type: Boolean,
            default: true
        },

        hasHeader: {
            type: Boolean,
            default: true
        },

        bindResize: {
            type: [String, Boolean],
            default: 'close'
        },

        bindScroll: {
            type: [String, Boolean],
            default: 'close'
        },

        width: {
            type: Number,
            default: 200
        },

        minHeight: {
            type: Number,
            default: 0
        },

        maxHeight: {
            type: Number,
            default: 800
        }
    },

    data() {
        return {
            showHeader: true,
            contentOverflow: false,
            //calculation info
            info: {
                position: 'bottom',
                align: 'center',
                top: 0,
                left: 0,
                width: 'auto',
                height: 'auto'
            }
        };
    },

    computed: {
        classList() {
            return [
                'vui',
                'vui-popup',
                `vui-popup-${this.info.position}-${this.info.align}`,
                'vui-popover',
                this.cid
            ];
        },

        styleList() {
            return {
                top: `${this.info.top}px`,
                left: `${this.info.left}px`,
                width: `${this.info.width}px`,
                height: `${this.info.height}px`
            };
        },

        styleBody() {
            return {
                width: `${this.width}px`
            };
        },

        classContent() {
            const list = [
                'vui-popover-content'
            ];
            if (this.contentOverflow) {
                list.push('vui-popover-content-overflow');
            }
            return list;
        }

    },

    created() {
        this.showHeader = this.hasHeader;
        if (this.showHeader && !this.title) {
            this.showHeader = false;
        }
    },

    mounted() {
        if (this.attachToBody || !this.$el.parentNode) {
            document.body.appendChild(this.$el);
        }
        this.bindEvents();
        this.update();
    },

    beforeUnmount() {
        clearTimeout(this.timeout_close);
        this.updateStop();
        this.unbindEvents();
        this.positionInfo = null;
        this.$emit('close');
    },

    methods: {
        bindEvents() {
            this.bindTargetEvent();
            this.bindResizeEvent();
            this.bindScrollEvent();
            this.bindCloseEvent();
            //after mounted
            this.$watch('dataVisible', this.visibleHandler);
        },

        unbindEvents() {
            this.unbindTargetEvent();
            this.unbindResizeEvent();
            this.unbindScrollEvent();
            this.unbindCloseEvent();
        },

        visibleHandler() {
            if (this.dataVisible) {
                this.bindResizeEvent();
                this.bindScrollEvent();
                this.bindCloseEvent();
                this.update();
            } else {
                this.unbindResizeEvent();
                this.unbindScrollEvent();
                this.unbindCloseEvent();
                this.positionInfo = null;
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
                this.$target.addEventListener('click', this.openHandler);
            }
        },

        unbindTargetEvent() {
            if (this.$target) {
                this.$target.removeEventListener('click', this.openHandler);
                this.$target = null;
            }
        },

        openHandler() {
            if (this.dataVisible) {
                return;
            }
            this.dataVisible = true;
        },

        //=============================================================================

        bindResizeEvent() {
            if (!this.bindResize) {
                return;
            }
            this.unbindResizeEvent();
            window.addEventListener('resize', this.resizeHandler);
        },

        unbindResizeEvent() {
            window.removeEventListener('resize', this.resizeHandler);
        },

        resizeHandler() {
            if (this.bindResize === 'close') {
                this.close();
                return;
            }
            this.update();
        },

        //=============================================================================

        bindScrollEvent() {
            if (!this.bindScroll) {
                return;
            }
            this.unbindScrollEvent();
            window.addEventListener('scroll', this.scrollHandler, true);
        },

        unbindScrollEvent() {
            window.removeEventListener('scroll', this.scrollHandler, true);
        },

        scrollHandler(e) {
            if (this.isInnerElement(e.target)) {
                return;
            }
            if (!this.isParentElement(e.target)) {
                return;
            }
            if (this.bindScroll === 'close') {
                this.close();
                return;
            }
            this.update();
        },

        //=============================================================================

        bindCloseEvent() {
            this.unbindCloseEvent();
            if (this.autoClose && this.dataVisible) {
                this.timeout_close = setTimeout(() => {
                    window.addEventListener('mousedown', this.clickHandler);
                    window.addEventListener('keydown', this.keydownHandler);
                }, 10);
            }
        },

        unbindCloseEvent() {
            window.removeEventListener('mousedown', this.clickHandler);
            window.removeEventListener('keydown', this.keydownHandler);
        },

        clickHandler(e) {
            if (this.isInnerElement(e.target)) {
                return;
            }
            this.close();
        },

        keydownHandler(e) {
            //ESC
            if (e.keyCode !== 27) {
                return;
            }
            this.close();
        },

        //=============================================================================

        isInnerElement(elem) {
            if (this.$el === elem) {
                return true;
            }
            try {
                return this.$el.contains(elem);
            } catch (e) {
                //empty
            }
            return false;
        },

        isParentElement(elem) {

            const targetElement = this.getElement(this.target);
            if (!targetElement) {
                return false;
            }
            let parent = targetElement.parentNode;
            while (parent) {
                if (parent === elem) {
                    return true;
                }
                parent = parent.parentNode;
            }
            return false;
        },

        close() {
            if (!this.dataVisible) {
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

            this.updateContentHeight();

            const rect = this.getRect(`.${this.cid}`);

            //console.log(containerRect, targetRect, rect);

            this.positionInfo = this.getBestPosition(
                containerRect,
                targetRect,
                rect,
                this.positions,
                //previous position info for keeping position if has animation (dynamic size)
                this.positionInfo
            );

            let noChange = true;
            for (const k in this.info) {
                if (this.info[k] !== this.positionInfo[k]) {
                    noChange = false;
                    break;
                }
            }
            if (noChange) {
                return this;
            }

            for (const k in this.info) {
                this.info[k] = this.positionInfo[k];
            }
            this.$emit('update');
            return this;
        },

        updateContentHeight() {
            this.$el.style.height = 'auto';
            const elem = this.$el.querySelector('.vui-popover-content');
            elem.style.height = 'auto';

            const br = elem.getBoundingClientRect();
            const rect = this.toRect(br);
            const ch = rect.height;

            this.contentOverflow = false;
            //fix for min/max height
            if (ch > this.maxHeight) {
                elem.style.height = `${this.maxHeight}px`;
                this.contentOverflow = true;
            } else if (ch < this.minHeight) {
                elem.style.height = `${this.minHeight}px`;
            }

        },

        //=============================================================================

        updateStop() {
            clearTimeout(this.timeout_update_next);
            clearTimeout(this.timeout_update_stop);
            return this;
        },

        updateStart(freq = 10, timeout = 1000) {
            this.updateStop();
            this.updateNext(freq);
            this.timeout_update_stop = setTimeout(() => {
                this.updateStop();
            }, timeout);
            return this;
        },

        updateNext(freq) {
            this.update();
            this.timeout_update_next = setTimeout(() => {
                this.updateNext();
            }, freq);
        },

        updateEnd() {
            this.updateStop();
            this.update();
            return this;
        }
    }
};

</script>

<style lang="scss">
.vui-popover {
    position: absolute;
    visibility: visible;
    z-index: 1000;
    opacity: 1;
    margin: 0;
    padding: 16px;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 20%);
    transition: opacity 0.2s linear, visibility 0.2s linear;

    .vui-popover-header {
        padding-bottom: 5px;
        border-bottom: 1px solid #333;
        margin-bottom: 5px;

        .vui-popover-title {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .vui-popover-content {
        margin: 0;
        padding: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vui-popover-content-overflow {
        overflow-y: auto;
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
