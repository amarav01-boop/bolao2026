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

function renderPrizeScenario(title, body, items) {
  return `
    <section class="rules-prize-scenario">
      <div class="rules-prize-scenario__header">
        <p class="rules-prize-scenario__title">${title}</p>
        <p class="rules-prize-scenario__body">${body}</p>
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
        body: 'Seja bem-vindo a mais uma edição do tradicional bolão dos amigos da Vila Olímpia! A cada copa do mundo buscamos aprimorar nosso bolão, com mais tecnologia, com mais participantes e com mais diversão! Também estamos sempre aprendendo com os bolões anteriores, e fazemos pequenas alterações nas regras para aumentar a competitividade do bolão. Agora é com você! Prepare seus palpites, estude as seleções e seus craques, e entre nessa divertida competição!'
      })}
    </section>

    <section class="panel panel--span-12">
      <div class="panel__header">
        <p class="panel__label">Importante</p>
      </div>
      <p class="panel__text">
        Importante: leia atentamente ao regulamento desse bolão. Em caso de dúvidas, não hesite em entrar em contato com os administradores do bolão pelo email <strong>vitoramaral@hotmail.com</strong> ou por whatsapp <strong>(11) 99176-3660</strong>.
      </p>
    </section>

    <section class="panel panel--span-12 rules-payment-card">
      <div class="panel__header">
        <p class="panel__label">Pagamento da participação</p>
        <span class="chip chip--accent">Prazo até 10/06/2026</span>
      </div>
      <p class="panel__text">
        O valor para participação do Bolão é de <strong>R$ 100,00 (cem reais)</strong>, e deve ser feito um PIX até <strong class="rules-payment-card__deadline">10 de Junho de 2026</strong> na chave abaixo, e o comprovante de pagamento enviado para o email <strong>vitoramaral@hotmail.com</strong> ou por whatsapp <strong>(11) 99176-3660</strong> com o seu nome.
      </p>
      <p class="panel__text">
        <strong>Chave PIX:</strong> <span class="chip chip--accent">vitoramaral@hotmail.com</span>
      </p>
    </section>

    <section class="panel panel--span-12 rules-prize-card">
      <div class="panel__header">
        <p class="panel__label">Premiação</p>
      </div>
      <p class="panel__text">
        Todo o valor arrecadado será distribuído, em prêmios, da seguinte forma:
      </p>
      <ul class="inline-list">
        <li>70% do valor arrecadado será destinado para o <strong>1º colocado</strong> do bolão;</li>
        <li>20% do valor arrecadado será destinado para o <strong>2º colocado</strong> do bolão;</li>
        <li>10% do valor arrecadado será destinado para o <strong>3º colocado</strong> do bolão;</li>
      </ul>
      <div class="rules-prize-divider"></div>
      ${renderPrizeScenario(
        'Cenário A',
        'Dois participantes terminando o bolão empatados em número de pontos na 1ª posição.',
        [
          '90% do valor arrecadado será dividido entre os dois participantes na 1ª posição;',
          '10% do valor arrecadado será destinado para o 2º colocado;',
          'Não haverá premiação para o 3º colocado.'
        ]
      )}
      ${renderPrizeScenario(
        'Cenário B',
        'Mais de dois participantes terminando o bolão empatados em número de pontos na 1ª posição.',
        [
          '100% do valor arrecadado será dividido entre os participantes na 1ª posição;',
          'Não haverá premiação para o 2º colocado;',
          'Não haverá premiação para o 3º colocado.'
        ]
      )}
      ${renderPrizeScenario(
        'Cenário C',
        'Dois ou mais participantes terminando o bolão empatados em número de pontos na 2ª posição.',
        [
          'Caso só exista um participante em 1º lugar ao final do bolão: 30% do valor arrecadado será dividido entre os participantes na 2ª posição; não haverá premiação para o 3º colocado.',
          'Caso só existam dois participantes em 1º lugar ao final do bolão: 10% do valor arrecadado será dividido entre os participantes na 2ª posição; não haverá premiação para o 3º colocado.',
          'Em caso de mais de dois participantes em 1º lugar ao final do bolão, não haverá premiação para o 2º e 3º colocados.'
        ]
      )}
      ${renderPrizeScenario(
        'Cenário D',
        'Dois ou mais participantes terminando o bolão empatados em número de pontos na 3ª posição.',
        [
          'Este cenário só será possível se houver apenas um participante em 1º lugar e um participante em 2º lugar.',
          '10% do valor arrecadado será dividido entre os participantes na 3ª posição.'
        ]
      )}
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
      'Os jogos desta fase ficam visíveis no formato de tab por grupo para facilitar o preenchimento.',
      'Classificação correta do grupo: <strong>5 pontos</strong> quando a ordem completa do grupo bater com o gabarito final.'
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
