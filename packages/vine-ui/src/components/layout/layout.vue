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
import {
    unbindEvents, bindEvents, preventDefault
} from '../../util/util.js';

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
        // console.log(children);
        if (children.length < 2) {
            return;
        }
        children.length -= 1;
        children.forEach((child, i) => {
            const gutter = document.createElement('div');
            gutter.className = 'vui-layout-gutter';
            child.insertAdjacentElement('afterend', gutter);
        });

        this.bindEvents();

    },

    methods: {
        bindEvents() {
            this.mousedownEvents = {
                mousedown: {
                    handler: (e) => {
                        this.startHandler(e);
                    }
                }
            };
            bindEvents(this.mousedownEvents, this.$el);
        },

        startHandler(e) {

            const cl = e.target.classList;
            if (!cl.contains('vui-layout-gutter')) {
                return;
            }

            cl.add('vui-layout-active');
            this.$el.classList.add('vui-layout-moving');

            this.initNodes(e);

            this.option = {
                startX: e.pageX,
                startY: e.pageY,
                offsetX: 0,
                offsetY: 0
            };

            //stop nested layout event
            e.stopImmediatePropagation();
            //console.log('start');

            this.windowEvents = {
                mousemove: {
                    handler: (ee) => {
                        this.iframeHandler(ee);
                        this.mouseMoveHandler(ee);
                    },
                    options: true
                },
                mouseup: {
                    handler: (ee) => {
                        cl.remove('vui-layout-active');
                        this.mouseUpHandler(ee);
                    },
                    options: {
                        once: true
                    }
                }
            };
            bindEvents(this.windowEvents, window);
        },

        initNodes(e) {
            this.prevNode = null;
            this.nextNode = null;

            const prevNode = e.target.previousElementSibling;
            const nextNode = e.target.nextElementSibling;

            // const prevStyle = getComputedStyle(prevNode);
            // const nextStyle = getComputedStyle(nextNode);
            // console.log('prev:', prevStyle.flexBasis, 'next:', nextStyle.flexBasis);

            const sizeKey = this.direction === 'row' ? 'clientWidth' : 'clientHeight';

            if (prevNode) {
                this.prevSize = prevNode[sizeKey];
                this.prevNode = prevNode;
            }

            if (nextNode) {
                this.nextSize = nextNode[sizeKey];
                this.nextNode = nextNode;
            }
        },

        clean() {
            unbindEvents(this.windowEvents);
            this.windowEvents = null;
            if (this.previousIframe) {
                this.previousIframe.classList.remove('iframe-pointer-events-none');
                this.previousIframe = null;
            }
            this.$el.classList.remove('vui-layout-moving');
            this.prevNode = null;
            this.nextNode = null;
        },

        iframeHandler: function(e) {
            const target = e.target;
            if (target.nodeName !== 'IFRAME') {
                return;
            }
            if (target === this.previousIframe) {
                return;
            }
            if (this.previousIframe) {
                this.previousIframe.classList.remove('iframe-pointer-events-none');
            }
            target.classList.add('iframe-pointer-events-none');
            this.previousIframe = target;
        },

        mouseMoveHandler: function(e) {
            preventDefault(e);
            const o = this.option;
            o.offsetX = e.pageX - o.startX;
            o.offsetY = e.pageY - o.startY;
            this.updateHandler(e);
        },

        mouseUpHandler: function(e) {
            preventDefault(e);
            this.clean();
        },

        updateHandler(e) {
            const offsetKey = this.direction === 'row' ? 'offsetX' : 'offsetY';
            const offset = this.option[offsetKey];

            //console.log(offset);
            //console.log(this.prevNode, this.nextNode);

            const prevSize = this.prevSize + offset;
            const nextSize = this.nextSize - offset;
            if (prevSize < 0 || nextSize < 0) {
                return;
            }

            //const styleKey = this.direction === 'row' ? 'width' : 'height';
            const styleKey = 'flexBasis';
            if (this.prevNode) {
                this.prevNode.style[styleKey] = `${prevSize}px`;
            }
            if (this.nextNode) {
                this.nextNode.style[styleKey] = `${nextSize}px`;
            }

        },

        beforeUnmount() {
            this.clean();
            unbindEvents(this.mousedownEvents);
            this.mousedownEvents = null;
        }
    }
};

</script>

<style lang="scss">
.iframe-pointer-events-none {
    pointer-events: none;
}

.vui-layout {
    position: relative;
}

.vui-layout-moving > {
    * {
        pointer-events: none;
    }

    .vui-layout-active {
        background-color: #0077cf;
        pointer-events: auto;
    }
}

.vui-layout-row > * {
    height: 100%;
}

.vui-layout-column > * {
    width: 100%;
}

.vui-layout-gutter {
    position: relative;
    z-index: 100;
}

.vui-layout-gutter:hover {
    background-color: #0077cf;
}

.vui-layout-gutter::after {
    content: "";
    position: absolute;
    display: block;
    background-color: transparent;
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
        transform: translateX(-50%);
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
        transform: translateY(-50%);
    }
}

</style>
