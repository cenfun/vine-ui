<template>
  <div
    :class="classList"
  >
    <label v-if="label">
      <BaseRender :content="label" />
    </label>
    <input
      ref="view"
      v-model="viewValue"
      v-select
      v-bind="$attrs"
      type="text"
      :class="listClass"
      :style="listStyle"
      :disabled="disabled"
      :readonly="!input"
      @click.stop="onClick"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    >
    <select
      ref="select"
      disabled
      class="vui-dropdown-select"
    >
      <slot />
    </select>
    <div
      ref="list"
      class="vui vui-dropdown-list"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        class="vui-dropdown-item"
        :class="item.value === dataModelValue ? 'selected':''"
        @click="onItemClick(item)"
      >
        <div
          class="vui-dropdown-item-label"
        >
          {{ item.label }}
        </div>
        <div
          v-if="item.delete"
          class="vui-dropdown-item-delete"
          @click.stop="onItemDelete(item)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { Util } from '../..';
import Base from '../../base/base.vue';
import selectOnFocus from '../../helper/select-on-focus.js';

import registerComponent from '../../helper/register-component.js';

const Dropdown = {

    name: 'Dropdown',

    extends: Base,

    directives: {
        select: selectOnFocus
    },

    components: {
    },

    props: {
        options: {
            type: Array,
            default: null
        },

        multiple: {
            type: Boolean,
            default: false
        },

        width: {
            type: String,
            default: ''
        },

        input: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            viewValue: '',
            //for options from slots
            listOptions: null,

            listMinWidth: 45,
            listMaxWidth: 300,
            listWidth: 50,
            listVisible: false
        };
    },

    created() {
        this.init();
    },

    mounted() {

        const options = Array.from(this.$refs.select.options);
        if (options.length) {
            this.listOptions = options.map((option) => {
                return {
                    value: option.value,
                    label: option.textContent
                };
            });
            this.firstUpdateWidth = true;
        }

        this.$list = this.$refs.list;
        this.$view = this.$refs.view;
        this.updateWidth();

    },

    watch: {

        dataModelValue: {

            handler(newName, oldName) {
                const item = this.list.find((it) => it.value === this.dataModelValue);
                if (item) {
                    this.viewValue = this.dataModelValue;
                } else {
                    this.viewValue = '';
                }
            },
            immediate: true
            
        }
    },

    computed: {
        classList() {
            return [
                'vui',
                'vui-dropdown',
                this.classId
            ];
        },

        listClass() {
            const ls = ['vui-dropdown-view'];
            if (this.input) {
                ls.push('vui-dropdown-input');
            }
            return ls;
        },

        listStyle() {
            return {
                'width': `${this.listWidth}px`
            };
        },

        list() {

            if (!Util.isList(this.options)) {
                if (this.listOptions) {
                    return this.listOptions;
                }
                return [];
            }

            const list = this.options.map(function(item) {
                if (item && typeof item === 'object') {
                    return {
                        ... item,
                        label: item.label || item.value,
                        value: item.value || item.label
                    };
                }
                return {
                    label: `${item}`,
                    value: `${item}`
                };
            });

            //console.log(list);

            return list;
        }

    },

    updated() {
        if (this.input) {
            this.layout();
        }
        if (this.firstUpdateWidth) {
            this.firstUpdateWidth = false;
            this.updateWidth();
        }
    },

    methods: {

        init: function() {

            this.documentClickHandler = (e) => {
                //console.log('documentClickHandler');
                if (this.isDropdownInner(e.target)) {
                    return;
                }
                this.close();
            };

            this.resizeHandler = (e) => {
                //console.log('resizeHandler');
                this.close();
            };

            this.scrollHandler = (e) => {
                //console.log('scrollHandler');
                if (this.isDropdownInner(e.target)) {
                    return;
                }
                if (!this.isViewParent(e.target)) {
                    return;
                }
                this.close();
            };

        },

        unbindEvents: function() {
            //console.log('unbindEvents');
            document.removeEventListener('click', this.documentClickHandler);
            window.removeEventListener('resize', this.resizeHandler);
            window.removeEventListener('scroll', this.scrollHandler, true);
        },

        bindEvents: function() {
            this.unbindEvents();
            document.addEventListener('click', this.documentClickHandler);
            window.addEventListener('resize', this.resizeHandler);
            window.addEventListener('scroll', this.scrollHandler, true);
        },


        open: function() {

            if (this.isOpen) {
                return;
            }

            if (this.disabled) {
                return;
            }

            if (!this.list.length) {
                return;
            }
            
            document.body.appendChild(this.$list);

            this.$list.style.visibility = 'visible';

            this.isOpen = true;

            this.layout();

            this.bindEvents();

        },

        layout: function() {
            if (!this.isOpen) {
                return;
            }

            if (!this.$view) {
                return;
            }

            const viewRect = this.$view.getBoundingClientRect();
            const listRect = this.$list.getBoundingClientRect();
            const bodyRect = document.body.getBoundingClientRect();

            const spacing = 2;

            let top = Math.max(viewRect.top + viewRect.height + spacing, 0);
            if (viewRect.top + viewRect.height + listRect.height > bodyRect.height) {
                top = viewRect.top - listRect.height - spacing;
            }

            let left = Math.max(viewRect.left, 0);
            if (left + listRect.width > bodyRect.width) {
                left = bodyRect.width - listRect.width;
            }

            const st = this.$list.style;
            st.left = `${left}px`;
            st.top = `${top}px`;
            st.minWidth = `${viewRect.width}px`;

            //selected element.scrollIntoView();
            const $selected = this.$list.querySelector('.vui-dropdown-item.selected');
            if ($selected) {
                $selected.scrollIntoView();
            }

        },

        updateWidth() {
            if (this.width) {
                this.listWidth = this.width;
            } else {
                const listRect = this.$list.getBoundingClientRect();
                this.listWidth = Util.clamp(Math.ceil(listRect.width) + 15, this.listMinWidth, this.listMaxWidth);
            }
        },

        closeAsync() {
            clearTimeout(this.timeout_close);
            this.timeout_close = setTimeout(() => {
                this.close();
            }, 200);
        },

        close() {
            this.isOpen = false;
            this.unbindEvents();
            this.$list.remove();
        },

        onItemClick(item) {
            //console.log('onItemClick', item);
            this.dataModelValue = item.value;
            this.close();
        },

        onItemDelete(item) {
            this.$emit('delete', item);
        },

        onClick(e) {
            //console.log('onClick');
            this.open();
        },

        onInput(e) {
            this.$emit('input', e.target.value);
        },

        onFocus(e) {
            //console.log('onFocus', this.classId);
            this.open();
        },

        onBlur(e) {
            //console.log('onBlur', this.classId);
            this.closeAsync();
        },

        isDropdownInner(elem) {
            if (this.$list === elem) {
                return true;
            }
            let inner = false;
            try {
                inner = this.$list.contains(elem);
            } catch (e) {
                //empty
            }
            return inner;
        },

        isViewParent(elem) {
            const targetElement = this.$view;
            let parent = targetElement.parentNode;
            while (parent) {
                if (parent === elem) {
                    return true;
                }
                parent = parent.parentNode;
            }
            return false;
        }

    }

};

