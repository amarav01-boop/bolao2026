import { escapeHtml } from '../utils/escape-html.js';

export function renderEmptyState({ title, body, action }) {
  return `
    <section class="empty-state">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(body)}</p>
      ${action ? `<div class="empty-state__action">${action}</div>` : ''}
    </section>
  `;
}
