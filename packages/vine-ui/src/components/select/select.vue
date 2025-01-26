<template>
  <div
    ref="elRef"
    :class="['vui-select', cid]"
  >
    <label v-if="props.label">
      {{ props.label }}
    </label>

    <div
      class="vui-select-view"
      :style="viewStyle"
    >
      <input
        v-model="data.viewLabel"
        v-select-on-focus="props.selectOnFocus"
        type="text"
        :class="props.searchable?'vui-select-search':''"
        :disabled="props.disabled"
        :readonly="!props.searchable"
        @click.stop="onClick"
        @input.stop="onInput"
        @focus="onFocus"
        @blur="onBlur"
      >
      <span>{{ data.widthLabel }}</span>
    </div>
    <div class="vui-select-options">
      <div class="vui-select-list">
        <div
          v-for="item in data.list"
          :key="item.index"
          :class="['vui-select-item', item.selected?'selected':'']"
          @mousedown="onItemClick(item)"
        >
          <div class="vui-select-item-label">
            {{ item.label }}
          </div>
          <div
            v-if="item.removable"
            class="vui-select-item-remove"
            @mousedown.stop.prevent="onItemRemove(item)"
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
    computed, onMounted,
    ref, shallowReactive,
    watch, watchEffect,
    useSlots,
    nextTick
} from 'vue';
import { microtask } from 'async-tick';

import {
    hasOwn, isList, autoPx, toStr, bindEvents, unbindEvents, getCID, vSelectOnFocus, getSlot
} from '../../utils/util.js';

import IconX from '../../images/icon-x.vue';

const cid = getCID('VuiSelect');

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

    minWidth: {
        type: String,
        default: ''
    },

    maxWidth: {
        type: String,
        default: ''
    },

    searchable: {
        type: Boolean,
        default: false
    },

    selectOnFocus: {
        type: Boolean,
        default: true
    },

    value: {
        type: [String, Number],
        default: ''
    },

    modelValue: {
        type: [String, Number],
        default: null
    }
});

const slots = useSlots();
const emit = defineEmits(['update:modelValue', 'change', 'search', 'remove']);

const data = shallowReactive({

    // from v-model
    value: '',
    // from list selected item
    viewLabel: '',

    list: [],

    isOpen: false,
    shouldOpen: false,

    lastDirection: 'down',

    widthLabel: ' ',

    selectedIndex: -1,
    // label for view display
    selectedLabel: '',
    // value for selected item class
    selectedValue: null,

    // for search input
    searchValue: null

});


const elRef = ref(null);
let $el;
let $view;
let $options;
let $list;

const viewStyle = computed(() => {
    const st = {};
    if (props.width && props.width !== 'auto') {
        st.width = autoPx(props.width);
    }
    if (props.minWidth) {
        st['--vui-select-min-width'] = props.minWidth;
    }
    if (props.maxWidth) {
        st['--vui-select-max-width'] = props.maxWidth;
    }
    return st;
});

// =========================================================================================================

const resizeHandler = (e) => {
    // console.log('resizeHandler');
    close();
};

const isSelectInner = (elem) => {
    if (!$list) {
        return false;
    }
    if ($list === elem) {
        return true;
    }
    let inner = false;
    try {
        inner = $list.contains(elem);
    } catch (e) {
        // empty
    }
    return inner;
};

