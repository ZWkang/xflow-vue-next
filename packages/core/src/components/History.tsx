import { History as H } from '@antv/x6-plugin-history';
import { defineComponent, watchEffect } from 'vue';

import { useGraphInstance } from '../hooks/useGraphInstance';
import { useProps } from '../hooks/useProps';
export const History = defineComponent({
  setup(p: H.Options, ctx) {
    const props = useProps<H.Options>();
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
