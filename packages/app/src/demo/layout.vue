<template>
  <div>
    <VuiFlex>
      <VuiLayout
        width="50%"
        height="300px"
      >
        <div size="200px">
          row left size: 200px
        </div>
        <div>
          row right auto
        </div>
      </VuiLayout>
      <VuiLayout
        width="50%"
        height="300px"
        direction="column"
      >
        <div>
          column top auto
        </div>
        <div size="100px">
          column bottom size: 100px
        </div>
      </VuiLayout>
    </VuiFlex>
    <VuiLayout
      width="100%"
      height="300px"
    >
      <div
        size="200px"
        class="vui-layout-left"
      >
        left
        size: 200px
        min-width: 50px
      </div>
      <div>
        <VuiLayout
          height="100%"
          direction="column"
          size="3px"
        >
          <div
            size="50px"
            class="vui-layout-top"
          >
            top
            height: 50px;
            min-height: 50px;
          </div>
          <div>
            middle
          </div>
          <div size="100px">
            bottom
          </div>
        </VuiLayout>
      </div>
      <div>
        middle-right
      </div>
      <div size="200px">
        right
        size: 200px
      </div>
    </VuiLayout>
  </div>
</template>

<script setup>
import VineUI from 'vine-ui';
const { VuiLayout, VuiFlex } = VineUI;

</script>
<style>
.vui-layout-item {
    border: thin solid #eee;
}

.vui-layout-left {
    min-width: 50px;
}

.vui-layout-top {
    min-height: 50px;
}
</style>

