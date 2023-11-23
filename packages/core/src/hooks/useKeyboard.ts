import { watch, onBeforeUnmount, watchEffect } from 'vue';

import { useGraphInstance } from './useGraphInstance';

export const useKeyboard = (
  key: string | string[],
  callback: (e: KeyboardEvent) => void,
  action?: 'keypress' | 'keydown' | 'keyup',
) => {
  const graph = useGraphInstance();
  watchEffect(() => {
    if (graph.value) {
      graph.value.bindKey(key, callback, action);
    }
  });

  onBeforeUnmount(() => {
    if (graph.value) {
      graph.value.unbindKey(key);
    }
  });
};
