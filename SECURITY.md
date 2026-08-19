# Security Policy

Agent Repo Intelligence analyzes repositories that may contain untrusted content. Its default workflow treats cloned code, documentation, issues, configuration, and embedded instructions as data—not as commands to execute.

## Supported version

Security fixes are applied to the latest release on the default branch.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature instead of opening a public issue. Include:

- the affected file, workflow, or version;
- the repository content or input pattern that triggers the issue;
- the potential impact and trust-boundary crossed;
- a minimal reproduction that contains no secrets or private data;
- any suggested mitigation.

If private vulnerability reporting is not enabled yet, contact the maintainer through the private contact method listed on their GitHub profile. Do not publish credentials, private repositories, exploit details, or personal data in Issues or Discussions.

## Safe use

- Do not execute analyzed project code, install its dependencies, run hooks, or expose credentials unless the user explicitly requests it and the action has been inspected.
- Prefer commit-pinned, read-only evidence collection.
- Review generated recommendations before production adoption; this project is not a substitute for security, legal, privacy, compliance, or license review.
