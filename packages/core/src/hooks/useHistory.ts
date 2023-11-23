import type { KeyValue } from '@antv/x6';
import { ref } from 'vue';
import { useGraphEvent } from './useGraphEvent';
import { useGraphInstance } from './useGraphInstance';
import { useLoaded } from './useLoaded';

export const useHistory = () => {
  const graph = useGraphInstance();
  const { isLoaded } = useLoaded('history');
  const canUndo = ref(false);
  const canRedo = ref(false);

  const undo = (options?: KeyValue) => {
    if (isLoaded() && graph.value) {
      return graph.value.undo(options);
    }
    return null;
  };

  const redo = (options?: KeyValue) => {
    if (isLoaded() && graph.value) {
      return graph.value.redo(options);
    }
    return null;
  };

  useGraphEvent('history:change', () => {
    if (graph.value) {
      canUndo.value = graph.value.canUndo();
      canRedo.value = graph.value.canRedo();
    }
  });

  return { undo, redo, canUndo, canRedo };
};
