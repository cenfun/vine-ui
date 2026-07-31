<template>
  <div
    v-init="{cid}"
    :class="classMap"
  >
    <label v-if="props.label">
      {{ props.label }}
    </label>
    <div
      ref="viewEl"
      class="vui-multi-select-view"
      tabindex="0"
      @click="onOpenClick"
    >
      <div class="vui-multi-select-selected-list">
        <div
          v-for="(item, ii) in data.selectedList"
          :key="ii"
          class="vui-multi-select-selected-item"
        >
          <div class="vui-multi-select-selected-name">
            <span v-if="item.parent">{{ item.parent.label || item.parent.value }}</span>
            <span>
              {{ item.label || item.value }}
            </span>
          </div>
          <div
            class="vui-multi-select-selected-close"
            @click.stop="onItemRemove(item)"
          >
            <Icon
              icon="close"
              size="12px"
            />
          </div>
        </div>
      </div>
      <Icon icon="dropdown" />
    </div>
    <Popover
      v-model="data.popoverVisible"
      :target="data.popoverTarget"
      :width="data.popoverWidth"
      border-radius="0px"
      padding="0"
      positions="bottom,top"
      :arrow="false"
    >
      <div class="vui-multi-select-popover">
        <div
          v-if="props.searchable"
          class="vui-multi-select-search"
        >
          <Icon
            icon="search"
            class="vui-multi-select-icon-search"
          />
          <input
            v-model="data.keywords"
            :placeholder="props.placeholder"
            @focus="onSearchFocus"
            @input="onSearchStart"
          >
          <Icon
            v-if="data.keywords"
            icon="close"
            class="vui-multi-select-icon-close"
            @click="onSearchClear"
          />
        </div>
        <div
          ref="panelEl"
          class="vui-multi-select-panel"
        >
          <template v-if="data.hasGroups">
            <div
              v-for="(group, gi) in data.groups"
              :key="gi"
              class="vui-multi-select-group-item"
            >
              <div
                class="vui-multi-select-group-name"
                @click="onGroupClick(group)"
              >
                {{ group.label }}
              </div>
              <div class="vui-multi-select-option-list">
                <div
                  v-for="(item, ii) in group.options"
                  :key="ii"
                  :class="['vui-multi-select-option-item', 'vui-multi-select-option-item--grouped', item.selected?'selected':'']"
                  @click="onItemClick(item)"
                >
                  <div
                    v-html="item.html || item.label || item.value"
                  />
                  <Icon icon="selected" />
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="data.groups?.length">
            <div class="vui-multi-select-option-list">
              <div
                v-for="(item, ii) in data.groups"
                :key="ii"
                :class="['vui-multi-select-option-item', item.selected?'selected':'']"
                @click="onItemClick(item)"
              >
                <div
                  v-html="item.html || item.label || item.value"
                />
                <Icon icon="selected" />
              </div>
            </div>
          </template>
          <div
            v-else-if="props.searchable"
            class="vui-multi-select-no-results"
          >
            没有任何结果
          </div>
        </div>
      </div>
    </Popover>
  </div>
</template>
<script setup>
import {
    onMounted, reactive, ref, watch
} from 'vue';
import { microtask, debounce } from 'async-tick';

import Icon from './icon.vue';
import Popover from './popover.vue';

import {
    isList, getCID, highlightKeywords, vInit
} from '../utils/util.js';

const cid = getCID('VuiMultiSelect');
const classMap = ['vui', 'vui-multi-select'];

const props = defineProps({

    /** Multi-select label text */

    label: {
        type: String,
        default: ''
    },

    /** Disable the multi-select */


    disabled: {
        type: Boolean,
        default: false
    },

    /** Enable search/filter functionality */


    searchable: {
        type: Boolean,
        default: false
    },

    /** Search input placeholder text */


    placeholder: {
        type: String,
        default: ''
    },

    /** Array of options [{label, value}] or grouped [{label, options: [{label, value}]}] */


    options: {
        type: Array,
        default: null
    }

});

const mv = defineModel({
    type: Array,
    default: null
});

const data = reactive({
    keywords: '',
    selectedList: [],
    groups: [],
    hasGroups: false,
    popoverVisible: false,
    popoverTarget: null,
    popoverWidth: null
});

