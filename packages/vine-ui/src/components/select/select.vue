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
    <div class="vui-select-slots">
      <slot />
    </div>

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
    computed, nextTick, onMounted, reactive, ref, watch
} from 'vue';
import {
    useBase, BaseRender, vSelectOnFocus
} from '../../base/base.js';

import Util from '../../util/util.js';
import IconX from '../../base/images/icon-x.vue';

const { cid } = useBase('VuiSelect');

const classList = ['vui', 'vui-select', cid];

const viewMinWidth = 50;
const viewMaxWidth = 300;

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
        default: null
    }
});

const el = ref(null);
let $el;
let $view;
let $list;
let isOpen;
let shouldOpen;
let timeout_display;
let lastDirection = 'down';

const viewClass = computed(() => {
    const ls = ['vui-select-view'];
    if (props.searchable) {
        ls.push('vui-select-search');
    }
    return ls;
});

const emit = defineEmits(['search', 'remove', 'update:modelValue']);

const data = reactive({
    //for list computed
    slotsReady: false,
    //for view width
    width: props.width,
    //label for view display
    selectedLabel: '',
    //value for selected item class
    selectedValue: '',
    //for search input
    searchValue: null
});

const viewStyle = computed(() => {
    if (data.width) {
        return {
            'width': `${data.width}`
        };
    }
    return {};
});

const viewValue = computed({
    get() {
        if (props.searchable && data.searchValue !== null) {
            return data.searchValue;
        }
        return data.selectedLabel;
    },
    set(v) {
        data.searchValue = v;
    }
});

const listStyle = computed(() => {
    if (data.width) {
        return {
            'min-width': `${data.width}`
        };
    }
    return {};
});


//=========================================================================================================

const initSelectedItem = (list) => {
    const dv = props.modelValue === null ? props.value : props.modelValue;
    const item = list.find((it) => it.value === dv);
    if (item) {
        data.selectedLabel = item.label;
        data.selectedValue = item.value;
    } else {
        data.selectedLabel = '';
        data.selectedValue = '';
    }

};


