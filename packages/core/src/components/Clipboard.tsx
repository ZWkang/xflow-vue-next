import { Clipboard as C } from '@antv/x6-plugin-clipboard';
import { watchEffect, defineComponent } from 'vue';

import { useGraphInstance } from '../hooks/useGraphInstance';
import { useProps } from '../hooks/useProps';

export const Clipboard = defineComponent({
  setup(p: Omit<C.Options, 'enabled'>, ctx) {
    const props = useProps<Omit<C.Options, 'enabled'>>();
    const graph = useGraphInstance();
    watchEffect(() => {
      const _graph = graph.value;
      if (_graph) {
        if (_graph.getPlugin('clipboard')) {
          _graph.disposePlugins('clipboard');
        }
        _graph.use(
          new C({
            enabled: true,
            ...props,
          }),
        );
      }
    });

    return () => null;
  },
});
