<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { Node } from '@antv/x6';

const props = defineProps<{
  node: Node;
}>();
// const data = node.getData();
const data = computed(() => props.node.getData());
</script>

<template>
  <div class="h-full w-full flex items-center justify-center" style="border: 1px solid #8f8f8f; border-radius: 6px">
    <span>{{ `${data.animal.name}-${data.animal.age}` }}</span>
  </div>
</template>

<style lang="scss" scoped></style>