const getListByPropOptions = () => {
    const list = props.options.map((item) => {
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

    initSelectedItem(list);

    return list;

};

const getListBySlotOptions = () => {

    const $options = Array.from($el.querySelector('.vui-select-slots').children);

    if (!$options.length) {
        return [];
    }

    const list = $options.map((elem) => {

        const label = elem.getAttribute('label') || elem.innerText;
        // //value could be (empty)
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

    initSelectedItem(list);

    return list;

};

const list = computed(() => {
    if (props.options) {
        return getListByPropOptions();
    }
    if (data.slotsReady) {
        return getListBySlotOptions();
    }
    return [];
});

//=========================================================================================================

const resizeHandler = (e) => {
    //console.log('resizeHandler');
    close();
};

const isSelectInner = (elem) => {
    if ($list === elem) {
        return true;
    }
    let inner = false;
    try {
        inner = $list.contains(elem);
    } catch (e) {
        //empty
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
    //console.log('scrollHandler');
    if (isSelectInner(e.target)) {
        return;
    }
    if (!isViewParent(e.target)) {
        return;
    }
    close();
};


const unbindEvents = () => {
    //console.log('unbindEvents');
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('scroll', scrollHandler, true);
};

const bindEvents = () => {
    unbindEvents();
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('scroll', scrollHandler, true);
};

//=========================================================================================================

const showList = () => {
    document.body.appendChild($list);
    $list.style.visibility = 'visible';
    isOpen = true;
};

const hideList = () => {
    isOpen = false;
    $list.remove();
};

//=========================================================================================================

const close = () => {

    //align with open
    shouldOpen = false;

    if (!isOpen) {
        return;
    }
    lastDirection = 'down';
    hideList();
    unbindEvents();
};

const closeAsync = () => {
    clearTimeout(timeout_display);
    timeout_display = setTimeout(() => {
        close();
    }, 100);
};

//=========================================================================================================

const getListTop = (viewRect, listRect, bodyRect) => {
    const spacing = 2;

    const top = {
        down: viewRect.top + viewRect.height + spacing,
        up: viewRect.top - listRect.height - spacing
    };

    const ok = {
        down: top.down + listRect.height <= bodyRect.height,
        up: top.up > 0
    };

    //console.log(top, ok);

    if (ok[lastDirection]) {
        return top[lastDirection];
    }

    if (ok.down) {
        lastDirection = 'down';
        return top.down;
    }

    lastDirection = 'up';
    return top.up;
};

const layout = () => {

    const viewRect = $view.getBoundingClientRect();
    const listRect = $list.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();

    const top = getListTop(viewRect, listRect, bodyRect);

    let left = Math.max(viewRect.left, 0);
    if (left + listRect.width > bodyRect.width) {
        left = bodyRect.width - listRect.width;
    }

    const st = $list.style;
    st.left = `${left}px`;
    st.top = `${top}px`;

    //selected element.scrollIntoView();
    const $selected = $list.querySelector('.vui-select-item.selected');
    if ($selected) {
        $selected.scrollIntoView();
    }

};

const layoutAsync = () => {
    if (props.disabled) {
        return;
    }

    if (!$el) {
        return;
    }

    if (shouldOpen && !isOpen) {
        nextTick(() => {
            open();
        });
        return;
    }

    if (!isOpen) {
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

    shouldOpen = true;

    if (isOpen) {
        return;
    }

    if (!list.value.length) {
        return;
    }

    showList();
    layout();
    bindEvents();
};

//when opened list and click out side browser will blur
//then click body will trigger focus and blur, that not make sense
const openAsync = () => {
    clearTimeout(timeout_display);
    timeout_display = setTimeout(() => {
        open();
    }, 100);
};

//=========================================================================================================

const onClick = (e) => {
    open();
};

const onInput = (e) => {
    emit('search', e);
};

const onFocus = (e) => {
    //console.log('onFocus', cid);
    openAsync();
};

const onBlur = (e) => {
    //console.log('onBlur', cid);
    data.searchValue = null;
    closeAsync();
};


//=========================================================================================================


const getItemClass = (item) => {
    const ls = ['vui-select-item'];
    if (item.value === data.selectedValue) {
        ls.push('selected');
    }
    return ls;
};

const onItemClick = (item) => {
    data.searchValue = null;
    data.selectedLabel = item.label;
    data.selectedValue = item.value;
    emit('update:modelValue', item.value);
    close();
};

const onItemRemove = (item) => {
    emit('remove', item);
};


//=========================================================================================================

const initWidth = () => {

    if (data.width) {
        return;
    }

    const listRect = $list.getBoundingClientRect();
    //border is 2 if empty
    if (listRect.width > 2) {
        const iconWidth = 15;
        //no padding because list have same padding
        const w = Util.clamp(Math.ceil(listRect.width) + iconWidth, viewMinWidth, viewMaxWidth);
        data.width = `${w}px`;
    }
};

watch(list, () => {
    layoutAsync();
});


onMounted(() => {
    $el = el.value;

    $view = $el.querySelector('.vui-select-view');
    $list = $el.querySelector('.vui-select-list');

    //trigger computed list
    data.slotsReady = true;

    if (props.options) {
        initWidth();
    } else {
        nextTick(() => {
            initWidth();
        });
    }
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
    min-width: 50px;
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

.vui-select-slots {
    display: none;
}

/* holder for width computed */
.vui-select-holder {
    position: absolute;
    width: 500px;
}

.vui-select-list {
    position: absolute;
    visibility: hidden;
    background-color: #fff;
    z-index: 10000;
    border: 1px solid #aaa;
    border-radius: 5px;
    max-width: 350px;
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 20%);
}

.vui-select-item-label {
    min-height: 1rem;
    flex: 1 1 0%;
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
