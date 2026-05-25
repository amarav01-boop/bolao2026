import { escapeHtml } from '../utils/escape-html.js';
import { getAvatarStyle, getAvatarByKey } from '../data/avatar-options.js';

export function renderParticipantBadge({
  nickname = '',
  username = '',
  city = '',
  avatarKey = '',
  showUsername = false,
  compact = false,
  label = ''
}) {
  const avatar = getAvatarByKey(avatarKey);
  const displayName = nickname || label || username || 'Participante';

  return `
    <div class="participant-badge${compact ? ' participant-badge--compact' : ''}">
      <span
        class="participant-badge__avatar"
        style="${escapeHtml(Object.entries(getAvatarStyle(avatarKey))
          .map(([key, value]) => `${key}:${value}`)
          .join(';'))}"
      >
      </span>
      <span class="participant-badge__body">
        <strong>${escapeHtml(displayName)}</strong>
        ${city ? `<span>${escapeHtml(city)}</span>` : ''}
        ${showUsername && username ? `<span>@${escapeHtml(username)}</span>` : ''}
        ${avatar ? `<span>${escapeHtml(avatar.label)}</span>` : ''}
      </span>
    </div>
  `;
}
