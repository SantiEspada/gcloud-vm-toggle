#!/usr/bin/env node

import executionTime from 'execution-time';

const perf = executionTime();
perf.start();

import { toggleVm } from './lib.js';

async function main() {
  const [operationType] = process.argv.slice(2);

  const output = true;

  await toggleVm({ operationType, output });

  const time = perf.stop();

  console.log(`✨ Done in ${time.preciseWords}`);
}

main().catch(console.error);
