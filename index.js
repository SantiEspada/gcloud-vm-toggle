#!/usr/bin/env node
import executionTime from 'execution-time';

import { VM_NAME } from './config.js';
import { getCredentials, getVm, getVmMetadata, startVm, stopVm, guessOperation, wait } from './lib.js';

const perf = executionTime();
perf.start();

async function main() {
  const credentials = await getCredentials();

  const vm = await getVm(credentials);

  const { status, ipAddress } = await getVmMetadata(vm);

  const output = true;

  const [operationType] = process.argv.slice(2);

  if (operationType) {
    switch (operationType) {
      case 'up':
        if (status === 'RUNNING') {
          return console.log(`ℹ️  ${VM_NAME} is up`);
        } else {
          await startVm({ vm, ipAddress, output });
        }
        break;
      case 'down':
        if (status === 'TERMINATED') {
          return console.log(`ℹ️  ${VM_NAME} is stopped`);
        } else if (status === 'STOPPING') {
          console.log(`🟡 ${VM_NAME} is stopping...`);

          await wait(10 * 1000);

          return main();
        } else {
          await stopVm({ vm, output });
        }
        break;
      default:
        return console.error(`🚫 Unknown operation type "${operationType}"`);
    }
  } else {
    await guessOperation({ vm, status, ipAddress, output });
  }

  const time = perf.stop();

  console.log(`✨ Done in ${time.preciseWords}`);
}

main().catch(console.error);
