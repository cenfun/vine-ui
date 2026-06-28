<template>
  <div
    ref="elRef"
    v-init="{cid}"
    class="vui vui-select"
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
        :type="props.type"
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
      <div
        class="vui vui-select-list"
        :style="listStyle"
      >
        <div
          v-for="(item, ii) in data.list"
          :key="ii"
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
            X
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
    computed, onMounted,
    ref, reactive,
    watch, watchEffect,
    useSlots,
    nextTick,
    onUnmounted
} from 'vue';
import { microtask } from 'async-tick';

import {
    hasOwn, isList, autoPx, toStr, bindEvents, unbindEvents, getCID, vSelectOnFocus, getSlot, toNum, vInit
} from '../utils/util.js';

const cid = getCID('VuiSelect');

const props = defineProps({

    /** Select label text */


    label: {
        type: String,
        default: ''
    },

    /** Disable the select */


    disabled: {
        type: Boolean,
        default: false
    },

    /** Input type attribute */


    type: {
        type: String,
        default: 'text'
    },

    /** Array of option objects [{label, value}] */


    options: {
        type: Array,
        default: null
    },

    /** Select width */


    width: {
        type: [String, Number],
        default: ''
    },

    /** Select minimum width */


    minWidth: {
        type: [String, Number],
        default: ''
    },

    /** Select maximum width */


    maxWidth: {
        type: [String, Number],
        default: ''
    },

    /** Select font size */


    fontSize: {
        type: [String, Number],
        default: ''
    },

    /** Enable search/filter functionality */


    searchable: {
        type: Boolean,
        default: false
    },

    /** Auto-select text on focus */


    selectOnFocus: {
        type: Boolean,
        default: true
    },

    /** If true,
 v-model binds to option index instead of value */


    index: {
        type: Boolean,
        default: false
    }

});

const mv = defineModel({
    type: [String, Number],
    default: null
});

const slots = useSlots();
const emit = defineEmits(['change', 'search', 'remove', 'focus', 'blur']);

const data = reactive({

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
        st['--vui-select-min-width'] = autoPx(props.minWidth);
    }
    if (props.maxWidth) {
        st['--vui-select-max-width'] = autoPx(props.maxWidth);
    }
    if (props.fontSize) {
        st['--vui-select-font-size'] = autoPx(props.fontSize);
    }
    return st;
});

const listStyle = computed(() => {
    const st = {};
    if (props.fontSize) {
        st['--vui-select-font-size'] = autoPx(props.fontSize);
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
    updateSelectedItem();

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
        data.value = props.index ? item.index : item.value;
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
    data.value = props.index ? item.index : item.value;

    // console.log(props.label, 'onItemClick', item, data.selectedLabel);
    updateSelectedItem();

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
    const space = 0;

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

    emit('focus');
};

const onBlur = (e) => {
    // console.log(cid, 'blur');
    data.searchValue = null;
    closeAsync();
    unbindKeyEvents();

    emit('blur');
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
        if (hasOwn(item, 'removable')) {
            item.removable = true;
        }
        return item;
    });

    return ls;
};


// =========================================================================================================

const updateLayout = microtask(() => {
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

const updateSelectedItem = () => {

    if (!isList(data.list)) {
        return;
    }
    data.list.forEach((it, i) => {
        it.selected = false;
    });
    const selectedItem = data.list.find((it) => it.value === data.selectedValue);
    if (selectedItem) {
        selectedItem.selected = true;
    }
};

const initSelectedItem = () => {

    const item = props.index ? data.list[data.value] : data.list.find((it) => it.value === data.value);

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

    updateSelectedItem();

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
    updateLayout();

};

const update = microtask(() => {
    $el = elRef.value;
    $view = $el.querySelector('.vui-select-view');
    $options = $el.querySelector('.vui-select-options');
    $list = $options.querySelector('.vui-select-list');

    initList();
    initMaxLabel();
});

watchEffect(() => {
    const v = mv.value === null ? props.value : mv.value;
    data.value = props.index ? toNum(v) : toStr(v);
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

watch(() => data.value, (v) => {
    initSelectedItem();
    mv.value = v;
    emit('change', v);
});


watchEffect(() => {
    data.viewLabel = props.searchable && data.searchValue !== null ? data.searchValue : data.selectedLabel;
});

watch(() => props.options, (v) => {
    update();
});

onMounted(() => {
    update();
});

onUnmounted(() => {
    unbindOpenEvents();
    unbindKeyEvents();
    if ($list && $list.parentNode) {
        $list.parentNode.removeChild($list);
    }
});

defineExpose({
    update,
    cid
});
</script>
<style lang="scss">
@use "../global.scss";

.vui-select {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;

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
    --vui-select-padding: 5px 24px 5px 8px;
    --vui-select-font-size: inherit;

    position: relative;
    min-width: var(--vui-select-min-width);
    max-width: var(--vui-select-max-width);
    font-weight: normal;
    text-overflow: ellipsis;

    span {
        position: relative;
        display: inline-block;
        min-width: 2px;
        max-width: var(--vui-select-max-width);
        padding: var(--vui-select-padding);
        font-size: var(--vui-select-font-size);
        white-space: pre;
        border: 1px solid transparent;
        border-radius: 5px;
        opacity: 0;
        user-select: none;
        pointer-events: none;
    }

    input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: var(--vui-select-padding);
        font-size: var(--vui-select-font-size);
        border: 1px solid #aaa;
        border-radius: 5px;
        background-image: url("../images/select.svg");
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 8px 10px;
        background-clip: padding-box;
        cursor: pointer;
        appearance: none;
        user-select: none;
        transition: var(--vui-color-transition);

        &:disabled {
            color: gray;
            border: 1px solid #ccc;
            background-image: url("../images/select-disabled.svg");
            cursor: default;
        }

        &:not(:disabled):hover {
            border: 1px solid #888;
        }

        &:not(:disabled):focus {
            outline: 1px solid var(--vui-neutral-60);
            outline-offset: -1px;
        }

        &.vui-select-search {
            cursor: text;
        }
    }
}

.vui-select-options {
    position: absolute;
    display: none;
}

.vui-select-list {
    --vui-select-font-size: inherit;

    position: absolute;
    top: 0;
    left: 0;
    z-index: 10000;
    max-width: 350px;
    max-height: 300px;
    border: 1px solid #aaa;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 3px 8px rgb(0 0 0 / 30%);
    overflow: hidden auto;
}

.vui-select-item-label {
    flex: 1 1 0%;
    min-height: 1rem;
    overflow: hidden;
}

.vui-select-item-remove {
    position: relative;
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
    gap: 8px;
    justify-content: space-between;
    align-items: center;
    padding: 5px 8px;
    color: #555;
    font-size: var(--vui-select-font-size);
    cursor: pointer;

    &:hover {
        background: #e8e8e8;

        .vui-select-item-remove {
            visibility: visible;
        }
    }

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
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
