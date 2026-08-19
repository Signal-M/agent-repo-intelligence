# Output Contract

## Report depth

### Quick scan

Deliver:

1. one-sentence product definition;
2. who it serves and the job it performs;
3. how the product works at a high level;
4. three strong signals and three important unknowns;
5. Agent relevance and one key design trade-off when applicable;
6. three candidate ideas to borrow, each with one caveat;
7. inspected scope and sources.

### Standard analysis

Deliver the full structure in `SKILL.md`, but keep the executive section independently readable. Use tables for capability-to-code mapping, comparisons, and borrowability; use prose for causal judgments.

### Deep analysis

Add a dated evolution timeline, repository/community health interpretation, external alternatives, strategic trajectory, and stronger validation of innovation or moat claims.

### Business adoption analysis

Use this output when `decisionGoal` is `adopt`, `borrow`, `build`, or `invest`. Add:

1. decision context, business inputs, and explicit assumptions;
2. scenario-fit decisions instead of one repository-wide adoption score;
3. maximum safe autonomy level and seven readiness gates;
4. Build/Buy/Borrow/Avoid alternatives;
5. enterprise-readiness gaps and trust boundaries;
6. downside/base/upside economics or a required-input and break-even plan;
7. pilot stage, evaluation set, promotion gates, rollback, and kill criteria;
8. operating owners and conditions that would reverse the decision.

Keep `mode` for research depth and use `decisionGoal` for the business decision. They are independent: a standard-depth repository analysis can still support an adoption decision when the decisive evidence is available.

## `project-knowledge.json`

Create this artifact only when a diagram, HTML report, or reusable comparison needs structured data.

```json
{
  "meta": {
    "repo": "owner/name",
    "url": "https://github.com/owner/name",
    "commit": "full-sha",
    "analyzedAt": "2026-08-14",
    "mode": "standard",
    "decisionGoal": "adopt",
    "productTypes": ["agent-application"],
    "agentRelevance": "core",
    "scope": ["README.md", "src/runtime", "docs", "releases"]
  },
  "graph": {
    "nodes": [
      {"id": "runtime", "title": "Agent runtime", "category": "runtime"}
    ],
    "edges": [
      {"s": "app", "t": "runtime", "kind": "calls"}
    ]
  },
  "architecture": {
    "layers": [
      {
        "label": "Experience",
        "boxes": [{"id": "app", "title": "Application", "sub": "User control"}]
      }
    ]
  },
  "findings": [
    {
      "id": "F-01",
      "lens": "product",
      "claim": "...",
      "status": "verified",
      "confidence": "high",
      "evidence": [{"source": "repository", "location": "src/app.ts:10", "note": "..."}],
      "counterevidence": [],
      "implication": "..."
    }
  ],
  "coreModules": [
    {
      "id": "src/runtime/index.ts",
      "role": "Owns the execution loop",
      "importance": "high",
      "signals": ["user-path", "state-owner", "extension-boundary"],
      "evidenceIds": ["F-01"]
    }
  ],
  "borrowable": [
    {
      "idea": "Approval boundary around side-effecting tools",
      "userValue": "Improves control and auditability",
      "strategicFit": "high",
      "dependencies": ["tool side-effect classification"],
      "cost": "medium",
      "risk": "Approval fatigue",
      "experiment": "Gate two destructive tools and measure completion plus override rate",
      "decision": "prototype",
      "evidenceIds": ["F-01"]
    }
  ],
  "decisionContext": {
    "decisionGoal": "adopt",
    "decision": "Whether to pilot the runtime for an internal engineering workflow",
    "organization": "Business context supplied by the user or explicitly marked unknown",
    "workflow": "Repository diagnosis and bounded code changes",
    "users": ["engineer", "engineering manager", "platform operator"],
    "constraints": ["Human review before merge"],
    "assumptions": ["No production customer data in the pilot"],
    "currentBaseline": {
      "status": "unknown",
      "metrics": []
    }
  },
  "businessScenarios": [
    {
      "id": "internal-coding",
      "name": "Internal supervised coding Agent",
      "actor": "Software engineer",
      "workflow": "Diagnose and modify a repository",
      "autonomyLevel": "supervised-execute",
      "status": "conditional",
      "decision": "prototype",
      "decisiveConstraint": "Task-quality and severe-error baselines are not established",
      "conditions": ["All writes remain reviewable and reversible"],
      "blockers": ["Representative evaluation set is missing"],
      "evidenceIds": ["F-01"]
    }
  ],
  "readinessGates": [
    {
      "id": "value",
      "label": "Valuable and frequent problem",
      "status": "unknown",
      "blocker": "Current workflow baseline is unavailable",
      "owner": "Business owner",
      "nextProof": "Measure task volume, handling time, and rework",
      "maxAutonomy": "assist",
      "evidenceIds": []
    }
  ],
  "economics": {
    "status": "unknown",
    "currency": "CNY",
    "horizonMonths": 12,
    "requiredInputs": ["task volume", "loaded labor cost", "review time"],
    "scenarios": []
  },
  "enterpriseReadiness": [
    {
      "domain": "identity-and-authorization",
      "status": "partial",
      "gap": "Organization SSO integration is not evidenced",
      "control": "Limit the pilot to local named users",
      "owner": "Platform security",
      "evidenceIds": ["F-01"]
    }
  ],
  "pilot": {
    "targetScenarioId": "internal-coding",
    "stage": "offline",
    "baseline": "Current human workflow",
    "taskSet": ["Core", "edge", "adversarial", "recovery"],
    "metrics": ["task success", "severe error", "intervention", "cost per successful task"],
    "promotionCriteria": ["Meet the agreed quality and failure budget"],
    "killCriteria": ["Any prohibited irreversible action"],
    "owners": ["Business owner", "Agent product owner", "evaluation owner"]
  },
  "unknowns": ["Production adoption is not evidenced by the repository"]
}
```

