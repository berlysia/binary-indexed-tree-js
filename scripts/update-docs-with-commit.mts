#!/usr/bin/env zx

import { $ } from "zx";

async function main() {
  // stage is clean
  const isClean =
    (await $`git diff --name-only --exit-code --quiet`.nothrow()).exitCode ===
    0;
  if (!isClean) {
    throw new Error("stage is not clean");
  }
  await Promise.all([
    $`yarn run update-docs:changelog`,
    $`yarn run update-docs:readme`,
  ]);
  await $`git add CHANGELOG.md README.md`;

  const isDirty =
    (await $`git diff --name-only --exit-code --quiet`.nothrow()).exitCode !==
    0;
  if (isDirty) {
    await $`git commit -m 'docs(CHANGELOG): Update'`;
  } else {
    console.info("no docs are updated");
  }
}

main();
