<template>
  <div
    :class="classList"
    :style="styleList"
  >
    <slot>
      <BaseRender :content="props.content" />
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBase, BaseRender } from '../../base/base.js';
import { toCssUnit } from '../../util/util.js';

const { cid } = useBase('VuiFlex');

const props = defineProps({

    spacing: {
        type: [String, Number],
        default: ''
    },

    direction: {
        type: String,
        default: 'row',
        validator(value) {
            return ['row', 'column'].includes(value);
        }
    },

    content: {
        validator: (v) => true,
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

    center: {
        type: Boolean,
        default: false
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
    if (props.center) {
        ls.push('vui-flex-center');
    }
    if (props.spacing) {
        ls.push('vui-flex-spacing');
    }
    ls.push(cid);
    return ls;
});

const styleList = computed(() => {
    const st = {};
    if (props.width) {
        st.width = toCssUnit(props.width);
    }
    if (props.height) {
        st.height = toCssUnit(props.height);
    }
    if (props.spacing) {
        st['--vui-flex-spacing'] = toCssUnit(props.spacing);
    }
    if (props.spacing) {
        st['--vui-flex-margin'] = toCssUnit(props.margin);
    }
    if (props.spacing) {
        st['--vui-flex-padding'] = toCssUnit(props.padding);
    }
    return st;
});

</script>

<style lang="scss">
.vui-flex {
    --vui-flex-spacing: 0;
    --vui-flex-margin: 0;
    --vui-flex-padding: 0;

    margin: var(--vui-flex-margin);
    padding: var(--vui-flex-padding);
}

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

.vui-flex-center {
    justify-content: center;
}

.vui-flex-auto {
    flex: 1 1 0%;
    overflow: hidden;
}

.vui-flex-empty {
    flex: 1 1 0%;
    margin: 0;
    overflow: hidden;
}

.vui-flex-spacing {
    &.vui-flex-column > *:not(:first-child) {
        margin-top: var(--vui-flex-spacing);
    }

    &.vui-flex-row > *:not(:first-child) {
        margin-left: var(--vui-flex-spacing);
    }

    &.vui-flex .vui-flex-empty,
    &.vui-flex .vui-flex-empty + * {
        margin: 0;
    }
}

</style>
