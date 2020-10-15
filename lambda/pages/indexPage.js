import { html } from 'lit-ntml';

import { buildPage } from './buildPage';

const toggleButton = ({ operationType, label }) => html`
  <form action="/vm/toggle" method="POST">
    <input type="hidden" name="operationType" value="${operationType}" />
    <button type="submit">${label}</button>
  </form>
`;

const goingNotice = ({ to }) => html`<p>The VM is still going ${to}. Please wait a few seconds.</p> `;

const render = (data) => html`
  <div>
    <h2>${data.vmName}</h2>
    <h3>Status: ${data.vmStatus.replace('_', ' ')}</h3>
  </div>

  ${{
    up: toggleButton({ operationType: 'down', label: 'Go down' }),
    down: toggleButton({ operationType: 'up', label: 'Go up' }),
    going_up: goingNotice({ to: 'up' }),
    going_down: goingNotice({ to: 'down' }),
  }[data.vmStatus]}
`;

export const indexPage = buildPage({
  render,
});