Allowed values:

- `meta.mode`: `quick`, `standard`, `deep`, `comparison`;
- `meta.decisionGoal`: `understand`, `compare`, `adopt`, `borrow`, `build`, `invest` when present;
- `meta.agentRelevance`: `core`, `adjacent`, `none`, `unknown`;
- finding `status`: `verified`, `inferred`, `unknown`, `conflicted`;
- `confidence`, `importance`, `strategicFit`, and `cost`: `high`, `medium`, `low` where present;
- borrowable `decision`: `adopt`, `prototype`, `watch`, `reject`.
- business scenario `status`: `ready`, `conditional`, `experimental`, `not-fit`, `unknown`;
- autonomy level: `manual`, `assist`, `recommend`, `supervised-execute`, `bounded-autonomy`, `high-autonomy`;
- readiness gate `status`: `pass`, `conditional`, `fail`, `unknown`;
- enterprise-readiness `status`: `ready`, `partial`, `not-ready`, `not-applicable`, `unknown`;
- economics `status`: `supported`, `conditional`, `unsupported`, `unknown`;
- pilot `stage`: `offline`, `shadow`, `assist`, `supervised`, `bounded`, `scale`.

Keep node IDs unique. Every edge endpoint must reference an existing node. Every `evidenceIds` value must reference a finding. Use no unexplained numeric scores.

For adoption artifacts, run both validators:

```bash
node scripts/validate_project_knowledge.js project-knowledge.json
node scripts/validate_business_case.js project-knowledge.json
```

The business validator requires all seven readiness gates: `value`, `agent-fit`, `data-tools`, `verifiability`, `trust`, `reliability`, and `economics-org`. The weakest critical gate bounds the autonomy recommendation; do not average gate statuses into a vanity score.

## Writing rules

- Put the verdict before supporting detail.
- Name the evidence immediately after a non-obvious factual claim.
- Explain causal implications; do not merely enumerate technologies.
- State observed limitations without dramatizing them.
- Keep recommendations asymmetric: a project can be worth learning from without being a suitable competitor or implementation template.
- End with unresolved questions that could materially change the recommendation.
