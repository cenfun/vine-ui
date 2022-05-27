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
      :class="viewClass"
      :style="viewStyle"
      :disabled="disabled"
      :readonly="!searchable"
      @click.stop="onClick"
      @input.stop="onInput"
      @focus="onFocus"
      @blur="onBlur"
    >
    <select
      ref="select"
      disabled
      class="vui-select-select"
    >
      <slot />
    </select>
    <div
      ref="list"
      class="vui vui-select-list"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        class="vui-select-item"
        :class="item.value === dataModelValue ? 'selected':''"
        @mousedown="onItemClick(item)"
      >
        <div
          class="vui-select-item-label"
        >
          {{ item.label }}
        </div>
        <div
          v-if="item.removable"
          class="vui-select-item-remove"
          @mousedown.stop="onItemRemove(item)"
        >
          <IconX />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Util } from '../..';
import Base from '../../base/base.vue';
import selectOnFocus from '../../util/select-on-focus.js';

import IconX from '../../base/images/icon-x.vue';

const Select = {

    name: 'Select',

    extends: Base,

    directives: {
        select: selectOnFocus
    },

    components: {
        IconX
    },

    props: {
        options: {
            type: Array,
            default: null
        },

        width: {
            type: String,
            default: ''
        },

        searchable: {
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
            viewWidth: 50,
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
                    label: option.textContent,
                    selected: option.selected
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
                }
            },
            immediate: true
            
        }
    },

    computed: {
        classList() {
            return [
                'vui',
                'vui-select',
                this.cid
            ];
        },

        viewClass() {
            const ls = ['vui-select-view'];
            if (this.searchable) {
                ls.push('vui-select-search');
            }
            return ls;
        },

        viewStyle() {
            return {
                'width': `${this.viewWidth}px`
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
        if (this.searchable) {
            this.layout();
        }
        if (this.firstUpdateWidth) {
            this.firstUpdateWidth = false;
            this.updateWidth();
        }
    },

    methods: {

        init: function() {

            this.resizeHandler = (e) => {
                //console.log('resizeHandler');
                this.close();
            };

            this.scrollHandler = (e) => {
                //console.log('scrollHandler');
                if (this.isSelectInner(e.target)) {
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
            window.removeEventListener('resize', this.resizeHandler);
            window.removeEventListener('scroll', this.scrollHandler, true);
        },

        bindEvents: function() {
            this.unbindEvents();
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
            const $selected = this.$list.querySelector('.vui-select-item.selected');
            if ($selected) {
                $selected.scrollIntoView();
            }

        },

        updateWidth() {
            if (this.width) {
                this.viewWidth = this.width;
            } else {
                const listRect = this.$list.getBoundingClientRect();
                this.viewWidth = Util.clamp(Math.ceil(listRect.width) + 15, this.listMinWidth, this.listMaxWidth);
            }
        },

        closeAsync() {
            clearTimeout(this.timeout_close);
            this.timeout_close = setTimeout(() => {
                this.close();
            }, 100);
        },

        close() {
            this.isOpen = false;
            this.unbindEvents();
            this.$list.remove();
        },

        onItemClick(item) {
            //this.log('onItemClick', item);
            this.dataModelValue = item.value;
            this.close();
        },

        onItemRemove(item) {
            //this.log('remove', item);
            this.$emit('remove', item);
        },

        onClick(e) {
            //this.log('onClick');
            this.open();
        },

        onInput(e) {
            //this.log(e);
            // e.preventDefault();
            // e.stopImmediatePropagation();
            this.$emit('search', e);
        },

        onFocus(e) {
            //console.log('onFocus', this.cid);
            this.open();
        },

        onBlur(e) {
            //console.log('onBlur', this.cid);
            this.closeAsync();
        },

        isSelectInner(elem) {
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
}

.vui-select-view {
    cursor: default;
    position: relative;
    background-image: url("./images/select.svg");
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

.vui-select-search {
    cursor: text;
}

.vui-select-select {
    display: none;
}

.vui-select-list {
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

.vui-select-item-label {
    min-height: 1rem;
    flex: 1;
    overflow: hidden;
}

.vui-select-item-remove {
    position: relative;
    cursor: pointer;
    width: 25px;
    height: 20px;
    visibility: hidden;
    color: #000;
    opacity: 0.6;

    &:hover {
        opacity: 1;
    }
}

.vui-select-item {
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

        .vui-select-item-remove {
            color: #fff;
        }
    }

    &:hover {
        background: #e8e8e8;

        .vui-select-item-remove {
            visibility: visible;
        }
    }

    &.selected:hover {
        background: #555;
    }
}

</style>
