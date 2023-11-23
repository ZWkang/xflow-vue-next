import { defineComponent, watchEffect } from 'vue';
import { Snapline as S } from '@antv/x6-plugin-snapline';
import { useGraphInstance } from '../hooks/useGraphInstance';
import { useProps } from '../hooks/useProps';

export const Snapline = defineComponent({
  setup(p: S.Options, ctx) {
    const props = useProps<S.Options>();
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
