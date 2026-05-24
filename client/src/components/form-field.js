import { escapeHtml } from '../utils/escape-html.js';

function renderErrorList(errors = []) {
  if (!errors.length) {
    return '';
  }

  return `<p class="field__error">${errors[0]}</p>`;
}

export function renderFormField({
  id,
  name,
  label,
  type = 'text',
  value = '',
  placeholder = '',
  autoComplete = '',
  helpText = '',
  errors = [],
  required = true,
  disabled = false
}) {
  const errorClass = errors.length ? ' field--error' : '';
  const requiredMark = required ? '<span aria-hidden="true">*</span>' : '';

  return `
    <label class="field${errorClass}" for="${id}">
      <span class="field__label">${escapeHtml(label)}${requiredMark}</span>
      <input
        id="${id}"
        name="${name}"
        data-auth-input
        data-registration-input
        data-login-input
        data-admin-input
        type="${type}"
        value="${escapeHtml(value)}"
        placeholder="${escapeHtml(placeholder)}"
        autocomplete="${escapeHtml(autoComplete)}"
        aria-invalid="${errors.length ? 'true' : 'false'}"
        ${required ? 'required' : ''}
        ${disabled ? 'disabled' : ''}
      />
      ${helpText ? `<span class="field__hint">${escapeHtml(helpText)}</span>` : ''}
      ${renderErrorList(errors)}
    </label>
  `;
}
