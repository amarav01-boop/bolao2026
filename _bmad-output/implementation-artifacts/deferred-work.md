# Deferred Work

- Make answer-key scoring and persisted ranking-position snapshots share explicit recovery semantics. The current implementation follows the existing match-result flow: scoring commits first, then ranking positions are recalculated. If the second operation fails, live totals are correct but movement snapshots can remain stale until recalculation is retried.
