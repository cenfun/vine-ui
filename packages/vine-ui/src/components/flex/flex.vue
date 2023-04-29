<template>
  <div
    :class="classList"
    :style="styleList"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBase } from '../../base/base.js';
import { autoPx } from '../../utils/util.js';

const { cid } = useBase('VuiFlex');

const props = defineProps({

    direction: {
        type: String,
        default: 'row',
        validator(value) {
            return ['row', 'column'].includes(value);
        }
    },

    gap: {
        type: [String, Number],
        default: ''
    },

    wrap: {
        type: Boolean,
        default: false
    },

    shrink: {
        type: Boolean,
        default: false
    },

    // justify-content
    align: {
        type: String,
        default: ''
    },

    // quick align center
    center: {
        type: Boolean,
        default: false
    },

    alignItems: {
        type: String,
        default: ''
    },

    width: {
        type: [String, Number],
        default: ''
    },

    height: {
        type: [String, Number],
        default: ''
    },

    margin: {
        type: [String, Number],
        default: ''
    },

    padding: {
        type: [String, Number],
        default: ''
    }
});

const classList = computed(() => {
    const ls = [
        'vui',
        'vui-flex',
        `vui-flex-${props.direction}`
    ];
    if (props.wrap) {
        ls.push('vui-flex-wrap');
    }
    if (props.shrink) {
        ls.push('vui-flex-shrink');
    }
    ls.push(cid);
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

    return st;
});

</script>

<style lang="scss">
.vui-flex {
    --vui-flex-gap: 0;
    --vui-flex-margin: 0;
    --vui-flex-padding: 0;
    --vui-flex-align: "";

    gap: var(--vui-flex-gap);
    justify-content: var(--vui-flex-align);
    margin: var(--vui-flex-margin);
    padding: var(--vui-flex-padding);
    text-overflow: ellipsis;
    overflow: hidden;

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
    overflow: hidden;
}

.vui-flex-empty {
    flex: 1 1 0%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

</style>