registerComponent(Dropdown);

export default Dropdown;
</script>
<style lang="scss">
.vui-dropdown {
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
}

.vui-dropdown-view {
    cursor: default;
    position: relative;
    background-image: url("./dropdown.svg");
    background-repeat: no-repeat;
    background-size: 8px 10px;
    background-position: right 5px center;
    padding: 0 20px 0 5px;
    border-radius: 5px;
    height: 30px;
    border: 1px solid #aaa;
    user-select: none;
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
        color: gray;
    }

    &:hover:not(:disabled) {
        border: 1px solid #aaa;
    }

    &.disabled {
        background-color: #eee;
    }

    &:focus:not(:disabled) {
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
    }
}

.vui-dropdown-input {
    cursor: text;
}

.vui-dropdown-select {
    display: none;
}

.vui-dropdown-list {
    position: fixed;
    background-color: #fff;
    z-index: 10000;
    border: 1px solid #aaa;
    border-radius: 5px;
    max-width: 350px;
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 20%);
    visibility: hidden;
}

.vui-dropdown-item {
    padding: 8px 5px;
    position: relative;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    color: #555;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:nth-last-child(1) {
        border-bottom: none;
    }

    &.selected {
        background: #666;
        color: #fff;
    }

    &:hover {
        background: #e8e8e8;
    }

    &.selected:hover {
        background: #555;
    }
}

.vui-dropdown-item-label {
    min-height: 1rem;
    flex: 1;
}

.vui-dropdown-item-delete {
    position: relative;
    cursor: pointer;
    width: 20px;
    height: 100%;
    visibility: hidden;

    &::after {
        content: "X";
        font-size: 18px;
        font-weight: bold;
        position: absolute;
        color: currentcolor;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &:hover {
        color: #000;
    }
}

.vui-dropdown-item:hover .vui-dropdown-item-delete {
    visibility: visible;
}

.vui-dropdown-item.selected .vui-dropdown-item-delete:hover {
    color: #fff;
}
</style>
