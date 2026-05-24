export function renderParticipantNav(activeRoute = 'home') {
  const items = [
    { route: 'home', href: '/', label: 'Home' },
    { route: 'ranking', href: '/ranking', label: 'Ranking' },
    { route: 'reveal', href: '/todos-palpites', label: 'Todos os Palpites' },
    { route: 'rules', href: '/regras', label: 'Regras' }
  ];

  return `
    <nav class="participant-nav" aria-label="Menu do participante">
      ${items
        .map(
          (item) => `
            <a class="chip ${item.route === activeRoute ? 'chip--accent' : ''}" href="${item.href}">
              ${item.label}
            </a>
          `
        )
        .join('')}
    </nav>
  `;
}
