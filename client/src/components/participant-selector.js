export function renderParticipantSelector({ options = ['Vitão', 'Pedro', 'Daniel'] } = {}) {
  return `
    <section class="panel">
      <div class="panel__header">
        <p class="panel__label">Seletor de participante</p>
      </div>
      <label class="field">
        <span>Escolha o participante</span>
        <select>
          ${options.map((option) => `<option>${option}</option>`).join('')}
        </select>
      </label>
    </section>
  `;
}
