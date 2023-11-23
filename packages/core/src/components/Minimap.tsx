import { NodeView } from '@antv/x6';
import { MiniMap as M } from '@antv/x6-plugin-minimap';
import { CSSProperties, defineComponent, toRefs, watchEffect, ref, toRaw, Ref } from 'vue';
import { useGraphInstance } from '../hooks/useGraphInstance';

type IProps = Partial<Omit<M.Options, 'container'>> & {
  style?: CSSProperties;
  className?: string;
  simple?: boolean;
  simpleNodeBackground?: string;
};

class SimpleNodeView extends NodeView {
  static nodeBackground = '#8f8f8f';

  protected renderMarkup() {
    const tag = this.cell.shape === 'circle' ? 'circle' : 'rect';
    return this.renderJSONMarkup({
      tagName: tag,
      selector: 'body',
    });
  }

  update() {
    super.update({
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: SimpleNodeView.nodeBackground,
      },
    });
  }
}

function resolveValue(obj: {
  [key in string]?: Ref<unknown> | unknown;
}) {
  return Object.keys(obj).reduce(
    (item, next) => {
      item[next] = toRaw(obj[next]);
      return item;
    },
    {} as unknown as {
      [key in string]: unknown;
    },
  );
}

export const Minimap = defineComponent({
  setup(prop: IProps, ctx) {
    const { style, className, simple, simpleNodeBackground, ...others } = toRefs(prop);
    const graph = useGraphInstance();
    const nodeRef = ref<HTMLDivElement | null>(null);
    watchEffect(() => {
      const _graph = graph.value;
      if (graph.value && nodeRef.value) {
        if (_graph?.getPlugin('minimap')) {
          _graph.disposePlugins('minimap');
        }

        SimpleNodeView.nodeBackground = simpleNodeBackground?.value || SimpleNodeView.nodeBackground;

        _graph?.use(
          new M({
            container: nodeRef.value,
            width: 200,
            height: 160,
            padding: 10,
            graphOptions: simple?.value
              ? {
                  createCellView(cell) {
                    if (cell.isEdge()) {
                      return null;
                    }
                    if (cell.isNode()) {
                      return SimpleNodeView;
                    }
                    return undefined;
                  },
                }
              : undefined,
            ...resolveValue(others),
          }),
        );
      }
    });

    return () => <div ref={ref} style={{ ...style?.value }} class={className?.value}></div>;
  },
});
