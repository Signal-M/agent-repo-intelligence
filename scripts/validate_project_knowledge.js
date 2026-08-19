#!/usr/bin/env node
'use strict';

const fs = require('fs');

const MODES = new Set(['quick', 'standard', 'deep', 'comparison']);
const AGENT_RELEVANCE = new Set(['core', 'adjacent', 'none', 'unknown']);
const STATUSES = new Set(['verified', 'inferred', 'unknown', 'conflicted']);
const LEVELS = new Set(['high', 'medium', 'low']);
const DECISIONS = new Set(['adopt', 'prototype', 'watch', 'reject']);

function failUsage() {
  process.stderr.write('Usage: node validate_project_knowledge.js <project-knowledge.json>\n');
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
  if (!file || process.argv.length > 3) failUsage();

  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    process.stderr.write(`Invalid JSON or unreadable file: ${error.message}\n`);
    process.exit(1);
  }

  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };

  check(isObject(data), 'root must be an object');
  if (!isObject(data)) return finish(errors);

  const meta = data.meta;
  check(isObject(meta), 'meta must be an object');
  if (isObject(meta)) {
    check(nonEmpty(meta.repo), 'meta.repo must be a non-empty string');
    check(nonEmpty(meta.commit), 'meta.commit must be a non-empty commit identifier');
    check(/^\d{4}-\d{2}-\d{2}$/.test(meta.analyzedAt || ''), 'meta.analyzedAt must use YYYY-MM-DD');
    check(MODES.has(meta.mode), `meta.mode must be one of: ${[...MODES].join(', ')}`);
    check(Array.isArray(meta.productTypes) && meta.productTypes.length > 0, 'meta.productTypes must be a non-empty array');
    check(AGENT_RELEVANCE.has(meta.agentRelevance), `meta.agentRelevance must be one of: ${[...AGENT_RELEVANCE].join(', ')}`);
    check(Array.isArray(meta.scope), 'meta.scope must be an array');
  }

  const findingIds = new Set();
  check(Array.isArray(data.findings), 'findings must be an array');
  (Array.isArray(data.findings) ? data.findings : []).forEach((finding, index) => {
    const prefix = `findings[${index}]`;
    check(isObject(finding), `${prefix} must be an object`);
    if (!isObject(finding)) return;
    check(nonEmpty(finding.id), `${prefix}.id must be a non-empty string`);
    if (nonEmpty(finding.id)) {
      check(!findingIds.has(finding.id), `${prefix}.id is duplicated: ${finding.id}`);
      findingIds.add(finding.id);
    }
    check(nonEmpty(finding.lens), `${prefix}.lens must be a non-empty string`);
    check(nonEmpty(finding.claim), `${prefix}.claim must be a non-empty string`);
    check(STATUSES.has(finding.status), `${prefix}.status must be one of: ${[...STATUSES].join(', ')}`);
    check(LEVELS.has(finding.confidence), `${prefix}.confidence must be one of: ${[...LEVELS].join(', ')}`);
    check(Array.isArray(finding.evidence), `${prefix}.evidence must be an array`);
    (Array.isArray(finding.evidence) ? finding.evidence : []).forEach((evidence, evidenceIndex) => {
      const evidencePrefix = `${prefix}.evidence[${evidenceIndex}]`;
      check(isObject(evidence), `${evidencePrefix} must be an object`);
      if (!isObject(evidence)) return;
      check(nonEmpty(evidence.source), `${evidencePrefix}.source must be a non-empty string`);
      check(nonEmpty(evidence.location), `${evidencePrefix}.location must be a non-empty string`);
      check(nonEmpty(evidence.note), `${evidencePrefix}.note must be a non-empty string`);
    });
    check(finding.counterevidence === undefined || Array.isArray(finding.counterevidence), `${prefix}.counterevidence must be an array when present`);
  });

  const graph = data.graph;
  if (graph !== undefined) {
    check(isObject(graph), 'graph must be an object when present');
    if (isObject(graph)) {
      check(Array.isArray(graph.nodes), 'graph.nodes must be an array');
      check(Array.isArray(graph.edges), 'graph.edges must be an array');
      const nodeIds = new Set();
      (Array.isArray(graph.nodes) ? graph.nodes : []).forEach((node, index) => {
        const prefix = `graph.nodes[${index}]`;
        check(isObject(node), `${prefix} must be an object`);
        if (!isObject(node)) return;
        check(nonEmpty(node.id), `${prefix}.id must be a non-empty string`);
        if (nonEmpty(node.id)) {
          check(!nodeIds.has(node.id), `${prefix}.id is duplicated: ${node.id}`);
          nodeIds.add(node.id);
        }
        check(nonEmpty(node.title || node.id), `${prefix}.title must be a non-empty string when id is absent`);
      });
      (Array.isArray(graph.edges) ? graph.edges : []).forEach((edge, index) => {
        const prefix = `graph.edges[${index}]`;
        check(isObject(edge), `${prefix} must be an object`);
        if (!isObject(edge)) return;
        check(nodeIds.has(edge.s), `${prefix}.s references an unknown node: ${String(edge.s)}`);
        check(nodeIds.has(edge.t), `${prefix}.t references an unknown node: ${String(edge.t)}`);
      });
    }
  }

  const architecture = data.architecture;
  if (architecture !== undefined) {
    check(isObject(architecture), 'architecture must be an object when present');
    if (isObject(architecture)) {
      check(Array.isArray(architecture.layers), 'architecture.layers must be an array');
      const boxIds = new Set();
      (Array.isArray(architecture.layers) ? architecture.layers : []).forEach((layer, layerIndex) => {
        const prefix = `architecture.layers[${layerIndex}]`;
        check(isObject(layer), `${prefix} must be an object`);
        if (!isObject(layer)) return;
        check(nonEmpty(layer.label), `${prefix}.label must be a non-empty string`);
        const boxes = layer.boxes || layer.nodes;
        check(Array.isArray(boxes), `${prefix}.boxes must be an array`);
        (Array.isArray(boxes) ? boxes : []).forEach((box, boxIndex) => {
          const boxPrefix = `${prefix}.boxes[${boxIndex}]`;
          check(isObject(box), `${boxPrefix} must be an object`);
          if (!isObject(box)) return;
          check(nonEmpty(box.id), `${boxPrefix}.id must be a non-empty string`);
          check(nonEmpty(box.title || box.id), `${boxPrefix}.title must be a non-empty string when id is absent`);
          if (nonEmpty(box.id)) {
            check(!boxIds.has(box.id), `${boxPrefix}.id is duplicated: ${box.id}`);
            boxIds.add(box.id);
          }
        });
      });
    }
  }

  const checkEvidenceIds = (items, label) => {
    check(items === undefined || Array.isArray(items), `${label} must be an array when present`);
    (Array.isArray(items) ? items : []).forEach((item, index) => {
      const ids = item && item.evidenceIds;
      check(Array.isArray(ids), `${label}[${index}].evidenceIds must be an array`);
      (Array.isArray(ids) ? ids : []).forEach(id => {
        check(findingIds.has(id), `${label}[${index}].evidenceIds references an unknown finding: ${id}`);
      });
    });
  };

  checkEvidenceIds(data.coreModules, 'coreModules');
  (Array.isArray(data.coreModules) ? data.coreModules : []).forEach((module, index) => {
    check(LEVELS.has(module.importance), `coreModules[${index}].importance must be high, medium, or low`);
    check(module.score === undefined, `coreModules[${index}].score is not allowed; use an explained importance level`);
  });

  checkEvidenceIds(data.borrowable, 'borrowable');
  (Array.isArray(data.borrowable) ? data.borrowable : []).forEach((item, index) => {
    const prefix = `borrowable[${index}]`;
    check(nonEmpty(item.idea), `${prefix}.idea must be a non-empty string`);
    check(LEVELS.has(item.strategicFit), `${prefix}.strategicFit must be high, medium, or low`);
    check(LEVELS.has(item.cost), `${prefix}.cost must be high, medium, or low`);
    check(DECISIONS.has(item.decision), `${prefix}.decision must be one of: ${[...DECISIONS].join(', ')}`);
    check(nonEmpty(item.experiment), `${prefix}.experiment must be a non-empty string`);
  });

  check(data.unknowns === undefined || Array.isArray(data.unknowns), 'unknowns must be an array when present');
  finish(errors);
}

function finish(errors) {
  if (errors.length) {
    process.stderr.write(`Validation failed with ${errors.length} error(s):\n`);
    errors.forEach(error => process.stderr.write(`- ${error}\n`));
    process.exit(1);
  }
  process.stdout.write('project-knowledge.json is valid\n');
}

main();
