#!/usr/bin/env zx

import { $ } from "zx";

async function main() {
  await Promise.all([
    $`yarn run update-docs:changelog`,
    $`yarn run update-docs:readme`,
  ]);
  await $`git add CHANGELOG.md README.md`;

  const isStaged =
    (await $`git diff --staged --exit-code --quiet`.nothrow()).exitCode !== 0;
  if (isStaged) {
    await $`git commit -m 'docs: Update'`;
  } else {
    console.info("no docs are updated");
  }
}

main();
