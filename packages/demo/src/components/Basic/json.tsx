import { useGraphStore } from 'xflow-vue-next';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
// import { useEffect, useRef } from 'react';
import { ref, watch, watchEffect } from 'vue';

import 'highlight.js/styles/github.css';

hljs.registerLanguage('json', json);

const JSONCode = () => {
  // const ref = useRef<HTMLElement>(null);
  const codeRef = ref<HTMLElement>();
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);

  const parse = () => {
    if (codeRef.value) {
      codeRef.value.innerText = JSON.stringify({ nodes, edges }, null, 2);
      hljs.highlightBlock(codeRef.value);
    }
  };

  watch(
    () => [nodes, edges],
    () => {
      parse();
    },
  );

  return (
    <div class=" w-[400px] flex-shrink-0 h-full overflow-auto border-l  border-solid border-cyan-300">
      <pre>
        <code className="language-json" ref={codeRef} />
      </pre>
    </div>
  );
};

export { JSONCode };
