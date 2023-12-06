/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { produce, original } from 'immer';

import { ref, Ref } from 'vue';

import type { NodeOptions, EdgeOptions } from '../types';
import { apply } from '../util';

export type Command = 'init' | 'addNodes' | 'removeNodes' | 'updateNode' | 'addEdges' | 'removeEdges' | 'updateEdge';

export type ChangeItem = {
  command: Command;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export type State = {
  changeList: ChangeItem[];
  nodes: NodeOptions[];
  edges: EdgeOptions[];
};

type MarkRef<T extends object> = {
  [key in keyof T]: Ref<T[key]>;
};

type ActionOptions = {
  silent?: boolean;
};

type UpdateNodeDataOrFn = Partial<NodeOptions> | ((node: NodeOptions) => Partial<NodeOptions>);
type UpdateEdgeDataOrFn = Partial<EdgeOptions> | ((edge: EdgeOptions) => Partial<NodeOptions>);

export type Actions = {
  initData: (data: { nodes: NodeOptions[]; edges: EdgeOptions[] }, options?: ActionOptions) => void;
  addNodes: (ns: NodeOptions[], options?: ActionOptions) => void;
  removeNodes: (ids: string[], options?: ActionOptions) => void;
  updateNode: (id: string, data: UpdateNodeDataOrFn, options?: ActionOptions) => void;
  addEdges: (es: EdgeOptions[], options?: ActionOptions) => void;
  removeEdges: (ids: string[], options?: ActionOptions) => void;
  updateEdge: (id: string, data: UpdateEdgeDataOrFn, options?: ActionOptions) => void;
  clearChangeList: () => void;
};

export type GraphStore = ReturnType<typeof createGraphStore>;

export const createGraphStore = () => {
  const nodes = ref<NodeOptions[]>([]);
  const edges = ref<EdgeOptions[]>([]);
  const changeList = ref<State['changeList']>([]);

  const initData: Actions['initData'] = (data, options) => {
    nodes.value = data.nodes;
    edges.value = data.edges;
    if (!options?.silent) {
      changeList.value.push({
        command: 'init',
        data,
      });
    }
  };

  const addNodes: Actions['addNodes'] = (ns, options) => {
    if (!ns.length) return;
    const duplicated = nodes.value.find((n) => ns.some((m) => m.id === n.id));
    if (!duplicated) {
      nodes.value.push(...ns);
      if (!options?.silent) {
        changeList.value.push({
          command: 'addNodes',
          data: ns,
        });
      }
    } else {
      console.error(`node id=${duplicated.id} already existed`);
    }
  };
  const removeNodes: Actions['removeNodes'] = (ids, options) => {
    if (!ids.length) return;
    nodes.value = nodes.value.filter((n) => !ids.includes(n.id!));
    if (!options?.silent) {
      changeList.value.push({
        command: 'removeNodes',
        data: ids,
      });
    }
  };

  const updateNode: Actions['updateNode'] = (id, data, options) => {
    const node = nodes.value.find((n) => n.id === id);
    if (node) {
      const changed = typeof data === 'function' ? data(node || {}) : data;
      if (changed.id !== undefined || changed.shape !== undefined) {
        console.error(`id and shape can't be changed`);
        return;
      }
      apply(node, changed);
      if (!options?.silent) {
        changeList.value.push({
          command: 'updateNode',
          data: { id, data: changed },
        });
      }
    }
  };

  const addEdges: Actions['addEdges'] = (es, options) => {
    if (!es.length) return;
    const duplicated = edges.value.find((e) => es.some((m) => m.id === e.id));
    if (!duplicated) {
      edges.value.push(...es);
      if (!options?.silent) {
        changeList.value.push({
          command: 'addEdges',
          data: es,
        });
      }
    } else {
      console.error(`edge id=${duplicated.id} already existed`);
    }
  };

  const removeEdges: Actions['removeEdges'] = (ids, options) => {
    if (!ids.length) return;
    edges.value = edges.value.filter((n) => !ids.includes(n.id));
    if (!options?.silent) {
      changeList.value.push({
        command: 'removeEdges',
        data: ids,
      });
    }
  };

  const updateEdge: Actions['updateEdge'] = (id, data, options) => {
    const edge = edges.value.find((n) => n.id === id);
    if (edge) {
      const changed = typeof data === 'function' ? data(edge as EdgeOptions) : data;
      if (changed.id !== undefined || changed.shape !== undefined) {
        console.error(`id and shape can't be changed`);
        return;
      }
      apply(edge, changed);
      if (!options?.silent) {
        changeList.value.push({
          command: 'updateEdge',
          data: { id, data: changed },
        });
      }
    }
  };

  const clearChangeList: Actions['clearChangeList'] = () => {
    changeList.value = [];
  };

  return {
    clearChangeList,
    initData,
    addNodes,
    removeNodes,
    updateNode,
    addEdges,
    removeEdges,
    updateEdge,
    nodes,
    edges,
    changeList,
  };
};
