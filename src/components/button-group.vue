<template>
  <div
    ref="list"
    v-init="{cid}"
    :class="classList"
    :style="styleMap"
    @click="onClick"
  >
    <slot />
  </div>
</template>
<script setup>
import {
    computed, watch, reactive, onMounted, ref
} from 'vue';
import { microtask } from 'async-tick';

import {
    toNum, getCID, hasOwn, vInit
} from '../utils/util.js';

const cid = getCID('VuiButtonGroup');

const props = defineProps({

    /** Array of option objects [{label, value}] for rendering items */


    options: {
        type: Array,
        default: null
    },

    /** Custom color for selected state */


    color: {
        type: String,
        default: ''
    },

    /** If true,
 v-model binds to option.value; otherwise binds to index */


    bindValue: {
        type: Boolean,
        default: false
    }


});

const mv = defineModel({
    type: [Number, String],
    default: null
});

const emit = defineEmits(['change']);

const data = reactive({
});

const list = ref(null);

const classList = computed(() => {
    return [
        'vui',
        'vui-button-group'
    ];
});

const styleMap = computed(() => {
    const st = {};
    if (props.color) {
        st['--vui-button-group-color'] = props.color;
    }
    return st;
});

const updateSelection = () => {
    const $list = list.value?.children || [];
    Array.from($list).forEach((elem, i) => {
        if (data.index === i) {
            elem.classList.add('vui-button-group-selected');
        } else {
            elem.classList.remove('vui-button-group-selected');
        }
    });
};

const onIndexChange = (index) => {
    // console.log('onIndexChange', cid, index, props.options);
    if (data.bindValue) {
        mv.value = props.options?.[index]?.value;
    } else {
        mv.value = index;
    }
    emit('change', mv.value);
};

const onClick = (e) => {
    let tabItem;
    let target = e.target;
    while (target) {
        if (target.classList && target.classList.contains('vui-button-group-item')) {
            tabItem = target;
            break;
        }
        target = target.parentNode;
    }

    if (!tabItem) {
        return;
    }
    const index = toNum(tabItem.getAttribute('index'));
    if (index === data.index) {
        return;
    }
    data.index = index;
    updateSelection();
};

const renderOptions = () => {

    const $list = list.value;
    $list.innerHTML = '';

    // eslint-disable-next-line complexity
    props.options.forEach((item, i) => {

        const label = item?.label || item?.name || item?.title || item?.value || i;
        if (!hasOwn(item, 'value')) {
            item.value = label;
        }

        const elem = document.createElement('div');
        elem.setAttribute('index', i);
        elem.classList.add('vui-button-group-item');
        elem.innerHTML = label;
        $list.appendChild(elem);
    });

    if (data.bindValue) {
        const index = props.options.findIndex((item) => item.value === mv.value);
        data.index = index >= 0 ? index : 0;
    } else {
        data.index = toNum(mv.value);
    }
    updateSelection();

};

const renderSlots = () => {
    const $children = list.value?.children || [];
    Array.from($children).forEach((elem, i) => {
        elem.setAttribute('index', i);
        elem.classList.add('vui-button-group-item');
    });
    data.bindValue = false;
    data.index = toNum(mv.value);
    updateSelection();
};

const update = microtask((v) => {
    data.bindValue = props.bindValue;
    if (Array.isArray(props.options)) {
        renderOptions();
        return;
    }
    renderSlots();
});

watch(() => data.index, (v) => {
    onIndexChange(v);
});

watch([
    () => mv.value,
    () => props.options,
    () => props.bindValue
], () => {
    update();
});

onMounted(() => {
    update();
});

defineExpose({
    update,
    cid
});
</script>
<style lang="scss">
@use "../global.scss";

.vui-button-group {
    --vui-button-group-color: var(--vui-blue-50);

    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.vui-button-group-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 80px;
    min-height: var(--vui-min-height);
    padding: 3px 12px;
    color: #5e5e5e;
    font-weight: 400;
    text-align: center;
    text-overflow: ellipsis;
    border: 1px solid #808080;
    cursor: pointer;
    user-select: none;
    transition: var(--vui-color-transition);

    &:not(:first-child) {
        border-left: none;
    }
}

.vui-button-group-item.vui-button-group-selected {
    position: relative;
    color: #fff;
    border-color: var(--vui-button-group-color);
    background-color: var(--vui-button-group-color);
}

.vui-button-group-item:first-child {
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
}

.vui-button-group-item:last-child {
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
}
</style>
