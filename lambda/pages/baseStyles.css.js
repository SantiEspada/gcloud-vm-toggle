import path from 'path';
import fs from 'fs';

import { html } from 'lit-ntml';
import { getNodeModulePath } from '../../util';

export async function baseStyles() {
  const boostrapRebootModulePath = await getNodeModulePath('bootstrap-reboot');

  const bootstrapRebootFilepath = path.resolve(boostrapRebootModulePath, 'dist', 'reboot.css');

  const bootstrapRebootContent = fs.readFileSync(bootstrapRebootFilepath).toString();

  return html`
    <style>
      ${bootstrapRebootContent}
    </style>
  `;
}
