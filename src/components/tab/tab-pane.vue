<template>
  <div :class="classList">
    <BaseRender :content="content" />
  </div>
</template>
<script>
import Base from '../../base/base.vue';

const TabPane = {

    name: 'TabPane',

    extends: Base,

    props: {
        content: {
            validator: (v) => true,
            default: ''
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classList() {
            const ls = ['vui-tab-pane'];
            if (this.selected) {
                ls.push('selected');
            }
            return ls;
        }
    }
};

export default TabPane;
</script>
<style lang="scss">
.vui-tab-pane {
    position: relative;
    display: none;
    padding: 10px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.vui-tab-pane.selected {
    display: block;
}

</style>
