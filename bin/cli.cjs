#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const SKILL_SOURCE = path.join(PACKAGE_ROOT, 'skills', 'intract');
const SKILL_NAME = 'intract';
const SUPPORTED_AGENT = 'claude-code';

function help() {
  stdout.write([
    '',
    'ai-skill-intractive — install the Intract agent skill',
    '',
    'Usage:',
    '  npx ai-skill-intractive [install] [options]',
    '  npx ai-skill-intractive status [options]',
    '  npx ai-skill-intractive uninstall [options]',
    '',
    'Options:',
    '  --agent claude-code   Target agent (currently Claude Code)',
    '  --global              Install for your user account',
    '  --project-dir <path>  Project directory (default: current directory)',
    '  --home-dir <path>     Home directory override (useful for tests)',
    '  --force               Back up an existing folder before replacing it',
    '  --yes                 Confirm uninstall in non-interactive mode',
    '  -h, --help            Show help',
    '  -v, --version         Show version',
    '',
    'Examples:',
    '  npx ai-skill-intractive install --agent claude-code',
    '  npx ai-skill-intractive install --agent claude-code --global',
    '  npm install -g ai-skill-intractive',
    '  ai-skill-intractive install --agent claude-code --global',
    ''
  ].join('\n'));
}

function parse(argv) {
  const args = [...argv];
  const commands = new Set(['install', 'status', 'uninstall', 'help']);
  const command = args[0] && commands.has(args[0]) ? args.shift() : 'install';
  const opts = {
    command,
    agent: SUPPORTED_AGENT,
    global: false,
    force: false,
    yes: false,
    projectDir: process.cwd(),
    homeDir: os.homedir()
  };

  while (args.length) {
    const arg = args.shift();
    if (arg === '--global' || arg === '-g') opts.global = true;
    else if (arg === '--force' || arg === '-f') opts.force = true;
    else if (arg === '--yes' || arg === '-y') opts.yes = true;
    else if (arg === '--agent') opts.agent = args.shift();
    else if (arg === '--project-dir') opts.projectDir = args.shift();
    else if (arg === '--home-dir') opts.homeDir = args.shift();
    else if (arg === '--help' || arg === '-h') opts.command = 'help';
    else if (arg === '--version' || arg === '-v') opts.command = 'version';
    else throw new Error('Unknown option: ' + arg);
  }

  if (!opts.agent || !opts.projectDir || !opts.homeDir) {
    throw new Error('A required option value is missing.');
  }
  return opts;
}

function targetPath(opts) {
  const root = opts.global
    ? path.resolve(opts.homeDir, '.claude', 'skills')
    : path.resolve(opts.projectDir, '.claude', 'skills');
  return path.join(root, SKILL_NAME);
}

function assertAgent(agent) {
  if (agent !== SUPPORTED_AGENT) {
    throw new Error('This release supports claude-code only. Unsupported agent: ' + agent);
  }
}

function assertSource() {
  const manifest = path.join(SKILL_SOURCE, 'SKILL.md');
  if (!fs.existsSync(manifest) || !fs.statSync(manifest).isFile()) {
    throw new Error('The package is incomplete: skills/intract/SKILL.md is missing.');
  }
}

async function askToRemove(target, yes) {
  if (yes) return true;
  if (!stdin.isTTY) {
    throw new Error('Uninstall needs confirmation. Re-run with --yes after verifying the path.');
  }
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const answer = await rl.question('Remove only this folder? ' + target + '\nType yes to confirm: ');
    return answer.trim().toLowerCase() === 'yes';
  } finally {
    rl.close();
  }
}

async function main() {
  const opts = parse(process.argv.slice(2));

  if (opts.command === 'help') return help();
  if (opts.command === 'version') {
    const pkg = require(path.join(PACKAGE_ROOT, 'package.json'));
    stdout.write(pkg.version + '\n');
    return;
  }

  assertAgent(opts.agent);
  const target = targetPath(opts);

  if (opts.command === 'status') {
    stdout.write(fs.existsSync(path.join(target, 'SKILL.md'))
      ? 'Intract is installed at:\n' + target + '\n'
      : 'Intract is not installed at:\n' + target + '\n');
    return;
  }

  if (opts.command === 'uninstall') {
    if (!fs.existsSync(target)) {
      stdout.write('No Intract installation found at:\n' + target + '\n');
      return;
    }
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error('Refusing to remove a non-directory or symbolic-link target: ' + target);
    }
    if (!(await askToRemove(target, opts.yes))) {
      stdout.write('Uninstall cancelled.\n');
      return;
    }
    fs.rmSync(target, { recursive: true, force: false });
    stdout.write('Removed Intract from:\n' + target + '\n');
    return;
  }

  assertSource();
  fs.mkdirSync(path.dirname(target), { recursive: true });

  if (fs.existsSync(target)) {
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error('Refusing to replace a file or symbolic link: ' + target);
    }
    if (!opts.force) {
      throw new Error('Intract already exists at ' + target + '. Use --force to back it up and replace it.');
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = target + '.backup-' + stamp;
    fs.renameSync(target, backup);
    stdout.write('Previous installation backed up to: ' + backup + '\n');
  }

  fs.cpSync(SKILL_SOURCE, target, { recursive: true, errorOnExist: true, force: false });
  if (!fs.existsSync(path.join(target, 'SKILL.md'))) {
    throw new Error('Install verification failed: SKILL.md is missing from the destination.');
  }

  stdout.write('\nIntract installed for Claude Code.\n');
  stdout.write('Path: ' + target + '\n');
  stdout.write('Invoke inside Claude Code with: /intract\n');
  stdout.write(opts.global
    ? 'User-level install: available across projects for this OS account.\n'
    : 'Project-level install: commit .claude/skills/intract to share it with your team.\n');
}

main().catch((error) => {
  console.error('\nError: ' + error.message + '\n');
  process.exitCode = 1;
});
