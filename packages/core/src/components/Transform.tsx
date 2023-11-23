import { Transform as T } from '@antv/x6-plugin-transform';
import { watchEffect, defineComponent } from 'vue';

import { useGraphInstance } from '../hooks/useGraphInstance';
import { useProps } from '../hooks/useProps';

type IProps = {
  resizing?: T.Options['resizing'];
  rotating?: T.Options['rotating'];
};

export const Transform = defineComponent({
  setup(p: IProps, ctx) {
    const graph = useGraphInstance();
    const props = useProps<IProps>();
    const parseOptions = (options: T.Options['resizing'] | T.Options['rotating']) => {
      if (typeof options === 'boolean') {
        return options;
      }
      if (typeof options === 'object') {
        return {
          enabled: true,
          ...options,
        };
      }

      return false;
    };

    watchEffect(() => {
      if (graph.value) {
        if (graph.value.getPlugin('transform')) {
          graph.value.disposePlugins('transform');
        }

        graph.value.use(
          new T({
            resizing: parseOptions(props.resizing),
            rotating: parseOptions(props.rotating),
          }),
        );
      }
    });

    return () => null;
  },
});
