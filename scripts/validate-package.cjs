'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = require(path.join(root, 'package.json'));
const required = [
  'bin/cli.cjs',
  'skills/intract/SKILL.md',
  'skills/intract/references/question-patterns.md',
  'skills/intract/references/evaluation-guide.md',
  'skills/intract/evals/scenarios.json'
];
if (pkg.name !== 'ai-skill-intractive') throw new Error('Unexpected npm package name.');
if (!pkg.bin || !pkg.bin['ai-skill-intractive'] || !pkg.bin.intract) throw new Error('CLI binaries are not declared.');
if (Number(process.versions.node.split('.')[0]) < 18) throw new Error('Node.js 18 or newer is required.');
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error('Missing package file: ' + file);
}
const skill = fs.readFileSync(path.join(root, 'skills/intract/SKILL.md'), 'utf8');
if (!skill.startsWith('---\n') || !/^name:\s*intract\s*$/m.test(skill)) throw new Error('Invalid Intract frontmatter.');
const description = skill.match(/^description:\s*(.+)$/m)?.[1] || '';
if (!description || description.length > 200) throw new Error('Skill description must be 1–200 characters.');
const scenarios = JSON.parse(fs.readFileSync(path.join(root, 'skills/intract/evals/scenarios.json'), 'utf8'));
if (!Array.isArray(scenarios) || scenarios.length < 8) throw new Error('Expected at least eight evaluation scenarios.');
console.log('Package validation passed: ' + pkg.name + '@' + pkg.version);
