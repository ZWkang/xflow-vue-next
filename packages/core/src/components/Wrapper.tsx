import { defineComponent, onMounted } from 'vue';

import { useGraphInstance } from '../hooks/useGraphInstance';

export const Wrapper = defineComponent({
  name: 'Wrapper',
  setup(props, ctx) {
    const graph = useGraphInstance();

    onMounted(() => {
      // Perform any necessary initialization here
    });

    return () => {
      if (graph) {
        return ctx.slots.default?.();
      }
      return null;
    };
  },
});
