// import { useContext } from 'react';
// import { useStore } from 'zustand';

import { useStore } from '../context';
import type { GraphStore } from '../store';

export const useGraphStore = <T>(selector: (state: GraphStore) => T) => {
  // const store = injectStore(StoreContext);
  const store = useStore();
  if (!store) {
    throw new Error('can only be get inside the xflow component.');
  }
  // return useStore(store, selector);
  return selector(store);
};
