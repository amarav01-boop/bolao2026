# Story 5.4: Home Ranking Snapshot

Status: review

## Story

As a participant,
I want Home to show my current ranking snapshot,
so that I immediately know where I stand without opening the full ranking.

## Acceptance Criteria

1. Given the participant opens Home, when ranking data is available, then their rank and points are shown in a compact status card.
2. Given all participants still have zero points, when Home renders, then the snapshot remains clear and does not imply an incorrect lead.
3. Given the participant wants more detail, when they click the ranking action, then they can navigate to the full ranking view.
4. Given the view is on mobile, when the snapshot renders, then it remains readable without horizontal overflow.

## Tasks / Subtasks

- [x] Reuse backend ranking calculation for a Home ranking snapshot.
- [x] Add current participant rank and points to the Home state contract.
- [x] Render a compact Home card with a link to the full ranking.
- [x] Keep initial all-zero ranking behavior understandable.
- [x] Verify the Home page still loads when ranking data is empty.

## Implementation Notes

- Implemented through `/api/home` and the Home page ranking card.
- Snapshot uses the same dense ranking service as `/api/ranking`, avoiding duplicated client calculation.
