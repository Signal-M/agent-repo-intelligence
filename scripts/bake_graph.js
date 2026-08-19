#!/usr/bin/env node
'use strict';

const fs = require('fs');

const COLORS = {
  interface: '#175cff', runtime: '#ff6b35', model: '#7c3aed', tool: '#087f5b',
  data: '#0086b3', integration: '#c2417d', control: '#b42318', concept: '#607083',
  app: '#175cff', sdk: '#087f5b', operator: '#ff6b35', 'agent-infra': '#b42318'
};
const FALLBACK_COLORS = ['#175cff', '#ff6b35', '#7c3aed', '#0086b3', '#087f5b', '#c2417d', '#b42318'];
const NODE_RADIUS = 14;
const PADDING = 42;
const MAX_NODES = 120;

function textEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function attrEscape(value) {
  return textEscape(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function displayUnits(value) {
  return Array.from(String(value)).reduce((sum, character) => sum + (/[^\u0000-\u00ff]/.test(character) ? 2 : 1), 0);
}

function hash(value) {
  let result = 2166136261;
  for (const character of String(value)) {
    result ^= character.codePointAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function colorFor(category) {
  return COLORS[category] || FALLBACK_COLORS[hash(category || 'concept') % FALLBACK_COLORS.length];
}

function seededRandom(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function validateGraph(graph) {
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    throw new Error('Expected graph.nodes and graph.edges arrays');
  }
  if (graph.nodes.length === 0) throw new Error('Cannot render an empty graph');
  if (graph.nodes.length > MAX_NODES) {
    throw new Error(`Graph has ${graph.nodes.length} nodes; aggregate it to ${MAX_NODES} or fewer before rendering`);
  }
  const ids = new Set();
  graph.nodes.forEach((node, index) => {
    if (!node || typeof node.id !== 'string' || !node.id.trim()) throw new Error(`graph.nodes[${index}].id must be a non-empty string`);
    if (ids.has(node.id)) throw new Error(`Duplicate graph node id: ${node.id}`);
    ids.add(node.id);
  });
  graph.edges.forEach((edge, index) => {
    if (!edge || !ids.has(edge.s) || !ids.has(edge.t)) throw new Error(`graph.edges[${index}] references an unknown node`);
  });
}

function layout(nodes, edges) {
  const random = seededRandom(0x9e3779b9);
  const positions = {};
  const velocities = {};
  const count = nodes.length;

  nodes.forEach((node, index) => {
    const angle = (index / count) * Math.PI * 2;
    const radius = 90 + Math.sqrt(count) * 20;
    positions[node.id] = {
      x: Math.cos(angle) * radius + (random() * 18 - 9),
      y: Math.sin(angle) * radius + (random() * 18 - 9)
    };
    velocities[node.id] = { x: 0, y: 0 };
  });

  const iterations = Math.min(520, 240 + count * 5);
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const forces = {};
    nodes.forEach(node => { forces[node.id] = { x: 0, y: 0 }; });

    for (let leftIndex = 0; leftIndex < count; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < count; rightIndex += 1) {
        const left = positions[nodes[leftIndex].id];
        const right = positions[nodes[rightIndex].id];
        let dx = left.x - right.x;
        let dy = left.y - right.y;
        let distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < 1) {
          dx = random() - 0.5;
          dy = random() - 0.5;
          distanceSquared = Math.max(1, dx * dx + dy * dy);
        }
        const distance = Math.sqrt(distanceSquared);
        const repulsion = Math.min(36, 9000 / distanceSquared);
        const fx = dx / distance * repulsion;
        const fy = dy / distance * repulsion;
        forces[nodes[leftIndex].id].x += fx;
        forces[nodes[leftIndex].id].y += fy;
        forces[nodes[rightIndex].id].x -= fx;
        forces[nodes[rightIndex].id].y -= fy;
      }
    }

    edges.forEach(edge => {
      if (edge.s === edge.t) return;
      const source = positions[edge.s];
      const target = positions[edge.t];
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const strength = 0.018 * (distance - 100);
      const fx = dx / distance * strength;
      const fy = dy / distance * strength;
      forces[edge.s].x += fx;
      forces[edge.s].y += fy;
      forces[edge.t].x -= fx;
      forces[edge.t].y -= fy;
    });

    nodes.forEach(node => {
      const id = node.id;
      forces[id].x -= positions[id].x * 0.008;
      forces[id].y -= positions[id].y * 0.008;
      velocities[id].x = (velocities[id].x + forces[id].x) * 0.82;
      velocities[id].y = (velocities[id].y + forces[id].y) * 0.82;
      const speed = Math.sqrt(velocities[id].x ** 2 + velocities[id].y ** 2);
      if (speed > 8) {
        velocities[id].x = velocities[id].x / speed * 8;
        velocities[id].y = velocities[id].y / speed * 8;
      }
      positions[id].x += velocities[id].x;
      positions[id].y += velocities[id].y;
    });
  }

  return positions;
}

function render(graph) {
  validateGraph(graph);
  const positions = layout(graph.nodes, graph.edges);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const placed = graph.nodes.map(node => {
    const point = positions[node.id];
    const title = String(node.title || node.id);
    const labelWidth = Math.max(38, displayUnits(title) * 6.4 + 16);
    minX = Math.min(minX, point.x - NODE_RADIUS, point.x - labelWidth / 2);
    maxX = Math.max(maxX, point.x + NODE_RADIUS, point.x + labelWidth / 2);
    minY = Math.min(minY, point.y - NODE_RADIUS);
    maxY = Math.max(maxY, point.y + 36);
    return { node, point, title, labelWidth };
  });

  const viewBox = [minX - PADDING, minY - PADDING, maxX - minX + PADDING * 2, maxY - minY + PADDING * 2];
  const output = [];
  output.push(`<svg id="repo-graph" class="chart" role="img" aria-label="Repository capability and dependency graph" viewBox="${viewBox.map(value => value.toFixed(1)).join(' ')}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`);
  output.push('  <title>Repository capability and dependency graph</title>');
  output.push('  <g class="graph-edges">');
  graph.edges.forEach(edge => {
    const source = positions[edge.s];
    const target = positions[edge.t];
    output.push(`    <line data-s="${attrEscape(edge.s)}" data-t="${attrEscape(edge.t)}" data-kind="${attrEscape(edge.kind || 'related')}" x1="${source.x.toFixed(1)}" y1="${source.y.toFixed(1)}" x2="${target.x.toFixed(1)}" y2="${target.y.toFixed(1)}" stroke="#b8c2d8" stroke-width="1.4"/>`);
  });
  output.push('  </g>');
  output.push('  <g class="graph-nodes">');
  placed.forEach(({ node, point, title, labelWidth }) => {
    output.push(`    <g class="gnode" data-id="${attrEscape(node.id)}" data-title="${attrEscape(title)}" transform="translate(${point.x.toFixed(1)},${point.y.toFixed(1)})">`);
    output.push(`      <circle r="${NODE_RADIUS}" fill="${colorFor(node.category)}"/>`);
    output.push(`      <rect x="${(-labelWidth / 2).toFixed(1)}" y="17" width="${labelWidth.toFixed(1)}" height="17" rx="4" fill="#fff" stroke="#c7d0e6"/>`);
    output.push(`      <text x="0" y="29" font-size="11" text-anchor="middle" fill="#172033">${textEscape(title)}</text>`);
    output.push('    </g>');
  });
  output.push('  </g>');
  output.push('</svg>');
  return output.join('\n');
}

function main() {
  try {
    const args = process.argv.slice(2);
    let inputFile;
    let outputFile;
    for (let index = 0; index < args.length; index += 1) {
      if (args[index] === '--out') {
        outputFile = args[++index];
        if (!outputFile) throw new Error('--out requires a file path');
      }
      else if (!inputFile) inputFile = args[index];
      else throw new Error(`Unexpected argument: ${args[index]}`);
    }
    const raw = inputFile && inputFile !== '-' ? fs.readFileSync(inputFile, 'utf8') : fs.readFileSync(0, 'utf8');
    const data = JSON.parse(raw);
    const svg = render(data.graph || data);
    if (outputFile) fs.writeFileSync(outputFile, `${svg}\n`, 'utf8');
    else process.stdout.write(`${svg}\n`);
  } catch (error) {
    process.stderr.write(`bake_graph: ${error.message}\n`);
    process.exit(1);
  }
}

main();
