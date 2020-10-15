import path from 'path';
import url from 'url';
import util from 'util';
import module from 'module';

import TcpPing from 'tcp-ping';

export function dirname(importMetaUrl) {
  return path.dirname(url.fileURLToPath(importMetaUrl));
}

export async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stringifyError(error) {
  return JSON.stringify(error, Object.getOwnPropertyNames(error));
}

export async function ping({ ipAddress: address, timeout = 5 * 100, attempts = 10 }) {
  let tcpPing = util.promisify(TcpPing.ping);

  try {
    await tcpPing({
      address,
      timeout,
      attempts,
    });

    return true;
  } catch (err) {
    return false;
  }
}

export async function getNodeModulePath(moduleName) {
  const require = module.createRequire(import.meta.url);

  const pathName = path.dirname(require.resolve(moduleName));

  return pathName;
}
