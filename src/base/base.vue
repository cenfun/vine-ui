<script>
import BaseRender from './base-render.vue';
export default {

    components: {
        BaseRender
    },

    model: {
        prop: 'parentModelValue',
        event: 'model-value-change'
    },

    props: {
        parentModelValue: {
            type: [String, Boolean, Number, Object],
            default: null
        },
        value: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        visible: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            classId: '',
            dataVisible: this.visible,
            dataModelValue: this.parentModelValue
        };
    },

    watch: {
        
        parentModelValue: function(nv) {
            this.dataModelValue = nv;
        },

        visible: function(nv) {
            this.dataVisible = nv;
        },

        dataModelValue: function(nv) {
            this.$emit('model-value-change', nv);
        }
    },

    created() {
        this.classId = this.getClassId();
    },

    methods: {

        getClassId() {
            const ls = ['vui'];
            const cn = this.$options.name;
            if (cn) {
                ls.push(`${cn}`.toLowerCase());
            } else {
                console.error('Invalid component name', this);
            }
            ls.push(this._uid);
            return ls.join('-');
        },

        getSlot(name) {
            let ls = this.$slots[name];
            if (!ls) {
                return;
            }
            ls = ls.filter(it => it.tag);
            return ls;
        },

        getList() {
            const l = arguments.length;
            let i = 0;
            while (i < l) {
                const item = arguments[i];
                if (Array.isArray(item)) {
                    return item;
                }
                i++;
            }
            return [];
        }
    }

};

</script>
<style lang="scss">
.vui,
.vui ::before,
.vui ::after,
.vui *,
.vui *::before,
.vui *::after {
    box-sizing: border-box;
}

.vui {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;

    button,
    input,
    optgroup,
    select,
    textarea {
        font-family: inherit;
    }

    button,
    input {
        overflow: visible;
    }

    button,
    select {
        text-transform: none;
    }
}

</style>