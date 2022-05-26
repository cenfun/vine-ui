<template>
  <button
    :class="classList"
    :disabled="disabled"
  >
    <slot>
      <BaseRender
        v-if="label"
        :content="label"
      />
    </slot>
  </button>
</template>
<script>
import Base from '../../base/base.vue';
import registerComponent from '../../util/register-component.js';
const Button = {
    
    name: 'Button',

    extends: Base,

    props: {
        primary: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        classList() {
            const ls = [
                'vui',
                'vui-button'
            ];
            if (this.primary) {
                ls.push('vui-button-primary');
            }
            ls.push(this.cid);
            return ls;
        }
    }

};

registerComponent(Button);

export default Button;
</script>
<style lang="scss">
.vui-button {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    background-color: #f5f5f5;
    border: 1px solid transparent;
    padding: 5px 8px;
    border-radius: 5px;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
    color: #6c757d;
    border-color: #6c757d;
    min-width: 50px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:focus {
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
    }

    &:disabled {
        opacity: 0.65;
    }

    &:not(:disabled) {
        cursor: pointer;
    }

    &:not(:disabled):hover {
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
    }

    &.vui-button-primary {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;

        &:hover {
            color: #fff;
            background-color: #0069d9;
            border-color: #0062cc;
        }

        &:focus {
            box-shadow: 0 0 0 0.2rem rgb(38 143 255 / 50%);
        }

        &:disabled {
            opacity: 0.65;
            color: #fff;
            background-color: #6c757d;
            border-color: #6c757d;
        }
    }
}

</style>
