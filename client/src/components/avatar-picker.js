import { escapeHtml } from '../utils/escape-html.js';
import { getAvatarStyle } from '../data/avatar-options.js';

export function renderAvatarPicker({
  options = [],
  selectedKey = '',
  errors = [],
  disabled = false
}) {
  const errorClass = errors.length ? ' field--error' : '';

  return `
    <fieldset class="avatar-fieldset${errorClass}" ${disabled ? 'disabled' : ''}>
      <legend class="field__label">Avatar*</legend>
      <p class="field__hint">Escolha a identidade pública que vai aparecer no ranking.</p>
      <div class="avatar-grid">
        ${options
          .map((option) => {
            const selected = option.key === selectedKey;
            const style = getAvatarStyle(option.key);
            return `
              <label class="avatar-option${selected ? ' avatar-option--selected' : ''}">
                <input
                  type="radio"
                  name="avatarKey"
                  value="${escapeHtml(option.key)}"
                  ${selected ? 'checked' : ''}
                  ${disabled ? 'disabled' : ''}
                  data-avatar-input
                />
                <span
                  class="avatar-option__preview"
                  style="${escapeHtml(Object.entries(style)
                    .map(([key, value]) => `${key}:${value}`)
                    .join(';'))}"
                ></span>
                <span class="avatar-option__content">
                  <strong>${escapeHtml(option.label)}</strong>
                  <span>${escapeHtml(option.hint)}</span>
                </span>
              </label>
            `;
          })
          .join('')}
      </div>
      ${errors.length ? `<p class="field__error">${errors[0]}</p>` : ''}
    </fieldset>
  `;
}
