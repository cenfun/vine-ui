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
      :class="viewClass"
      :style="viewStyle"
      tabindex="0"
      @click.stop="onClick"
      @focus="onFocus"
      @blur="onBlur"
    >
      <template v-if="props.multiple">
        <div class="vui-select-selected-list">
          <div
            v-for="(item, ii) in data.selectedList"
            :key="ii"
            class="vui-select-selected-item"
          >
            <div class="vui-select-selected-name">
              {{ item.label || item.value }}
            </div>
            <div
              class="vui-select-selected-close"
              @click.stop="onSelectedItemRemove(item)"
            >
              <Icon
                icon="close"
                size="12px"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <span>{{ data.viewLabel }}</span>
      </template>
      <Icon
        icon="arrow-select"
        size="10px"
      />
    </div>
    <div class="vui-select-options">
      <div
        v-init="{cid: cidPopup}"
        class="vui vui-select-popup"
      >
        <div class="vui-select-list">
          <div
            v-for="(item, ii) in data.list"
            :key="ii"
            :class="['vui-select-item', item.selected?'vui-select-selected':'', props.multiple && item.index === data.selectedIndex ? 'vui-select-active' : '']"
            @mousedown="onItemClick(item, $event)"
          >
            <div class="vui-select-item-label">
              {{ item.label }}
            </div>
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
    watch,
    useSlots,
    nextTick,
    onUnmounted
} from 'vue';
import { microtask } from 'async-tick';

import Icon from './icon.vue';

import {
    hasOwn, isList, autoPx, bindEvents, unbindEvents, getCID, getSlot, vInit
} from '../utils/util.js';

const cid = getCID('VuiSelect');
const cidPopup = getCID('VuiSelectPopup');

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

    /** Font size for options*/
    fontSize: {
        type: [String, Number],
        default: ''
    },

    /** If true, v-model binds to option index instead of value */
    index: {
        type: Boolean,
        default: false
    },

    /** Enable multiple selection */
    multiple: {
        type: Boolean,
        default: false
    }

});

const mv = defineModel({
    type: [String, Number, Boolean, Array],
    default: null
});

const slots = useSlots();
const emit = defineEmits(['focus', 'blur']);

const data = reactive({

    // from list selected item
    viewLabel: '',

    list: [],

    isOpen: false,
    shouldOpen: false,

    lastDirection: 'down',

    selectedIndex: -1,
    // label for view display
    selectedLabel: '',
    // value for selected item class
    selectedValue: null,

    // selected items for multiple mode
    selectedList: []

});

const elRef = ref(null);
let $el;
let $view;
let $options;
let $popup;
const initElements = () => {
    $el = elRef.value;
    $view = $el.querySelector('.vui-select-view');
    $options = $el.querySelector('.vui-select-options');
    $popup = $options.querySelector('.vui-select-popup');
    if (!$popup) {
        // list is appended to document.body while open
        $popup = document.querySelector(`[cid=${cidPopup}]`);
    }
};
const unmountElements = () => {
    if ($popup && $popup.parentNode) {
        $popup.parentNode.removeChild($popup);
    }
    $el = null;
    $view = null;
    $options = null;
    $popup = null;
};

const viewClass = computed(() => {
    const cls = ['vui-select-view'];
    if (props.disabled) {
        cls.push('vui-select-disabled');
    }
    return cls;
});

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

// =========================================================================================================

const resizeHandler = (e) => {
    // console.log('resizeHandler');
    close();
};

