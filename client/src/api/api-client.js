const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!DEFAULT_BASE_URL) {
    return path;
  }

  return `${DEFAULT_BASE_URL.replace(/\/$/, '')}${path}`;
}

export async function fetchJson(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const rawText = await response.text();
  const payload = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    const message = payload?.error?.message || `A requisição falhou com status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.code = payload?.error?.code;
    error.details = payload?.error?.details;
    throw error;
  }

  return payload;
}

export async function fetchText(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      Accept: 'text/plain, */*',
      ...(options.headers || {})
    },
    ...options
  });

  const rawText = await response.text();

  if (!response.ok) {
    const error = new Error(rawText || `A requisição falhou com status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return rawText;
}
