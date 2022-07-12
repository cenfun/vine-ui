<template>
  <div :class="['vui','vui-radio', cid]">
    <input
      :id="cid"
      :checked="dataModelValue === value"
      :disabled="disabled"
      :name="name"
      type="radio"
      @change="onChange"
    >
    <label :for="cid">
      <slot>
        <BaseRender :content="label" />
      </slot>
    </label>
  </div>
</template>
<script>
import Base from '../../base/base.vue';
import Util from '../../util/util.js';
export default {

    name: 'VuiRadio',

    extends: Base,

    props: {
        name: {
            type: String,
            default: ''
        },
        checked: {
            type: Boolean,
            default: false
        }
    },

    created() {
        if (Util.isInvalid(this.dataModelValue)) {
            if (this.checked) {
                this.dataModelValue = this.value;
            }
        }
    },

    methods: {
        onChange: function(e) {
            const checked = e.target.checked;
            if (checked) {
                this.dataModelValue = this.value;
            }
        }
    }
};

</script>
<style lang="scss">
.vui-radio {
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
            border-radius: 50%;
            content: "";
            background: #fff;
            border: #adb5bd solid 1px;
        }

        &::after {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(6px, -50%);
            display: none;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            content: "";
            background: #0077cf;
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
            ~ label::before {
                border-color: #0077cf;
            }

            ~ label::after {
                display: block;
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
            ~ label {
                &::before {
                    border-color: #80bdff;
                }

                &::after {
                    background-color: rgb(0 123 255 / 50%);
                }
            }
        }

        &:not(:disabled, :checked, :focus) {
            ~ label:hover::before {
                border-color: #888;
            }
        }
    }
}

</style>
