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
    ls.push(cid);
    return ls;
});

const styleList = computed(() => {
    const st = {};
    if (props.width) {
        st.width = autoPx(props.width);
    }
    if (props.height) {
        st.height = autoPx(props.height);
    }
    if (props.align) {
        st['--vui-flex-align'] = props.align;
    } else if (props.center) {
        st['--vui-flex-align'] = 'center';
    }
    if (props.gap) {
        st['--vui-flex-gap'] = autoPx(props.gap);
    }
    if (props.margin) {
        st['--vui-flex-margin'] = autoPx(props.margin);
    }
    if (props.padding) {
        st['--vui-flex-padding'] = autoPx(props.padding);
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
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.vui-flex-column {
    position: relative;
    display: flex;
    flex-direction: column;
}

.vui-flex-wrap {
    flex-wrap: wrap;
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
