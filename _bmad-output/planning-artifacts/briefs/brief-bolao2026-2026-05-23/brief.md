---
title: "Bolao 2026 Product Brief"
status: draft
created: 2026-05-23
updated: 2026-05-23
---

# Product Brief: Bolao 2026

## Executive Summary

Bolao 2026 is a responsive website for a long-running friends' World Cup prediction pool. The product lets participants register, choose a public nickname/avatar, enter phase-based match predictions, track ranking movement, inspect locked predictions after admin reveal, and follow match-day highlights such as daily prediction distributions and "Acertou na mosca" exact-result celebrations.

This is a personal project with an urgent launch target: the first usable version should be live by 2026-05-25. The brief therefore prioritizes the competition backbone over polish: reliable login, prediction entry, deadline locking, scoring, ranking, and admin control. Social and agentic enhancements are valuable but must not endanger the two-day launch.

The product should preserve what worked in previous editions: nicknames, ranking drama, phase reminders, exact-hit celebrations, and admin-controlled updates. The 2022 database export confirms the core model: users, bets, match master data, rounds, ranking history, timed messages, admin content, and lightweight social commentary.

## The Problem

The existing bolao has emotional value because it creates daily rivalry among friends, but running it requires clear rules, manual operational control, and a way for participants to understand how every game changes their standing. Without a modern responsive site, participants may struggle to enter predictions on mobile, know whether their picks are saved, understand deadlines, compare themselves to others, or see why the ranking changed.

The admin also needs a practical control surface. Prediction windows, deadlines, match results, corrections, rule changes, and disputes must remain under human authority. Automation can help later, but the MVP must first make the competition trustworthy and manageable.

## The Solution

Build a mobile-first bolao website organized around the tournament rhythm:

1. Participants register/login, choose nickname and avatar, and enter predictions.
2. Admin opens a prediction window for each World Cup phase.
3. Participants edit predictions until the phase deadline; predictions autosave by group/form section.
4. At deadline, predictions lock; empty predictions default to `0x0`.
5. Admin reveals locked predictions when ready.
6. Admin enters match results; the system calculates points and updates ranking.
7. Participants return to the homepage/ranking loop to see position, movement, daily match sentiment, and exact-hit highlights.

The homepage should act as the emotional command center: current phase status, action message, ranking snapshot, today's prediction distribution, and recent "Acertou na mosca" highlights. Ranking should feel alive through movement arrows, points, status chips, nickname/avatar identity, and clear tie behavior.

## Who This Serves

**Participants:** Friends joining the bolao from mobile or desktop. They need fast registration, clear prediction input, deadline confidence, ranking visibility, and fun social comparison.

**Admin/Organizer:** A single protected admin user. The admin needs to open/close registration, manage prediction windows and deadlines, enter/correct results, reveal predictions, control rules/disputes, and keep the competition trustworthy.

## MVP Scope

### In Scope For Launch

- Responsive participant site.
- Open self-registration with username/password.
- Public nickname and curated avatar selection.
- Admin login through a protected route/account.
- Admin registration open/closed toggle.
- Phase-based prediction windows.
- Group Phase prediction form segmented by group.
- Group-level autosave and visible save state.
- Deadline locking with short grace-window behavior.
- Missing predictions default to `0x0`.
- Preserve explicit `0x0` versus defaulted `0x0`.
- Extras predictions: champion, top scorer, and top scorer goals.
- Manual admin setup/update for knockout phase matchups.
- Manual match result entry.
- Ranking calculation with dense ties: `1, 1, 2`.
- Ranking movement indicators and basic status chips.
- Visible ranking correction notice when a result is corrected.
- Dedicated "Todos os Palpites" section after admin reveal.
- Participant selector to view locked predictions.
- Manual admin reveal switch for locked predictions.
- Rules page explaining scoring, deadlines, visibility, and `0x0` defaults.

### Homepage MVP

- Phase status card.
- Competition-aware attention message.
- Ranking snapshot.
- Today's match prediction distribution after predictions are locked/revealed.
- "Acertou na mosca" highlights for past completed matches.

### Admin MVP

- Login as single admin.
- Open/close registration.
- Open/close prediction windows.
- Set/edit deadlines.
- Enter and correct match results.
- Trigger ranking recalculation.
- Reveal predictions manually.
- Manage knockout match setup manually.

## Out Of Scope For Initial Launch

- FIFA result scout agent.
- Recap writer or WhatsApp text generator.
- Public pinned rival mechanic.
- Full participant profile pages.
- Full in-site chat/social feed.
- Automated bracket/matchup generation.
- Advanced audit UI beyond essential correction/reveal state.
- Push notifications or WhatsApp integration.

## Product Principles

- **Ranking is the emotional homepage.** Participants should immediately understand how they are doing.
- **Admin authority beats automation.** Anything affecting official competition state requires admin control.
- **Mobile first, simple by default.** Prediction input must survive real phone usage and interruptions.
- **Fairness must be visible.** Deadlines, locked state, defaulted `0x0`, prediction reveal, and corrections need clear UI.
- **Playful, not chaotic.** The tone can use banter and "Acertou na mosca" flavor, but the rules must stay precise.

## Key User Flows

### Participant Registration

Visitor opens the site, creates an account with username/password, chooses a nickname, selects an avatar, and enters the participant experience if registration is open. If registration is closed, they see a clear closed-registration message.

### Prediction Entry

Participant opens "Palpites," selects the active phase, fills predictions by group/section, sees group-level save state, and can return later where they left off. Before deadline, missing games warn that they will become `0x0`.

### Deadline Lock

At deadline, predictions lock. A short server-side grace window may accept saves initiated near the cutoff. Empty predictions become defaulted `0x0`, distinct from explicit `0x0`.

### Prediction Reveal

After lock, admin manually reveals predictions. Participants access "Todos os Palpites," choose a participant from a selector, and inspect that person's locked predictions.

### Result And Ranking Update

Admin enters a result. The system calculates points, updates ranking, shows ranking movement, updates match-day stats/highlights, and preserves correction notices if a result changes later.

## Success Criteria

- Participants can register, login, and complete predictions on mobile without admin help.
- Admin can open a phase, lock it by deadline, reveal predictions, enter results, and update ranking.
- Ranking is understandable immediately: rank, points, movement, and tie behavior are clear.
- Missing predictions are handled deterministically as defaulted `0x0`.
- Participants can view other predictions only after admin reveal.
- The product is usable for launch by 2026-05-25, even if later social/agentic polish is deferred.

## Open Questions

- Exact scoring rules should be confirmed from previous rules PDFs.
- Whether extras predictions score at phase end, tournament end, or through separate admin action needs confirmation.
- Avatar source set needs to be chosen or created.
- Whether registration should remain open after first deadline is an admin policy decision.
- How visible the explicit/defaulted `0x0` distinction should be to all users versus admin only needs final UX decision.

## Later Vision

After the core bolao is stable, the product can become a richer social tournament companion. The next layers are a FIFA result scout that proposes official results for admin approval, recap/WhatsApp text generation, public pinned rivals, richer status badges, and optional extras dashboards. The long-term direction is not a generic sports app; it is a delightful, trustworthy, mobile-first home for this friend group's World Cup ritual.
