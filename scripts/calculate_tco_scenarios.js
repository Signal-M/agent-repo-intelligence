#!/usr/bin/env node
'use strict';

const fs = require('fs');

const REQUIRED = [
  'taskVolume', 'eligibleShare', 'adoptionRate', 'minutesSavedPerTask',
  'loadedLaborCostPerHour', 'realizationFactor', 'variableCostPerTask',
  'reviewShare', 'reviewMinutes', 'reviewerCostPerHour', 'annualizedFixedCost',
  'severeFailureProbability', 'averageSevereImpact',
  'moderateFailureProbability', 'averageReworkCost'
];
const RATES = new Set([
  'eligibleShare', 'adoptionRate', 'realizationFactor', 'reviewShare',
  'severeFailureProbability', 'moderateFailureProbability'
]);

function usage() {
  process.stderr.write('Usage: node calculate_tco_scenarios.js <business-case.json> [--out result.json]\n');
  process.exit(2);
}

function round(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function validateInputs(inputs, label) {
  const errors = [];
  REQUIRED.forEach(key => {
    const value = inputs[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) errors.push(`${label}.${key} must be a finite number`);
    else if (value < 0) errors.push(`${label}.${key} must be non-negative`);
    else if (RATES.has(key) && value > 1) errors.push(`${label}.${key} must be between 0 and 1`);
  });
  if (inputs.incrementalQualityValue !== undefined && (typeof inputs.incrementalQualityValue !== 'number' || !Number.isFinite(inputs.incrementalQualityValue))) {
    errors.push(`${label}.incrementalQualityValue must be a finite number when present`);
  }
  return errors;
}

function calculate(name, inputs) {
  const attemptedTasks = inputs.taskVolume * inputs.eligibleShare * inputs.adoptionRate;
  const grossLaborValue = attemptedTasks * inputs.minutesSavedPerTask / 60 * inputs.loadedLaborCostPerHour;
  const incrementalQualityValue = inputs.incrementalQualityValue || 0;
  const realizedValue = (grossLaborValue + incrementalQualityValue) * inputs.realizationFactor;
  const variableCost = attemptedTasks * inputs.variableCostPerTask;
  const humanControlCost = attemptedTasks * inputs.reviewShare * inputs.reviewMinutes / 60 * inputs.reviewerCostPerHour;
  const totalCost = variableCost + humanControlCost + inputs.annualizedFixedCost;
  const expectedSevereLoss = attemptedTasks * inputs.severeFailureProbability * inputs.averageSevereImpact;
  const expectedReworkLoss = attemptedTasks * inputs.moderateFailureProbability * inputs.averageReworkCost;
  const expectedLoss = expectedSevereLoss + expectedReworkLoss;
  const netValue = realizedValue - totalCost - expectedLoss;
  const denominator = totalCost + expectedLoss;

  return {
    name,
    attemptedTasks: round(attemptedTasks),
    grossLaborValue: round(grossLaborValue),
    incrementalQualityValue: round(incrementalQualityValue),
    realizedValue: round(realizedValue),
    variableCost: round(variableCost),
    humanControlCost: round(humanControlCost),
    annualizedFixedCost: round(inputs.annualizedFixedCost),
    totalCost: round(totalCost),
    expectedSevereLoss: round(expectedSevereLoss),
    expectedReworkLoss: round(expectedReworkLoss),
    expectedLoss: round(expectedLoss),
    netValue: round(netValue),
    benefitCostRatio: denominator > 0 ? round(realizedValue / denominator) : null,
    economicsSupported: netValue > 0
  };
}

function main() {
  const args = process.argv.slice(2);
  if (!args.length) usage();
  const inputFile = args[0];
  let outputFile;
  if (args.length > 1) {
    if (args[1] !== '--out' || !args[2] || args.length > 3) usage();
    outputFile = args[2];
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  } catch (error) {
    process.stderr.write(`Invalid JSON or unreadable file: ${error.message}\n`);
    process.exit(1);
  }

  const economics = data.economics || data;
  if (!economics || !Array.isArray(economics.scenarios) || economics.scenarios.length === 0) {
    process.stderr.write('economics.scenarios must be a non-empty array\n');
    process.exit(1);
  }

  const errors = [];
  const names = new Set();
  economics.scenarios.forEach((scenario, index) => {
    const name = scenario && scenario.name;
    if (typeof name !== 'string' || !name.trim()) errors.push(`economics.scenarios[${index}].name must be a non-empty string`);
    else if (names.has(name)) errors.push(`duplicate scenario name: ${name}`);
    else names.add(name);
    if (!scenario || typeof scenario.inputs !== 'object' || Array.isArray(scenario.inputs)) errors.push(`economics.scenarios[${index}].inputs must be an object`);
    else errors.push(...validateInputs(scenario.inputs, `economics.scenarios[${index}].inputs`));
  });
  if (errors.length) {
    process.stderr.write(`TCO calculation failed with ${errors.length} error(s):\n`);
    errors.forEach(error => process.stderr.write(`- ${error}\n`));
    process.exit(1);
  }

  const result = {
    currency: economics.currency || 'unspecified',
    horizonMonths: economics.horizonMonths || 12,
    scenarios: economics.scenarios.map(item => calculate(item.name, item.inputs))
  };
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (outputFile) fs.writeFileSync(outputFile, serialized, 'utf8');
  else process.stdout.write(serialized);
}

main();
