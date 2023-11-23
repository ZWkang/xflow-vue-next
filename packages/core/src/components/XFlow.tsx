import { provideGraph, provideGraphStore } from '../context';
import '../styles/index.css';

import { defineComponent } from 'vue';

export const XFlow = defineComponent({
  setup(props, ctx) {
    provideGraphStore();
    provideGraph();
    return () => {
      return ctx.slots.default?.();
    };
  },
});
