#!/usr/bin/env node
'use strict';

const fs = require('fs');

const DECISION_GOALS = new Set(['understand', 'compare', 'adopt', 'borrow', 'build', 'invest']);
const ADOPTION_GOALS = new Set(['adopt', 'borrow', 'build', 'invest']);
const SCENARIO_STATUSES = new Set(['ready', 'conditional', 'experimental', 'not-fit', 'unknown']);
const DECISIONS = new Set(['adopt', 'prototype', 'watch', 'reject']);
const AUTONOMY = new Set(['manual', 'assist', 'recommend', 'supervised-execute', 'bounded-autonomy', 'high-autonomy']);
const GATE_STATUSES = new Set(['pass', 'conditional', 'fail', 'unknown']);
const GATE_IDS = new Set(['value', 'agent-fit', 'data-tools', 'verifiability', 'trust', 'reliability', 'economics-org']);
const ENTERPRISE_STATUSES = new Set(['ready', 'partial', 'not-ready', 'not-applicable', 'unknown']);
const ECONOMIC_STATUSES = new Set(['supported', 'conditional', 'unsupported', 'unknown']);
const PILOT_STAGES = new Set(['offline', 'shadow', 'assist', 'supervised', 'bounded', 'scale']);

function usage() {
  process.stderr.write('Usage: node validate_business_case.js <project-knowledge.json>\n');
  process.exit(2);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function main() {
  const file = process.argv[2];
  if (!file || process.argv.length > 3) usage();

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    process.stderr.write(`Invalid JSON or unreadable file: ${error.message}\n`);
    process.exit(1);
  }

  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const meta = data.meta;
  check(isObject(meta), 'meta must be an object');
  const decisionGoal = isObject(meta) ? meta.decisionGoal : undefined;
  check(DECISION_GOALS.has(decisionGoal), `meta.decisionGoal must be one of: ${[...DECISION_GOALS].join(', ')}`);

  if (!ADOPTION_GOALS.has(decisionGoal)) {
    errors.push('business-case validation requires decisionGoal adopt, borrow, build, or invest');
    return finish(errors);
  }

  const findingIds = new Set((Array.isArray(data.findings) ? data.findings : []).map(item => item && item.id).filter(nonEmpty));
  const validateEvidenceIds = (value, label) => {
    check(Array.isArray(value), `${label} must be an array`);
    (Array.isArray(value) ? value : []).forEach(id => check(findingIds.has(id), `${label} references unknown finding: ${id}`));
  };

  const context = data.decisionContext;
  check(isObject(context), 'decisionContext must be an object');
  if (isObject(context)) {
    check(context.decisionGoal === decisionGoal, 'decisionContext.decisionGoal must match meta.decisionGoal');
    check(nonEmpty(context.decision), 'decisionContext.decision must be a non-empty string');
    check(nonEmpty(context.workflow), 'decisionContext.workflow must be a non-empty string');
    check(Array.isArray(context.users) && context.users.length > 0, 'decisionContext.users must be a non-empty array');
    check(Array.isArray(context.constraints), 'decisionContext.constraints must be an array');
    check(Array.isArray(context.assumptions), 'decisionContext.assumptions must be an array');
    check(isObject(context.currentBaseline), 'decisionContext.currentBaseline must be an object');
  }

  const scenarioIds = new Set();
  check(Array.isArray(data.businessScenarios) && data.businessScenarios.length > 0, 'businessScenarios must be a non-empty array');
  (Array.isArray(data.businessScenarios) ? data.businessScenarios : []).forEach((scenario, index) => {
    const prefix = `businessScenarios[${index}]`;
    check(isObject(scenario), `${prefix} must be an object`);
    if (!isObject(scenario)) return;
    check(nonEmpty(scenario.id), `${prefix}.id must be a non-empty string`);
    if (nonEmpty(scenario.id)) {
      check(!scenarioIds.has(scenario.id), `${prefix}.id is duplicated: ${scenario.id}`);
      scenarioIds.add(scenario.id);
    }
    check(nonEmpty(scenario.name), `${prefix}.name must be a non-empty string`);
    check(nonEmpty(scenario.actor), `${prefix}.actor must be a non-empty string`);
    check(nonEmpty(scenario.workflow), `${prefix}.workflow must be a non-empty string`);
    check(AUTONOMY.has(scenario.autonomyLevel), `${prefix}.autonomyLevel is invalid`);
    check(SCENARIO_STATUSES.has(scenario.status), `${prefix}.status is invalid`);
    check(DECISIONS.has(scenario.decision), `${prefix}.decision is invalid`);
    check(nonEmpty(scenario.decisiveConstraint), `${prefix}.decisiveConstraint must be a non-empty string`);
    check(Array.isArray(scenario.conditions), `${prefix}.conditions must be an array`);
    check(Array.isArray(scenario.blockers), `${prefix}.blockers must be an array`);
    validateEvidenceIds(scenario.evidenceIds, `${prefix}.evidenceIds`);
  });

  const seenGates = new Set();
  check(Array.isArray(data.readinessGates), 'readinessGates must be an array');
  (Array.isArray(data.readinessGates) ? data.readinessGates : []).forEach((gate, index) => {
    const prefix = `readinessGates[${index}]`;
    check(isObject(gate), `${prefix} must be an object`);
    if (!isObject(gate)) return;
    check(GATE_IDS.has(gate.id), `${prefix}.id is invalid: ${String(gate.id)}`);
    if (GATE_IDS.has(gate.id)) {
      check(!seenGates.has(gate.id), `${prefix}.id is duplicated: ${gate.id}`);
      seenGates.add(gate.id);
    }
    check(nonEmpty(gate.label), `${prefix}.label must be a non-empty string`);
    check(GATE_STATUSES.has(gate.status), `${prefix}.status is invalid`);
    check(nonEmpty(gate.blocker), `${prefix}.blocker must be a non-empty string`);
    check(nonEmpty(gate.owner), `${prefix}.owner must be a non-empty string`);
    check(nonEmpty(gate.nextProof), `${prefix}.nextProof must be a non-empty string`);
    check(AUTONOMY.has(gate.maxAutonomy), `${prefix}.maxAutonomy is invalid`);
    validateEvidenceIds(gate.evidenceIds, `${prefix}.evidenceIds`);
  });
  GATE_IDS.forEach(id => check(seenGates.has(id), `readinessGates is missing required gate: ${id}`));

  const economics = data.economics;
  check(isObject(economics), 'economics must be an object');
  if (isObject(economics)) {
    check(ECONOMIC_STATUSES.has(economics.status), 'economics.status is invalid');
    check(nonEmpty(economics.currency), 'economics.currency must be a non-empty string');
    check(Number.isInteger(economics.horizonMonths) && economics.horizonMonths > 0, 'economics.horizonMonths must be a positive integer');
    check(Array.isArray(economics.requiredInputs), 'economics.requiredInputs must be an array');
    check(Array.isArray(economics.scenarios), 'economics.scenarios must be an array');
    if (economics.status === 'unknown') check(economics.requiredInputs.length > 0, 'unknown economics must name requiredInputs');
  }

  check(Array.isArray(data.enterpriseReadiness) && data.enterpriseReadiness.length > 0, 'enterpriseReadiness must be a non-empty array');
  (Array.isArray(data.enterpriseReadiness) ? data.enterpriseReadiness : []).forEach((item, index) => {
    const prefix = `enterpriseReadiness[${index}]`;
    check(isObject(item), `${prefix} must be an object`);
    if (!isObject(item)) return;
    check(nonEmpty(item.domain), `${prefix}.domain must be a non-empty string`);
    check(ENTERPRISE_STATUSES.has(item.status), `${prefix}.status is invalid`);
    check(nonEmpty(item.gap), `${prefix}.gap must be a non-empty string`);
    check(nonEmpty(item.control), `${prefix}.control must be a non-empty string`);
    check(nonEmpty(item.owner), `${prefix}.owner must be a non-empty string`);
    validateEvidenceIds(item.evidenceIds, `${prefix}.evidenceIds`);
  });

  const pilot = data.pilot;
  check(isObject(pilot), 'pilot must be an object');
  if (isObject(pilot)) {
    check(scenarioIds.has(pilot.targetScenarioId), 'pilot.targetScenarioId must reference a business scenario');
    check(PILOT_STAGES.has(pilot.stage), 'pilot.stage is invalid');
    check(nonEmpty(pilot.baseline), 'pilot.baseline must be a non-empty string');
    ['taskSet', 'metrics', 'promotionCriteria', 'killCriteria', 'owners'].forEach(key => {
      check(Array.isArray(pilot[key]) && pilot[key].length > 0, `pilot.${key} must be a non-empty array`);
    });
  }

  finish(errors);
}

function finish(errors) {
  if (errors.length) {
    process.stderr.write(`Business-case validation failed with ${errors.length} error(s):\n`);
    errors.forEach(error => process.stderr.write(`- ${error}\n`));
    process.exit(1);
  }
  process.stdout.write('business adoption case is valid\n');
}

main();
