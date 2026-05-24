import { escapeHtml } from '../utils/escape-html.js';

const LOGO_SRC = '/assets/logotipo_bolao.png?v=20260523';

export function renderAppShell({ title, eyebrow, lead, content, footer, variant = 'admin' }) {
  return `
    <div class="app-shell app-shell--${escapeHtml(variant)}">
      <header class="topbar">
        <div>
          <p class="eyebrow">${escapeHtml(eyebrow)}</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="lede">${escapeHtml(lead)}</p>
        </div>
        <div class="brand-mark brand-mark--logo" aria-hidden="true">
          <img src="${LOGO_SRC}" alt="" />
        </div>
      </header>

      <main class="page-grid">
        ${content}
      </main>

      <footer class="page-footer">
        ${escapeHtml(footer)}
      </footer>
    </div>
  `;
}
