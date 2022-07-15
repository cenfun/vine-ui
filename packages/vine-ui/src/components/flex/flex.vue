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

const { cid } = useBase('VuiFlex');

const props = defineProps({
    width: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: ''
    },
    direction: {
        type: String,
        default: 'row',
        validator(value) {
            return ['row', 'column'].includes(value);
        }
    },
    center: {
        type: Boolean,
        default: false
    },
    content: {
        validator: (v) => true,
        default: ''
    },
    spacing: {
        type: String,
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
        st.width = props.width;
    }
    if (props.height) {
        st.height = props.height;
    }
    if (props.spacing) {
        st['--vui-flex-spacing'] = props.spacing;
    }
    return st;
});

</script>

<style lang="scss">
.vui-flex {
    --vui-flex-spacing: 0;
}

.vui-flex-auto {
    flex: 1 1 0%;
    overflow: hidden;
}

.vui-flex-empty {
    flex: 1 1 0%;
    overflow: hidden;
    margin: 0;
}

.vui-flex-center {
    justify-content: center;
}

.vui-flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}

.vui-flex-column {
    display: flex;
    flex-direction: column;
    position: relative;
}

.vui-flex-spacing > .vui-flex-empty,
.vui-flex-spacing > .vui-flex-empty + * {
    margin-left: 0;
    margin-top: 0;
}

.vui-flex-spacing {
    &.vui-flex-column > * {
        margin-top: var(--vui-flex-spacing);
    }

    &.vui-flex-row > * {
        margin-left: var(--vui-flex-spacing);
    }

    &.vui-flex-column > *:first-child {
        margin-top: 0;
    }

    &.vui-flex-row > *:first-child {
        margin-left: 0;
    }
}

</style>
