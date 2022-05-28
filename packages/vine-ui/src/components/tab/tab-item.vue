<template>
  <div
    :class="classList"
    @click="clickHandler"
  >
    <BaseRender :content="content" />
  </div>
</template>
<script>
import Base from '../../base/base.vue';
const TabItem = {

    name: 'TabItem',

    extends: Base,

    props: {
        position: {
            type: String,
            default: 'left'
        },
        content: {
            validator: (v) => true,
            default: ''
        },
        index: {
            type: Number,
            default: 0
        },
        selected: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classList() {
            const ls = [
                'vui-tab-item',
                `vui-tab-${this.position}`,
                'vui-flex-row'
            ];
            if (this.selected) {
                ls.push('selected');
            }
            return ls;
        }
    },

    methods: {
        clickHandler(e) {
            //console.log(e);
            this.dataModelValue = this.index;
        }
    }
};

export default TabItem;
</script>
<style lang="scss">
.vui-tab-item {
    position: relative;
    padding: 0 15px;
    max-width: 200px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    user-select: none;
    color: #002b36;
}

.vui-tab-right.vui-tab-item {
    margin-left: -1px;
}

.vui-tab-item::after {
    background-color: #a4a7ab;
    display: block;
    position: absolute;
    bottom: 8px;
    left: 100%;
    width: 1px;
    height: 20px;
    content: "";
    z-index: 0;
}

.vui-tab-right.vui-tab-item::after {
    left: 0;
}

.vui-tab-item:hover {
    background-color: #ebecef;
    z-index: 2;
}

.vui-tab-item:hover::before,
.vui-tab-item:hover::after {
    background-repeat: no-repeat;
    background-color: transparent;
    position: absolute;
    bottom: 0;
    left: -10px;
    display: block;
    width: 10px;
    height: 10px;
    pointer-events: none;
    content: "";
}

.vui-tab-item:hover::before {
    background-image: url("./images/hover-before.svg");
}

.vui-tab-item:hover::after {
    left: 100%;
    background-image: url("./images/hover-after.svg");
}

.vui-tab-item.selected {
    background-color: #fff;
    position: relative;
    z-index: 3;
}

.vui-tab-item.selected::before,
.vui-tab-item.selected::after {
    background-repeat: no-repeat;
    background-color: transparent;
    position: absolute;
    bottom: 0;
    left: -10px;
    display: block;
    width: 10px;
    height: 10px;
    pointer-events: none;
    content: "";
}

.vui-tab-item.selected::before {
    background-image: url("./images/selected-before.svg");
}

.vui-tab-item.selected::after {
    left: 100%;
    background-image: url("./images/selected-after.svg");
}

.vui-tab-item > * {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
