<template>
  <div class="vui-app vui-flex-column">
    <div class="vui-header vui-flex-row">
      <div
        class="vui-title"
        tooltip="Lightweight UI components"
      >
        Vine UI Components
      </div>
      <div class="vui-sub">
        Based on <a
          href="https://github.com/vuejs/core"
          target="_blank"
        >Vue 3.x</a>
      </div>
      <VuiFlex gap="10px">
        <div class="fps-detector" />
        <a
          href="https://github.com/cenfun/vine-ui"
          target="_blank"
          class="icon-github"
          tooltip="Github"
        />
      </VuiFlex>
    </div>
    <div class="vui-body vui-flex-auto vui-flex-row">
      <div class="vui-demo-nav">
        <router-link
          class="vui-nav-home"
          to="/"
        >
          Preview All
        </router-link>
        <router-link
          v-for="(item,i) in demos"
          :key="i"
          :to="item.path"
          :class="'vui-nav-'+item.key"
        >
          {{ item.componentName }}
        </router-link>
      </div>
      <div class="vui-demo-body vui-flex-auto">
        <router-view />
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
    onMounted, reactive, provide
} from 'vue';
import { components, generateTooltips } from 'vine-ui';
import FPSDetector from 'fps-detector';

import demos from './demos.js';

const { VuiFlex, VuiTooltip } = components;

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

    console.log('components', components);
    console.log('demos', demos);

    new FPSDetector('.fps-detector');

    const getTooltip = (target) => {
        const text = target.getAttribute('tooltip');
        if (text) {
            return text;
        }
        if (target.classList.contains('tooltip')) {
            return target.innerText;
        }
    };

    generateTooltips((target, text) => {
        tooltip.visible = true;
        tooltip.target = target;
        tooltip.text = text;
    }, (target) => {
        tooltip.visible = false;
        tooltip.text = '';
    }, getTooltip);

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
    padding: 5px 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    background: #f5f5f5;
}

.vui-title {
    height: 30px;
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
}

.vui-sub {
    flex: 1 1 0%;
    height: 30px;
    padding-left: 10px;
    color: #666;
    line-height: 30px;
}

.icon-github {
    display: block;
    width: 26px;
    height: 26px;
    margin-right: 5px;
    background-image: url("images/github.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 26px 26px;
    opacity: 0.6;
}

.icon-github:hover {
    opacity: 1;
}

.vui-body {
    align-items: start;
    overflow: hidden;
}

.vui-demo-nav {
    width: 168px;
    height: 100%;
    overflow-y: auto;

    a {
        position: relative;
        display: block;
        padding: 10px;
        padding-left: 25px;
        color: #000;
        text-decoration: none;
        border-bottom: 1px solid #ddd;

        &::before {
            position: absolute;
            top: 50%;
            left: 10px;
            content: "";
            display: block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #000;
            transform: translate(0, -50%);
        }
    }

    a:visited {
        color: #000;
    }

    a.router-link-active {
        font-weight: bold;
        background-color: #eee;
    }

    a:hover {
        background-color: #f8f8f8;
    }

    .vui-nav-home {
        &::before {
            left: 8px;
            width: 8px;
            height: 8px;
            border-radius: 0;
        }
    }
}

.vui-demo-body {
    height: 100%;
    margin-left: 10px;
    padding: 10px;
    overflow-y: auto;
}

</style>
