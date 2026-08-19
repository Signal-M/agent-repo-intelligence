#!/usr/bin/env node
'use strict';

const fs = require('fs');

const COLORS = ['#175cff', '#ff6b35', '#7c3aed', '#0086b3', '#087f5b', '#c2417d', '#b42318'];
const WIDTH = 1000;
const SIDE_PADDING = 28;
const TOP_PADDING = 20;
const BOTTOM_PADDING = 20;
const HEADER_HEIGHT = 36;
const BOX_HEIGHT = 58;
const BOX_GAP = 16;
const ROW_GAP = 12;
const BAND_BOTTOM = 18;
const BETWEEN_BANDS = 30;
const MAX_COLUMNS = 5;
const MAX_BOX_WIDTH = 220;

function textEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function attrEscape(value) {
  return textEscape(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function units(character) {
  return /[^\u0000-\u00ff]/.test(character) ? 2 : 1;
}

function truncate(value, maxUnits) {
  const characters = Array.from(String(value));
  let used = 0;
  let output = '';
  for (const character of characters) {
    const next = units(character);
    if (used + next > maxUnits) return `${output}…`;
    output += character;
    used += next;
  }
  return output;
}

function validate(layers) {
  if (!Array.isArray(layers) || layers.length === 0) throw new Error('Expected architecture.layers to be a non-empty array');
  const ids = new Set();
  layers.forEach((layer, layerIndex) => {
    if (!layer || typeof layer.label !== 'string' || !layer.label.trim()) throw new Error(`layers[${layerIndex}].label must be a non-empty string`);
    const boxes = layer.boxes || layer.nodes;
    if (!Array.isArray(boxes)) throw new Error(`layers[${layerIndex}].boxes must be an array`);
    boxes.forEach((box, boxIndex) => {
      if (!box || typeof box.id !== 'string' || !box.id.trim()) throw new Error(`layers[${layerIndex}].boxes[${boxIndex}].id must be a non-empty string`);
      if (ids.has(box.id)) throw new Error(`Duplicate architecture box id: ${box.id}`);
      ids.add(box.id);
    });
  });
}

function prepare(layers) {
  let cursorY = TOP_PADDING;
  return layers.map((layer, index) => {
    const boxes = layer.boxes || layer.nodes;
    const columns = Math.max(1, Math.min(MAX_COLUMNS, boxes.length || 1));
    const rows = Math.max(1, Math.ceil(boxes.length / columns));
    const bandHeight = HEADER_HEIGHT + rows * BOX_HEIGHT + Math.max(0, rows - 1) * ROW_GAP + BAND_BOTTOM;
    const placed = { layer, boxes, columns, rows, top: cursorY, height: bandHeight, color: COLORS[index % COLORS.length] };
    cursorY += bandHeight + (index < layers.length - 1 ? BETWEEN_BANDS : 0);
    return placed;
  });
}

function render(layers) {
  validate(layers);
  const prepared = prepare(layers);
  const totalHeight = prepared[prepared.length - 1].top + prepared[prepared.length - 1].height + BOTTOM_PADDING;
  const output = [];
  output.push(`<svg id="repo-arch" class="chart" role="img" aria-label="Layered repository architecture" viewBox="0 0 ${WIDTH} ${totalHeight}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`);
  output.push('  <title>Layered repository architecture</title>');
  output.push('  <defs><marker id="repo-arch-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#8b98b3"/></marker></defs>');

  prepared.forEach((item, layerIndex) => {
    const { layer, boxes, columns, top, height, color } = item;
    output.push(`  <g class="arch-layer" data-layer="${attrEscape(layer.label)}">`);
    output.push(`    <rect x="0" y="${top}" width="${WIDTH}" height="${height}" rx="4" fill="${color}" fill-opacity="0.06"/>`);
    output.push(`    <rect x="0" y="${top}" width="6" height="${height}" rx="3" fill="${color}"/>`);
    output.push(`    <text x="16" y="${top + 23}" font-size="14" font-weight="700" fill="${color}">${textEscape(layer.label)}</text>`);

    if (boxes.length === 0) {
      output.push(`    <text x="${WIDTH / 2}" y="${top + HEADER_HEIGHT + 34}" font-size="13" text-anchor="middle" fill="#64748b">No mapped modules</text>`);
    } else {
      const boxWidth = Math.min(MAX_BOX_WIDTH, (WIDTH - SIDE_PADDING * 2 - BOX_GAP * (columns - 1)) / columns);
      boxes.forEach((box, boxIndex) => {
        const row = Math.floor(boxIndex / columns);
        const column = boxIndex % columns;
        const boxesInRow = Math.min(columns, boxes.length - row * columns);
        const rowWidth = boxesInRow * boxWidth + Math.max(0, boxesInRow - 1) * BOX_GAP;
        const rowStart = (WIDTH - rowWidth) / 2;
        const x = rowStart + column * (boxWidth + BOX_GAP);
        const y = top + HEADER_HEIGHT + row * (BOX_HEIGHT + ROW_GAP);
        const titleLimit = Math.max(8, Math.floor(boxWidth / 7));
        const subLimit = Math.max(10, Math.floor(boxWidth / 6));
        output.push(`    <g class="abox" data-id="${attrEscape(box.id)}" data-title="${attrEscape(box.title || box.id)}" transform="translate(${x.toFixed(1)},${y})">`);
        output.push(`      <rect width="${boxWidth.toFixed(1)}" height="${BOX_HEIGHT}" rx="4" fill="#fff" stroke="${color}" stroke-opacity="0.55"/>`);
        output.push(`      <text x="${(boxWidth / 2).toFixed(1)}" y="24" font-size="13" font-weight="600" text-anchor="middle" fill="#172033">${textEscape(truncate(box.title || box.id, titleLimit))}</text>`);
        if (box.sub) output.push(`      <text x="${(boxWidth / 2).toFixed(1)}" y="43" font-size="11" text-anchor="middle" fill="#5f6b7a">${textEscape(truncate(box.sub, subLimit))}</text>`);
        output.push('    </g>');
      });
    }
    output.push('  </g>');

    if (layerIndex < prepared.length - 1) {
      const next = prepared[layerIndex + 1];
      output.push(`  <line x1="${WIDTH / 2}" y1="${top + height + 4}" x2="${WIDTH / 2}" y2="${next.top - 6}" stroke="#8b98b3" stroke-width="1.6" marker-end="url(#repo-arch-arrow)"/>`);
    }
  });

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
    const architecture = data.architecture || data;
    const svg = render(architecture.layers);
    if (outputFile) fs.writeFileSync(outputFile, `${svg}\n`, 'utf8');
    else process.stdout.write(`${svg}\n`);
  } catch (error) {
    process.stderr.write(`bake_arch: ${error.message}\n`);
    process.exit(1);
  }
}

main();
