# Decision Quality Rubric

Use this reference before delivering a business-adoption report and when forward-testing the skill. It tests whether the analysis supports a real decision rather than rewarding length or visual polish.

## Contents

1. Critical failures
2. Quality dimensions
3. Forward-test cases
4. Calibration record

## 1. Critical failures

The report fails quality review if any condition is true:

- repository claims, external facts, business inputs, and analyst assumptions are blended;
- one adoption score is applied across materially different scenarios;
- production readiness is inferred from architecture, stars, demos, or test count;
- autonomy exceeds the weakest critical trust, verification, or operations gate;
- ROI uses invented volume, labor, adoption, quality, or failure inputs;
- a prototype recommendation lacks a baseline, task set, metric, promotion gate, or kill criterion;
- a production recommendation lacks an accountable owner, manual fallback, incident path, and rollback;
- hard legal, security, privacy, or irreversible-action constraints are averaged into a numeric score;
- negative absence claims exceed the inspected scope;
- recommendations cannot be traced to evidence or named assumptions.

## 2. Quality dimensions

Judge each dimension as `strong`, `adequate`, `weak`, or `missing`. Do not average them into a single vanity score.

### Decision framing

- Is the decision, organization, workflow, user, current baseline, and success outcome explicit?
- Are missing inputs visible and decision-relevant questions prioritized?

### Evidence integrity

- Does every material claim have a status and source class?
- Are counterevidence, version drift, and inspected-scope limits preserved?

### Scenario discrimination

- Do scenarios vary by actor, workflow, autonomy, data, failure consequence, and scale?
- Can the same repository receive different decisions for defensible reasons?

### Agent product judgment

- Is Agent suitability compared with deterministic automation?
- Are completion, verification, tools, memory, control, recovery, latency, cost, and failure modes connected to user consequences?
- Is the recommended autonomy the minimum level that creates value?

### Business and economic reasoning

- Is the unit of value measurable against a current baseline?
- Does TCO include review, integration, evaluation, maintenance, incidents, upgrades, and exit?
- Are scenarios, sensitivities, and break-even conditions explicit when inputs exist?

### Production and enterprise reasoning

- Are trust boundaries, identity, isolation, secrets, audit, operations, change management, and compliance mapped to the scenario?
- Is the highest evidence-supported deployment class explicit?

### Pilot and learning design

- Does the evaluation include core, edge, adversarial, and recovery tasks?
- Are metrics segmented by task and severity?
- Are promotion, rollback, pause, and kill criteria observable?
- Does the pilot test the riskiest assumption before platform expansion?

### Strategic judgment

- Are Build/Buy/Borrow/Avoid options normalized around the same job?
- Are project moat, adopter advantage, dependency power, and exit posture separated?
- Is the recommendation asymmetric rather than “copy everything” or “reject everything”?

### Executive usefulness

- Can a decision-maker understand the recommendation, confidence, blocker, next proof, owner, and reversal condition without reading the technical appendix?
- Can an engineer trace the decision back to runtime evidence?

## 3. Forward-test cases

Use raw repositories and minimal task-local context. Do not give the evaluator the intended answer.

### Case A — Same repository, low-risk versus high-risk use

Prompt once for an internal, reversible, supervised workflow and once for a customer-facing, irreversible workflow. Pass only if the decisions and autonomy levels diverge and the explanation identifies the changed failure and governance boundary.

### Case B — Strong architecture, weak business baseline

Use a well-engineered Agent framework without organization-specific task volume or economics. Pass only if the report can recommend a technical prototype while keeping ROI and production adoption unknown.

### Case C — Popular repository, weak governance

Use a widely discussed project with unstable releases or concentrated maintenance. Pass only if popularity is separated from adoption, support, compatibility, and exit risk.

### Case D — Deterministic alternative dominates

Use a workflow that can be solved by rules or conventional automation. Pass only if the report rejects unnecessary Agent complexity or restricts the Agent to ambiguous substeps.

### Case E — Missing or conflicting evidence

Remove access to runtime code, business inputs, or release history. Pass only if the report downgrades confidence, preserves unknowns, and proposes the cheapest evidence-gathering step.

## 4. Calibration record

After a real decision or pilot, retain outside the installed skill:

- original snapshot and recommendation;
- assumptions and predicted blockers;
- actual pilot metrics and incidents;
- which predictions were confirmed, rejected, or remained unknown;
- which rubric or workflow rule changed as a result.

The reusable advantage comes from calibrated cases and evaluation evidence, not from adding more prose to `SKILL.md`.
