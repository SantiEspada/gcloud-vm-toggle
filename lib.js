import util from 'util';
import TcpPing from 'tcp-ping';
import Compute from '@google-cloud/compute';

import { GOOGLE_APPLICATION_CREDENTIALS, ZONE, VM_NAME } from './config.js';

const ping = util.promisify(TcpPing.ping);

export async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
