<template>
  <div :class="classList">
    <div class="vui-loading-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
      ><path
        d="M1,8 A7 7 0 1 1 8 15"
        :stroke="color||'#999'"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"
      /></svg>
    </div>
  </div>
</template>
<script>
import Base from '../../base/base.vue';
import registerComponent from '../../helper/register-component.js';

const Loading = {
    name: 'Loading',

    extends: Base,

    props: {
        center: {
            type: Boolean,
            default: false
        },
        fast: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: '#999'
        },
        size: {
            type: String,
            default: 'm',
            validator(value) {
                return ['', 's', 'm', 'l'].includes(value);
            }
        },
        theme: {
            type: String,
            default: ''
        }
        // percent: {
        //     type: String,
        //     default: ''
        // }
    },

    computed: {
        classList() {
            const ls = ['vui-loading'];
            if (this.center) {
                ls.push('vui-loading-center');
            }
            if (this.fast) {
                ls.push('vui-loading-fast');
            }
            ls.push(`vui-loading-${this.size || 'm'}`);
            if (this.visible) {
                ls.push('vui-loading-show');
            }
            ls.push(this.classId);
            return ls;
        }
    }
};

registerComponent(Loading);

export default Loading;
</script>
<style lang="scss">
.vui-loading {
    position: relative;
    pointer-events: none;
    display: none;
    overflow: hidden;
    z-index: 1000;
}

.vui-loading-show {
    display: inline-block;
}

@keyframes vui-loading-icon-animation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.vui-loading-icon {
    display: block;
    animation: 1s vui-loading-icon-animation linear infinite;
}

.vui-loading-fast .vui-loading-icon {
    animation: 0.382s vui-loading-icon-animation linear infinite;
}

.vui-loading-s .vui-loading-icon {
    width: 16px;
    height: 16px;
}

.vui-loading-m .vui-loading-icon {
    width: 30px;
    height: 30px;
}

.vui-loading-l .vui-loading-icon {
    width: 50px;
    height: 50px;
}

.vui-loading-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.vui-loading-center.vui-loading-show {
    display: block;
}

</style>