const emit = defineEmits(['change']);

const viewEl = ref();
const panelEl = ref();
const getViewRect = () => {

    const $elem = viewEl.value;
    const bb = $elem.getBoundingClientRect();

    // console.log(bb);

    return {
        x: Math.floor(bb.x),
        y: Math.floor(bb.y),
        width: Math.floor(bb.width),
        height: Math.floor(bb.height)
    };
};

const scrollToSelected = debounce(() => {
    const $elem = panelEl.value;
    if (!$elem) {
        return;
    }
    const $selected = $elem.querySelector('.vui-multi-select-option-item.selected');
    if ($selected) {
        $selected.scrollIntoView({
            // behavior: 'smooth'
        });
        return;
    }
    $elem.scrollTo(0, 0);
});

const onOpenClick = (e) => {
    data.popoverTarget = getViewRect();
    data.popoverWidth = data.popoverTarget.width - 12;
    data.popoverVisible = true;

    scrollToSelected();
};

const updatePopover = debounce(() => {
    data.popoverTarget = getViewRect();
}, 10);

const updateSelectedList = (item) => {
    if (item.selected) {
        // copy item to stop reactive loop
        data.selectedList.push({
            ... item
        });
    } else {
        data.selectedList = data.selectedList.filter((it) => it.value !== item.value);
    }

    data.selectedList.sort((a, b) => {
        if (a.groupIndex !== b.groupIndex) {
            return a.groupIndex - b.groupIndex;
        }
        return a.index - b.index;
    });

    data.value = data.selectedList.map((it) => it.value);

    // console.log('updateSelectedList', data.selectedList, data.value);

    mv.value = data.value;
    emit('change', data.selectedList);

    updatePopover();
};

const onItemRemove = (item) => {
    item.selected = false;
    updateSelectedList(item);
};

const onGroupClick = (group) => {
    const allSelected = group.options.every((it) => it.selected);
    const targetState = !allSelected;
    group.options.forEach((item) => {
        item.selected = targetState;
        updateSelectedList(item);
    });
};

const onItemClick = (item) => {
    item.selected = !item.selected;
    updateSelectedList(item);
};

const updateSearchResults = () => {
    const keywords = `${data.keywords}`.trim().toLowerCase().split(/\s+/g).filter((s) => s);
    if (!keywords.length) {
        data.groups = data.allGroups;
        data.groups.forEach((it) => {
            if (it.options) {
                it.options.forEach((ot) => {
                    ot.html = ot.label;
                });
            } else {
                it.html = it.label;
            }
        });
        return;
    }

    data.groups = data.allGroups.map((it) => {

        const g = {
            ... it
        };

        if (g.options) {
            const list = it.options.filter((ot) => {
                const label = `${ot.label}`.trim();
                if (!label) {
                    return;
                }
                const lowerLabel = label.toLowerCase();
                let startPos = 0;
                for (const key of keywords) {
                    const index = lowerLabel.indexOf(key, startPos);
                    if (index === -1) {
                        return;
                    }
                    startPos = index + key.length;
                }
                ot.html = highlightKeywords(label, keywords);
                return true;
            });

            if (list.length) {
                g.options = list;
                return g;
            }
        } else {
            const label = `${it.label}`.trim();
            if (!label) {
                return;
            }
            const lowerLabel = label.toLowerCase();
            let startPos = 0;
            for (const key of keywords) {
                const index = lowerLabel.indexOf(key, startPos);
                if (index === -1) {
                    return;
                }
                startPos = index + key.length;
            }
            g.html = highlightKeywords(label, keywords);
            return g;
        }

    }).filter((it) => it);

};

const onSearchClear = () => {
    data.keywords = '';
    updateSearchResults();
};

let time_search;
const onSearchStart = (e) => {
    clearTimeout(time_search);
    time_search = setTimeout(() => {
        updateSearchResults();
    }, 300);
};

const onSearchFocus = (e) => {
    e.target.select();

    if (data.keywords) {
        onSearchStart();
    }
};

