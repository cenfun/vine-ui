<template>
  <div
    v-show="data.visible"
    ref="el"
    :class="classList"
  >
    <div
      class="vui-modal-window"
      :style="styleWindow"
    >
      <div
        v-if="props.closeButton"
        class="vui-modal-close"
        @click="onCloseClick"
      >
        <IconX />
      </div>
      <div class="vui-modal-main vui-flex-column">
        <div
          v-if="props.title"
          class="vui-modal-header"
        >
          {{ props.title }}
        </div>
        <div class="vui-modal-content vui-flex-auto">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
    computed, onMounted, ref, reactive, watchEffect, watch
} from 'vue';
import { useBase } from '../../base/base.js';

import IconX from '../../images/icon-x.vue';
import { bindEvents, unbindEvents } from '../../utils/util.js';

const { cid } = useBase('VuiModal');

const classList = ['vui', 'vui-modal', cid];

const props = defineProps({

    title: {
        type: String,
        default: ''
    },

    inset: {
        type: String,
        default: '20%'
    },

    closeButton: {
        type: Boolean,
        default: true
    },

    closeOnClickOut: {
        type: Boolean,
        default: true
    },

    visible: {
        type: Boolean,
        default: false
    },

    modelValue: {
        type: Boolean,
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'close']);

const data = reactive({
    visible: false
});

watchEffect(() => {
    data.visible = props.modelValue === null ? props.visible : props.modelValue;
});

watch(() => data.visible, (v) => {
    eventsHandler();
    emit('update:modelValue', v);
});

const el = ref(null);
let $el;

const styleWindow = computed(() => {
    return {
        inset: props.inset
    };
});

const close = () => {

    if (!data.visible) {
        return;
    }

    data.visible = false;

};

const onCloseClick = () => {
    close();
};

const documentEvents = {
    click: {
        handler: (e) => {
            const $main = $el.querySelector('.vui-modal-main');
            if ($main === e.target || $main.contains(e.target)) {
                return;
            }
            unbindEvents(documentEvents);
            close();
        }
    }
};

const eventsHandler = () => {
    if (data.visible) {
        if (props.closeOnClickOut) {
            setTimeout(() => {
                bindEvents(documentEvents, document);
            }, 100);
        }
    } else {
        unbindEvents(documentEvents);
    }
};

onMounted(() => {
    $el = el.value;
    eventsHandler();
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
    margin-bottom: 10px;
    padding-bottom: 10px;
    font-weight: bold;
    font-size: 18px;
    border-bottom: 2px solid #333;
}

.vui-modal-content {
    position: relative;
    width: 100%;
    overflow: auto;
}

</style>
