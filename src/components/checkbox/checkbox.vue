<template>
  <div :class="['vui','vui-checkbox', cid]">
    <input
      :id="cid"
      v-model="dataModelValue"
      :disabled="disabled"
      type="checkbox"
    >
    <label :for="cid">
      <slot>
        <BaseRender
          v-if="label"
          :content="label"
        />
      </slot>
    </label>
  </div>
</template>
<script>
import Base from '../../base/base.vue';
import registerComponent from '../../util/register-component.js';
import Util from '../../util/util.js';
const Checkbox = {

    name: 'Checkbox',

    extends: Base,

    props: {
        checked: {
            type: Boolean,
            default: false
        }
    },

    created() {
        if (Util.isInvalid(this.dataModelValue)) {
            this.dataModelValue = this.checked;
        }
    }
};
registerComponent(Checkbox);
export default Checkbox;
</script>
<style lang="scss">
.vui-checkbox {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    line-height: 30px;

    label {
        position: relative;
        display: block;
        padding-left: 25px;
        margin-left: -22px;
        min-height: 30px;
        min-width: 22px;
        max-width: 500px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        &::before {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(3px, -50%);
            display: block;
            width: 16px;
            height: 16px;
            content: "";
            background-color: #fff;
            border: #adb5bd solid 1px;
            border-radius: 3px;
        }

        &::after {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(3px, -50%);
            display: block;
            width: 16px;
            height: 16px;
            content: "";
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 10px 10px;
            background-clip: border-box;
        }
    }

    input {
        display: block;
        width: 22px;
        height: 22px;
        opacity: 0;
        padding: 0;
        margin: 0;

        &:checked {
            ~ label {
                &::before {
                    color: #fff;
                    border-color: #0077cf;
                    background-color: #0077cf;
                }

                &::after {
                    background-image: url("./checkbox.svg");
                }
            }
        }

        &:disabled {
            ~ label {
                color: #6c757d;
            }

            ~ label::before {
                background-color: #e9ecef;
            }
        }

        &:focus {
            ~ label::before {
                box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
            }
        }

        &:focus:not(:checked) {
            ~ label::before {
                border-color: #80bdff;
            }
        }

        &:disabled:checked {
            ~ label::before {
                background-color: rgb(0 123 255 / 50%);
                border-color: #80bdff;
            }
        }

        &:not(:disabled):not(:checked):not(:focus) {
            ~ label:hover::before {
                border-color: #888;
            }
        }
    }
}

</style>
