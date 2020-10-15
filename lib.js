import Compute from '@google-cloud/compute';

import { GOOGLE_APPLICATION_CREDENTIALS, ZONE, VM_NAME } from './config.js';
import { ping } from './util.js';

export async function getCredentials() {
  const { default: credentials } = await import(GOOGLE_APPLICATION_CREDENTIALS);

  return credentials;
}

export async function getVm(credentials) {
  const compute = new Compute({
    projectId: credentials.project_id,
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
  });

  const zone = compute.zone(ZONE);
  const vm = zone.vm(VM_NAME);

  return vm;
}

export async function getVmMetadata(vm) {
  const [metadata] = await vm.getMetadata();

  const {
    status,
    networkInterfaces: [
      {
        accessConfigs: [{ natIP: ipAddress }],
      },
    ],
  } = metadata;

  return { status, ipAddress };
}

export async function startVm({ vm, ipAddress, output = false }) {
  output && console.log(`🔄 Starting ${VM_NAME}...`);

  const [startOperation] = await vm.start();

  await startOperation.promise();

  output && console.log(`🟡 ${VM_NAME} has started! Waiting for it to come up`);

  let pooling = true;

  while (pooling) {
    const isUp = await ping({ ipAddress });

    pooling = !isUp;
  }

  output && console.log(`🟢 ${VM_NAME} is up!`);
}

export async function stopVm({ vm, output = false }) {
  output && console.log(`🔄 Stopping ${VM_NAME}...`);

  const [stopOperation] = await vm.stop();

  await stopOperation.promise();

  output && console.log(`🔴 ${VM_NAME} is down!`);
}

export async function guessOperation({ vm, status, ipAddress, output = false }) {
  output && console.log(`ℹ️  ${VM_NAME} is currently ${status === 'RUNNING' ? 'running' : 'stopped'}`);

  switch (status) {
    case 'TERMINATED':
      await startVm({ vm, ipAddress, output });
      break;

    case 'RUNNING':
      await stopVm({ vm, output });
      break;
  }
}

export async function getVmInfo() {
  const credentials = await getCredentials();

  const vm = await getVm(credentials);

  const { status: vmStatus, ipAddress } = await getVmMetadata(vm);

  let status;

  switch (vmStatus) {
    case 'RUNNING':
      const isUp = await ping({ ipAddress, timeout: 100, attempts: 2 });

      status = isUp ? 'up' : 'going_up';
      break;
    case 'STOPPING':
      status = 'going_down';
      break;
    case 'TERMINATED':
      status = 'down';
      break;
    default:
      status = 'unknown';
  }

  return {
    name: VM_NAME,
    status,
  };
}

export async function toggleVm({ operationType = null, output = false }) {
  const credentials = await getCredentials();

  const vm = await getVm(credentials);

  const { status, ipAddress } = await getVmMetadata(vm);

  if (operationType) {
    switch (operationType) {
      case 'up':
        if (status === 'RUNNING') {
          return output && console.log(`ℹ️  ${VM_NAME} is up`);
        } else {
          await startVm({ vm, ipAddress, output });
        }
        break;
      case 'down':
        if (status === 'TERMINATED') {
          return output && console.log(`ℹ️  ${VM_NAME} is stopped`);
        } else if (status === 'STOPPING') {
          output && console.log(`🟡 ${VM_NAME} is stopping...`);

          await wait(10 * 1000);

          return main();
        } else {
          await stopVm({ vm, output });
        }
        break;
      default:
        return output && console.error(`🚫 Unknown operation type "${operationType}"`);
    }
  } else {
    await guessOperation({ vm, status, ipAddress, output });
  }
}