const isViewParent = (elem) => {
    const targetElement = $view;
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

const openEvents = {
    resize: {
        target: window,
        handler: resizeHandler
    },
    scroll: {
        target: window,
        handler: scrollHandler,
        options: true
    }
};

const unbindOpenEvents = () => {
    unbindEvents(openEvents);
};

const bindOpenEvents = () => {
    unbindOpenEvents();
    bindEvents(openEvents, window);
};

// =========================================================================================================

const keydownHandler = (e) => {
    // console.log(e.key);
    const handlers = {
        ArrowDown: keyArrowDownHandler,
        ArrowUp: keyArrowUpHandler,
        Enter: keyEnterHandler,
        Escape: keyEscapeHandler
    };
    const handler = handlers[e.key];
    if (handler) {
        e.preventDefault();
        handler(e);
    }
};

const keyArrowDownHandler = (e) => {
    keyArrowHandler(e, 1);
};

const keyArrowUpHandler = (e) => {
    keyArrowHandler(e, -1);
};

const keyArrowHandler = (e, offset) => {
    if (!data.isOpen) {
        open();
        return;
    }
    const len = data.list.length;
    const index = data.selectedIndex + offset;
    if (index >= len || index < 0) {
        return;
    }
    const item = data.list[index];

    data.selectedIndex = index;
    data.selectedValue = item.value;

    scrollIntoViewAsync(offset);
};

const scrollIntoViewAsync = microtask((offset) => {
    if (!$list) {
        return;
    }
    const target = $list.querySelector('.vui-select-item.selected');
    if (!target) {
        return;
    }
    const tt = target.offsetTop;
    const th = target.clientHeight;
    const lt = $list.scrollTop;
    const lh = $list.clientHeight;
    if (tt < lt || tt + th > lt + lh) {
        const block = offset > 0 ? 'end' : 'start';
        target.scrollIntoView({
            block
        });
    }
});

const keyEnterHandler = (e) => {
    if (!data.isOpen) {
        open();
        return;
    }

    const item = data.list[data.selectedIndex];
    if (item) {
        data.searchValue = null;
        data.selectedLabel = item.label;
        data.value = item.value;
    }
    close();
};

const keyEscapeHandler = (e) => {
    close();
};


const keyEvents = {
    keydown: {
        handler: keydownHandler
    }
};

const unbindKeyEvents = () => {
    unbindEvents(keyEvents);
};

const bindKeyEvents = () => {
    unbindKeyEvents();
    bindEvents(keyEvents, $el);
};

// =========================================================================================================

const onItemClick = (item) => {

    // console.log(cid, 'item click');

    data.searchValue = null;
    data.selectedIndex = item.index;
    data.selectedLabel = item.label;
    data.selectedValue = item.value;
    data.value = item.value;

    // console.log(props.label, 'onItemClick', item, data.selectedLabel);

    close();

};

const onItemRemove = (item) => {
    emit('remove', item);
};

// =========================================================================================================

const showList = () => {
    document.body.appendChild($list);
    data.isOpen = true;
};

const hideList = () => {
    $options.appendChild($list);
    data.isOpen = false;
};

// =========================================================================================================

const close = () => {

    // align with open
    data.shouldOpen = false;

    if (!data.isOpen) {
        return;
    }
    data.lastDirection = 'down';
    hideList();
    unbindOpenEvents();
};

const closeAsync = microtask(close);

// =========================================================================================================

const getRect = (elem) => {
    const br = elem.getBoundingClientRect();
    const rect = {
        left: Math.round(br.left),
        top: Math.round(br.top)
    };

    // fix offset (no fixed in body)
    rect.left += window.scrollX;
    rect.top += window.scrollY;

    if (elem === document.body) {
        // exclude scrollbar size
        rect.width = elem.clientWidth;
        rect.height = elem.clientHeight;
    } else {
        rect.width = elem.offsetWidth;
        rect.height = elem.offsetHeight;
    }
    return rect;
};

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

    // console.log('top ok', top, ok);

    if (ok[data.lastDirection]) {
        return top[data.lastDirection];
    }

    if (ok.down) {
        data.lastDirection = 'down';
        return top.down;
    }

    data.lastDirection = 'up';
    return top.up;
};

const getListLeft = (viewRect, listRect, bodyRect) => {
    const space = 2;
    let left = Math.max(viewRect.left, 0);
    if (left + listRect.width >= bodyRect.width) {
        left = bodyRect.width - listRect.width - space;
    }
    return left;
};

const layout = () => {
    if (!$list) {
        return;
    }

    const viewRect = getRect($view);
    const bodyRect = getRect(document.body);

    const lst = $list.style;

    // reset position
    lst.left = '0px';
    lst.top = '0px';

    // update list min/max width
    // console.log('list,view width', listRect.width, viewRect.width);
    lst.minWidth = `${viewRect.width}px`;
    const maxWidth = Math.min(350, bodyRect.width);
    // console.log('maxWidth', maxWidth, bodyRect.width);
    lst.maxWidth = `${maxWidth}px`;

    nextTick(() => {
        const listRect = getRect($list);

        // console.log('viewRect', viewRect, 'listRect', listRect, 'bodyRect', bodyRect);

        const left = getListLeft(viewRect, listRect, bodyRect);
        const top = getListTop(viewRect, listRect, bodyRect);

        // console.log('left', left, 'top', top);

        lst.left = `${left}px`;
        lst.top = `${top}px`;

        // selected element.scrollIntoView();
        const $selected = $list.querySelector('.vui-select-item.selected');
        if ($selected) {
            // scrollIntoView cased whole page scroll if body scrollable
            // $selected.scrollIntoView();
            $selected.parentNode.scrollTop = $selected.offsetTop;
        }
    });

};

const open = () => {
    if (props.disabled) {
        return;
    }

    data.shouldOpen = true;

    if (data.isOpen) {
        return;
    }

    if (!isList(data.list)) {
        return;
    }

    showList();
    layout();
    bindOpenEvents();
};

// when opened list and click out side browser will blur
// then click body will trigger focus and blur, that not make sense
const openAsync = microtask(open);

// =========================================================================================================

const onClick = (e) => {
    open();
};

const onInput = (e) => {
    data.searchValue = data.viewLabel;
    if (!data.isOpen) {
        open();
    }
    emit('search', e);
};

