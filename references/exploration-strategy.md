# Repository Exploration Strategy

## Partition only when it helps

Keep a single analysis pass for small repositories. Partition a large repository when independent slices can be bounded and reconciled.

Choose one split:

- **Product flow**: onboarding/interface, core runtime, state/data, integrations, operations/tests.
- **Package boundary**: one meaningful package group per slice for a monorepo.
- **Comparison target**: one repository per slice, using an identical rubric.
- **Evidence type**: current code/docs versus evolution/community/external market evidence.

Avoid one agent per generic “lens” when every lens would reread the whole repository. It multiplies cost and produces contradictory summaries without improving code coverage.

## Bounded task contract

Give each slice:

- repository/ref and exact directories or evidence sources;
- questions to answer;
- excluded areas;
- output schema using finding IDs, status, confidence, citations, and unknowns;
- read-only and untrusted-repository constraints.

Require concise findings, not copied source text. Do not pass earlier conclusions into an independent validation slice.

## Reconcile centrally

Keep these responsibilities in the primary analysis:

- product definition and project-type classification;
- deduplication and conflict resolution;
- capability-to-code path across package boundaries;
- confidence calibration and evidence coverage;
- competitive judgment and borrowability decisions;
- final narrative.

When two slices disagree, preserve the conflict, inspect the shared runtime path, and downgrade confidence until resolved.

## Sequential fallback

When parallel agents are unavailable or disallowed, run the same slices sequentially. Preserve a small evidence ledger between slices and stop when additional reading no longer changes a decision-relevant conclusion.
