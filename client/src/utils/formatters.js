export function formatBytes(value) {
  const bytes = Number(value);

  if (!Number.isFinite(bytes)) {
    return '-';
  }

  const units = [
    { unit: 'B', factor: 1 },
    { unit: 'KB', factor: 1024 },
    { unit: 'MB', factor: 1024 ** 2 },
    { unit: 'GB', factor: 1024 ** 3 }
  ];

  const selected = [...units].reverse().find((entry) => bytes >= entry.factor) || units[0];
  const displayValue = bytes / selected.factor;

  return `${displayValue >= 10 ? displayValue.toFixed(0) : displayValue.toFixed(1)} ${selected.unit}`;
}

export function formatDurationSeconds(value) {
  const seconds = Number(value);

  if (!Number.isFinite(seconds)) {
    return '-';
  }

  if (seconds < 1) {
    return `${Math.round(seconds * 1000)} ms`;
  }

  if (seconds < 60) {
    return `${seconds.toFixed(seconds < 10 ? 2 : 1)} s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${String(remainingSeconds).padStart(2, '0')}s`;
}
