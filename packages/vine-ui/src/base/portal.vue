<template>
  <Teleport :to="props.to">
    <slot />
  </Teleport>
</template>
<script setup>

// import { onMounted } from 'vue';

const props = defineProps({
    to: {
        type: String,
        default: 'body'
    }
});

</script>
