import { useAttrs } from 'vue';

export function useProps<T>(): T {
  return useAttrs() as T;
}
