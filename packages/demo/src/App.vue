<script setup lang="ts">
import { ref } from 'vue';
import { XFlow, XFlowGraph, Background } from 'xflow-vue-next';

const bgColor = ref('red');
</script>

<template>
  <div class="container">
    <XFlow>
      <Background :color="bgColor" />
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
      />
    </XFlow>
  </div>
</template>

<style scoped>
.container {
  width: 1200px;
  height: 600px;
  margin-bottom: 50px;
  border-radius: 5px;
}
</style>
