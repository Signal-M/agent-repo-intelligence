#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function main() {
  const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  const errors = [];
  const skillPath = path.join(root, 'SKILL.md');
  if (!fs.existsSync(skillPath)) return fail(['SKILL.md is missing']);

  const skill = fs.readFileSync(skillPath, 'utf8');
  const lines = skill.split(/\r?\n/);
  if (lines[0] !== '---') errors.push('SKILL.md must start with YAML frontmatter');
  const closing = lines.indexOf('---', 1);
  if (closing < 0) errors.push('SKILL.md frontmatter is not closed');

  const frontmatter = closing > 0 ? lines.slice(1, closing) : [];
  const fields = {};
  frontmatter.forEach((line, index) => {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.+)$/);
    if (!match) errors.push(`frontmatter line ${index + 2} is not a simple key/value`);
    else fields[match[1]] = match[2].trim();
  });
  const keys = Object.keys(fields);
  keys.forEach(key => { if (!['name', 'description'].includes(key)) errors.push(`unsupported frontmatter field: ${key}`); });
  if (!fields.name || !/^[a-z0-9-]{1,64}$/.test(fields.name)) errors.push('name must use lowercase letters, digits, and hyphens and be at most 64 characters');
  if (!fields.description || fields.description.length < 40) errors.push('description must be a substantive non-empty trigger description');
  if (fields.name && path.basename(root) !== fields.name) errors.push(`skill directory '${path.basename(root)}' must match name '${fields.name}'`);
  if (lines.length > 500) errors.push(`SKILL.md has ${lines.length} lines; keep it under 500`);

  const referenced = new Set();
  const resourcePattern = /`((?:references|scripts|assets)\/[A-Za-z0-9._/-]+)`/g;
  let match;
  while ((match = resourcePattern.exec(skill))) referenced.add(match[1]);
  referenced.forEach(relative => {
    if (!fs.existsSync(path.join(root, relative))) errors.push(`referenced resource is missing: ${relative}`);
  });

  const agentPath = path.join(root, 'agents', 'openai.yaml');
  if (!fs.existsSync(agentPath)) errors.push('agents/openai.yaml is missing');
  else {
    const agent = fs.readFileSync(agentPath, 'utf8');
    ['display_name', 'short_description', 'default_prompt'].forEach(key => {
      if (!new RegExp(`^\\s*${key}:\\s*"[^"]+"\\s*$`, 'm').test(agent)) errors.push(`agents/openai.yaml must contain quoted ${key}`);
    });
    if (fields.name && !agent.includes(`$${fields.name}`)) errors.push('agents/openai.yaml default_prompt must mention the skill with $name');
    const short = agent.match(/^\s*short_description:\s*"([^"]+)"\s*$/m);
    if (short && (Array.from(short[1]).length < 25 || Array.from(short[1]).length > 64)) errors.push('short_description must be 25–64 characters');
  }

  if (errors.length) fail(errors);
  process.stdout.write(`skill structure is valid: ${lines.length} SKILL.md lines, ${referenced.size} referenced resources\n`);
}

function fail(errors) {
  process.stderr.write(`Skill validation failed with ${errors.length} error(s):\n`);
  errors.forEach(error => process.stderr.write(`- ${error}\n`));
  process.exit(1);
}

main();
