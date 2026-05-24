export function renderPhaseStatusCard({ phase, deadline, countdown, state, progress }) {
  return `
    <article class="panel phase-card">
      <div class="panel__header">
        <p class="panel__label">Fase atual</p>
        <span class="chip chip--accent">${state}</span>
      </div>
      <h2>${phase}</h2>
      <p class="panel__text">Prazo: <strong>${deadline}</strong></p>
      <p class="panel__text">Tempo restante: <strong>${countdown || 'Sem prazo definido'}</strong></p>
      <div class="progress">
        <div class="progress__bar" style="width:${Math.max(0, Math.min(100, progress))}%"></div>
      </div>
    </article>
  `;
}
