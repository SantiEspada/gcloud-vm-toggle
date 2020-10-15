import path from 'path';
import deepmerge from 'deepmerge';

import { html } from 'lit-ntml';
import { baseStyles } from './baseStyles.css';

export function buildPage({ config: pageConfig = {}, render: content }) {
  const baseConfig = {
    head: {
      title: 'Google Cloud VM Toggle',
    },
  };

  const basePageConfig = deepmerge(baseConfig, pageConfig);

  return ({ data = {}, config: renderConfig = {} }) => {
    const config = deepmerge(basePageConfig, renderConfig);

    return {
      render() {
        return html`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>${config.head.title}</title>
              ${baseStyles()} ${config.head.extra ? config.head.extra : ''}
            </head>
            <body>
              ${content(data)}
            </body>
          </html>
        `;
      },
    };
  };
}
