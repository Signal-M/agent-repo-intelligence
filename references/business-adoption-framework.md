# Business Adoption Framework

Use this reference when the decision goal is `adopt`, `build`, `borrow`, or `invest`, or when the user asks whether a repository can support a real business workflow.

## Contents

1. Decision context
2. Business scenario unit
3. Scenario-fit assessment
4. Build, buy, borrow, or avoid
5. Adoption decision
6. Output requirements

## 1. Establish the decision context

Repository quality is not business fit. Record the following before recommending adoption:

| Field | Decision question |
|---|---|
| `decisionGoal` | Understand, compare, adopt, borrow, build, or invest? |
| `organization` | Which business unit, maturity stage, and operating environment? |
| `workflow` | Which end-to-end job changes if the project is adopted? |
| `users` | Who operates, supervises, administers, buys, and is affected? |
| `currentBaseline` | How is the job performed today, with what time, cost, quality, and failure rate? |
| `constraints` | Which delivery date, budget, architecture, procurement, or staffing constraints apply? |
| `dataBoundary` | Which data classes, regions, retention rules, and external transmissions are allowed? |
| `failureCost` | What can go wrong, is it reversible, and who carries the consequence? |
| `serviceLevel` | Which volume, concurrency, latency, availability, and recovery expectations apply? |
| `successMetric` | Which observable business outcome would justify adoption? |

Ask only for missing information that could materially change the decision. Otherwise make conservative, visible assumptions and attach them to the recommendation.

Never infer organization-specific facts from repository evidence. Keep these evidence classes separate:

- **Repository fact**: verified in code, docs, releases, or runtime evidence.
- **External fact**: verified in a dated authoritative source.
- **Business input**: supplied by the user or organization.
- **Analyst assumption**: required to proceed and explicitly testable.

## 2. Use the business scenario as the decision unit

Do not assign one universal adoption rating to a repository. Define scenarios as:

`actor + workflow + environment + autonomy level + data boundary + failure consequence + scale`

Example scenarios for the same Agent runtime:

- internal engineering assistant with human review and reversible repository changes;
- internal shared Agent platform with multiple teams and centralized policy;
- customer-facing service Agent that can update account state;
- regulated operations Agent handling sensitive records.

For each scenario, identify:

1. trigger and task frequency;
2. current manual or incumbent workflow;
3. desired unit of value;
4. required tools, systems, and data;
5. permitted autonomy level;
6. expected volume and service level;
7. failure modes and reversibility;
8. accountable owner and human fallback;
9. evidence-supported fit and unresolved blockers.

## 3. Assess scenario fit

Use anchored levels rather than a synthetic total score:

| Status | Meaning |
|---|---|
| `ready` | Evidence supports a bounded production use under the stated controls. |
| `conditional` | A pilot is reasonable, but named blockers must be closed before production. |
| `experimental` | The value hypothesis is plausible; reliability or integration evidence is insufficient. |
| `not-fit` | Structural mismatch, unacceptable risk, or a simpler alternative dominates. |
| `unknown` | Required business or technical evidence is missing. |

Assess at least:

- workflow and user fit;
- Agent suitability versus deterministic automation;
- capability fit;
- integration and data fit;
- trust and control fit;
- operational fit;
- economic fit;
- organizational fit;
- strategic fit and dependency risk.

Name the decisive constraint. A long list of moderate concerns is less useful than the one condition that blocks adoption.

## 4. Compare build, buy, borrow, and avoid

Normalize alternatives around the same job:

| Option | Include |
|---|---|
| Adopt upstream | Integration, upgrade, support, governance, and dependency cost. |
| Fork | Internal ownership, merge burden, security response, and talent requirements. |
| Borrow patterns | Which mechanisms transfer without adopting the runtime. |
| Buy hosted product | Procurement, data boundary, control, SLA, and switching cost. |
| Build internally | Time to first value, ongoing operation, and opportunity cost. |
| Deterministic workflow | Whether rules, RPA, search, or conventional software solves the task more reliably. |
| Do nothing | Current failure cost and strategic cost of delay. |

Do not let architectural elegance dominate the decision. Prefer the option with the strongest risk-adjusted path to the business outcome.

## 5. Issue an adoption decision

Use one decision per scenario:

- `adopt`: evidence supports controlled use now;
- `prototype`: run a time-boxed experiment against a baseline;
- `watch`: wait for named evidence, maturity, or internal readiness;
- `reject`: the scenario is structurally mismatched or dominated by a simpler option.

Every decision must include:

- decision owner and target workflow;
- autonomy level;
- evidence and confidence;
- prerequisites and blockers;
- expected business value;
- major risks and controls;
- cheapest validation experiment;
- promotion gate and kill criteria;
- conditions that would reverse the decision.

## 6. Output requirements

For an adoption analysis, add these sections to the normal repository report:

1. decision context and explicit assumptions;
2. scenario-fit matrix;
3. recommended autonomy level per scenario;
4. Build/Buy/Borrow/Avoid comparison;
5. production-readiness blockers;
6. base/upside/downside economics when inputs exist;
7. pilot, evaluation, promotion gates, rollback, and kill criteria;
8. operating owner and unresolved decisions.

Lead with the scenario decision. Repository description and architecture are supporting evidence, not the executive outcome.
