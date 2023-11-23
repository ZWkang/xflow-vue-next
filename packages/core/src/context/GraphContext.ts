import type { Graph } from '@antv/x6';
import { provide, shallowRef, inject, ShallowRef } from 'vue';

export interface GraphContextValue {
  graph: ShallowRef<Graph | null>;
  setGraph: (graph: Graph | null) => void;
}

export const symbol = Symbol('graph_context');

export const provideGraph = () => {
  const graph = shallowRef<Graph | null>(null);

  function setGraph(g: Graph | null) {
    graph.value = g;
  }

  const val = {
    graph,
    setGraph,
  };

  provide(symbol, val);
  return val;
};

export const useGraph = () => {
  const val = inject(symbol);

  if (!val) {
    throw new Error('useGraph must be used after provideGraph');
  }

  return val as GraphContextValue;
};
