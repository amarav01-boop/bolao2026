import { renderAppShell } from '../components/app-shell.js';
import { renderEmptyState } from '../components/empty-state.js';

const BRAND_LABEL = 'BOLÃO DA COPA 2026 - AMIGOS DA VILA OLÍMPIA';

function renderRuleCard(title, items) {
  return `
    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">${title}</p>
      </div>
      <ul class="inline-list">
        ${items.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </section>
  `;
}

export function renderRulesPage(state = {}) {
  const backHref = state.adminSession ? '/admin' : '/';
  const backLabel = state.adminSession
    ? 'Voltar para o painel admin'
    : state.sessionParticipant
      ? 'Voltar para a home'
      : 'Voltar para o login';

  const content = `
    <section class="panel panel--span-12">
      ${renderEmptyState({
        title: 'Regras do bolão',
        body: 'Esta página resume como o bolão funciona, com foco no prazo, na pontuação por fase e no peso dos palpites extras.'
      })}
    </section>

    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">Acesso rápido</p>
      </div>
      <div class="panel-actions">
        <a class="btn btn--primary" href="${backHref}">${backLabel}</a>
      </div>
    </section>

    ${renderRuleCard('1. Fase de Grupos', [
      'Os jogos da fase de grupos são preenchidos por grupo, com salvamento por seção.',
      'O prazo da fase de grupos é até <strong>10 de junho de 2026</strong>.',
      'Se o participante não preencher um jogo, o sistema considera <strong>0x0</strong> quando a janela fechar.',
      'Os jogos desta fase ficam visíveis no formato de tab por grupo para facilitar o preenchimento.'
    ])}

    ${renderRuleCard('2. Resultado considerado', [
      'O placar considerado é sempre o resultado dos <strong>90 minutos de jogo</strong>.',
      'Prorrogação e pênaltis não entram no cálculo do bolão.',
      'O admin registra o gabarito oficial do jogo diretamente no painel de administração.'
    ])}

    ${renderRuleCard('3. Pontuação na fase de grupos', [
      'Acertou o placar exato: <strong>3 pontos</strong>.',
      'Acertou o vencedor ou o empate, mas não o placar exato: <strong>1 ponto</strong>.',
      'Errou o resultado da partida: <strong>0 pontos</strong>.',
      'Essa regra vale para cada jogo da fase de grupos.'
    ])}

    ${renderRuleCard('4. Pontuação no mata-mata', [
      'Acertou o resultado exato da partida: <strong>5 pontos</strong>.',
      'Acertou o vencedor da partida ou o empate, mas não o placar exato: <strong>2 pontos</strong>.',
      'Errou o resultado da partida: <strong>0 pontos</strong>.',
      'A regra continua olhando apenas os <strong>90 minutos</strong> do jogo.'
    ])}

    ${renderRuleCard('5. Palpites extras', [
      'Campeão da Copa: <strong>10 pontos</strong>.',
      'Semifinalistas: <strong>5 pontos</strong> para cada acerto.',
      'Artilheiro: <strong>10 pontos</strong>.',
      'Número de gols do artilheiro: <strong>5 pontos</strong>.'
    ])}

    ${renderRuleCard('6. Revelação e consulta pública', [
      'Os palpites dos outros participantes só aparecem depois que o admin liberar a revelação.',
      'Antes da revelação, os palpites continuam protegidos.',
      'Depois da revelação, o participante pode consultar os palpites por pessoa.'
    ])}

    ${renderRuleCard('7. Ranking e organização', [
      'Classificação correta do grupo: <strong>5 pontos</strong> quando a ordem completa do grupo bater com o gabarito final.',
      'O ranking usa pontuação acumulada e desempate denso, sem pular posições.',
      'A home mostra status da fase, ranking rápido e mensagens de atenção quando houver pendências.',
      'A tela de ranking mostra sua posição, seus pontos e a evolução dos demais participantes.'
    ])}

    <section class="panel panel--span-12">
      ${renderEmptyState({
        title: 'Admin continua no controle',
        body: 'Correções de resultado, abertura de fases, liberação de palpites e disputas seguem sob responsabilidade do administrador do bolão.'
      })}
    </section>
  `;

  return renderAppShell({
    eyebrow: BRAND_LABEL,
    title: 'Regras do bolão',
    lead: 'Uma página pública e direta para que qualquer participante entenda como o bolão funciona antes de se cadastrar.',
    content,
    footer: 'Regras do bolão, em formato simples e pronto para acesso público.',
    variant: 'participant'
  });
}
