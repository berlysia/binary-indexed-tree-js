#!/usr/bin/env zx

import { $ } from "zx";

async function main() {
  // stage is clean
  const isCleanBefore =
    (await $`git diff --exit-code --quiet`.nothrow()).exitCode === 0;
  if (!isCleanBefore) {
    throw new Error("stage is not clean");
  }
  await Promise.all([
    $`yarn run update-docs:changelog`,
    $`yarn run update-docs:readme`,
  ]);
  await $`git add CHANGELOG.md README.md`;

  const isCleanAfter =
    (await $`git diff --exit-code --quiet`.nothrow()).exitCode === 0;
  const isStaged =
    (await $`git diff --staged --exit-code --quiet`.nothrow()).exitCode !== 0;
  if (isCleanAfter && isStaged) {
    await $`git commit -m 'docs(CHANGELOG): Update'`;
  } else {
    console.info("no docs are updated");
  }
}

main();
