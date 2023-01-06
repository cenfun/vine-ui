<template>
  <div
    v-show="state.visible"
    ref="el"
    :class="classList"
  >
    <div
      class="vui-modal-window"
      :style="styleWindow"
    >
      <div class="vui-modal-close">
        <IconX />
      </div>
      <div class="vui-modal-main vui-flex-column">
        <div :class="classHeader">
          <BaseRender :content="props.title" />
        </div>
        <div class="vui-modal-content vui-flex-auto">
          <slot>
            <BaseRender :content="props.content" />
          </slot>
        </div>
      </div>
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

import IconX from '../../base/images/icon-x.vue';
import { bindEvents, unbindEvents } from '../../util/util.js';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    content: {
        validator: (v) => true,
        default: ''
    },
    padding: {
        type: String,
        default: '20%'
    },
    headerSpacing: {
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

const { cid } = useBase('VuiModal');

const classList = ['vui', 'vui-modal', cid];

const el = ref(null);

const emit = defineEmits(['update:modelValue']);

const state = reactive({
    $el: null,
    visible: true
});

const classHeader = computed(() => {
    const ls = ['vui-modal-header'];
    if (props.headerSpacing) {
        ls.push('vui-modal-header-spacing');
    }
    return ls;
});

const styleWindow = computed(() => {
    return {
        inset: props.padding
    };
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
            const $main = state.$el.querySelector('.vui-modal-main');
            if ($main === e.target || $main.contains(e.target)) {
                return;
            }
            unbindEvents(documentEvents);
            close();
        }
    }
};

const eventHandler = () => {
    if (state.visible) {
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
.vui-modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 20%);
}

.vui-modal-close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    width: 40px;
    height: 40px;
    margin-top: -15px;
    margin-right: -15px;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    border-radius: 20px;
    background: #fff;
    cursor: pointer;

    svg {
        display: block;
        width: 24px;
        height: 24px;
        margin: 8px 0 0 8px;
        opacity: 0.6;
        pointer-events: none;
    }
}

.vui-modal-close:hover svg {
    opacity: 1;
}

.vui-modal-window {
    position: absolute;
    min-width: 300px;
    max-width: 1920px;
    min-height: 200px;
    max-height: 1080px;
    box-sizing: border-box;
    border-radius: 10px;
    background: #fff;
}

.vui-modal-main {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow: hidden;
}

.vui-modal-header {
    padding-bottom: 10px;
    font-weight: bold;
    font-size: 18px;
    border-bottom: 2px solid #333;
}

.vui-modal-header-spacing {
    margin-bottom: 10px;
}

.vui-modal-content {
    position: relative;
    width: 100%;
    overflow: auto;
}

</style>