const isSelectInner = (elem) => {
    if (!$popup) {
        return false;
    }
    if ($popup === elem) {
        return true;
    }
    let inner = false;
    try {
        inner = $popup.contains(elem);
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

    if (!props.multiple) {
        updateSelected(item);
    }

    scrollIntoViewAsync(offset);
};

const scrollIntoViewAsync = microtask((offset) => {
    if (!$popup) {
        return;
    }
    const target = $popup.querySelector('.vui-select-selected, .vui-select-active');
    if (!target) {
        return;
    }
    const tt = target.offsetTop;
    const th = target.clientHeight;
    const lt = $popup.scrollTop;
    const lh = $popup.clientHeight;
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

    if (props.multiple) {
        if (item) {
            updateSelected(item);
            updateValue(item);
        }
        return;
    }

    updateSelected(item);
    updateValue(item);

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

const onItemClick = (item, e) => {

    // console.log(cid, 'item click');

    if (props.multiple) {
        // keep focus on view so the list stays open for the next selection
        e?.preventDefault();
    }

    data.selectedIndex = item.index;
    data.selectedLabel = item.label;
    data.selectedValue = item.value;

    // console.log(props.label, 'onItemClick', item, data.selectedLabel);
    updateSelected(item);
    updateValue(item);

    if (!props.multiple) {
        close();
    }

};

// =========================================================================================================

const showList = () => {
    document.body.appendChild($popup);
    data.isOpen = true;
};

const hideList = () => {
    $options.appendChild($popup);
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

    if (viewRect.left <= bodyRect.width / 2) {
        if (viewRect.left + listRect.width <= bodyRect.width) {
            return viewRect.left;
        }
    } else {
        const rightAlignLeft = viewRect.left + viewRect.width - listRect.width;
        if (rightAlignLeft >= 0) {
            return rightAlignLeft;
        }
    }

    if (listRect.width < bodyRect.width) {
        return Math.round((bodyRect.width - listRect.width) / 2);
    }

    return 0;
};

const layout = () => {
    if (!$popup) {
        return;
    }

    const viewRect = getRect($view);
    const bodyRect = getRect(document.body);

    const popupStyle = $popup.style;

    // reset position
    popupStyle.left = '0px';
    popupStyle.top = '0px';

    const fontSize = props.fontSize;
    if (fontSize) {
        popupStyle.fontSize = autoPx(fontSize);
    }

    // update list min/max width
    let maxWidth = Math.max(viewRect.width, 300);
    maxWidth = Math.min(maxWidth, bodyRect.width);
    // console.log('maxWidth', maxWidth, bodyRect.width);
    popupStyle.maxWidth = `${maxWidth}px`;
    popupStyle.minWidth = `${viewRect.width}px`;

    nextTick(() => {
        const listRect = getRect($popup);

        // console.log('viewRect', viewRect, 'listRect', listRect, 'bodyRect', bodyRect);

        const left = getListLeft(viewRect, listRect, bodyRect);
        const top = getListTop(viewRect, listRect, bodyRect);

        // console.log('left', left, 'top', top);

        popupStyle.left = `${left}px`;
        popupStyle.top = `${top}px`;

        const $selected = $popup.querySelector('.vui-select-selected');
        if ($selected) {
            const container = $selected.parentNode;
            const targetRect = $selected.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const isInView = targetRect.top >= containerRect.top && targetRect.bottom <= containerRect.bottom;
            if (!isInView) {
                container.scrollTop = $selected.offsetTop - 1;
            }
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

const onClick = (e) => {
    openAsync();
};

const onFocus = (e) => {
    // console.log(cid, 'focus');
    openAsync();
    bindKeyEvents();

    emit('focus');
};

const onBlur = (e) => {
    console.log(cid, 'blur');
    closeAsync();
    unbindKeyEvents();

    emit('blur');
};


// =========================================================================================================

const updateSelectedList = () => {
    data.selectedList = data.list.filter((it) => it.selected).sort((a, b) => a.index - b.index);
    mv.value = data.selectedList.map((it) => (props.index ? it.index : it.value));
};

const onSelectedItemRemove = (item) => {
    if (props.disabled) {
        return;
    }
    item.selected = false;
    updateSelectedList();
};

const updateSelected = (item) => {
    if (!item) {
        return;
    }
    if (props.multiple) {
        item.selected = !item.selected;
        return;
    }
    data.list.forEach((it, i) => {
        it.selected = false;
    });
    item.selected = true;
};

const updateValue = (item) => {
    if (!item) {
        data.viewLabel = '';
        return;
    }
    if (props.multiple) {
        updateSelectedList();
        return;
    }
    data.viewLabel = item.label;
    const nv = props.index ? item.index : item.value;
    if (mv.value !== nv) {
        mv.value = nv;
    }
};

// =========================================================================================================

const initSelectedItem = () => {

    if (props.multiple) {
        const selectedValues = isList(mv.value) ? mv.value : [];
        data.list.forEach((it) => {
            const v = props.index ? it.index : it.value;
            it.selected = selectedValues.includes(v);
        });
        data.selectedList = data.list.filter((it) => it.selected).sort((a, b) => a.index - b.index);
        data.viewLabel = '';
        data.selectedLabel = '';
        data.selectedValue = null;
        if (data.selectedIndex < 0 || data.selectedIndex >= data.list.length) {
            const firstSelected = data.selectedList[0];
            data.selectedIndex = firstSelected ? firstSelected.index : 0;
        }
        return;
    }

    const item = data.list.find((it) => {
        return props.index ? it.index === mv.value : it.value === mv.value;
    });

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

    updateSelected(item);
    updateValue(item);

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
        const item = {
            ... (vn.props || {})
        };
        if (!hasOwn(item, 'label')) {
            item.label = getChildrenLabel(vn.children);
        }
        if (!hasOwn(item, 'value')) {
            item.value = item.label;
        }
        return item;
    });

    return ls;
};


const initList = () => {
    const list = isList(props.options) ? getListFromProps(props.options) : getListFromSlot(getSlot(slots));
    // for selectedIndex
    list.forEach((item, i) => {
        item.index = i;
    });
    // console.log('initList', cid, list);
    data.list = list;
    initSelectedItem();
};

// =========================================================================================================

const update = microtask(() => {
    initList();
    // async layout if list is show and change list dynamic
    updateLayout();
});

watch([
    mv,
    () => props.options,
    () => props.multiple
], (v) => {
    update();
});

onMounted(() => {
    initElements();
    update();
});

onUnmounted(() => {
    unbindOpenEvents();
    unbindKeyEvents();
    unmountElements();
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
    --vui-select-min-width: 42px;
    --vui-select-max-width: 350px;
    --vui-select-padding: 3px 8px;
    --vui-select-font-size: inherit;

    position: relative;
    display: flex;
    gap: 5px;
    justify-content: space-between;
    align-items: center;
    min-width: var(--vui-select-min-width);
    max-width: var(--vui-select-max-width);
    min-height: var(--vui-min-height);
    padding: var(--vui-select-padding);
    border: 1px solid #aaa;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
    appearance: none;
    user-select: none;
    transition: var(--vui-color-transition);

    span {
        flex: auto 1 1;
        font-weight: normal;
        font-size: var(--vui-select-font-size);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &.vui-select-disabled {
        color: gray;
        border: 1px solid #ccc;
        cursor: default;
    }

    &:not(.vui-select-disabled):hover {
        border: 1px solid #888;
    }

    &:not(.vui-select-disabled):focus {
        outline: 1px solid var(--vui-neutral-60);
        outline-offset: -1px;
    }
}

/* list popup */

.vui-select-options {
    position: absolute;
    display: none;
}

.vui-select-popup {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10000;
    border: 1px solid #aaa;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 3px 8px rgb(0 0 0 / 30%);
    overflow: hidden;
}

.vui-select-list {
    position: relative;
    max-height: 300px;
    overflow: hidden auto;
}

.vui-select-item-label {
    flex: 1 1 0%;
    min-height: 1rem;
    overflow: hidden;
}

.vui-select-item {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    color: #555;
    font-size: inherit;
    cursor: pointer;

    &::after {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 100%;
        height: 100%;
        background: rgb(0 0 0 / 5%);
        opacity: 0;
        pointer-events: none;
        transition: var(--vui-opacity-transition);
    }

    &:hover {
        &::after {
            opacity: 1;
        }
    }

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }

    &.vui-select-selected {
        color: #fff;
        background: #666;
    }

    &.vui-select-active {
        color: #fff;
        background: #888;
    }
}

/* multiple select */

.vui-select-selected-list {
    display: flex;
    flex: 1 1 auto;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    min-width: 0;
    overflow: hidden;
}

.vui-select-selected-item {
    display: flex;
    gap: 4px;
    align-items: center;
    max-width: 100%;
    padding: 1px 5px;
    color: #5e5e5e;
    font-size: var(--vui-font-size-s);
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: var(--vui-neutral-5);
}

.vui-select-selected-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.vui-select-selected-close {
    display: flex;
    flex-shrink: 0;
    cursor: pointer;
    opacity: 0.8;
    transition: var(--vui-opacity-transition);

    &:hover {
        opacity: 1;
    }
}

</style>
