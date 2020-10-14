import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

const GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);
const ZONE = process.env.ZONE;
const VM_NAME = process.env.VM_NAME;

export { GOOGLE_APPLICATION_CREDENTIALS, ZONE, VM_NAME };
