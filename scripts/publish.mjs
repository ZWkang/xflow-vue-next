#!/usr/bin/env zx
/* eslint-disable */

let bundleMode = argv.mode;

if (!bundleMode) {
  bundleMode = 'alpha';
}

await $`npm run clean`;
await $`npm run build`;
await $`npm run changeset`;
await $`npm run version-publish`;
await $`pnpm changeset publish --tag ${bundleMode}`;
await $`pnpm release`;
