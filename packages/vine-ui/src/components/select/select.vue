<template>
  <div
    ref="el"
    :class="classList"
  >
    <label v-if="props.label">
      <BaseRender :content="props.label" />
    </label>

    <input
      v-model="viewValue"
      v-select-on-focus
      type="text"
      :class="viewClass"
      :style="viewStyle"
      :disabled="props.disabled"
      :readonly="!props.searchable"
      @click.stop="onClick"
      @input.stop="onInput"
      @focus="onFocus"
      @blur="onBlur"
    >

    <div class="vui-select-holder">
      <div
        class="vui vui-select-list"
        :style="listStyle"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="getItemClass(item)"
          @mousedown="onItemClick(item)"
        >
          <div class="vui-select-item-label">
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
  </div>
</template>

<script setup>
import {
    computed, nextTick, onMounted, ref, shallowReactive, watch
} from 'vue';
import {
    useBase, BaseRender, vSelectOnFocus, getSlot
} from '../../base/base.js';

import {
    hasOwn, clamp, isList
} from '../../util/util.js';
import IconX from '../../base/images/icon-x.vue';

const { cid, undef } = useBase('VuiSelect');

const classList = ['vui', 'vui-select', cid];

const props = defineProps({
    label: {
        type: String,
        default: ''
    },

    disabled: {
        type: Boolean,
        default: false
    },

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
    },

    value: {
        type: String,
        default: ''
    },

    modelValue: {
        type: String,
        default: () => {
            let ud;
            return ud;
        }
    }
});

const el = ref(null);

const state = shallowReactive({
    $el: null,
    $view: null,
    $list: null,

    isOpen: false,
    shouldOpen: false,

    timeout_display: null,
    lastDirection: 'down',

    // for view width
    width: props.width,
    // label for view display
    selectedLabel: '',
    // value for selected item class
    selectedValue: undef,
    // for search input
    searchValue: undef

});


const viewClass = computed(() => {
    const ls = ['vui-select-view'];
    if (props.searchable) {
        ls.push('vui-select-search');
    }
    return ls;
});

const emit = defineEmits(['search', 'remove', 'update:modelValue']);

const viewStyle = computed(() => {
    if (state.width) {
        return {
            'width': `${state.width}`
        };
    }
    return {};
});

const viewValue = computed({
    get() {
        if (props.searchable && state.searchValue !== undef) {
            return state.searchValue;
        }
        return state.selectedLabel;
    },
    set(v) {
        state.searchValue = v;
    }
});

const listStyle = computed(() => {
    if (state.width) {
        return {
            'min-width': `${state.width}`
        };
    }
    return {};
});


// =========================================================================================================

const initSelectedItem = (ls) => {
    const dv = props.modelValue === undef ? props.value : props.modelValue;

    // console.log(props.label, 'dv', dv);

    const item = ls.find((it) => it.value === dv);
    if (item) {
        state.selectedLabel = item.label;
        state.selectedValue = item.value;
    } else {
        state.selectedLabel = '';
        state.selectedValue = undef;
    }

    // console.log(props.label, 'initSelectedItem', dv, state.selectedLabel);

};


const getListByPropOptions = (ls) => {
    ls = ls.map((item) => {
        if (item && typeof item === 'object') {
            const newItem = {
                ... item
            };
            if (!hasOwn(newItem, 'value') && hasOwn(newItem, 'label')) {
                newItem.value = newItem.label;
            }
            if (!hasOwn(newItem, 'label') && hasOwn(newItem, 'value')) {
                newItem.label = newItem.value;
            }
            return newItem;
        }
        return {
            label: `${item}`,
            value: `${item}`
        };
    });

    initSelectedItem(ls);

    return ls;

};

const getListBySlotOptions = (ls) => {
    if (!isList(ls)) {
        return [];
    }

    const getChildrenLabel = (children) => {
        if (typeof children === 'string') {
            return children;
        }
        if (isList(children)) {
            return children.map((c) => {
                return getChildrenLabel(c.children);
            }).join('');
        }
        return children || '';
    };

    ls = ls.map((vn) => {
        const item = vn.props || {};
        if (!hasOwn(item, 'label')) {
            item.label = getChildrenLabel(vn.children);
        }
        if (!hasOwn(item, 'value')) {
            item.value = item.label;
        }
        if (hasOwn(item, 'selected')) {
            item.selected = true;
        }
        if (hasOwn(item, 'removable')) {
            item.removable = true;
        }
        return item;
    });

    initSelectedItem(ls);

    return ls;
};

