import path from 'path';

import dotenv from 'dotenv';

import { dirname } from './util';

const __dirname = dirname(import.meta.url);

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

const GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);
const ZONE = process.env.ZONE;
const VM_NAME = process.env.VM_NAME;

export { GOOGLE_APPLICATION_CREDENTIALS, ZONE, VM_NAME };
