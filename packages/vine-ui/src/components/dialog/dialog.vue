<template>
  <div
    v-show="data.visible"
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
      <slot />
    </div>
  </div>
</template>

<script setup>
import {
    computed, onMounted, ref, reactive, watchEffect, watch
} from 'vue';

import {
    bindEvents, unbindEvents, getCID
} from '../../utils/util.js';

const cid = getCID('VuiDialog');

const classList = ['vui', 'vui-dialog', cid];

const props = defineProps({

    message: {
        type: String,
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

const emit = defineEmits(['update:modelValue']);

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

    if (!data.visible) {
        return;
    }

    data.visible = false;

};

const documentEvents = {
    click: {
        handler: (e) => {
            const $main = $el.querySelector('.vui-dialog-window');
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
