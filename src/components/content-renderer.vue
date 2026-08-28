<template>
  <template v-if="typeof props.content === 'string'">
    <span
      v-if="props.html"
      style="display: contents"
      v-html="props.content"
    />
    <template v-else>
      {{ props.content }}
    </template>
  </template>
  <DynamicContent
    v-else
    :content="props.content"
  />
</template>
<script setup>
import {
    defineComponent, h, isVNode
} from 'vue';

defineOptions({
    name: 'VuiContentRenderer'
});

const props = defineProps({
    content: {
        type: [String, Object, Function],
        default: null
    },
    html: {
        type: Boolean,
        default: false
    }
});

const DynamicContent = defineComponent({
    name: 'VuiDynamicContent',
    props: {
        content: {
            type: [Object, Function],
            default: null
        }
    },
    setup(rendererProps) {
        return () => {
            const content = rendererProps.content;
            if (content === null || typeof content === 'undefined') {
                return null;
            }
            if (isVNode(content)) {
                return content;
            }
            return h(content);
        };
    }
});
</script>
