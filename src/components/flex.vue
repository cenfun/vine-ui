<template>
  <div
    v-init="{cid}"
    :class="classList"
    :style="styleList"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
    autoPx, getCID, vInit, normalizeDirection
} from '../utils/util.js';

const cid = getCID('VuiFlex');

const props = defineProps({

    /** Flex direction: row or column */


    direction: {
        type: String,
        default: 'row',
        validator(value) {
            return ['row', 'column', 'r', 'c'].includes(value);
        }
    },

    /** Gap between flex items */


    gap: {
        type: [String, Number],
        default: ''
    },

    /** Enable flex-wrap */


    wrap: {
        type: Boolean,
        default: false
    },

    /** Allow children to shrink (flex-shrink: 1) */


    shrink: {
        type: Boolean,
        default: false
    },


    /** justify-content value (start, center, end, between, etc.) */
    align: {
        type: String,
        default: ''
    },


    /** Quick shorthand to center justify-content */
    center: {
        type: Boolean,
        default: false
    },

    /** Align-items value */


    alignItems: {
        type: String,
        default: ''
    },

    /** Flex container width */


    width: {
        type: [String, Number],
        default: ''
    },

    /** Flex container height */


    height: {
        type: [String, Number],
        default: ''
    },

    /** Overflow value */


    overflow: {
        type: String,
        default: ''
    },

    /** Margin around the container */


    margin: {
        type: [String, Number],
        default: ''
    },

    /** Padding inside the container */


    padding: {
        type: [String, Number],
        default: ''
    }


});

const dir = computed(() => normalizeDirection(props.direction));

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-flex',
        `vui-flex-${dir.value}`
    ];
    if (props.wrap) {
        ls.push('vui-flex-wrap');
    }
    if (props.shrink) {
        ls.push('vui-flex-shrink');
    }
    return ls;
});

const autoFxStyle = (st, k, v) => {
    if (v) {
        st[k] = autoPx(v);
    }
};

const styleList = computed(() => {
    const st = {};
    autoFxStyle(st, 'width', props.width);
    autoFxStyle(st, 'height', props.height);
    autoFxStyle(st, '--vui-flex-gap', props.gap);
    autoFxStyle(st, '--vui-flex-margin', props.margin);
    autoFxStyle(st, '--vui-flex-padding', props.padding);

    if (props.align) {
        st['--vui-flex-align'] = props.align;
    } else if (props.center) {
        st['--vui-flex-align'] = 'center';
    }

    if (props.alignItems) {
        st['--vui-flex-align-items'] = props.alignItems;
    }

    if (props.overflow) {
        st['--vui-flex-overflow'] = props.overflow;
    }

    return st;
});

defineExpose({
    cid
});
</script>

<style lang="scss">
.vui-flex {
    --vui-flex-gap: 0;
    --vui-flex-margin: 0;
    --vui-flex-padding: 0;
    --vui-flex-align: unset;
    --vui-flex-overflow: unset;

    gap: var(--vui-flex-gap);
    justify-content: var(--vui-flex-align);
    margin: var(--vui-flex-margin);
    padding: var(--vui-flex-padding);
    text-overflow: ellipsis;
    overflow: var(--vui-flex-overflow);

    // layout component do not break sub component size
    > * {
        flex-shrink: 0;
    }
}

/*
display for portable using both vui-flex-row and vui-flex-column
*/
.vui-flex-row {
    --vui-flex-align-items: center;

    position: relative;
    display: flex;
    flex-direction: row;
    align-items: var(--vui-flex-align-items);
}

.vui-flex-column {
    --vui-flex-align-items: normal;

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: var(--vui-flex-align-items);
}

.vui-flex-wrap {
    flex-wrap: wrap;
}

.vui-flex-shrink {
    > * {
        flex-shrink: 1;
    }
}

.vui-flex-auto {
    flex: 1 1 0%;
    overflow: var(--vui-flex-overflow);
}

.vui-flex-empty {
    flex: 1 1 0%;
    margin: 0;
    padding: 0;
    overflow: var(--vui-flex-overflow);
}

</style>
