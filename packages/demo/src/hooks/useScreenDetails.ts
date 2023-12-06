import { computed, ref, shallowRef } from 'vue';

export interface IOptions {
  defaultWindow?: Window;
}

type ScreenDetails = inferPromise<ReturnType<typeof window.getScreenDetails>>;
type inferPromise<T extends Promise<unknown>> = T extends Promise<infer U> ? U : never;

export function useScreenDetails(options: IOptions = {}) {
  const _window = options.defaultWindow || window;
  const isSupported = computed(() => _window && 'getScreenDetails' in _window);

  const screenDetails = ref<ScreenDetails | undefined>(undefined);
  const error = shallowRef<null | unknown>(null);

  async function requestScreenDetails() {
    if (!isSupported.value) {
      return;
    }

    error.value = null;

    try {
      screenDetails.value = await _window.getScreenDetails();
    } catch (e) {
      error.value = e;
    }
  }

  return {
    isSupported,
    requestScreenDetails,
    error,
    screenDetails,
  };
}
