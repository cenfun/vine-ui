<template>
  <div
    v-show="data.visible"
    ref="el"
    v-init="{cid}"
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
    bindEvents, unbindEvents, getCID, vInit
} from '../utils/util.js';

const cid = getCID('VuiDialog');

const classList = ['vui', 'vui-dialog'];

const props = defineProps({

    /** Dialog message text */


    message: {
        type: String,
        default: ''
    },

    /** Dialog window width */


    width: {
        type: String,
        default: ''
    },

    /** Dialog window height */


    height: {
        type: String,
        default: ''
    },

    /** Close dialog when clicking outside */


    closeOnClickOut: {
        type: Boolean,
        default: true
    },

    /** Initial visibility (used without v-model) */


    visible: {
        type: Boolean,
        default: false
    }

});

const mv = defineModel({
    type: Boolean,
    default: null
});

const data = reactive({
    visible: false
});

watchEffect(() => {
    data.visible = mv.value === null ? props.visible : mv.value;
});

watch(() => data.visible, (v) => {
    eventsHandler();
    mv.value = v;
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

defineExpose({
    cid
});
</script>
<style lang="scss">
@use "../global.scss";

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
    border-radius: 10px;
    background: #fff;
    transform: translate(-50%, -50%);
    overflow: auto;
}

</style>