const initSelected = microtask((reason) => {
    let selectedValues = [];
    if (isList(data.value)) {
        selectedValues = data.value;
    }

    const selectedList = [];

    if (isList(props.options)) {
        // Check if first item has nested options (group mode)
        const first = props.options[0];
        data.hasGroups = first && first.options;

        if (data.hasGroups) {
            data.allGroups = props.options;
            data.allGroups.forEach((group, i) => {
                group.index = i;
                group.options?.forEach((it, j) => {
                    it.groupIndex = i;
                    it.index = j;
                    if (selectedValues.includes(it.value)) {
                        it.selected = true;
                        selectedList.push({
                            ... it
                        });
                    } else {
                        it.selected = false;
                    }
                });
            });
        } else {
            // Flat mode
            data.allGroups = props.options.map((it, i) => {
                it.groupIndex = 0;
                it.index = i;
                if (selectedValues.includes(it.value)) {
                    it.selected = true;
                    selectedList.push({
                        ... it
                    });
                } else {
                    it.selected = false;
                }
                return it;
            });
        }
    } else {
        data.allGroups = [];
    }

    data.selectedList = selectedList;
    data.value = selectedList.map((it) => it.value);

    if (props.searchable) {
        updateSearchResults();
    } else {
        data.groups = data.allGroups;
    }

});

watch(() => mv.value, (vs) => {
    data.value = vs;
    initSelected('watch mv');
});

onMounted(() => {
    data.value = mv.value;
    initSelected('onMounted');
});

defineExpose({
    cid
});
</script>
<style lang="scss">
@use "../global.scss";

.vui-multi-select {
    display: flex;
    flex-direction: column;
    gap: 3px;
    color: #1e1e1e;
    font-weight: 400;

    label {
        position: relative;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.vui-multi-select-view {
    display: flex;
    gap: 5px;
    justify-content: space-between;
    align-items: center;
    min-height: var(--vui-min-height);
    padding: 3px 5px;
    color: #495057;
    font-weight: 400;
    border: 1px solid #aaa;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
    overflow: hidden;
    transition: var(--vui-color-transition);

    &:hover {
        border: 1px solid #888;
    }

    &:focus {
        outline: 1px solid var(--vui-neutral-60);
        outline-offset: -1px;
    }
}

.vui-multi-select-popover {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.vui-multi-select-search {
    position: relative;
    display: flex;
    gap: 5px;
    align-items: center;
    width: 100%;
    height: 30px;
    padding: 0 15px;
    border-radius: 24px;
    background-color: #e5e5e5;

    .vui-multi-select-icon-search {
        flex-shrink: 0;
    }

    .vui-multi-select-icon-close {
        cursor: pointer;
    }

    input {
        display: block;
        flex: auto;
        height: 100%;
        border: none;
        background-color: transparent;
    }

    input:focus {
        border: none;
        outline: none;
    }
}

.vui-multi-select-panel {
    max-height: 300px;
    color: #1e1e1e;
    background-color: #fff;
    overflow: hidden auto;
}

.vui-multi-select-no-results {
    padding: 10px;
}

.vui-multi-select-group-name {
    padding: 6px 8px 4px;
    font-weight: 600;
    cursor: pointer;
}

.vui-multi-select-option-list {
    position: relative;
}

.vui-multi-select-option-item {
    display: flex;
    gap: 5px;
    justify-content: space-between;
    align-items: center;
    min-height: 30px;
    padding: 5px;
    cursor: pointer;
    overflow: hidden;
    transition: var(--vui-color-transition);

    &:hover {
        background-color: #f2f2f2;
    }

    span {
        flex: auto;
        color: #1c1915;
        text-overflow: ellipsis;
    }

    mark {
        color: #006fba;
        background: none;
    }

    .vui-icon {
        display: none;
        flex-shrink: 0;
    }

    &.selected {
        color: #006fba;

        .vui-icon {
            display: block;
        }
    }

    &--grouped {
        padding-left: 20px;
    }
}

.vui-multi-select-selected-list {
    display: flex;
    flex: auto;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
    overflow: hidden;
}

.vui-multi-select-selected-item {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 2px 5px;
    color: #5e5e5e;
    font-weight: 400;
    border: solid 1px #ccc;
    border-radius: 5px;
    background-color: var(--vui-neutral-5);
}

.vui-multi-select-selected-name {
    display: flex;
    gap: 5px;
    align-items: center;
    font-size: var(--vui-font-size-s);
}

</style>
