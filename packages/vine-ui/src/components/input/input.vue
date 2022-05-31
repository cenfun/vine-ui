<template>
  <div :class="['vui','vui-input', cid]">
    <label v-if="labelContent">
      <slot>
        <BaseRender
          v-if="label"
          :content="label"
        />
      </slot>
    </label>
    <input
      v-model="dataModelValue"
      v-select
      :disabled="disabled"
      :placeholder="placeholder"
      :type="type"
      :style="{ width: width }"
      :title="title"
    >
  </div>
</template>
<script>
import Base from '../../base/base.vue';
import selectOnFocus from '../../util/select-on-focus.js';
export default {

    name: 'VuiInput',

    directives: {
        select: selectOnFocus
    },

    extends: Base,

    props: {
        placeholder: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        width: {
            type: String,
            default: '80px'
        }
    },

    computed: {

        labelContent() {
            return this.label || this.$slots.default;
        }

    }

};

</script>
<style lang="scss">
.vui-input {
    display: flex;
    flex-direction: row;
    align-items: center;

    label {
        padding-right: 5px;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 200px;
        overflow: hidden;
    }

    input {
        display: inline-block;
        padding: 5px;
        font-weight: 400;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #aaa;
        border-radius: 5px;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &:disabled {
            border: 1px solid #ccc;
            color: gray;
        }

        &:hover:not(:disabled) {
            border: 1px solid #888;
        }

        &:focus:not(:disabled) {
            border-color: #80bdff;
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
        }
    }
}
</style>