// TODO vue bug here, only can put it here not in computed
const slotDefault = getSlot();

const list = computed(() => {
    if (props.options) {
        return getListByPropOptions(props.options);
    }
    return getListBySlotOptions(slotDefault);
});

// =========================================================================================================

const resizeHandler = (e) => {
    // console.log('resizeHandler');
    close();
};

const isSelectInner = (elem) => {
    if (state.$list === elem) {
        return true;
    }
    let inner = false;
    try {
        inner = state.$list.contains(elem);
    } catch (e) {
        // empty
    }
    return inner;
};

const isViewParent = (elem) => {
    const targetElement = state.$view;
    let parent = targetElement.parentNode;
    while (parent) {
        if (parent === elem) {
            return true;
        }
        parent = parent.parentNode;
    }
    return false;
};

const scrollHandler = (e) => {
    // console.log('scrollHandler');
    if (isSelectInner(e.target)) {
        return;
    }
    if (!isViewParent(e.target)) {
        return;
    }
    close();
};


const unbindEvents = () => {
    // console.log('unbindEvents');
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('scroll', scrollHandler, true);
};

const bindEvents = () => {
    unbindEvents();
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('scroll', scrollHandler, true);
};

// =========================================================================================================

const showList = () => {
    document.body.appendChild(state.$list);
    state.isOpen = true;
};

const hideList = () => {
    state.isOpen = false;
    state.$list.remove();
};

// =========================================================================================================

const close = () => {

    // align with open
    state.shouldOpen = false;

    if (!state.isOpen) {
        return;
    }
    state.lastDirection = 'down';
    hideList();
    unbindEvents();
};

const closeAsync = () => {
    clearTimeout(state.timeout_display);
    state.timeout_display = setTimeout(() => {
        close();
    }, 100);
};

// =========================================================================================================

const getListTop = (viewRect, listRect, bodyRect) => {
    const space = 2;

    const top = {
        down: viewRect.top + viewRect.height + space,
        up: viewRect.top - listRect.height - space
    };

    const ok = {
        down: top.down + listRect.height <= bodyRect.height,
        up: top.up > 0
    };

    // console.log(top, ok);

    if (ok[state.lastDirection]) {
        return top[state.lastDirection];
    }

    if (ok.down) {
        state.lastDirection = 'down';
        return top.down;
    }

    state.lastDirection = 'up';
    return top.up;
};

const getRect = (elem) => {
    const br = elem.getBoundingClientRect();
    const rect = {
        left: br.left + window.pageXOffset,
        top: br.top + window.pageYOffset,
        width: elem.offsetWidth,
        height: elem.offsetHeight
    };

    return rect;
};

const layout = () => {

    const viewRect = getRect(state.$view);
    const listRect = getRect(state.$list);
    const bodyRect = getRect(document.body);

    const top = getListTop(viewRect, listRect, bodyRect);

    let left = Math.max(viewRect.left, 0);
    if (left + listRect.width > bodyRect.width) {
        left = bodyRect.width - listRect.width;
    }

    // console.log('left', left, 'top', top);

    const st = state.$list.style;
    st.left = `${left}px`;
    st.top = `${top}px`;

    // selected element.scrollIntoView();
    const $selected = state.$list.querySelector('.vui-select-item.selected');
    if ($selected) {
        // scrollIntoView cased whole page scroll if body scrollable
        // $selected.scrollIntoView();
        $selected.parentNode.scrollTop = $selected.offsetTop;
    }

};

const layoutAsync = () => {
    if (props.disabled) {
        return;
    }

    if (!state.$el) {
        return;
    }

    if (state.shouldOpen && !state.isOpen) {
        nextTick(() => {
            open();
        });
        return;
    }

    if (!state.isOpen) {
        return;
    }

    nextTick(() => {
        layout();
    });

};

