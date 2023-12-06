<script lang="ts" setup>
import { defineEmits, defineProps, toRefs } from 'vue';

import { XFlow, XFlowGraph, Grid, Background, Clipboard, History, Minimap, Snapline, Transform } from 'xflow-vue-next';
import Toolbar from '../components/Basic/tools.vue';

interface IProps {}

const props = defineProps<IProps>();

const {} = toRefs(props);
</script>

<template>
  <div class="flex w-[1200px] my-[100px] mx-auto">
    <div class="w-[1200px] h-[600px] mb-[50px] rounded-md">
      <XFlow>
        <Toolbar />
        <div class="flex h-[800px]">
          <XFlowGraph
            zoomable
            pannable
            centerView
            fitView
            :connectionEdgeOptions="{
              attrs: {
                line: {
                  stroke: '#8f8f8f',
                  strokeWidth: 1,
                },
              },
            }"
          >
          </XFlowGraph>
          <Grid type="mesh" :options="{ color: '#ccc', thickness: 1 }" />
          <JSONCode />
          <Clipboard />
          <History />
          <Snapline sharp />
          <Transform resizing rotating />
        </div>
      </XFlow>
    </div>
    <div class="w-[1200px] h-[600px] mb-[50px] rounded-md"></div>
  </div>
</template>

<style lang="scss" scoped></style>
