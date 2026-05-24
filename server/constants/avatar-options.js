const AVATAR_OPTIONS = [
  { key: 'craque', label: 'Craque', hint: 'Cabeça fria e leitura de jogo', tone: '#f9c74f' },
  { key: 'perna-de-pau', label: 'Perna de Pau', hint: 'Vai no improviso e na raça', tone: '#90be6d' },
  { key: 'corneteiro', label: 'Corneteiro', hint: 'Opinião forte para todo lance', tone: '#f9c74f' },
  { key: 'pe-quente', label: 'Pé Quente', hint: 'Onde pisa, a bola obedece', tone: '#f94144' },
  { key: 'resenha', label: 'Resenha', hint: 'Joga e conversa junto', tone: '#90be6d' },
  { key: 'bruxo', label: 'Bruxo', hint: 'Mexe os pauzinhos no ataque', tone: '#9b5de5' },
  { key: 'rei-do-pitaco', label: 'Rei do Pitaco', hint: 'Mandou, aconteceu', tone: '#90be6d' },
  { key: 'sofa-tatico', label: 'Sofá Tático', hint: 'Vê o jogo inteiro do sofá', tone: '#4ea8de' },
  { key: 'casca-grossa', label: 'Casca Grossa', hint: 'Não desiste de uma disputa', tone: '#adb5bd' },
  { key: 'zicador', label: 'Zicador', hint: 'Melhor nem provocar', tone: '#b56576' },
  { key: 'artilheiro', label: 'Artilheiro', hint: 'Mira afinada para gols', tone: '#f3722c' },
  { key: 'paredao', label: 'Paredão', hint: 'Fecha o gol com autoridade', tone: '#90be6d' },
  { key: 'zebra', label: 'Zebra', hint: 'Sempre pronto para surpreender', tone: '#f9c74f' },
  { key: 'raiz', label: 'Raiz', hint: 'Jogo duro e sem firula', tone: '#90be6d' },
  { key: 'nutella', label: 'Nutella', hint: 'Elegante, mas ainda competitivo', tone: '#ff6b9a' },
  { key: 'cartola', label: 'Cartola', hint: 'Tática de escritório e campo', tone: '#90be6d' },
  { key: 'malandro', label: 'Malandro', hint: 'Joga com astúcia', tone: '#f9c74f' },
  { key: 'comentarista', label: 'Comentarista', hint: 'Analisa tudo antes de falar', tone: '#4ea8de' },
  { key: 'varzeano', label: 'Varzeano', hint: 'Tem alma de várzea', tone: '#b08968' },
  { key: 'maestro', label: 'Maestro', hint: 'Distribui o jogo inteiro', tone: '#9b5de5' }
];

const AVATAR_KEYS = AVATAR_OPTIONS.map((avatar) => avatar.key);

module.exports = {
  AVATAR_OPTIONS,
  AVATAR_KEYS
};
