# Contributing

Thank you for helping improve Agent Repo Intelligence.

This repository values evidence quality and decision usefulness over checklist length. Contributions should make the skill more reliable on real product, Agent, architecture, adoption, or evaluation decisions.

## Useful contributions

- Add a well-scoped repository case with commit-pinned evidence.
- Improve a product, Agent, business-adoption, enterprise, or evaluation rubric.
- Add a failure mode or counterexample that changes a recommendation.
- Improve a deterministic validator, calculator, SVG generator, or report template.
- Report a case where the skill confuses facts, assumptions, absence, or business fit.
- Add a forward test that distinguishes real reasoning from template completion.

## Evidence requirements

For material claims:

1. identify the repository, ref, commit, and analysis date;
2. cite a file, symbol, narrow line range, test, release, or authoritative source;
3. label the claim `verified`, `inferred`, `unknown`, or `conflicted`;
4. include counterevidence and inspected-scope limits;
5. do not use stars, demos, or test count as proof of adoption or superiority;
6. do not invent market, user, ROI, SLA, or production evidence.

## Business-adoption contributions

A business case should include:

- explicit decision context and assumptions;
- scenario-specific decisions;
- all seven Agent readiness gates;
- highest safe autonomy level;
- enterprise and upstream dependency gaps;
- economics or required inputs;
- pilot baseline, task set, metrics, promotion gates, rollback, and kill criteria;
- owners and conditions that would reverse the decision.

## Local checks

Run the checks relevant to your change:

```bash
node scripts/validate_skill_structure.js .
node scripts/validate_project_knowledge.js path/to/project-knowledge.json
node scripts/validate_business_case.js path/to/project-knowledge.json
node scripts/verify_report.js path/to/report.html
node --check scripts/your-script.js
```

For a report change, verify keyboard navigation, narrow-screen reading, reduced motion, offline behavior, and print output. Do not add CDNs or external runtime dependencies to the offline report.

## Pull requests

Keep pull requests focused. Explain:

- the decision-quality problem;
- the evidence or failing example;
- the proposed behavior;
- validation performed;
- compatibility or migration impact.

Do not add generic documentation, decorative assets, or framework complexity without a concrete use case.

