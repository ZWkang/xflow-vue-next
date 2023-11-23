import type { Clipboard } from '@antv/x6-plugin-clipboard';

import { useGraphInstance } from './useGraphInstance';
import { useLoaded } from './useLoaded';

export const useClipboard = () => {
  const graph = useGraphInstance();
  const { isLoaded } = useLoaded('clipboard');

  const copy = (ids: string[], copyOptions?: Clipboard.CopyOptions) => {
    if (isLoaded() && graph.value) {
      const cells = ids.map((id) => graph.value!.getCellById(id)).filter(Boolean);
      graph.value.copy(cells, copyOptions);
    }
  };

  const cut = (ids: string[], cutOptions?: Clipboard.CopyOptions) => {
    if (isLoaded() && graph.value) {
      const cells = ids.map((id) => graph.value!.getCellById(id)).filter(Boolean);
      graph.value.cut(cells, cutOptions);
    }
  };

  const paste = (pasteOptions?: Clipboard.PasteOptions) => {
    if (isLoaded() && graph.value) {
      const cells = graph.value.paste(pasteOptions);
      return cells;
    }
    return [];
  };

  return { copy, cut, paste };
};
