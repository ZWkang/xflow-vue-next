import { Dnd } from '@antv/x6-plugin-dnd';
import { ref, watch, watchEffect } from 'vue';
import type { NodeOptions } from '../types';

import { useGraphInstance } from './useGraphInstance';

export const useDnd = (options?: Omit<Dnd.Options, 'target' | 'getDragNode' | 'getDropNode'>) => {
  const graph = useGraphInstance();
  const dndRef = ref<Dnd>();

  watchEffect(() => {
    if (graph.value && !dndRef.value) {
      dndRef.value = new Dnd({
        target: graph.value,
        getDragNode: (node) => node.clone({ keepId: true }),
        getDropNode: (node) => node.clone({ keepId: true }),
        ...options,
      });
    }
  });

  const startDrag = (n: NodeOptions, e: any) => {
    if (graph.value && dndRef.value) {
      e.persist();
      dndRef.value.start(graph.value.createNode(n), e.nativeEvent);
    }
  };

  return { startDrag };
};
