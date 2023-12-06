<script lang="ts" setup>
import { defineEmits, defineProps, toRefs } from 'vue';

interface IProps {}

const props = defineProps<IProps>();

const {} = toRefs(props);
</script>

<template>
  <div>
    123123213
    <slot />
  </div>
</template>

<style lang="scss" scoped></style>