const onFocus = (e) => {
    // console.log(cid, 'focus');
    openAsync();
    bindKeyEvents();
};

const onBlur = (e) => {
    // console.log(cid, 'blur');
    data.searchValue = null;
    closeAsync();
    unbindKeyEvents();
};

// =========================================================================================================

const getListFromProps = (ls) => {
    return ls.map((item) => {
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
};

const getListFromSlot = (ls) => {

    if (!isList(ls)) {
        return [];
    }

    const getChildrenLabel = (children) => {
        if (typeof children === 'string') {
            return children.trim();
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

    return ls;
};


// =========================================================================================================

const layoutIfNeeded = microtask(() => {
    if (props.disabled) {
        return;
    }

    if (!$el) {
        return;
    }

    if (data.shouldOpen && !data.isOpen) {
        openAsync();
        return;
    }

    if (!data.isOpen) {
        return;
    }

    layout();

});

// =========================================================================================================

const initSelectedItem = () => {

    const item = data.list.find((it) => it.value === data.value);

    if (item) {
        data.selectedIndex = item.index;
        data.selectedLabel = item.label;
        data.selectedValue = item.value;
    } else {
        data.selectedIndex = -1;
        data.selectedLabel = '';
        data.selectedValue = null;
    }

    // console.log(cid, 'initSelectedItem', item, data.selectedIndex);

};

// get max label for list only first time
const initMaxLabel = () => {

    if (data.maxLabel) {
        return;
    }

    let maxLabel = '';
    data.list.forEach((it) => {
        if (it.label && it.label.length > maxLabel.length) {
            maxLabel = it.label;
        }
    });
    data.maxLabel = maxLabel || ' ';
};

const initList = () => {

    const list = props.options ? getListFromProps(props.options) : getListFromSlot(getSlot(slots));

    // for selectedIndex
    list.forEach((item, i) => {
        item.index = i;
        item.value = toStr(item.value);
    });

    // console.log('initList', cid, data.list);

    data.list = list;

    initSelectedItem();

    // async layout if list is show and change list dynamic
    layoutIfNeeded();

};

watchEffect(() => {
    data.value = toStr(props.modelValue === null ? props.value : props.modelValue);
});

watch([
    () => data.viewLabel,
    () => data.maxLabel
], () => {


    // fixed width or already calculated
    if (props.width) {
        data.widthLabel = data.viewLabel || ' ';
        return;
    }

    data.widthLabel = data.maxLabel || ' ';

});

watch(() => data.selectedValue, (v) => {
    data.list.forEach((it) => {
        it.selected = it.value === v;
    });
});

watch(() => data.value, (v) => {
    initSelectedItem();
    emit('update:modelValue', v);
    emit('change', v);
});

watchEffect(() => {
    data.viewLabel = props.searchable && data.searchValue !== null ? data.searchValue : data.selectedLabel;
});

watch(() => props.options, (v) => {
    initList();
});

onMounted(() => {
    $el = elRef.value;
    $view = $el.querySelector('.vui-select-view');
    $options = $el.querySelector('.vui-select-options');
    $list = $options.querySelector('.vui-select-list');

    initList();
    initMaxLabel();
});

</script>
<style lang="scss">
.vui-select {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    font-family: inherit;

    label {
        position: relative;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.vui-select-view {
    --vui-select-min-width: 50px;
    --vui-select-max-width: 350px;

    position: relative;
    min-width: var(--vui-select-min-width);
    max-width: var(--vui-select-max-width);
    box-sizing: border-box;
    text-overflow: ellipsis;

    input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 5px 20px 5px 5px;
        box-sizing: border-box;
        font-size: inherit;
        font-family: inherit;
        border: 1px solid #aaa;
        border-radius: 5px;
        background-image: url("../../images/select.svg");
        background-repeat: no-repeat;
        background-position: right 7px center;
        background-size: 8px 10px;
        cursor: default;
        user-select: none;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

        &:disabled {
            color: gray;
            border: 1px solid #ccc;
            background-image: url("../../images/select-disabled.svg");
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

    input.vui-select-search {
        cursor: text;
    }

    /* padding left 25px bigger than 20px */
    span {
        position: relative;
        display: inline-block;
        min-width: 2px;
        max-width: var(--vui-select-max-width);
        padding: 5px 25px 5px 5px;
        box-sizing: border-box;
        font-size: inherit;
        font-family: inherit;
        white-space: pre;
        opacity: 0;
        user-select: none;
        pointer-events: none;
    }
}

.vui-select-options {
    position: absolute;
    display: none;
}

.vui-select-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10000;
    max-width: 350px;
    max-height: 300px;
    border: 1px solid #aaa;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 20%);
    overflow: hidden auto;
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
    padding: 6px 5px;
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
