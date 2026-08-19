# Evaluation and Rollout

Use this reference when recommending a prototype, pilot, production adoption, autonomy increase, or a build-a-similar-product plan.

## Contents

1. Evaluation contract
2. Task and failure sets
3. Metrics
4. Rollout stages
5. Promotion and kill criteria
6. Operating ownership

## 1. Define the evaluation contract

Begin with the decision the evaluation must support:

- Is the Agent better than the current workflow for a bounded job?
- Which autonomy level is safe?
- Which model, tool, or architecture choice performs best?
- Is the economics strong enough to proceed?
- Which failure class blocks production?

Freeze:

- target users and workflow;
- baseline and comparison method;
- task eligibility rules;
- success criteria and failure budget;
- evaluation period and sample coverage;
- model, Prompt, tool, policy, and dataset versions;
- human review rubric and adjudication owner.

## 2. Build representative task sets

Use four slices:

1. **Core tasks** — frequent, value-bearing work.
2. **Edge tasks** — ambiguous, incomplete, or uncommon inputs.
3. **Adversarial tasks** — prompt injection, unsafe tools, poisoned context, permission pressure.
4. **Recovery tasks** — outage, timeout, malformed result, partial side effect, interruption, and resume.

Include current production distributions where allowed. Avoid a showcase-only set of easy tasks.

For every task, record:

- initial state and allowed tools;
- target outcome and acceptable variants;
- prohibited actions;
- verification method;
- maximum cost, latency, and intervention;
- severity if the task fails.

## 3. Measure product and operational outcomes

### Quality

- end-to-end task success;
- first-pass acceptance;
- factual or action correctness;
- regression and policy violation rate;
- severe-error rate by failure class.

### Human control

- intervention and escalation rate;
- approval acceptance/rejection rate;
- review time and override rate;
- automation-bias indicators;
- manual takeover and recovery success.

### Operations

- P50/P95 latency;
- cost per attempted and successful task;
- retry, timeout, tool failure, and provider failure rate;
- context growth and compaction behavior;
- replay and incident diagnosis time.

### Business

- cycle-time change;
- capacity or cash value realized;
- adoption and repeat use;
- quality, conversion, resolution, or risk outcome relevant to the workflow;
- support and training burden.

Segment results by task type, severity, autonomy level, model, tool, and user cohort. Averages can hide unacceptable high-impact failures.

## 4. Use staged rollout

| Stage | Agent behavior | Required evidence |
|---|---|---|
| `offline` | Run on a frozen evaluation set. | Core quality, policy, recovery, and cost baseline. |
| `shadow` | Observe live inputs without affecting workflow. | Distribution fit, latency, hidden dependencies, and drift. |
| `assist` | Draft or retrieve; human performs the action. | User value, acceptance, provenance, and workflow fit. |
| `supervised` | Execute after approval. | Side-effect controls, intervention load, rollback, and audit. |
| `bounded` | Execute within explicit scope and budgets. | Stable failure rate, operations ownership, incident response, economics. |
| `scale` | Expand users, tools, or autonomy. | Regression discipline, capacity, governance, and sustained business value. |

Advance one risk dimension at a time. Do not expand users, tools, data sensitivity, and autonomy simultaneously.

## 5. Define promotion and kill criteria

Promotion criteria must be observable and tied to the next stage. Include:

- minimum task success and business improvement;
- maximum severe error, policy violation, intervention, latency, and cost;
- successful cancellation, rollback, replay, and manual takeover;
- no unresolved critical security or data-boundary issue;
- named owners for operations and incidents.

Kill or pause when:

- a prohibited or catastrophic action occurs;
- severe-error rate exceeds the failure budget;
- human review erases the economic benefit;
- users route around controls;
- task distribution differs materially from the evaluation set;
- costs, latency, or support burden exceed the agreed threshold;
- an upgrade invalidates the regression baseline;
- required logs or rollback are unavailable.

Specify rollback scope, safe state, data cleanup, communication, and restart conditions.

## 6. Assign operating ownership

Create a minimal RACI across:

- business outcome owner;
- Agent product owner;
- model/Prompt owner;
- tool and integration owner;
- data and privacy owner;
- evaluation owner;
- security/policy owner;
- on-call and incident commander;
- human operations or review lead.

A production recommendation without an evaluation owner, incident owner, and manual fallback is incomplete.
