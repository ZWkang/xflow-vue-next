import { spawn } from 'child_process';
import { yellow } from 'colorette';
import svgr from 'esbuild-plugin-svgr';
import { Options } from 'tsup';
import VueJsxEsbuild from 'unplugin-vue-jsx/esbuild';

/**
 *
 * @param {string} outDir
 * @returns
 */
const emitDeclarations = (outDir: string) =>
  new Promise<void>((resolve, reject) => {
    const timer = `${yellow('TSC')} .d.ts generated in`;
    console.time(timer);
    console.log(yellow('TSC'), 'Generating .d.ts');
    const proc = spawn(
      'tsc',
      ['--emitDeclarationOnly', '--declaration', '--declarationMap', '--skipLibCheck', '--declarationDir', outDir],
      { stdio: ['ignore', 'ignore', 'ignore'] },
    );
    proc.on('exit', () => {
      console.timeEnd(timer);
      resolve();
    });
    proc.on('error', reject);
  });

const config: Options = {
  outDir: 'dist',
  format: ['esm', 'cjs', 'iife'],
  outExtension: ({ format }) => ({ js: `.${format}.js` }),
  // sourcemap: true,
  clean: true,
  splitting: true,
  loader: {
    '.css': 'copy',
  },
  entry: ['./src/index.ts'],
  esbuildPlugins: [svgr(), VueJsxEsbuild({}) as any /** 因为不同依赖esbuild不一致 */],
  onSuccess: () => emitDeclarations('./dist/typing'),
};

export default config;
