import path from 'path';

import cpy from 'cpy';

import { dirname } from '../util';

async function main() {
  const __dirname = dirname(import.meta.url);
  const projectBasePath = path.resolve(__dirname, '..');

  const indexFilePath = path.resolve(projectBasePath, 'index.js');
  const lambdaIndexFilePath = path.resolve(projectBasePath, 'index.lambda.js');

  await cpy([indexFilePath, lambdaIndexFilePath], projectBasePath, {
    rename: (basename) => {
      switch (basename) {
        case 'index.js':
          return 'index.backup.js';
        case 'index.lambda.js':
          return 'index.js';
        default:
          return basename;
      }
    },
  });
}

main().catch(console.error);
