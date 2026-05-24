import { escapeHtml } from '../utils/escape-html.js';

export function renderStatusMessage({ tone = 'neutral', title, body }) {
  return `
    <section class="status-message status-message--${tone}">
      <div>
        <p class="status-message__title">${escapeHtml(title)}</p>
        <p class="status-message__body">${escapeHtml(body)}</p>
      </div>
    </section>
  `;
}
