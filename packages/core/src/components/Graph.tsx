import { Graph, Options } from '@antv/x6';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Selection } from '@antv/x6-plugin-selection';
import { ref, onMounted, onBeforeUnmount, watchEffect, defineComponent, toRefs } from 'vue';
import { useGraph } from '../context';
import type { GraphOptions } from '../types';

import { XFlowState } from './State';
import { Wrapper } from './Wrapper';
import { useProps } from '../hooks/useProps';

export const XFlowGraph = defineComponent({
  setup(p: GraphOptions, ctx) {
    const props = useProps<GraphOptions>();
    const container = ref<HTMLDivElement | null>(null);
    const { graph, setGraph } = useGraph()!;
    onMounted(() => {
      const g = new Graph({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        container: container.value!,
        autoResize: true,
        virtual: props.virtual,
        scaling: {
          min: props.minScale,
          max: props.maxScale,
        },
        connecting: {
          ...props.connectionOptions,
          createEdge() {
            return this.createEdge({
              shape: 'edge',
              ...props.connectionEdgeOptions,
            });
          },
        },
        highlighting: {
          default: props.defaultHighlightOptions,
          embedding: props.embedHighlightOptions,
          nodeAvailable: props.nodeAvailableHighlightOptions,
          magnetAvailable: props.magnetAvailableHighlightOptions,
          magnetAdsorbed: props.magnetAdsorbedHighlightOptions,
        },
      });

      g.use(new Selection({ enabled: true, ...props.selectOptions }));
      g.use(new Keyboard({ enabled: true, ...props.keyboardOptions }));

      if (props.scroller) {
        g.use(new Scroller({ enabled: true, ...props.scrollerOptions }));
      }

      setGraph(g);
    });

    onBeforeUnmount(() => {
      if (graph.value) {
        graph.value.dispose();
        setGraph(null);
      }
    });
    watchEffect(() => {
      if (graph.value) {
        if (props.readonly) {
          graph.value.options.interacting = false;
        } else {
          graph.value.options.interacting = {
            nodeMovable: (view) => {
              const cell = view.cell;
              return cell.prop('draggable') !== false;
            },
            edgeMovable: (view) => {
              const cell = view.cell;
              return cell.prop('draggable') !== false;
            },
          };
        }
      }
    });
    watchEffect(() => {
      if (graph.value) {
        if (props.zoomable) {
          graph.value.enableMouseWheel();
          graph.value.options.mousewheel = {
            ...Options.defaults.mousewheel,
            ...props.zoomOptions,
          };
        } else {
          graph.value.disableMouseWheel();
        }
      }
    });

    watchEffect(() => {
      if (graph.value) {
        if (props.pannable) {
          graph.value.options.panning = {
            ...Options.defaults.panning,
            enabled: true,
            ...props.panOptions,
          };
          graph.value.enablePanning();
        } else {
          graph.value.disablePanning();
        }
      }
    });

    watchEffect(() => {
      if (graph.value) {
        if (props.embedable) {
          graph.value.options.embedding = {
            ...Options.defaults.embedding,
            enabled: true,
            validate: () => true,
            ...props.embedOptions,
          };
        } else {
          graph.value.options.embedding = { enabled: false, validate: () => false };
        }
      }
    });

    watchEffect(() => {
      if (graph.value) {
        if (props.restrict) {
          graph.value.options.translating = {
            restrict: props.restrictOptions ? props.restrictOptions.bound : props.restrict,
          };
        } else {
          graph.value.options.translating = { restrict: false };
        }
      }
    });
    const { style, className } = toRefs(props);
    return () => {
      return (
        <div style={{ width: '100%', height: '100%', ...style?.value }} class={className?.value}>
          <div ref={container} style={{ width: '100%', height: '100%' }} />
          <Wrapper>
            <XFlowState
              connectionEdgeOptions={props.connectionEdgeOptions}
              centerView={props.centerView}
              centerViewOptions={props.centerViewOptions}
              fitView={props.fitView}
              fitViewOptions={props.fitViewOptions}
            />
          </Wrapper>
        </div>
      );
    };
  },
});
