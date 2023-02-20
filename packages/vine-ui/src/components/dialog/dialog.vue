<template>
  <div
    v-show="state.visible"
    ref="el"
    :class="classList"
  >
    <div
      class="vui-dialog-window"
      :style="styleMap"
    >
      <div
        v-if="props.message"
        class="vui-dialog-message"
      >
        {{ props.message }}
      </div>
      <slot>
        <BaseRender :content="props.content" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import {
    computed, onMounted, ref, onUnmounted, reactive, watchEffect, watch
} from 'vue';
import {
    useBase, BaseRender, getComponent, destroyComponent
} from '../../base/base.js';

import { bindEvents, unbindEvents } from '../../util/util.js';

const props = defineProps({

    message: {
        type: String,
        default: ''
    },

    content: {
        validator: (v) => true,
        default: ''
    },

    width: {
        type: String,
        default: ''
    },

    height: {
        type: String,
        default: ''
    },

    fastClose: {
        type: Boolean,
        default: true
    },

    visible: {
        type: Boolean,
        default: true
    },
    modelValue: {
        type: Boolean,
        default: null
    }
});

const { cid } = useBase('VuiDialog');

const classList = ['vui', 'vui-dialog', cid];

const el = ref(null);

const emit = defineEmits(['update:modelValue']);

const state = reactive({
    $el: null,
    visible: true
});


const styleMap = computed(() => {
    const st = {};
    if (props.width) {
        st.width = props.width;
    }
    if (props.height) {
        st.height = props.height;
    }
    return st;
});

const close = () => {

    const component = getComponent(state.$el);
    if (component) {
        destroyComponent(state.$el);
        return;
    }

    if (!state.visible) {
        return;
    }

    state.visible = false;
    emit('update:modelValue', state.visible);

};

const documentEvents = {
    click: {
        handler: (e) => {
            const $main = state.$el.querySelector('.vui-dialog-window');
            if ($main === e.target || $main.contains(e.target)) {
                return;
            }
            unbindEvents(documentEvents);
            close();
        }
    }
};

const eventHandler = () => {
    if (state.visible && props.fastClose) {
        setTimeout(() => {
            bindEvents(documentEvents, document);
        }, 100);
    } else {
        unbindEvents(documentEvents);
    }
};

watchEffect(() => {
    if (props.modelValue === null) {
        state.visible = props.visible;
    } else {
        state.visible = props.modelValue;
    }
});

watch(() => state.visible, () => {
    eventHandler();
});

onMounted(() => {
    state.$el = el.value;
    eventHandler();
});

onUnmounted(() => {
    unbindEvents(documentEvents);
});

defineExpose({
    cid
});

</script>
<style lang="scss">
.vui-dialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 20%);
}

.vui-dialog-window {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 240px;
    max-width: 80%;
    max-height: 80%;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 10px;
    background: #fff;
    transform: translate(-50%, -50%);
    overflow: auto;
}

</style>
