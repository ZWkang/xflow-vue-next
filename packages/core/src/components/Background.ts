import { watchEffect, defineComponent, defineProps, useAttrs } from 'vue';
import { useGraphInstance } from '../hooks/useGraphInstance';
import { Background as BG } from '@antv/x6/lib/registry/background';

export const Background = defineComponent({
  inheritAttrs: true,
  setup(p: BG.Options) {
    const props = useAttrs();
    const graph = useGraphInstance();
    watchEffect(() => {
      console.log(props, props?.color, graph.value);
      const _graph = graph.value;
      if (_graph) {
        _graph.clearBackground();
        _graph.drawBackground(props);
      }
    });

    return () => null;
  },
});
