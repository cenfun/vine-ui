<script>
import { h } from 'vue';
export default {

    props: {
        content: {
            validator: (v) => true,
            default: ''
        }
    },

    setup(props, ctx) {

        //vNode
        // if (isVNode(props.content)) {
        //     return h(props.content);
        // }
           
        //render function
        if (typeof props.content === 'function') {
            return () => {
                return props.content.call(ctx, h, ctx);
            };
        }

        //console.log(props.content);
        
        //text node
        return () => props.content;

    }

};
</script>
