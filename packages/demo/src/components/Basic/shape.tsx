import { register } from '@antv/x6-vue-shape';
import type { Node } from 'xflow-vue-next';
import NodeComponent from './NodeComponent.vue';

const REACT_NODE = 'react-node';

register({
  shape: REACT_NODE,
  component: NodeComponent,
  width: 100,
  height: 40,
  effect: ['data'], // re-render when data changes
});

export { REACT_NODE };
