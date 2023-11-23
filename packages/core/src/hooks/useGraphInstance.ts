import { inject } from 'vue';

import { symbol, GraphContextValue } from '../context/GraphContext';

export const useGraphInstance = () => {
  const { graph } = inject(symbol) as GraphContextValue;

  return graph;
};