const open = () => {
    if (props.disabled) {
        return;
    }

    state.shouldOpen = true;

    if (state.isOpen) {
        return;
    }

    if (!list.value.length) {
        return;
    }

    showList();
    layout();
    bindEvents();
};

// when opened list and click out side browser will blur
// then click body will trigger focus and blur, that not make sense
const openAsync = () => {
    clearTimeout(state.timeout_display);
    state.timeout_display = setTimeout(() => {
        open();
    }, 100);
};

// =========================================================================================================

const onClick = (e) => {
    open();
};

const onInput = (e) => {
    emit('search', e);
};

const onFocus = (e) => {
    // console.log('onFocus', cid);
    openAsync();
};

const onBlur = (e) => {
    // console.log('onBlur', cid);
    state.searchValue = undef;
    closeAsync();
};


// =========================================================================================================


const getItemClass = (item) => {
    const ls = ['vui-select-item'];
    if (item.value === state.selectedValue) {
        ls.push('selected');
    }
    return ls;
};

const onItemClick = (item) => {

    state.searchValue = undef;
    state.selectedLabel = item.label;
    state.selectedValue = item.value;

    // console.log(props.label, 'onItemClick', item, state.selectedLabel);

    emit('update:modelValue', item.value);
    close();
};

const onItemRemove = (item) => {
    emit('remove', item);
};


// =========================================================================================================

const initWidth = () => {

    if (state.width) {
        return;
    }

    const listRect = state.$list.getBoundingClientRect();
    // border is 2 if empty
    if (listRect.width <= 2) {
        return;
    }

    // Symbol, last latter is l will be cut, so + 1
    const iconWidth = 15 + 1;
    const viewMinWidth = 50;
    const viewMaxWidth = 350;
    // no padding because list have same padding
    const w = clamp(Math.ceil(listRect.width) + iconWidth, viewMinWidth, viewMaxWidth);
    state.width = `${w}px`;

};

watch(list, () => {
    layoutAsync();
});


onMounted(() => {
    state.$el = el.value;

    state.$view = state.$el.querySelector('.vui-select-view');
    state.$list = state.$el.querySelector('.vui-select-list');

    initWidth();
});

</script>

<style lang="scss">
.vui-select {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;

    label {
        position: relative;
        display: inline-block;
        padding-right: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.vui-select-view {
    position: relative;
    width: 50px;
    height: 30px;
    min-width: 50px;
    padding: 0 20px 0 5px;
    border: 1px solid #aaa;
    border-radius: 5px;
    background-image: url("./images/select.svg");
    background-repeat: no-repeat;
    background-position: right 7px center;
    background-size: 8px 10px;
    cursor: default;
    user-select: none;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:disabled {
        color: gray;
        border: 1px solid #ccc;
        background-image: url("./images/select-disabled.svg");
    }

    &:not(:disabled):hover {
        border: 1px solid #888;
    }

    &:not(:disabled):focus {
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
    }
}

.vui-select-search {
    cursor: text;
}

/* holder for width computed */
.vui-select-holder {
    position: absolute;
    width: 500px;
    visibility: hidden;
}

/* top/left -500px will not caused body size change */
.vui-select-list {
    position: absolute;
    top: -500px;
    left: -500px;
    z-index: 10000;
    max-width: 350px;
    max-height: 300px;
    border: 1px solid #aaa;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 20%);
    overflow-x: hidden;
    overflow-y: auto;
}

.vui-select-item-label {
    flex: 1 1 0%;
    min-height: 1rem;
    overflow: hidden;
}

.vui-select-item-remove {
    position: relative;
    width: 25px;
    height: 20px;
    color: #000;
    visibility: hidden;
    cursor: pointer;
    opacity: 0.6;

    &:hover {
        opacity: 1;
    }
}

.vui-select-item {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 5px;
    color: #555;
    border-bottom: 1px solid #eee;
    cursor: pointer;

    &:hover {
        background: #e8e8e8;

        .vui-select-item-remove {
            visibility: visible;
        }
    }

    &:nth-last-child(1) {
        border-bottom: none;
    }

    &.selected {
        color: #fff;
        background: #666;

        .vui-select-item-remove {
            color: #fff;
        }
    }

    &.selected:hover {
        background: #555;
    }
}
</style>
