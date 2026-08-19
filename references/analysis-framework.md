# Product and Agent Analysis Framework

Use the sections that match the project and the selected depth. Do not turn the questions into a mechanical questionnaire in the final report.

## 1. Product model

Establish:

- One-sentence definition: for **which user**, doing **which job**, through **which distinctive mechanism**, producing **which outcome**.
- User roles: buyer, adopter, administrator, builder, operator, end user, and affected non-user when relevant.
- Current alternative: manual workflow, incumbent tool, adjacent open-source project, internal build, or doing nothing.
- Unit of value: completed task, deployed agent, processed artifact, integrated API call, saved review cycle, or another observable outcome.
- Value loop: trigger → setup/context → core action → result → verification/correction → reusable state or repeat use.
- First-value path: installation, credentials, configuration, example, first success, and likely abandonment points.
- Delivery and adoption: library, CLI, application, service, protocol, model, or platform; bottom-up, top-down, embedded, or ecosystem-led adoption.
- Boundaries: unsuitable tasks, missing prerequisites, hard dependencies, and failure consequences.

Judge the actual repository rather than the category ideal. A framework, demo, and finished product should not receive the same UX expectations.

## 2. Experience and human control

Trace one representative user journey end to end. Inspect:

- visibility of system state and progress;
- configuration burden and useful defaults;
- user control to pause, inspect, approve, edit, retry, roll back, cancel, or escalate;
- result verification and provenance;
- error language, recovery path, and preservation of work;
- accessibility, localization, collaboration, and administration when relevant.

Translate each UX observation into a product consequence. For example, “tool traces are persisted” matters because it supports auditability and debugging; it is not merely an implementation detail.

## 3. Capability-to-code map

For each core user-visible capability, map:

`user action → interface/API → orchestration/runtime → state/data → external dependency → result/feedback`

Identify:

- runtime entry points and the dominant execution path;
- modules that own state or policy;
- stable extension contracts versus internal implementation;
- sync/async boundaries and failure propagation;
- deployment topology and trust boundaries;
- tests or examples that prove the path works.

Rank a core module high only when multiple signals converge: it participates in the user path, controls runtime/state, defines an extension boundary, is documented/tested, or receives sustained change. Do not use line count alone.

## 4. Agent-product lens

Apply this section only when Agent relevance is `core` or `adjacent`.

### Agency contract

- Goal source: user prompt, workflow definition, event, policy, or another agent.
- Autonomy scope: advisory, proposal, supervised execution, bounded autonomy, or open-ended autonomy.
- Completion contract: success criteria, stop conditions, budget, timeout, and loop protection.
- Responsibility boundary: what the user, model, deterministic code, tool, and operator each decide.

### Runtime loop

- Observe → interpret → plan/select → act → validate → update state → stop/recover.
- Model/provider abstraction, routing, structured outputs, retry, fallback, and model-specific coupling.
- Tool/skill discovery, schemas, permissioning, idempotency, side-effect classification, and error normalization.
- Planning: implicit next-action choice, explicit plan, hierarchical planner, workflow graph, or no planning layer.
- Multi-agent use: role necessity, coordination protocol, shared state, arbitration, failure isolation, and whether parallelism creates real value.

### Context, memory, and learning

- Context assembly, truncation, summarization, retrieval, caching, and provenance.
- Difference between transient working state, conversation state, durable memory, user profile, and organizational knowledge.
- Write/read policy, privacy boundary, deletion, conflict handling, and poisoning risk.
- Whether “learning” means model training, durable memory, prompt adaptation, analytics, or simply saved state.

### Trust, evaluation, and operations

- Approval gates, least privilege, sandboxing, secret handling, policy enforcement, and audit logs.
- User-visible reasoning versus action rationale; do not equate hidden chain-of-thought with trustworthy UX.
- Offline evaluation, online metrics, traces, replay, regression tests, quality thresholds, and human review.
- Recovery from malformed output, unavailable tools, partial side effects, timeouts, rate limits, and runaway loops.
- Latency and cost budgets, concurrency, caching, observability, deployment, and tenant/data isolation.

End with the central product trade-off: which mix of autonomy, reliability, speed, cost, and control the design chooses.

## 5. Strategy and ecosystem

Assess only what evidence supports:

- positioning and the real alternative it displaces;
- wedge use case and expansion path;
- distribution through package ecosystems, templates, integrations, hosted service, community, content, or enterprise adoption;
- extension ecosystem and who creates versus captures value;
- switching costs, accumulated state, workflow embedding, compatibility, data/network effects, brand/community, or operational advantages;
- commercialization signals such as hosted control plane, support, enterprise administration, marketplace, or open-core boundary;
- strategic trajectory from shipped evolution, not wishful feature lists.

Open source is a distribution and governance choice, not automatically a business model or moat.

## 6. Competitive comparison

Compare repositories on a normalized job and evidence date. Recommended dimensions:

- target user and wedge;
- setup and first value;
- core capability and autonomy level;
- extension model and ecosystem;
- reliability, observability, safety, and control;
- deployment and data boundary;
- maturity and maintenance signals;
- licensing and commercialization boundary;
- strategic strengths and structural constraints.

Use `verified`, `inferred`, and `not observed` in cells where needed. Never convert an unavailable hosted feature or uninspected module into a zero score.

## 7. Borrowability matrix

Convert each candidate idea into this decision record:

| Field | Question |
|---|---|
| Idea | What design or mechanism is worth considering? |
| User value | Which outcome improves, and for whom? |
| Evidence | Where is it implemented or validated? |
| Strategic fit | Does it reinforce our product's wedge or distract from it? |
| Dependencies | Which data, model, workflow, ecosystem, or organizational capabilities are prerequisites? |
| Cost | What must be built, operated, migrated, or supported? |
| Risk | What can fail technically, behaviorally, legally, or strategically? |
| Adaptation | What principle should be copied, and what repository-specific implementation should not? |
| Experiment | What is the cheapest test with an observable success criterion? |
| Decision | Adopt now, prototype, watch, or reject. |

Prefer transferable principles to superficial feature copying. A useful recommendation explains why the design works in its original system and which conditions must hold in the target product.

## 8. Build-a-similar-product plan

Start from the riskiest product assumption, not the architecture diagram.

Define:

1. target user and narrow task;
2. success signal for one complete real-world job;
3. minimum trustworthy interaction loop;
4. smallest model/tool/data boundary needed;
5. manual or deterministic substitutes for premature Agent complexity;
6. evaluation set and failure budget;
7. milestones for capability, reliability, distribution, and defensibility.

Explain what not to build in the first version.
