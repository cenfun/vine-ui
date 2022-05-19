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
import registerComponent from '../../helper/register-component.js';

const Flyover = {

    name: 'Flyover',

    extends: Base,

    props: {
        width: {
            type: String,
            default: '50%'
        },
        position: {
            type: String,
            default: 'right',
            validator(value) {
                return ['right', 'left'].includes(value);
            }
        },
        content: {
            validator: (v) => true,
            default: ''
        },
        attachToBody: {
            type: Boolean,
            default: true
        }
    },

    data: function() {
        return {
            dataWidth: this.width
        };
    },

    computed: {
        classList() {
            
            return [
                'vui',
                'vui-flyover',
                `vui-flyover-${this.position}`,
                this.classId
            ];
        },
        styleList() {
            return {
                width: this.dataWidth
            };
        },
        bodyClass() {
            if (this.position === 'left') {
                return;
            }
            if (this.attachToBody || !this.$el.parentNode) {
                return 'vui-flyover-overflow-hidden';
            }
        }
    },

    watch: {
        dataVisible(nv, ov) {
            this.onStart(nv, ov);
        },
        width() {
            this.dataWidth = this.width;
        }
    },

    created() {
        this.animationHandler = () => {
            this.onEnd(this.dataVisible);
        };
    },

    mounted() {
        // if (this.attachToBody || !this.$el.parentNode) {
        //     document.body.appendChild(this.$el);
        // }
    },

    beforeUnmount() {
        this.unbindEvents();
        this.lockBody(false);
    },

    methods: {

        lockBody(lock) {
            if (!this.bodyClass) {
                return;
            }
            //for body hide scrollbar when animation
            const cl = document.body.classList;
            if (lock) {
                cl.add(this.bodyClass);
            } else {
                cl.remove(this.bodyClass);
            }
        },

        onStart(nv, ov) {
            if (this.hasStarted) {
                this.onEnd(ov);
            }
            this.lockBody(true);
            this.unbindEvents();
            const cl = this.$el.classList;
            if (nv) {
                cl.add(`vui-slide-in-${this.position}`, 'vui-flyover-show');
                this.dataWidth = this.width;
            } else {
                cl.add(`vui-slide-out-${this.position}`);
            }
            this.hasStarted = true;
            this.bindEvents();
        },

        onEnd(v) {
            this.hasStarted = false;
            this.lockBody(false);
            this.unbindEvents();
            const cl = this.$el.classList;
            if (v) {
                cl.remove(`vui-slide-in-${this.position}`);
            } else {
                cl.remove(`vui-slide-out-${this.position}`, 'vui-flyover-show');
                this.dataWidth = '0px';
            }
        },

        bindEvents() {
            this.$el.addEventListener('animationend', this.animationHandler);
        },

        unbindEvents() {
            this.$el.removeEventListener('animationend', this.animationHandler);
        }

    }
};

registerComponent(Flyover);

export default Flyover;

</script>

<style lang="scss">
.vui-flyover {
    position: absolute;
    top: 0;
    z-index: 1000;
    height: 100%;
    width: 0;
    display: none;
    background-color: #fff;
    animation-duration: 0.2s;
    animation-fill-mode: both;
}

.vui-flyover-right {
    right: 0;
}

.vui-flyover-left {
    left: 0;
}

.vui-flyover-show {
    display: block;
}

.vui-flyover-show::before {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 0;
    z-index: 10;
    display: block;
    height: 100%;
    width: 10px;
}

.vui-flyover-right.vui-flyover-show::before {
    left: -10px;
    background-image: linear-gradient(to left, rgb(0 0 0 / 20%), rgb(0 0 0 / 0%));
}

.vui-flyover-left.vui-flyover-show::before {
    left: 100%;
    background-image: linear-gradient(to right, rgb(0 0 0 / 20%), rgb(0 0 0 / 0%));
}

.vui-flyover-overflow-hidden {
    overflow: hidden;
}

@keyframes vui-slide-in-right {
    from {
        transform: translate3d(100%, 0, 0);
        visibility: visible;
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}

.vui-slide-in-right {
    animation-name: vui-slide-in-right;
}

@keyframes vui-slide-out-right {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        visibility: hidden;
        transform: translate3d(100%, 0, 0);
    }
}

.vui-slide-out-right {
    animation-name: vui-slide-out-right;
}

@keyframes vui-slide-in-left {
    from {
        transform: translate3d(-100%, 0, 0);
        visibility: visible;
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}

.vui-slide-in-left {
    animation-name: vui-slide-in-left;
}

@keyframes vui-slide-out-left {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        visibility: hidden;
        transform: translate3d(-100%, 0, 0);
    }
}

.vui-slide-out-left {
    animation-name: vui-slide-out-left;
}
</style>
