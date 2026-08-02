<template>
  <nav class="vui-nav">
    <router-link
      class="vui-nav-home"
      to="/"
    >
      Preview All
    </router-link>
    <router-link
      v-for="(item,i) in examples"
      :key="i"
      :to="item.path"
    >
      {{ item.componentName }}
    </router-link>
  </nav>
</template>
<script setup>
import examples from './examples.js';
</script>
<style lang="scss">
.vui-nav {
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

</style>
