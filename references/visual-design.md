# Visual Design Direction

Use this reference only for the optional HTML report. Keep analysis methodology independent from presentation styling.

The audit method is adapted from Leonxlnx's [`taste-skill`](https://github.com/Leonxlnx/taste-skill) (MIT), inspected on 2026-08-14, and Anthropic's [`frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) (Apache-2.0). Apply the transferable principles rather than copying either skill mechanically. `taste-skill` explicitly excludes dense dashboards and data tables, so its marketing-page motion, imagery, AIDA, and Bento rules are not defaults for this report.

## Product brief and dials

Treat the artifact as a **decision workspace for open-source product research**, not a marketing landing page, faux dossier, or generic dashboard.

Before editing, write a private brief with:

- `Subject`: the project, domain, and strongest visual cue present in the source material.
- `Audience + decision`: who reads the report and what they should decide after reading it.
- `Mode`: redesign-preserve for an existing report; redesign-overhaul only when the user asks for a new visual language.
- `DESIGN_VARIANCE`: 1–10. Default `7`: asymmetric hierarchy and multiple layout families, within a stable report system.
- `MOTION_INTENSITY`: 1–10. Default `2`: only selected-view feedback and relationship exploration.
- `VISUAL_DENSITY`: 1–10. Default `8`: research-dense, with strong scan paths and compact tables.

Put these three values on the report `<body>` as `data-design-variance`, `data-motion-intensity`, and `data-visual-density`. Change a default only when the project or audience justifies it.

## Audit before styling

Preserve report content, evidence semantics, tab IDs, static SVGs, keyboard behavior, offline behavior, and print output. Audit the current artifact for:

- centered or cinematic hero treatment that delays the decision;
- section-number eyebrows, fake dossier/version metadata, decorative dots, or status indicators without semantic state;
- equal three/four-card rows, cards used only to create spacing, and every section repeating the same container;
- mixed radius systems, heavy generic shadows, glass effects, AI-purple gradients, or decorative grids;
- serif-as-personality defaults, excessive uppercase microcopy, and metadata chains joined with ornamental punctuation;
- identical section layouts, long unbroken paragraphs, tables without a clear scan hierarchy, and mobile that merely stacks desktop blocks.

Name the patterns to retire before changing CSS. Do not mistake a font swap for a redesign.

## Stable visual system

- **Structure**: persistent research rail on desktop, compact horizontal chapter navigation on narrow screens, and a wide reading canvas.
- **Theme**: one light paper theme. Do not insert a random dark hero or inverted section.
- **Accent**: one restrained cobalt accent for selection and emphasis. Semantic green, amber, gray, and red are reserved for evidence/risk states.
- **Typography**: humanist sans for headings and body; mono for repository metadata, numeric data, and evidence labels. Avoid a decorative serif unless the repository has a defensible editorial identity.
- **Shape**: square or 2–4px radii. Use shadows only for genuinely floating UI such as the graph detail popover.
- **Surfaces**: establish hierarchy with type, rules, alignment, and whitespace before adding filled containers.

The evidence legend is functional, not decoration. Keep its meaning adjacent to navigation or conclusions and always pair color with text and border treatment.

## Layout variance with purpose

Use at least four layout families across a complete report:

- summary: asymmetric thesis plus compact evidence snapshot;
- product: journey sequence plus user/JTBD table;
- Agent: sticky principle or lead judgment beside a capability matrix;
- architecture: full-width visual canvases plus capability-to-code mapping;
- assessment: findings ledger beside a risk block;
- borrowability: ranked decision queue with explicit experiments;
- evidence: source ledger plus unknown/conflict split.

Do not add variety randomly. Each layout must make its content easier to compare, trace, sequence, or decide. Tables remain the correct component for repeated-field comparisons.

## Interaction and accessibility

- Keep CSS/radio navigation usable without JavaScript and static SVG diagrams readable before enhancement.
- Use motion only for view changes, focus, hover feedback, or relationship highlighting. Respect `prefers-reduced-motion`.
- Provide a skip link and visible keyboard focus.
- Keep one-column mobile reading deliberate: preserve judgment order, labels, and table overflow.
- Print must expose every section and remove navigation-only chrome.

## Pre-flight critique

Before delivery, answer:

1. Does the first screen state a decision instead of performing as a template-shaped hero?
2. Are fact, inference, unknown, and conflict distinct without relying on color alone?
3. Does every container, rule, or background encode hierarchy or grouping?
4. Are there at least four meaningful layout families, without decorative randomness?
5. Can any card, eyebrow, badge, dot, grid, shadow, or animation be removed without losing meaning? If yes, remove it.
6. Are long text, tables, diagrams, narrow screens, keyboard use, reduced motion, offline use, and print all viable?
7. Are the dial values honest descriptions of the implemented result?

The desired character comes from editorial judgment and information architecture, not visual intensity.
