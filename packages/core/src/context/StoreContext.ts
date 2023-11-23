import { provide, inject } from 'vue';

import { createGraphStore } from '../store';
import type { GraphStore } from '../store';

export const graphStoreSymbol = Symbol('graph');

export const provideGraphStore: () => ReturnType<typeof createGraphStore> = () => {
  const store = createGraphStore();
  provide(graphStoreSymbol, store);
  return store;
};

export const useStore = () => {
  const store = inject(graphStoreSymbol);
  if (!store) {
    throw new Error('useStore must be used after provideStore');
  }
  return store as GraphStore;
};
