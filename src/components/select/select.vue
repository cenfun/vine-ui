<template>
  <div :class="['vui','vui-select', classId]">
    <label v-if="label">
      <BaseRender :content="label" />
    </label>
    <select
      v-model="dataModelValue"
      :disabled="disabled"
    >
      <slot>
        <template v-if="list">
          <option
            v-for="item,i in list"
            :key="i"
            :value="item.value"
            :selected="dataModelValue === item.value"
          >
            {{ item.label }}
          </option>
        </template>
      </slot>
    </select>
  </div>
</template>
<script>
import Base from '../../base/base.vue';
import registerComponent from '../../util/register-component.js';
import Util from '../../util/util.js';
const Select = {

    name: 'Select',

    extends: Base,

    props: {
        options: {
            type: Array,
            default: null
        }
    },

    data() {
        return {
            list: null
        };
    },

    created() {
        this.initList();
    },

    methods: {
        initList() {
            if (!Util.isList(this.options)) {
                return;
            }
            this.list = this.options.map((item) => {
                if (item && typeof item === 'object') {
                    if (typeof item.value === 'undefined') {
                        item.value = item.label;
                    }
                    if (typeof item.label === 'undefined') {
                        item.label = item.value;
                    }
                    return item;
                }
                return {
                    label: item,
                    value: item
                };
            });
        }
    }
};

registerComponent(Select);

export default Select;
</script>
<style lang="scss">
.vui-select {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;

    label {
        position: relative;
        padding-right: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
    }

    select {
        display: inline-block;
        padding: 5px;
        font-weight: 400;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #aaa;
        border-radius: 5px;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &:hover {
            border: 1px solid #888;
        }

        &:focus {
            color: #495057;
            background-color: #fff;
            border-color: #80bdff;
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
        }

        &:disabled {
            border: 1px solid #ccc;
        }
    }
}

</style>
