export const AVATAR_SHEET_URL = '/avatars/avatares_imagem_2D.png?v=20260523';

export const AVATAR_OPTIONS = [
  { key: 'craque', label: 'Craque', hint: 'Cabeça fria e leitura de jogo', tone: '#f9c74f', spriteCol: 0, spriteRow: 0 },
  { key: 'perna-de-pau', label: 'Perna de Pau', hint: 'Vai no improviso e na raça', tone: '#90be6d', spriteCol: 1, spriteRow: 0 },
  { key: 'corneteiro', label: 'Corneteiro', hint: 'Opinião forte para todo lance', tone: '#f9c74f', spriteCol: 2, spriteRow: 0 },
  { key: 'pe-quente', label: 'Pé Quente', hint: 'Onde pisa, a bola obedece', tone: '#f94144', spriteCol: 3, spriteRow: 0 },
  { key: 'resenha', label: 'Resenha', hint: 'Joga e conversa junto', tone: '#90be6d', spriteCol: 4, spriteRow: 0 },
  { key: 'bruxo', label: 'Bruxo', hint: 'Mexe os pauzinhos no ataque', tone: '#9b5de5', spriteCol: 0, spriteRow: 1 },
  { key: 'rei-do-pitaco', label: 'Rei do Pitaco', hint: 'Mandou, aconteceu', tone: '#90be6d', spriteCol: 1, spriteRow: 1 },
  { key: 'sofa-tatico', label: 'Sofá Tático', hint: 'Vê o jogo inteiro do sofá', tone: '#4ea8de', spriteCol: 2, spriteRow: 1 },
  { key: 'casca-grossa', label: 'Casca Grossa', hint: 'Não desiste de uma disputa', tone: '#adb5bd', spriteCol: 3, spriteRow: 1 },
  { key: 'zicador', label: 'Zicador', hint: 'Melhor nem provocar', tone: '#b56576', spriteCol: 4, spriteRow: 1 },
  { key: 'artilheiro', label: 'Artilheiro', hint: 'Mira afinada para gols', tone: '#f3722c', spriteCol: 0, spriteRow: 2 },
  { key: 'paredao', label: 'Paredão', hint: 'Fecha o gol com autoridade', tone: '#90be6d', spriteCol: 1, spriteRow: 2 },
  { key: 'zebra', label: 'Zebra', hint: 'Sempre pronto para surpreender', tone: '#f9c74f', spriteCol: 2, spriteRow: 2 },
  { key: 'raiz', label: 'Raiz', hint: 'Jogo duro e sem firula', tone: '#90be6d', spriteCol: 3, spriteRow: 2 },
  { key: 'nutella', label: 'Nutella', hint: 'Elegante, mas ainda competitivo', tone: '#ff6b9a', spriteCol: 4, spriteRow: 2 },
  { key: 'cartola', label: 'Cartola', hint: 'Tática de escritório e campo', tone: '#90be6d', spriteCol: 0, spriteRow: 3 },
  { key: 'malandro', label: 'Malandro', hint: 'Joga com astúcia', tone: '#f9c74f', spriteCol: 1, spriteRow: 3 },
  { key: 'comentarista', label: 'Comentarista', hint: 'Analisa tudo antes de falar', tone: '#4ea8de', spriteCol: 2, spriteRow: 3 },
  { key: 'varzeano', label: 'Varzeano', hint: 'Tem alma de várzea', tone: '#b08968', spriteCol: 3, spriteRow: 3 },
  { key: 'maestro', label: 'Maestro', hint: 'Distribui o jogo inteiro', tone: '#9b5de5', spriteCol: 4, spriteRow: 3 }
];

export const AVATAR_ALIASES = {
  'captain-01': 'craque',
  'striker-01': 'artilheiro',
  'keeper-01': 'paredao',
  'playmaker-01': 'maestro',
  'legend-01': 'craque',
  'supporter-01': 'resenha'
};

export function getDefaultAvatarKey() {
  return AVATAR_OPTIONS[0]?.key || '';
}

export function getAvatarByKey(avatarKey) {
  const resolvedKey = AVATAR_ALIASES[avatarKey] || avatarKey;
  return AVATAR_OPTIONS.find((option) => option.key === resolvedKey) || AVATAR_OPTIONS[0] || null;
}

export function getAvatarStyle(avatarKey) {
  const avatar = getAvatarByKey(avatarKey);

  if (!avatar) {
    return {};
  }

  return {
    '--avatar-tone': avatar.tone,
    '--avatar-col': avatar.spriteCol,
    '--avatar-row': avatar.spriteRow,
    '--avatar-sheet': `url(${AVATAR_SHEET_URL})`
  };
}
