<template>
  <div
    ref="el"
    :class="classList"
  >
    <div
      class="vui-modal-main vui-flex-column"
      :style="styleMain"
    >
      <div :class="classHeader">
        <BaseRender :content="props.title" />
      </div>
      <div class="vui-modal-content vui-flex-auto">
        <slot>
          <BaseRender :content="props.content" />
        </slot>
      </div>
    </div>
    <div class="vui-modal-close">
      <IconX />
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
import { Util } from '../../index.js';

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

const styleMain = computed(() => {
    return {
        left: props.padding,
        right: props.padding,
        top: props.padding,
        bottom: props.padding
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
            Util.unbindEvents(documentEvents);
            destroyComponent($el);
        }
    }
};

onMounted(() => {
    $el = el.value;
    setTimeout(() => {
        Util.bindEvents(documentEvents, document);
    }, 100);
});

onUnmounted(() => {
    Util.unbindEvents(documentEvents);
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
    top: 20%;
    right: 20%;
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

.vui-modal-main {
    position: absolute;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
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
}

</style>
