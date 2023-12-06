/* eslint-disable no-case-declarations */
import type { Graph, EventArgs, Cell } from '@antv/x6';
import { FunctionExt, ObjectExt, Point } from '@antv/x6';

import { defineComponent, watch } from 'vue';

import { useGraphEvent, useGraphInstance, useGraphStore } from '../hooks';
import type { ChangeItem } from '../store';
import type { GraphOptions, NodeOptions, EdgeOptions, GraphModel } from '../types';
import { flatten } from '../util';
import { useProps } from '../hooks/useProps';

const INNER_CALL = '__inner__';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preprocess = (key: keyof Cell.Properties, value: any, graph: Graph) => {
  if (key === 'position') {
    const { x, y } = Point.create(value).snapToGrid(graph.getGridSize());
    return {
      x,
      y,
    };
  }
  if (key === 'size') {
    return {
      width: value.width,
      height: value.height,
    };
  }
  return {
    [key]: value,
  };
};

export const XFlowState = defineComponent({
  setup(
    p: Pick<GraphOptions, 'centerView' | 'centerViewOptions' | 'fitView' | 'fitViewOptions' | 'connectionEdgeOptions'>,
    ctx,
  ) {
    const props =
      useProps<
        Pick<GraphOptions, 'centerView' | 'centerViewOptions' | 'fitView' | 'fitViewOptions' | 'connectionEdgeOptions'>
      >();
    const graph = useGraphInstance();
    const updateNode = useGraphStore((state) => state.updateNode);
    const updateEdge = useGraphStore((state) => state.updateEdge);
    const addNodes = useGraphStore((state) => state.addNodes);
    const addEdges = useGraphStore((state) => state.addEdges);
    const removeNodes = useGraphStore((state) => state.removeNodes);
    const removeEdges = useGraphStore((state) => state.removeEdges);
    const changeList = useGraphStore((state) => state.changeList);
    const clearChangeList = useGraphStore((state) => state.clearChangeList);

    const changeSelectionStatus = (status: Partial<NodeOptions | EdgeOptions>[]) => {
      if (graph.value) {
        const added = status.filter((item) => item.selected);
        const removed = status.filter((item) => !item.selected);
        graph.value.select(
          added.map((item) => item.id),
          { [INNER_CALL]: true },
        );
        graph.value.unselect(
          removed.map((item) => item.id),
          { [INNER_CALL]: true },
        );
      }
    };

    const changeAnimatedStatus = (status: Partial<EdgeOptions>[]) => {
      if (graph.value) {
        status.forEach((item) => {
          const cell = graph.value!.getCellById(item.id);
          if (cell) {
            if (item.animated) {
              cell.attr('line/strokeDasharray', 5, { [INNER_CALL]: true });
              cell.attr('line/style/animation', 'animated-line 30s infinite linear', {
                [INNER_CALL]: true,
              });
            } else {
              cell.attr('line/strokeDasharray', 0, { [INNER_CALL]: true });
              cell.attr('line/style/animation', '', { [INNER_CALL]: true });
            }
          }
        });
      }
    };

    const initData = (g: Graph, data: GraphModel) => {
      g.fromJSON(ObjectExt.cloneDeep(data));

      if (props.centerView) {
        g.centerContent(props.centerViewOptions);
      }

      if (props.fitView) {
        g.zoomToFit({ maxScale: 1, ...props.fitViewOptions });
      }

      const { nodes, edges }: { nodes: NodeOptions[]; edges: EdgeOptions[] } = data;
      changeSelectionStatus([...nodes, ...edges]);
      changeAnimatedStatus([...edges]);
    };

    const onSpecialPropChange = (id: string, data: Partial<NodeOptions> | Partial<EdgeOptions>) => {
      if (graph.value) {
        const keys = Object.keys(data);
        if (keys.includes('selected')) {
          const selected = !!data.selected;
          changeSelectionStatus([{ id, selected }]);
        } else if (keys.includes('animated')) {
          const animated = !!data.animated;
          changeAnimatedStatus([{ id, animated }]);
        }
      }
    };

    const onPropChange = (id: string, data: Partial<NodeOptions> | Partial<EdgeOptions>, batchName: string) => {
      if (graph.value) {
        const cell = graph.value.getCellById(id);
        if (cell) {
          graph.value.startBatch(batchName);
          const changed = (cell as any).preprocess(data, true) as Cell.Properties;
          const properties = flatten(changed);
          Object.keys(properties).forEach((key) => {
            cell.setPropByPath(key, properties[key], {
              [INNER_CALL]: true,
              rewrite: true,
            });
          });
          onSpecialPropChange(id, data);
          graph.value.stopBatch(batchName);
        }
      }
    };

    const handleGraphChange = (g: Graph, changes: ChangeItem[]) => {
      changes.forEach((changeItem) => {
        const { command, data } = changeItem;
        switch (command) {
          case 'init':
            initData(g, data);
            break;
          case 'addNodes':
            const nodes = ObjectExt.cloneDeep(data);
            g.addNodes(nodes, { [INNER_CALL]: true });
            changeSelectionStatus(nodes);
            break;
          case 'removeNodes':
            g.removeCells(data, { [INNER_CALL]: true });
            break;
          case 'updateNode':
            onPropChange(data.id, data.data, 'updateNode');
            break;
          case 'addEdges':
            const edges = ObjectExt.cloneDeep(data);
            g.addEdges(edges, { [INNER_CALL]: true });
            changeSelectionStatus(edges);
            changeAnimatedStatus(edges);
            break;
          case 'removeEdges':
            g.removeCells(data, { [INNER_CALL]: true });
            break;
          case 'updateEdge':
            onPropChange(data.id, data.data, 'updateEdge');
            break;
          default:
            break;
        }
      });
      clearChangeList();
    };

    watch(
      () => changeList.value,
      (val) => {
        if (graph.value && val.length) {
          handleGraphChange(graph.value, val);
        }
      },
      { deep: true },
    );

    // Add cells for internal operations
    useGraphEvent('cell:added', ({ cell, options }) => {
      if (!options[INNER_CALL]) {
        if (cell.isNode()) {
          const nodes = [cell.toJSON()];
          addNodes(nodes, { silent: true });
          changeSelectionStatus(nodes);
        } else if (cell.isEdge()) {
          const edges = [cell.toJSON()];
          addEdges(edges, { silent: true });
          changeSelectionStatus(edges);
          changeAnimatedStatus(edges);
        }
      }
    });

    // Remove cells for internal operations
    useGraphEvent('cell:removed', ({ cell, options }) => {
      if (!options[INNER_CALL]) {
        if (cell.isNode()) {
          removeNodes([cell.id], { silent: true });
        } else if (cell.isEdge()) {
          removeEdges([cell.id], { silent: true });
        }
      }
    });

    // Update cells for internal operations
    useGraphEvent(
      'cell:change:*',
      FunctionExt.debounce(({ cell, key, current, options }: EventArgs['cell:change:*']) => {
        if (!options[INNER_CALL] && graph.value) {
          if (cell.isNode()) {
            updateNode(cell.id, preprocess(key, current, graph.value), { silent: true });
          } else if (cell.isEdge()) {
            updateEdge(cell.id, { [key]: current }, { silent: true });
          }
        }
      }, 100),
    );

    useGraphEvent('selection:changed', ({ added, removed, options }) => {
      if (!options[INNER_CALL]) {
        added.forEach((item) => {
          if (item.isNode()) {
            updateNode(item.id, { selected: true }, { silent: true });
          } else if (item.isEdge()) {
            updateEdge(item.id, { selected: true }, { silent: true });
          }
        });

        removed.forEach((item) => {
          if (item.isNode()) {
            updateNode(item.id, { selected: false }, { silent: true });
          } else if (item.isEdge()) {
            updateEdge(item.id, { selected: false }, { silent: true });
          }
        });
      }
    });

    return () => null;
  },
});
