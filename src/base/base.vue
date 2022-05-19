<script>
import BaseRender from './base-render.vue';
export default {

    components: {
        BaseRender
    },

    props: {
        modelValue: {
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
            //bridge from parent and child v-model: moduleValue
            dataModelValue: this.modelValue
        };
    },

    watch: {
        
        //from parent changed props
        modelValue: function(nv) {
            //this.log('modelValue changed:', nv);
            this.dataModelValue = nv;
        },

        //from child changed value
        dataModelValue: function(nv) {
            //this.log('dataModelValue changed:', nv);
            this.$emit('update:modelValue', nv);
        },

        visible: function(nv) {
            this.dataVisible = nv;
        }
    },

    created() {
        this.classId = this.getClassId();
    },

    methods: {

        log() {
            const args = Array.from(arguments);
            args.unshift(this.classId);
            console.log.apply(console, args);
        },

        destroy() {
            //this.log('destroy');
            this.$.appContext.app.unmount();
        },

        getClassId() {
            const ls = ['vui'];
            const cn = this.$options.name;
            if (cn) {
                ls.push(`${cn}`.toLowerCase());
            } else {
                console.error('Invalid component name', this);
            }
            ls.push(this._.uid);
            return ls.join('-');
        },

        getSlot(name) {
            const fun = this.$slots[name];
            if (!fun) {
                return;
            }
            let ls = fun();
            //console.log(ls);

            ls = ls.filter((it) => it.type);

            //console.log(ls);
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
