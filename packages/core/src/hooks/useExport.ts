import { Export } from '@antv/x6-plugin-export';

import { useGraphInstance } from './useGraphInstance';
import { useLoaded } from './useLoaded';

export const useExport = () => {
  const graph = useGraphInstance();
  const { isLoaded } = useLoaded('export');

  const ensure = () => {
    return isLoaded(() => {
      if (!graph.value) return false;
      graph.value.use(new Export());
      return true;
    });
  };

  const exportPNG = (fileName = 'chart', options: Export.ToImageOptions = {}) => {
    if (ensure() && graph.value) {
      graph.value.exportPNG(fileName, options);
    }
  };

  const exportJPEG = (fileName = 'chart', options: Export.ToImageOptions = {}) => {
    if (ensure() && graph.value) {
      graph.value.exportJPEG(fileName, options);
    }
  };

  const exportSVG = (fileName = 'chart', options: Export.ToSVGOptions = {}) => {
    if (ensure() && graph.value) {
      graph.value.exportSVG(fileName, options);
    }
  };

  return { exportPNG, exportJPEG, exportSVG };
};
