<template>
  <div
    v-show="data.visible"
    ref="el"
    :class="classList"
  >
    <div
      class="vui-modal-window"
      :style="styleMap"
    >
      <div
        v-if="props.closeButton"
        class="vui-modal-close"
        @click="onCloseClick"
      >
        <IconX />
      </div>
      <div class="vui-modal-main">
        <div
          v-if="props.title"
          class="vui-modal-header"
        >
          {{ props.title }}
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
    computed, onMounted, ref, reactive, watchEffect, watch
} from 'vue';

import IconX from '../../images/icon-x.vue';
import {
    bindEvents, unbindEvents, getCID,
    autoPx
} from '../../utils/util.js';

const cid = getCID('VuiModal');

const classList = ['vui-modal', cid];

const props = defineProps({

    title: {
        type: String,
        default: ''
    },

    closeButton: {
        type: Boolean,
        default: true
    },

    closeOnClickOut: {
        type: Boolean,
        default: true
    },

    width: {
        type: String,
        default: ''
    },
    maxWidth: {
        type: String,
        default: ''
    },

    appendToBody: {
        type: Boolean,
        default: false
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
    if (!v) {
        emit('close');
    }
});

const el = ref(null);
let $el;

const styleMap = computed(() => {
    const st = {
    };

    if (props.width) {
        st.width = autoPx(props.width);
    }
    if (props.maxWidth) {
        st['max-width'] = autoPx(props.maxWidth);
    }

    return st;
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

const maskEvents = {
    click: {
        handler: (e) => {
            const $main = $el.querySelector('.vui-modal-main');
            if ($main === e.target || $main.contains(e.target)) {
                return;
            }
            unbindEvents(maskEvents);
            close();
        }
    }
};

const eventsHandler = () => {
    const cls = document.body.classList;
    if (data.visible) {
        cls.add('vui-modal-lock-body');
        if (props.closeOnClickOut) {
            setTimeout(() => {
                bindEvents(maskEvents, $el);
            }, 100);
        }
    } else {
        cls.remove('vui-modal-lock-body');
        unbindEvents(maskEvents);
    }
};

onMounted(() => {
    $el = el.value;
    if (props.appendToBody) {
        document.body.appendChild($el);
    }
    eventsHandler();
});

</script>
<style lang="scss">
.vui-modal-lock-body {
    overflow: hidden;
    touch-action: none;
}

.vui-modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 30%);
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
    top: 50%;
    left: 50%;
    display: flex;
    max-width: 90%;
    max-height: 80%;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 10px;
    background: #fff;
    transform: translate(-50%, -50%);
}

.vui-modal-main {
    position: relative;
    width: 100%;
}

.vui-modal-header {
    margin-bottom: 10px;
    padding-bottom: 10px;
    font-weight: bold;
    font-size: 18px;
    border-bottom: 2px solid #333;
}

</style>
