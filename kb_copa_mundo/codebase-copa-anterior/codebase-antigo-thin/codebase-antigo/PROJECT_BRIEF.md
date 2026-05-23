# Bolão 2018/2022 - Projeto Brief

## 📋 Visão Geral
**Bolão** é uma plataforma web para um jogo coletivo de apostas em resultados de partidas de futebol, desenvolvida em PHP. Os participantes fazem palpites sobre os resultados dos jogos em diferentes fases do torneio (grupos A-L e fases eliminatórias) e competem por pontuação.

---

## 🎯 Objetivo Principal
Criar uma comunidade interativa de apaixonados por futebol que podem:
- Fazer apostas (palpites) em resultados de partidas
- Competir em ranking com outros participantes
- Visualizar estatísticas e pontuação
- Interagir através de um Twitter integrado do "Bolão"

---

## 🏗️ Arquitetura Geral

### Stack Tecnológico
- **Backend**: PHP (sem framework, vanilla PHP)
- **Banco de Dados**: MySQL (cup2018)
- **Frontend**: HTML + CSS
- **Servidor**: XAMPP (Apache)

### Estrutura Principal de Diretórios
```
htdocs/
├── /action              # Scripts de processamento (lógica backend)
├── /css                 # Estilos
├── /dashboard           # Painel administrativo (múltiplos idiomas)
├── /dbscripts           # Scripts SQL para criação/manutenção BD
├── /img                 # Imagens e assets
├── /module              # Módulos reutilizáveis
├── /backups             # Backups anteriores do projeto
├── /webalizer           # Análise de logs web
└── *.php                # Páginas principais
```

---

## 📄 Páginas Principais

### Autenticação
- **index.php** - Página de login
- **newuser.php** - Registro de novos participantes
- **helpme.php** - Recuperação de senha

### Navegação Principal
- **home.php** - Página inicial com ranking
- **master.php** - Painel administrativo (acesso restrito)
- **all-bets.php** - Visualização de todos os palpites

### Grupos e Seleções
- **a-group.php, b-group.php, ..., l-group.php** - Páginas para cada grupo da fase de grupos
- **i-group.php** - Oitavas de final
- **j-group.php** - Quartas de final
- **k-group.php** - Semifinais
- **l-group.php** - Finais

### Visualizações e Relatórios
- **showranking.php** - Ranking geral dos participantes
- **showgrouppoints.php** - Pontos por grupo
- **showchampionpoints.php** - Pontos do campeão
- **showmeme.php** - Memes integrados
- **showmessage.php** - Sistema de mensagens
- **showdailystatistics.php** - Estatísticas diárias
- **showbestofround.php** - Melhor rodada
- **showstrikerpoints.php** - Pontos de artilheiros

---

## 🔧 Funcionalidades Principais

### Gerenciamento de Palpites
- **Criação de Palpites**: Usuários preenchem seus palpites para cada partida
  - `/action/*-showbets.php` - Exibe partidas de um grupo
  - `/action/*-updatebets.php` - Atualiza palpites do usuário
  
- **Validação e Processamento**:
  - `/action/update-bets-points.php` - Calcula pontos dos palpites
  - Suporte a diferentes grupos (A-L) e fases

### Gerenciamento de Usuários
- **Autenticação**:
  - `/action/login.php` - Validação de credenciais
  - `/action/logout.php` - Encerramento de sessão
  - `/action/createuser.php` - Criação de novo participante
  
- **Recuperação de Senha**:
  - `/action/sendpwd.php` - Envio de senha por email

### Sistema de Ranking e Pontuação
- Cálculo automático de pontos baseado em acertos
- Ranking em tempo real
- Visualização de pontos por grupo, fase e estatísticas

### Painel de Administração
- Acesso restrito (userid==1 ou userid==4)
- `/action/load-master.php` e `/action/update-master.php`
- Gerenciamento geral do bolão

### Recursos Sociais
- Sistema de mensagens entre participantes
- Integração com Twitter do Bolão
- Exibição de memes relacionados ao torneio

---

## 🌍 Suporte Multilíngue
O projeto possui suporte para múltiplos idiomas através do diretório `/dashboard`:
- **Idiomas Disponíveis**: Alemão (de), Espanhol (es), Francês (fr), Húngaro (hu), Italiano (it), Japonês (jp), Polonês (pl), Português do Brasil (pt_br), Romeno (ro), Russo (ru), Turco (tr), Urdu (ur), Chinês Simplificado (zh_cn), Chinês Tradicional (zh_tw)

---

## 📊 Fluxo de Dados Principal

1. **Usuário acessa** `index.php` → Login
2. **Válido?** Redirecionado para `home.php` (página home)
3. **Navegação** para grupos (A-L) ou palpites
4. **Preenchimento de palpites** → Enviado para `/action/*-updatebets.php`
5. **Cálculo de pontos** → `/action/update-bets-points.php`
6. **Visualização** de ranking via `showranking.php`

---

## 🔐 Controle de Acesso
- **Sessões PHP**: Uso de `$_SESSION` para manter autenticação
- **Verificação de Login**: Redirecionamento para `index.php` se não autenticado
- **Admin Only**: Painel master restrito a usuários específicos (userid==1 ou userid==4)

---

## ⚠️ Observações Técnicas

### Código Legado
- Código procedural/vanilla PHP sem framework moderno
- Sem proteção contra SQL Injection evidente (concatenação direta de strings em SQL)
- Sem validação/sanitização visível de entradas
- Coexistência de versões antigas (arquivos com `-old` sufixo)

### Banco de Dados
- Banco: `cup2018` (nomenclatura de Copa 2018, mas código também parece ser Bolão 2022)
- Scripts de criação em `/dbscripts/dbcreation.sql`
- Tabelas principais sugeridas: `users`, `bets`, `matches`, `points`

### Estrutura de Desenvolvimento
- Backups anteriores em `/backups/` (bolao2018-backup, bolao2022)
- Múltiplas versões de arquivos (showranking-old.php, showranking-old-2.php)
- Indicativo de evolutação gradual do projeto

---

## 📱 Responsividade
- Uso de `meta viewport` em todas as páginas
- Estrutura de conteúdo com classes `content-desktop` e `content-mobile`
- CSS responsivo em `/css/global.css`

---

## 🚀 Casos de Uso Principais

1. **Participante Regular**: Faz login, preenche palpites, acompanha ranking
2. **Administrador**: Gerencia usuários, fases do bolão, calcula pontos
3. **Visualizador**: Consulta rankings, estatísticas e memes do bolão

---

## 📝 Conclusão
O Bolão é uma plataforma completa e funcional para gerenciar um jogo coletivo de apostas em futebol, com suporte multilíngue, sistema de pontuação automático e componentes sociais. Apesar de ser desenvolvido com tecnologia legada, cumpre seu propósito de forma eficiente como aplicação web PHP.
