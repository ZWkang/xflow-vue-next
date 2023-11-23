import { History as H } from '@antv/x6-plugin-history';
import { defineComponent, watchEffect } from 'vue';

import { useGraphInstance } from '../hooks/useGraphInstance';
export const History = defineComponent({
  setup(props, ctx) {
    const graph = useGraphInstance();
    watchEffect(() => {
      const _graph = graph.value;
      if (_graph) {
        if (_graph.getPlugin('history')) {
          _graph.disposePlugins('history');
        }

        _graph.use(
          new H({
            enabled: true,
            ...props,
          }),
        );
      }
    });
    return () => {
      return null;
    };
  },
});
