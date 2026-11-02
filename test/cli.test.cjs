'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const cli = path.resolve(__dirname, '../bin/cli.cjs');
function run(args, cwd) {
  return spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8' });
}
test('help and version work', () => {
  const help = run(['--help'], process.cwd());
  assert.equal(help.status, 0, help.stderr);
  assert.match(help.stdout, /Usage:/);
  const version = run(['--version'], process.cwd());
  assert.equal(version.status, 0, version.stderr);
  assert.match(version.stdout.trim(), /^\d+\.\d+\.\d+$/);
});
test('project install places the skill in Claude Code discovery path', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'intract-install-'));
  try {
    const result = run(['install', '--agent', 'claude-code', '--project-dir', temp], temp);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(temp, '.claude', 'skills', 'intract', 'SKILL.md')));
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
test('existing installation is preserved unless --force is supplied', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'intract-overwrite-'));
  try {
    const target = path.join(temp, '.claude', 'skills', 'intract');
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'preserve.txt'), 'keep');
    const result = run(['install', '--agent', 'claude-code', '--project-dir', temp], temp);
    assert.equal(result.status, 1);
    assert.ok(fs.existsSync(path.join(target, 'preserve.txt')));
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
test('non-interactive uninstall requires explicit confirmation', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'intract-uninstall-'));
  try {
    const target = path.join(temp, '.claude', 'skills', 'intract');
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, 'SKILL.md'), 'test');
    const result = run(['uninstall', '--agent', 'claude-code', '--project-dir', temp], temp);
    assert.equal(result.status, 1);
    assert.ok(fs.existsSync(target));
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
