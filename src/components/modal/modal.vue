<template>
  <div :class="['vui','vui-modal', classId]">
    <div
      class="vui-modal-main vui-flex-column"
      :style="styleMain"
    >
      <div :class="classHeader">
        <BaseRender :content="title" />
      </div>
      <div class="vui-modal-content vui-flex-auto">
        <slot>
          <BaseRender
            v-if="content"
            :content="content"
          />
        </slot>
      </div>
    </div>
    <div class="vui-modal-close">
      X
    </div>
  </div>
</template>

<script>
import Base from '../../base/base.vue';
import registerComponent from '../../helper/register-component.js';

const Modal = {

    name: 'Modal',

    extends: Base,

    props: {
        content: {
            validator: (v) => true,
            default: ''
        },
        padding: {
            type: String,
            default: '20%'
        },
        headerSpacing: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        classHeader() {
            const ls = ['vui-modal-header'];
            if (this.headerSpacing) {
                ls.push('vui-modal-header-spacing');
            }
            return ls;
        },
        styleMain: function() {
            return {
                left: this.padding,
                right: this.padding,
                top: this.padding,
                bottom: this.padding
            };
        }
    },

    mounted() {

        //close event handler
        const bindEvents = (e) => {
            const $main = this.$el.querySelector('.vui-modal-main');
            if ($main === e.target || $main.contains(e.target)) {
                return;
            }
            document.removeEventListener('click', bindEvents);
            this.destroy();
        };

        setTimeout(() => {
            document.addEventListener('click', bindEvents);
        }, 100);

    }

};

registerComponent(Modal);

export default Modal;
</script>
<style lang="scss">
.vui-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 20%);
    z-index: 1000;
}

.vui-modal-close {
    position: absolute;
    top: 20%;
    right: 20%;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: #fff;
    cursor: pointer;
    font-size: 20px;
    text-align: center;
    margin-top: -15px;
    margin-right: -15px;
    line-height: 40px;
}

.vui-modal-main {
    position: absolute;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
}

.vui-modal-header {
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
}

.vui-modal-header-spacing {
    margin-bottom: 10px;
}

.vui-modal-content {
    width: 100%;
    position: relative;
}

</style>
