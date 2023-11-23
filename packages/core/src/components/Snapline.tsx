import { defineComponent, watchEffect } from 'vue';
import { Snapline as S } from '@antv/x6-plugin-snapline';
import { useGraphInstance } from '../hooks/useGraphInstance';

export const Snapline = defineComponent({
  setup(props, ctx) {
    const graph = useGraphInstance();
    watchEffect(() => {
      const _graph = graph.value;
      if (_graph) {
        if (_graph.getPlugin('snapline')) {
          _graph.disposePlugins('snapline');
        }

        _graph.use(
          new S({
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
