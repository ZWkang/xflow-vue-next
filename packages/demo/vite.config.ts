import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        VueRouterAutoImports,
        {
          'vue-router/auto': ['userLink'],
        },
      ],
    }),
    VueRouter({
      routesFolder: [
        {
          src: 'src/pages',
        },
      ],
      logs: true,
      exclude: [
        '**/ignored/**',
        // '**/ignored/**/*',
        '**/__*',
        '**/__**/*',
        '**/*.component.vue',
        // resolve(__dirname, './src/pages/ignored'),
        //
        // './src/pages/**/*.spec.ts',
      ],
    }),

    vue(),
  ],
});
