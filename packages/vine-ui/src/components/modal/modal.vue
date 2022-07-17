<template>
  <div
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
    computed, onMounted, ref, onUnmounted
} from 'vue';
import {
    useBase, BaseRender, destroyComponent
} from '../../base/base.js';

import IconX from '../../base/images/icon-x.vue';
import { bindEvents, unbindEvents } from '../../util/util.js';

const { cid } = useBase('VuiModal');

const classList = ['vui', 'vui-modal', cid];

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
    }
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


const el = ref(null);
let $el;

const documentEvents = {
    click: {
        handler: (e) => {
            const $main = $el.querySelector('.vui-modal-main');
            if ($main === e.target || $main.contains(e.target)) {
                return;
            }
            unbindEvents(documentEvents);
            destroyComponent($el);
        }
    }
};

onMounted(() => {
    $el = el.value;
    setTimeout(() => {
        bindEvents(documentEvents, document);
    }, 100);
});

onUnmounted(() => {
    unbindEvents(documentEvents);
});


</script>
<style lang="scss">
.vui-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 20%);
    z-index: 1000;
}

.vui-modal-close {
    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: #fff;
    cursor: pointer;
    font-size: 20px;
    text-align: center;
    margin-top: -15px;
    margin-right: -15px;
    line-height: 40px;

    svg {
        pointer-events: none;
        display: block;
        width: 24px;
        height: 24px;
        margin: 8px 0 0 8px;
        opacity: 0.6;
    }

    &:hover svg {
        opacity: 1;
    }
}

.vui-modal-window {
    position: absolute;
    background: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    min-width: 300px;
    min-height: 200px;
    max-width: 1920px;
    max-height: 1080px;
}

.vui-modal-main {
    position: relative;
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.vui-modal-header {
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
}

.vui-modal-header-spacing {
    margin-bottom: 10px;
}

.vui-modal-content {
    width: 100%;
    position: relative;
    overflow: auto;
}

</style>
