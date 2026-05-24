export function renderPredictionForm() {
  return `
    <section class="panel">
      <div class="panel__header">
        <p class="panel__label">Prediction entry</p>
        <span class="chip chip--muted">Autosave ready</span>
      </div>

      <div class="form-grid">
        <label class="field">
          <span>Match 1</span>
          <input type="text" value="1 x 0" readonly />
        </label>
        <label class="field">
          <span>Match 2</span>
          <input type="text" value="2 x 1" readonly />
        </label>
      </div>
    </section>
  `;
}
