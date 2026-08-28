<template>
  <div class="vui-app vui-flex-column">
    <div class="vui-header">
      <div
        class="vui-header-menu"
        @click="toggleMenu"
      />
      <div class="vui-title">
        Vine UI
        <a
          href="https://github.com/cenfun/vine-ui"
          target="_blank"
        >v{{ VERSION }}</a>
      </div>
      <div class="fps-detector" />
    </div>
    <div class="vui-body vui-flex-auto vui-flex-row">
      <div class="vui-example-nav">
        <Nav />
      </div>
      <div class="vui-example-body vui-flex-auto">
        <router-view />
      </div>
    </div>
    <div
      v-if="flyoverVisible"
      ref="flyoverEl"
      class="vui-nav-flyover"
    >
      <div class="vui-nav-header">
        <div
          class="vui-nav-close"
          @click="toggleMenu"
        />
      </div>
      <div class="vui-nav-main">
        <Nav />
      </div>
    </div>
    <VuiTooltip
      :visible="tooltip.visible"
      :target="tooltip.target"
      :text="tooltip.text"
      :html="tooltip.html"
      :border-color="tooltip.borderColor"
      :bg-color="tooltip.bgColor"
      :color="tooltip.color"
    />
  </div>
</template>
<script setup>
import {
    onMounted, reactive, provide, ref, watch, nextTick
} from 'vue';
import { useRoute } from 'vue-router';
import {
    VuiTooltip, initGlobalTooltips, VERSION, TAG
} from './vine-ui.js';
import FPSDetector from 'fps-detector';

import Nav from './nav.vue';

console.log('TAG', TAG);

const isDev = import.meta.env.DEV;
const route = useRoute();

const flyoverVisible = ref(false);
const flyoverEl = ref();

const bindAnimation = (closing, callback) => {

    const elem = flyoverEl.value;
    if (!elem) {
        return;
    }

    elem.addEventListener('animationend', () => {
        if (closing) {
            elem.classList.remove('vui-nav-closing');
        } else {
            elem.classList.remove('vui-nav-opening');
        }
        if (callback) {
            callback();
        }
    }, {
        once: true
    });

    if (closing) {
        elem.classList.add('vui-nav-closing');
    } else {
        elem.classList.add('vui-nav-opening');
    }
};

const autoCloseHandler = (e) => {
    if (flyoverEl.value && !flyoverEl.value.contains(e.target)) {
        document.removeEventListener('click', autoCloseHandler);
        toggleMenu();
    }
};

const toggleMenu = () => {
    if (flyoverVisible.value) {
        bindAnimation(true, () => {
            document.removeEventListener('click', autoCloseHandler);
            flyoverVisible.value = false;
        });
    } else {
        flyoverVisible.value = true;
        nextTick(() => {
            bindAnimation(false, () => {
                document.addEventListener('click', autoCloseHandler);
            });
        });
    }
};

watch(() => route.path, () => {
    if (flyoverVisible.value) {
        toggleMenu();
    }
});

const tooltip = reactive({
    visible: false,
    target: '',
    text: '',
    html: false,
    borderColor: '',
    bgColor: '',
    color: ''
});

provide('tooltip', tooltip);

onMounted(() => {

    if (isDev) {
        new FPSDetector('.fps-detector');
    }

    initGlobalTooltips((target) => {
        let text = target.getAttribute('tooltip');
        if (!text) {
            if (target.clientWidth < target.scrollWidth) {
                text = target.innerText;
            } else {
                return;
            }
        }
        tooltip.visible = true;
        tooltip.target = target;
        tooltip.text = text;

    }, (target) => {

        tooltip.visible = false;
        tooltip.text = '';

    });

});

</script>
<style lang="scss">
html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    color: #333;
    font-size: 14px;
    font-family: Helvetica, Arial, sans-serif;
}

.vui-app {
    position: relative;
    width: 100%;
    height: 100%;
}

.vui-header {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
    background: #f5f5f5;
}

.vui-title {
    flex: auto;
    height: 30px;
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;

    a {
        padding-left: 5px;
        color: #666;
        font-weight: normal;
        font-size: 14px;
    }
}

.vui-header-menu,
.vui-nav-close {
    width: 26px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 26px 26px;
    cursor: pointer;
    opacity: 0.6;
}

.vui-header-menu {
    display: none;
    background-image: url("images/menu.svg");
}

.vui-nav-close {
    background-image: url("images/close.svg");
}

.vui-header-menu:hover,
.vui-nav-close:hover {
    opacity: 1;
}

.vui-body {
    align-items: start;
    overflow: hidden;
}

.vui-example-nav {
    width: 168px;
    height: 100%;
    border-right: 1px solid #ddd;
    overflow-y: auto;
}

.vui-example-body {
    height: 100%;
    padding: 10px;
    overflow-y: auto;
}

/* Mobile responsive */
@media (width <= 768px) {
    .vui-header-menu {
        display: block;
    }

    .vui-body .vui-example-nav {
        display: none;
    }
}

.vui-nav-flyover {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
    width: 230px;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    overflow: hidden;

    .vui-nav-header {
        display: flex;
        flex-shrink: 0;
        gap: 10px;
        justify-content: flex-end;
        align-items: center;
        height: 40px;
        padding: 0 10px;
        border-bottom: 1px solid #ddd;
    }

    .vui-nav-main {
        flex: auto;
        overflow: auto;
    }
}

@keyframes vui-nav-slide-in-left {
    from {
        visibility: visible;
        transform: translate3d(-100%, 0, 0);
    }

    to {
        transform: translate3d(0, 0, 0);
    }
}

@keyframes vui-nav-slide-out-left {
    from {
        transform: translate3d(0, 0, 0);
    }

    to {
        visibility: hidden;
        transform: translate3d(-100%, 0, 0);
    }
}

.vui-nav-opening {
    left: 0;
    animation-name: vui-nav-slide-in-left;
    animation-duration: 0.2s;
    animation-fill-mode: both;
}

.vui-nav-closing {
    left: 0;
    animation-name: vui-nav-slide-out-left;
    animation-duration: 0.2s;
    animation-fill-mode: both;
}

</style>
