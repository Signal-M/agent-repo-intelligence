# Enterprise Readiness

Use this reference for shared internal platforms, customer-facing products, regulated workflows, procurement, or any production recommendation with material data and operational exposure.

## Contents

1. Readiness domains
2. Trust-boundary map
3. Evidence and status
4. Deployment decision

## 1. Assess readiness domains

### Identity and authorization

- SSO or equivalent identity integration;
- RBAC/ABAC for users, Agents, tools, workspaces, and administrators;
- service identities and delegated authority;
- permission review, expiration, and emergency revocation;
- separation of duties for high-impact operations.

### Tenant, workspace, and data isolation

- explicit tenant and workspace boundaries;
- storage, cache, memory, log, and vector-index isolation;
- regional and residency controls;
- retention, deletion, export, and legal-hold behavior;
- protection against cross-session and cross-agent leakage.

### Secrets and tool execution

- secret storage, injection, scoping, rotation, and redaction;
- network egress and destination policy;
- sandbox, process, filesystem, and container boundary;
- tool allowlist, side-effect classification, idempotency, and rate limits;
- plugin/MCP supply-chain and execution trust.

### Audit and explainable action

- immutable or tamper-evident event history where required;
- actor, model, Prompt, policy, tool, input, output, approval, and result attribution;
- searchable incident timeline and replay;
- user-visible action rationale without exposing hidden chain-of-thought;
- export and retention aligned with business policy.

### Reliability and service operations

- version pinning and reproducible deployment;
- health, latency, cost, quality, policy, and drift monitoring;
- retry, fallback, circuit breaker, timeout, and capacity handling;
- backup, restore, disaster recovery, and recovery objectives;
- canary, rollback, incident response, and postmortem practice.

### Evaluation and change management

- representative regression set and failure taxonomy;
- model, Prompt, tool, policy, data, and plugin change gates;
- shadow or canary validation before autonomy expansion;
- responsible owner and approval path for releases;
- upgrade compatibility and migration policy.

### Compliance, legal, and procurement constraints

- license, redistribution, notice, patent, and dependency obligations;
- data processing and model-provider terms;
- security assessment and vulnerability response;
- accessibility, localization, records, or sector-specific requirements;
- vendor or maintainer dependency, support, and exit plan.

### Administration and operating model

- tenant/workspace lifecycle;
- policy and model catalog administration;
- usage, cost, quota, and billing controls where relevant;
- support, escalation, manual takeover, and user training;
- ownership across product, platform, security, legal, data, and operations.

## 2. Draw the trust-boundary map

For each scenario, map:

`user → application → Agent runtime → model provider → tools/MCP/plugins → business systems → storage/logging/telemetry`

For every boundary record:

- identity and authority crossing it;
- data classes crossing it;
- encryption and retention;
- external party or process that can observe the data;
- policy enforcement point;
- failure and compromise consequence;
- audit and revocation mechanism.

Do not describe a system as local or private merely because the UI runs locally. Model, search, telemetry, plugins, and tools may cross other boundaries.

## 3. Use evidence-aware statuses

| Status | Meaning |
|---|---|
| `ready` | Scenario-specific production evidence meets the requirement. |
| `partial` | Mechanism exists, but a named integration or control is missing. |
| `not-ready` | The current design conflicts with the requirement. |
| `not-applicable` | The requirement does not apply to the stated scenario. |
| `unknown` | Evidence was not inspected or is unavailable. |

For each material domain, attach:

- repository or external evidence;
- scenario requirement;
- gap and consequence;
- compensating control;
- owner and validation method.

Do not equate the existence of a hook or extension point with a production-ready implementation.

## 4. Issue the deployment decision

Separate:

- local individual use;
- internal bounded-team deployment;
- shared internal platform;
- customer-facing production;
- regulated or high-impact execution.

State the highest deployment class supported by evidence. Name the blockers for the next class. A project may be excellent for local supervised use and still be unsuitable as a shared or external platform.

Hard blockers such as unresolved tenant leakage, irreversible high-impact actions, missing audit, prohibited data transfer, or incompatible licensing cannot be averaged away by product strengths.
