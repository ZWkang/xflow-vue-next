import { type Registry } from '@antv/x6';
import { defineComponent, watchEffect } from 'vue';

import { useGraphInstance } from '../hooks/useGraphInstance';

type GridTypes = keyof Registry.Grid.Presets;
interface GridProps<T extends GridTypes> {
  type: T;
  options: Registry.Grid.OptionsMap[T];
}

export const Grid = defineComponent({
  setup(props: GridProps<GridTypes>, ctx) {
    const graph = useGraphInstance();
    watchEffect(() => {
      const _graph = graph.value;
      if (_graph) {
        _graph.clearGrid();
        _graph.drawGrid({
          ...props.options,
          type: props.type,
        });
        _graph.showGrid();
      }
    });
    return () => {
      return null;
    };
  },
});
