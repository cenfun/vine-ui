<script>
export default {

    functional: true,

    props: {
        content: {
            validator: (v) => true,
            default: ''
        }
    },

    render(h, context) {
        const content = context.props.content;

        if (content) {

            //vNode list
            if (Array.isArray(content)) {
                return content;
            }

            //vNode
            if (content.context && content.context._isVue) {
                return content;
            }

            //render function
            if (typeof content === 'function') {
                return content.call(context, h, context);
            }

        }

        //console.log(content);
        
        //text node
        return context._v(content);
    }

};
</script>
