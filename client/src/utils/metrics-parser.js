function unescapeLabelValue(value) {
  return String(value)
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\\\/g, '\\');
}

export function parsePrometheusMetrics(text = '') {
  const entries = [];
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  lines.forEach((line) => {
    const match = line.match(/^([a-zA-Z_:][a-zA-Z0-9_:]*)(\{([^}]*)\})?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)$/i);
    if (!match) {
      return;
    }

    const labels = {};
    const labelBlock = match[3] || '';
    const labelPattern = /([a-zA-Z_][a-zA-Z0-9_]*)="((?:\\.|[^"])*)"/g;
    let labelMatch = labelPattern.exec(labelBlock);

    while (labelMatch) {
      labels[labelMatch[1]] = unescapeLabelValue(labelMatch[2]);
      labelMatch = labelPattern.exec(labelBlock);
    }

    entries.push({
      name: match[1],
      labels,
      value: Number(match[4])
    });
  });

  return entries;
}

export function groupMetricsByName(entries = []) {
  return entries.reduce((accumulator, entry) => {
    const list = accumulator[entry.name] || [];
    list.push(entry);
    accumulator[entry.name] = list;
    return accumulator;
  }, {});
}

export function sumMetricValues(entries = [], predicate = () => true) {
  return entries.reduce((total, entry) => (predicate(entry) ? total + Number(entry.value || 0) : total), 0);
}

export function getFirstMetricValue(entries = [], predicate = () => true) {
  const entry = entries.find(predicate);
  return entry ? Number(entry.value || 0) : null;
}

export function calculateHistogramQuantile(entries = [], quantile = 0.95) {
  const buckets = new Map();

  entries.forEach((entry) => {
    const bucketKey = entry.labels.le;
    if (!bucketKey) {
      return;
    }

    const currentValue = buckets.get(bucketKey) || 0;
    buckets.set(bucketKey, currentValue + Number(entry.value || 0));
  });

  if (!buckets.size) {
    return null;
  }

  const ordered = [...buckets.entries()].map(([bucket, value]) => ({
    bucket: bucket === '+Inf' ? Number.POSITIVE_INFINITY : Number(bucket),
    value
  }));

  ordered.sort((left, right) => left.bucket - right.bucket);

  const total = ordered[ordered.length - 1].value;
  if (!Number.isFinite(total) || total <= 0) {
    return null;
  }

  const threshold = total * quantile;
  for (const item of ordered) {
    if (item.value >= threshold) {
      return Number.isFinite(item.bucket) ? item.bucket : null;
    }
  }

  return Number.isFinite(ordered[ordered.length - 1].bucket) ? ordered[ordered.length - 1].bucket : null;
}
