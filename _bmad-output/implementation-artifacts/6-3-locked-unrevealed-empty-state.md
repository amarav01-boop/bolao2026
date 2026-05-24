# Story 6.3: Locked/Unrevealed Empty State

Status: review

## Story

As a participant,
I want clear feedback when predictions are not yet revealed,
so that I understand why I cannot see other participants' inputs before the admin opens them.

## Acceptance Criteria

1. Given no phase has reveal enabled, when the participant opens Todos os Palpites, then the page shows a protected empty state.
2. Given a phase is locked but not revealed, when predictions are requested, then no other participant predictions are exposed.
3. Given the admin enables reveal, when the participant refreshes, then revealed predictions become visible.
4. Given the page is viewed on mobile, when the empty state renders, then it remains readable.

## Tasks / Subtasks

- [x] Gate reveal data by phase `revealEnabled`.
- [x] Return an unrevealed state when no phase is available for reveal.
- [x] Render a clear protected empty state in `/todos-palpites`.
- [x] Keep the API authenticated for participants only.
- [x] Smoke test the unrevealed and revealed states.

## Implementation Notes

- `/api/reveal` only returns prediction rows for phases explicitly marked as revealed by admin.
- The client shows the locked/protected empty state instead of leaking hidden prediction data.
