<template>
  <div
    v-init="{cid}"
    :class="classList"
    :style="styleMap"
    @click="onClick"
  >
    <div
      v-for="(item, i) in data.list"
      :key="i"
      class="vui-button-group-item"
      :class="{ 'vui-button-group-selected': data.index === i }"
      :data-index="i"
    >
      {{ item.label }}
    </div>

    <!-- temporary hidden host: read slot content, then it gets removed -->
    <div
      v-if="data.slotPending"
      ref="slotHost"
      class="vui-button-group-slot-host"
    >
      <slot />
    </div>
  </div>
</template>
<script setup>
import {
    computed, watch, reactive, onMounted, ref, nextTick
} from 'vue';

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

const data = reactive({
    list: [],
    index: -1,
    // whether the hidden slot host should be mounted (for reading slot content)
    slotPending: false
});

const slotHost = ref(null);

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

const isOptions = computed(() => Array.isArray(props.options));

// bindValue only applies in options mode; slot mode always binds by index
const bindValue = computed(() => isOptions.value && props.bindValue);

// =========================================================================================================

const getItemLabel = (item, i) => {
    return item.label || item.name || item.title || item.value || i;
};

const getLabel = (item, i) => {
    if (typeof item === 'object' && item !== null) {
        return getItemLabel(item, i);
    }
    if (typeof item === 'string' || typeof item === 'number') {
        return `${item}`;
    }
    return i;
};

const getListFromProps = (ls) => {
    return ls.map((item, i) => {
        const label = getLabel(item, i);
        if (item && typeof item === 'object') {
            const newItem = {
                ... item
            };
            if (!hasOwn(newItem, 'value')) {
                newItem.value = label;
            }
            return {
                label,
                value: newItem.value
            };
        }
        return {
            label,
            value: label
        };
    });
};

const getListFromSlot = (host) => {
    if (!host) {
        return [];
    }
    return Array.from(host.children).map((elem) => {
        const label = (elem.textContent || '').trim();
        return {
            label,
            value: label
        };
    });
};

const resolveIndex = () => {
    if (bindValue.value) {
        const index = data.list.findIndex((item) => item.value === mv.value);
        return index >= 0 ? index : 0;
    }
    return toNum(mv.value);
};

const initList = (list) => {
    data.list = list;
    data.index = resolveIndex();
};

// =========================================================================================================

const syncModel = (index) => {
    if (bindValue.value) {
        mv.value = data.list[index]?.value;
    } else {
        mv.value = index;
    }
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
    const index = toNum(tabItem.getAttribute('data-index'));
    if (index === data.index) {
        return;
    }
    data.index = index;
};

// =========================================================================================================
// slot content is rendered into a hidden host first, read from the DOM, then the host is removed.
// this way both options and slot are normalized into data.list and rendered by the same v-for.

let slotReadVersion = 0;

const readSlot = () => {
    const version = ++slotReadVersion;
    data.slotPending = true;
    nextTick(() => {
        if (version !== slotReadVersion) {
            // superseded by a newer read / options mode
            return;
        }
        const list = getListFromSlot(slotHost.value);
        data.slotPending = false;
        initList(list);
    });
};

const update = () => {
    if (isOptions.value) {
        // cancel any pending slot read
        slotReadVersion++;
        data.slotPending = false;
        initList(getListFromProps(props.options));
        return;
    }
    readSlot();
};

const updateIndex = () => {
    data.index = resolveIndex();
};

watch(() => data.index, (v) => {
    syncModel(v);
});

// list source changed
watch(() => props.options, () => {
    update();
});

// only selection changed, no need to rebuild the list
watch(() => mv.value, () => {
    updateIndex();
});

watch(() => props.bindValue, () => {
    updateIndex();
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
.vui-button-group {
    --vui-button-group-color: var(--vui-blue-50);

    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.vui-button-group-slot-host {
    display: none;
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
