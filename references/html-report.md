# Offline HTML Report

Use the HTML artifact only when the user requests a shareable file or the report benefits materially from navigation and visuals.

## Assembly

1. Copy `assets/report-template.html` into the task output directory.
2. Read `references/visual-design.md`, audit the existing artifact, and write a compact internal brief: subject, audience, decision, redesign mode, three design dials, patterns to preserve, and patterns to retire. Keep it out of the final report.
3. Replace every visible placeholder and remove unused tabs or sections.
4. Generate `project-knowledge.json` and run `scripts/validate_project_knowledge.js`.
5. Render optional diagrams with `scripts/bake_graph.js` and `scripts/bake_arch.js`.
6. Replace the template SVG placeholders with the generated static SVG.
7. Put the executive verdict, evidence status, unknowns, and analysis snapshot in the HTML; do not hide them in a technical appendix.
8. Critique the page for repeated layout families, card/eyebrow/meta-label overuse, hierarchy, excess decoration, and mobile reading. Remove every non-functional flourish, not merely one token example.
9. Run `node scripts/verify_report.js <report.html>` and fix every reported error.

## Constraints

- Keep core reading and navigation usable without JavaScript. Use the template's radio/CSS tabs and static SVG.
- Use JavaScript only as progressive enhancement. Avoid inline dependencies and CDNs.
- Preserve visible keyboard focus, reduced-motion behavior, readable contrast, and a print layout that exposes every report section.
- Keep all HTML IDs unique. Preserve `repo-graph` for the graph SVG and `repo-arch` for the architecture SVG so the optional enhancement script can find them.
- Preserve explicit 1–10 design-dial values on the `<body>` and make the implementation match them.
- Compute SVG `viewBox` from rendered content. Do not hand-code a height that can crop rows.
- Escape repository-derived content before inserting it into HTML or SVG.
- Aggregate the graph when more than 80–120 nodes would make the result unreadable.
- Preserve the original deliverable before overwriting a user-owned report. When creating a new report from the template, no backup is required.

## Verification

Check before delivery:

- radio, label, and visible section IDs match;
- all IDs are unique;
- every placeholder is replaced or intentionally removed;
- HTML remains understandable with scripts disabled;
- both SVGs contain static nodes/boxes and have non-clipping `viewBox` values;
- enhancement script throws no browser errors;
- narrow-screen layout does not create an unusable fixed-width viewport;
- hero, navigation, evidence states, body copy, tables, and diagrams form one intentional hierarchy rather than a collection of cards;
- color is not the only carrier of verified/inferred/unknown meaning;
- typography remains readable when the preferred local fonts are unavailable;
- findings preserve verified/inferred/unknown distinctions and cite their evidence;
- external links are direct, safe links and dated where the claim is volatile.
