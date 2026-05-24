import { renderAppShell } from '../components/app-shell.js';
import { renderAvatarPicker } from '../components/avatar-picker.js';
import { renderEmptyState } from '../components/empty-state.js';
import { renderFormField } from '../components/form-field.js';
import { renderStatusMessage } from '../components/status-message.js';
import { AVATAR_OPTIONS, getDefaultAvatarKey } from '../data/avatar-options.js';

const BRAND_LABEL = 'BOLÃO DA COPA 2026 - AMIGOS DA VILA OLÍMPIA';

function renderIssueMap(issues = []) {
  return issues.reduce((accumulator, issue) => {
    const fieldName = issue.path && issue.path[0] ? issue.path[0] : 'form';
    const message = issue.message || 'Valor inválido.';
    const current = accumulator[fieldName] || [];

    return {
      ...accumulator,
      [fieldName]: [...current, message]
    };
  }, {});
}

function renderLoginForm(state) {
  const errors = renderIssueMap(
    Object.values(state.loginErrors || {}).flatMap((entry) => (entry && entry.issues ? entry.issues : []))
  );

  return `
    <section class="panel panel--span-6">
      <div class="panel__header">
        <p class="panel__label">Entrar</p>
        <span class="chip">Participante cadastrado</span>
      </div>
      <form class="auth-form" data-login-form novalidate>
        ${state.loginFormError
          ? renderStatusMessage({
              tone: 'danger',
              title: 'Problema no login',
              body: state.loginFormError
            })
          : ''}
        ${renderFormField({
          id: 'login-email',
          name: 'username',
          label: 'E-mail',
          value: state.loginForm.username,
          placeholder: 'seu@email.com',
          autoComplete: 'email',
          helpText: 'Use o e-mail cadastrado no bolão.',
          errors: errors.username || [],
          disabled: state.isLoggingIn
        })}
        ${renderFormField({
          id: 'login-password',
          name: 'password',
          label: 'Senha',
          type: 'password',
          value: state.loginForm.password,
          placeholder: 'Sua senha',
          autoComplete: 'current-password',
          helpText: 'A senha nunca é exibida de volta na tela.',
          errors: errors.password || [],
          disabled: state.isLoggingIn
        })}
        <div class="form-actions">
          <button class="btn btn--primary" type="submit" ${state.isLoggingIn ? 'disabled' : ''}>
            ${state.isLoggingIn ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </section>
  `;
}

function renderRegistrationForm(state) {
  const errors = renderIssueMap(
    Object.values(state.registrationErrors || {}).flatMap((entry) => (entry && entry.issues ? entry.issues : []))
  );

  return `
    <section class="panel panel--span-6">
      <div class="panel__header">
        <p class="panel__label">Criar perfil</p>
        <span class="chip chip--accent">${state.registrationOpen ? 'Aberto' : 'Fechado'}</span>
      </div>
      ${
        state.registrationOpen
          ? `
        <form class="auth-form" data-registration-form novalidate>
          ${state.registrationFormError
            ? renderStatusMessage({
                tone: 'danger',
                title: 'Problema no cadastro',
                body: state.registrationFormError
              })
            : ''}
          ${renderFormField({
            id: 'register-email',
            name: 'username',
            label: 'E-mail',
            value: state.registrationForm.username,
            placeholder: 'seu@email.com',
            autoComplete: 'email',
            helpText: 'Usaremos o e-mail como identificador único e para login.',
            errors: errors.username || [],
            disabled: state.isRegistering
          })}
          ${renderFormField({
            id: 'nickname',
            name: 'nickname',
            label: 'Apelido',
            value: state.registrationForm.nickname,
            placeholder: 'Seu nome público',
            autoComplete: 'nickname',
            helpText: 'É assim que você vai aparecer no ranking.',
            errors: errors.nickname || [],
            disabled: state.isRegistering
          })}
          ${renderFormField({
            id: 'password',
            name: 'password',
            label: 'Senha',
            type: 'password',
            value: state.registrationForm.password,
            placeholder: 'Crie uma senha segura',
            autoComplete: 'new-password',
            helpText: 'As senhas são armazenadas com bcrypt.',
            errors: errors.password || [],
            disabled: state.isRegistering
          })}
          ${renderAvatarPicker({
            options: AVATAR_OPTIONS,
            selectedKey: state.registrationForm.avatarKey || getDefaultAvatarKey(),
            errors: errors.avatarKey || [],
            disabled: state.isRegistering
          })}
          <div class="form-actions">
            <button class="btn btn--primary" type="submit" ${state.isRegistering ? 'disabled' : ''}>
              ${state.isRegistering ? 'Salvando...' : 'Criar conta'}
            </button>
            <p class="form-note">O cadastro é controlado pelo servidor. O navegador apenas envia o formulário.</p>
          </div>
        </form>
      `
          : `
        ${renderStatusMessage({
          tone: 'warning',
          title: 'Cadastro fechado',
          body: 'Novas contas não podem ser criadas neste momento. Participantes existentes ainda podem entrar.'
        })}
      `
      }
    </section>
  `;
}

function renderNoticePanel(state) {
  return `
    <section class="panel panel--span-12">
      ${renderStatusMessage({
        tone: state.connection === 'offline' ? 'danger' : state.registrationOpen ? 'success' : 'warning',
        title:
          state.connection === 'offline'
            ? 'API indisponível'
            : state.registrationOpen
              ? 'Cadastro aberto'
              : 'Cadastro fechado',
        body:
          state.connection === 'offline'
            ? state.banner?.body || 'O backend não está acessível neste momento.'
            : state.registrationOpen
              ? 'Crie seu perfil de participante ou entre com uma conta existente.'
              : 'O login continua disponível, mas novos cadastros estão pausados.'
      })}
    </section>
  `;
}

export function renderAuthPage(state) {
  const content = `
    ${renderNoticePanel(state)}
    ${renderLoginForm(state)}
    ${renderRegistrationForm(state)}
    <section class="panel panel--span-12">
      ${renderEmptyState({
        title: 'Regras antes do cadastro',
        body: 'Você pode ler as regras do bolão antes de entrar, para saber como funcionam pontuação, prazo e revelação.',
        action: '<a class="btn btn--secondary" href="/regras">Ver regras</a>'
      })}
    </section>
    <section class="panel panel--span-12">
      ${renderEmptyState({
        title: 'Dúvidas',
        body: 'Envie um email para vitoramaral@hotmail.com.'
      })}
    </section>
  `;

  return renderAppShell({
    eyebrow: BRAND_LABEL,
    title: 'Crie ou acesse seu perfil de participante',
    lead: 'Será esta a Copa do Hexa do Brasil? Participe do nosso bolão e traga toda sua expertise nos palpites!',
    content,
    footer: ''
  });
}
