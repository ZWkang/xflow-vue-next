// import { useContext } from 'react';
// import { useStore } from 'zustand';

import { useStore } from '../context';
import { GraphStore } from '../store';

export const useGraphStore = <T>(selector: (state: GraphStore) => T) => {
  const store = useStore();
  if (!store) {
    throw new Error('can only be get inside the xflow component.');
  }
  return selector(store);
};
