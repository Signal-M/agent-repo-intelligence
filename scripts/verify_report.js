#!/usr/bin/env node
'use strict';

const fs = require('fs');

function usage() {
  process.stderr.write('Usage: node verify_report.js <report.html>\n');
  process.exit(2);
}

function main() {
  const file = process.argv[2];
  if (!file || process.argv.length > 3) usage();

  let html;
  try {
    html = fs.readFileSync(file, 'utf8');
  } catch (error) {
    process.stderr.write(`Cannot read report: ${error.message}\n`);
    process.exit(1);
  }

  const errors = [];
  const scanHtml = html.replace(/<!--[\s\S]*?-->/g, '');
  const structuralHtml = scanHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const ids = new Map();
  const idPattern = /\bid\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = idPattern.exec(structuralHtml))) ids.set(match[2], (ids.get(match[2]) || 0) + 1);
  ids.forEach((count, id) => { if (count > 1) errors.push(`duplicate id '${id}' appears ${count} times`); });

  const labelTargets = [];
  const labelPattern = /<label\b[^>]*\bfor\s*=\s*(["'])(.*?)\1[^>]*>/gi;
  while ((match = labelPattern.exec(structuralHtml))) labelTargets.push(match[2]);
  labelTargets.forEach(target => { if (!ids.has(target)) errors.push(`label references missing id '${target}'`); });

  const tabIds = [];
  const inputPattern = /<input\b[^>]*>/gi;
  while ((match = inputPattern.exec(structuralHtml))) {
    const tag = match[0];
    const classMatch = tag.match(/\bclass\s*=\s*(["'])(.*?)\1/i);
    if (!classMatch || !classMatch[2].split(/\s+/).includes('tab-toggle')) continue;
    const tabIdMatch = tag.match(/\bid\s*=\s*(["'])(.*?)\1/i);
    if (!tabIdMatch) errors.push('a tab-toggle input is missing an id');
    else tabIds.push(tabIdMatch[2]);
  }
  tabIds.forEach(id => {
    if (!labelTargets.includes(id)) errors.push(`tab '${id}' has no label`);
    const viewId = id.replace(/^tab-/, 'view-');
    if (!ids.has(viewId)) errors.push(`tab '${id}' has no matching view '${viewId}'`);
  });

  if (!ids.has('repo-graph')) errors.push("missing graph SVG id 'repo-graph'");
  if (!ids.has('repo-arch')) errors.push("missing architecture SVG id 'repo-arch'");
  if (!/<html\b[^>]*\blang\s*=\s*(["'])[^"']+\1/i.test(structuralHtml)) errors.push('html must declare a language');
  if (!/<meta\b[^>]*\bname\s*=\s*(["'])viewport\1/i.test(structuralHtml)) errors.push('missing viewport meta tag');
  if (/<script\b[^>]*\bsrc\s*=\s*(["'])https?:\/\//i.test(scanHtml)) errors.push('external script dependency is not allowed');
  if (/<link\b[^>]*\bhref\s*=\s*(["'])https?:\/\//i.test(scanHtml)) errors.push('external stylesheet dependency is not allowed');
  if (/<(?:img|video|audio|source)\b[^>]*\bsrc\s*=\s*(["'])https?:\/\//i.test(scanHtml)) errors.push('external media dependency is not allowed');
  if (/url\(\s*(["']?)https?:\/\//i.test(scanHtml)) errors.push('external CSS asset dependency is not allowed');
  if (!/prefers-reduced-motion/i.test(scanHtml)) errors.push('missing reduced-motion handling');
  if (!/:focus-visible/i.test(scanHtml)) errors.push('missing visible keyboard focus styling');
  if (!/@media\s+print/i.test(scanHtml)) errors.push('missing full-report print styling');
  const bodyTag = structuralHtml.match(/<body\b[^>]*>/i);
  const dialNames = ['design-variance', 'motion-intensity', 'visual-density'];
  dialNames.forEach(name => {
    const dial = bodyTag && bodyTag[0].match(new RegExp(`\\bdata-${name}\\s*=\\s*(["'])(\\d+)\\1`, 'i'));
    if (!dial) errors.push(`body is missing numeric data-${name}`);
    else if (Number(dial[2]) < 1 || Number(dial[2]) > 10) errors.push(`data-${name} must be between 1 and 10`);
  });
  if (!/<a\b[^>]*class\s*=\s*(["'])[^"']*\bskip-link\b[^"']*\1/i.test(structuralHtml)) errors.push('missing keyboard skip link');
  if (/dossier\s*0*1/i.test(structuralHtml)) errors.push('remove fake dossier/version metadata');
  if (/class\s*=\s*(["'])[^"']*\bnav-index\b[^"']*\1/i.test(structuralHtml)) errors.push('remove decorative section-number navigation');

  const scriptPattern = /<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptIndex = 0;
  while ((match = scriptPattern.exec(scanHtml))) {
    scriptIndex += 1;
    try {
      new Function(match[1]);
    } catch (error) {
      errors.push(`inline script ${scriptIndex} has invalid JavaScript: ${error.message}`);
    }
  }

  const openSections = (structuralHtml.match(/<section\b/gi) || []).length;
  const closeSections = (structuralHtml.match(/<\/section>/gi) || []).length;
  if (openSections !== closeSections) errors.push(`section tags are unbalanced: ${openSections} open, ${closeSections} close`);

  ['div', 'article', 'main', 'nav', 'header', 'aside', 'table', 'thead', 'tbody', 'tr'].forEach(tag => {
    const openCount = (structuralHtml.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const closeCount = (structuralHtml.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (openCount !== closeCount) errors.push(`${tag} tags are unbalanced: ${openCount} open, ${closeCount} close`);
  });

  const stylePattern = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let styleCount = 0;
  while ((match = stylePattern.exec(scanHtml))) {
    styleCount += 1;
    const css = match[1].replace(/\/\*[\s\S]*?\*\//g, '').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '');
    let balance = 0;
    for (const character of css) {
      if (character === '{') balance += 1;
      else if (character === '}') balance -= 1;
      if (balance < 0) break;
    }
    if (balance !== 0) errors.push(`style block ${styleCount} has unbalanced braces`);
  }
  if (styleCount === 0) errors.push('missing inline report styles');

  if (errors.length) {
    process.stderr.write(`Report verification failed with ${errors.length} error(s):\n`);
    errors.forEach(error => process.stderr.write(`- ${error}\n`));
    process.exit(1);
  }
  process.stdout.write(`Report verification passed: ${ids.size} unique ids, ${tabIds.length} tabs, ${styleCount} style block(s), ${scriptIndex} inline script(s)\n`);
}

main();
