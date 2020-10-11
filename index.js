#!/usr/bin/env node

const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  __dirname,
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);
const ZONE = process.env.ZONE;
const VM_NAME = process.env.VM_NAME;

const perf = require('execution-time')();
const { promisify } = require('util');
const TcpPing = require('tcp-ping');
const ping = promisify(TcpPing.ping);
const Compute = require('@google-cloud/compute');

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startVm({ vm, ipAddress }) {
  console.log(`🔄 Starting ${VM_NAME}...`);

  const [startOperation] = await vm.start();

  await startOperation.promise();

  console.log(`🟡 ${VM_NAME} has started! Waiting for it to come up`);

  let pool = true;

  while (pool) {
    try {
      await ping({
        address: ipAddress,
      });

      pool = false;
    } catch (err) {
      // keep trying...
    }
  }

  console.log(`🟢 ${VM_NAME} is up!`);
}

async function stopVm({ vm }) {
  console.log(`🔄 Stopping ${VM_NAME}...`);

  const [stopOperation] = await vm.stop();

  await stopOperation.promise();

  console.log(`🔴 ${VM_NAME} is down!`);
}

async function guessOperation({ vm, status, ipAddress }) {
  console.log(
    `ℹ️  ${VM_NAME} is currently ${
      status === 'RUNNING' ? 'running' : 'stopped'
    }`
  );

  switch (status) {
    case 'TERMINATED':
      await startVm({ vm, ipAddress });
      break;

    case 'RUNNING':
      await stopVm({ vm });
      break;
  }
}

perf.start();

async function main() {
  const credentials = require(GOOGLE_APPLICATION_CREDENTIALS);

  const compute = new Compute({
    projectId: credentials.project_id,
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
  });

  const zone = compute.zone(ZONE);
  const vm = zone.vm(VM_NAME);

  const [metadata] = await vm.getMetadata();

  const {
    status,
    networkInterfaces: [
      {
        accessConfigs: [{ natIP: ipAddress }],
      },
    ],
  } = metadata;

  const [operationType] = process.argv.slice(2);

  if (operationType) {
    switch (operationType) {
      case 'up':
        if (status === 'RUNNING') {
          return console.log(`ℹ️  ${VM_NAME} is up`);
        } else {
          await startVm({ vm, ipAddress });
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
          await stopVm({ vm });
        }
        break;
      default:
        return console.error(`🚫 Unknown operation type "${operationType}"`);
    }
  } else {
    await guessOperation({ vm, status, ipAddress });
  }

  const time = perf.stop();

  console.log(`✨ Done in ${time.preciseWords}`);
}

main().catch(console.error);
