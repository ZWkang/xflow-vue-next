import type { EventArgs } from '@antv/x6';
import { onBeforeUnmount, watch, watchEffect } from 'vue';

import { useGraphInstance } from './useGraphInstance';

export const useGraphEvent = <T extends keyof EventArgs>(name: T, callback: (args: EventArgs[T]) => void) => {
  const graph = useGraphInstance();
  watchEffect(() => {
    if (graph.value) {
      graph.value.on(name, callback);
    }
  });

  onBeforeUnmount(() => {
    graph.value?.off(name, callback);
  });
};
