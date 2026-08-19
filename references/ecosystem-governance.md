# Ecosystem and Open-Source Governance

Use this reference when adoption depends on an upstream project, plugin ecosystem, model provider, protocol, or community-maintained integration.

## Contents

1. Governance evidence
2. Dependency power map
3. Sustainability and exit
4. Defensibility

## 1. Inspect governance evidence

Record dated evidence for:

- release cadence and versioning discipline;
- migration guidance and compatibility policy;
- maintainer concentration and review participation;
- contribution policy and external pull-request behavior;
- issue response, security reporting, and vulnerability handling;
- roadmap transparency and decision process;
- license and contributor terms;
- plugin or integration certification and deprecation.

Do not equate commit volume, stars, or contributor count with reliable governance. Distinguish company-authored open source, community governance, and a source-available distribution channel.

## 2. Build a dependency power map

Identify who creates and captures value:

| Actor | Questions |
|---|---|
| Maintainer | Controls releases, roadmap, branding, compatibility, and security response? |
| Model provider | Can pricing, policy, behavior, or API changes invalidate the product? |
| Plugin developer | Can third-party code expand value or compromise the runtime? |
| Cloud/infra provider | Which operational capabilities are portable? |
| Adopter | Which state, workflows, evaluations, and integrations create switching cost? |
| User/customer | Who owns data, feedback, and outcome accountability? |

Map single points of failure, asymmetric dependencies, and the adopter's negotiating or exit position.

## 3. Evaluate sustainability and exit

For adoption, examine:

- ability to pin, patch, fork, and rebuild;
- depth of internal expertise required;
- dependency replacement paths;
- data and workflow portability;
- plugin compatibility and upgrade burden;
- security patch latency;
- support and escalation path;
- cost of remaining on an old version;
- trigger for migrating away.

Classify the operating posture:

- `consume`: follow upstream with minimal customization;
- `extend`: build supported plugins and integrations;
- `fork-capable`: maintain a narrow internal patch set and exit plan;
- `own`: intentionally assume full product and security responsibility.

Do not recommend a fork merely to gain control; verify the organization can carry the long-term merge and incident burden.

## 4. Assess defensibility carefully

Potential defensibility may come from:

- proprietary workflow integration;
- accumulated high-quality evaluation and operational data;
- user or organizational memory with legitimate switching cost;
- trusted policy and governance layer;
- model-runtime co-design with measured outcome advantage;
- distribution, ecosystem, or standards position;
- operational reliability and domain-specific implementation capability.

Treat architecture, open source, brand, and community attention as inputs, not a moat by themselves. Require comparative and outcome evidence before claiming defensibility.

For the adopter, separate project moat from internal advantage: adopting a popular runtime may accelerate delivery without creating differentiation. Name which capabilities should remain commodity and which should accumulate proprietary learning.
