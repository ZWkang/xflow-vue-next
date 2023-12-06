<script lang="ts" setup>
import { defineEmits, defineProps, toRefs } from 'vue';

interface IProps {
  size: string;
}

const props = defineProps<IProps>();

const {} = toRefs(props);
</script>

<template>
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-bind="$attrs"><slot /></button>
</template>

<style lang="scss" scoped></style>
