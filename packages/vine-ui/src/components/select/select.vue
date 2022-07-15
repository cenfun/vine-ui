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
    <div
      ref="options"
      class="vui-select-options"
    >
      <slot />
    </div>
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


import {
    //useBase, BaseRender,
    vSelectOnFocus
} from '../../base/base.js';

import IconX from '../../base/images/icon-x.vue';

const viewMinWidth = 50;
const viewMaxWidth = 300;

export default {

    name: 'VuiSelect',

    directives: {
        select: vSelectOnFocus
    },

    components: {
        IconX
    },

    extends: Base,

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
            slotOptions: null,

            viewValue: '',

            viewWidth: this.width

        };
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
            if (this.viewWidth) {
                let w = this.viewWidth;
                if ((/^\d+$/).test(this.viewWidth)) {
                    w += 'px';
                }
                return {
                    'width': `${w}`
                };
            }
            return {};
        },

        list() {
            //props first
            if (this.options) {
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
            // slot options next
            if (this.slotOptions) {
                return this.slotOptions;
            }

            return [];
        }

    },

    watch: {
        list() {
            this.updateViewValue();
        },
        dataModelValue() {
            //do not update when input now
            if (this.searchable && this.isOpen) {
                return;
            }
            this.updateViewValue();
        }
    },

    created() {
        this.init();
    },

    mounted() {

        //this.$refs.options

        const $options = Array.from(this.$refs.options.childNodes).filter((it) => it.nodeType === 1);
        //this.log($options);

        if ($options.length) {
            this.slotOptions = $options.map((elem) => {

                const label = elem.innerText;
                //value could be (empty)
                let value = elem.getAttribute('value');
                if (value === null) {
                    value = label;
                }

                const option = {
                    label,
                    value
                };

                //selected only has key
                const selected = elem.getAttribute('selected');
                const removable = elem.getAttribute('removable');
                if (selected !== null) {
                    option.selected = true;
                }
                if (removable !== null) {
                    option.removable = true;
                }

                return option;
            });

        }

        this.updateViewValue();

        this.$list = this.$refs.list;
        this.$view = this.$refs.view;

        //this.log('mounted');
        this.updateViewWidth('mounted');

    },

    updated() {
        if (this.searchable) {
            //if list is up, need update list top when list height changed by search results
            this.layout();
        }
        //this.log('updated');
        this.updateViewWidth('updated');
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

            const top = this.getListTop(viewRect, listRect, bodyRect);

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

        getListTop(viewRect, listRect, bodyRect) {
            const spacing = 2;

            const topDown = viewRect.top + viewRect.height + spacing;
            const topUp = viewRect.top - listRect.height - spacing;
            const isDownOk = topDown + listRect.height <= bodyRect.height;

            if (isDownOk) {
                return topDown;
            }

            return topUp;
        },

        updateViewWidth(step) {
            if (this.viewWidth) {
                return;
            }
            if (!this.list.length) {
                this.viewWidth = viewMinWidth;
                return;
            }

            const listRect = this.$list.getBoundingClientRect();
            //this.log(step, listRect);
            //border is 2 if empty
            if (listRect.width > 2) {
                const iconWidth = 15;
                //no padding because list have same padding
                this.viewWidth = Util.clamp(Math.ceil(listRect.width) + iconWidth, viewMinWidth, viewMaxWidth);
            }
        },

        updateViewValue() {
            const dv = this.dataModelValue;
            const item = this.list.find((it) => it.value === dv);
            //this.log(item);
            if (item) {
                this.viewValue = dv;
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
            this.updateViewValue();
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
    background-position: right 7px center;
    padding: 0 20px 0 5px;
    border-radius: 5px;
    width: 50px;
    height: 30px;
    border: 1px solid #aaa;
    user-select: none;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:disabled {
        border: 1px solid #ccc;
        color: gray;
        background-image: url("./images/select-disabled.svg");
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

.vui-select-search {
    cursor: text;
}

.vui-select-options {
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
