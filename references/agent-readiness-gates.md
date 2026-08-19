# Agent Readiness Gates

Use this reference for Agent products considered for a real workflow. The gates identify the safe autonomy level and the cheapest next proof; they are not a maturity vanity score.

## Contents

1. Autonomy ladder
2. Readiness gates
3. Gate decisions
4. Failure taxonomy
5. Evidence rules

## 1. Autonomy ladder

Recommend the minimum autonomy that creates material value:

| Level | Agent responsibility | Human responsibility |
|---|---|---|
| `manual` | No Agent action. | Perform and verify the task. |
| `assist` | Retrieve, summarize, draft, or explain. | Decide and execute. |
| `recommend` | Propose a decision or plan with evidence. | Approve the decision. |
| `supervised-execute` | Execute after per-action or per-plan approval. | Review high-impact actions and outcomes. |
| `bounded-autonomy` | Execute within explicit tools, budgets, and policies. | Monitor exceptions and audit outcomes. |
| `high-autonomy` | Pursue open-ended goals with limited intervention. | Set policy and handle escalations. |

Do not recommend a higher level merely because the runtime supports it. Increase autonomy only when verification, recovery, accountability, and economics improve together.

## 2. Readiness gates

### Gate A — Valuable and frequent problem

Verify:

- meaningful task frequency or consequence;
- measurable baseline pain;
- identifiable user and accountable owner;
- a unit of value beyond “using AI.”

Fail when the task is rare, low-value, or lacks an owner.

### Gate B — Agent-suitable task

Verify:

- the task needs interpretation, synthesis, or adaptive planning;
- tools and context can represent the necessary environment;
- outputs or actions can be verified;
- a deterministic workflow does not dominate on reliability and cost.

Fail when ambiguity is low and rules solve the job more safely.

### Gate C — Data and tool readiness

Verify:

- necessary data is accessible, current, attributable, and allowed;
- tool contracts are typed, versioned, observable, and cancellable;
- side effects, idempotency, and partial failure are understood;
- test and sandbox environments exist.

Fail when critical systems have no stable interface or data rights are unresolved.

### Gate D — Verifiability and completion contract

Verify:

- success and failure can be recognized;
- stop conditions, budgets, timeouts, and loop protection exist;
- high-impact outputs can be checked before commitment;
- provenance and action rationale are visible to the operator.

Fail when the Agent can act but neither it nor a human can reliably judge completion.

### Gate E — Trust and control

Verify:

- least privilege and side-effect classification;
- human approval at the correct boundary;
- audit log and responsibility assignment;
- rollback, cancellation, manual takeover, and escalation;
- privacy, retention, deletion, and policy enforcement.

Fail when severe actions are irreversible or unowned.

### Gate F — Reliability and operations

Verify:

- retry, timeout, rate-limit, malformed-output, unavailable-tool, and model-fallback behavior;
- trace, replay, regression evaluation, and version pinning;
- latency, concurrency, capacity, and cost budgets;
- incident response and change management.

Fail when the product cannot diagnose or recover from expected production failures.

### Gate G — Economics and organizational adoption

Verify:

- risk-adjusted value exceeds total operating cost;
- human review does not erase efficiency gains;
- owners exist for product, tools, evaluation, policy, and incidents;
- workflow and incentives support sustained use;
- the organization can maintain or exit the dependency.

Fail when the product works technically but cannot be operated or adopted economically.

## 3. Gate decisions

Record each gate as:

| Status | Meaning |
|---|---|
| `pass` | Evidence meets the next-stage requirement. |
| `conditional` | A named control or experiment can close the gap. |
| `fail` | The gap blocks the target autonomy or stage. |
| `unknown` | Required evidence is unavailable. |

Each gate record must include evidence, blocker, owner, next proof, and the maximum safe autonomy level implied by the gate.

The overall recommendation is bounded by the weakest critical gate. Do not average a failed trust gate with several strong product gates.

## 4. Failure taxonomy

Use a consistent taxonomy when designing evaluation and controls:

- **Understanding**: wrong goal, missing constraint, bad context selection.
- **Planning**: invalid decomposition, runaway loop, premature completion.
- **Tool contract**: malformed arguments, wrong tool, stale schema, unavailable dependency.
- **Execution**: timeout, partial side effect, non-idempotent retry, concurrency conflict.
- **Verification**: false success, missed regression, unsupported claim.
- **Control**: bypassed approval, excessive privilege, poor escalation.
- **Data**: leakage, retention violation, poisoned memory, stale or unlicensed input.
- **Operations**: latency, capacity, cost spike, provider outage, version drift.
- **Human system**: automation bias, unclear accountability, alert or approval fatigue.

Classify severity, detectability, reversibility, affected party, and control owner.

## 5. Evidence rules

- Repository implementation can verify mechanism availability, not business readiness.
- Tests can verify covered behavior, not task success outside their scope.
- A demo can establish possibility, not reliability.
- User reports can identify failure hypotheses, not population-level rates.
- Production readiness requires scenario-specific operational evidence.
- Missing evidence lowers the permissible autonomy level; it does not automatically mean the mechanism is absent.
