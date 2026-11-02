# AI-Skill

AI-Skill is a small collection of reusable agent skills. Its first skill is **Intract**: an adaptive clarification workflow that helps an AI assistant understand the user's actual intent before making material assumptions.

## Intract

Intract helps an assistant:

- Detect ambiguity that could materially change an answer or implementation.
- Verify accessible facts and inspect files before asking the user.
- Ask adaptive follow-up questions until the task is clear enough, without an arbitrary round limit.
- Present the four closest grounded options when four genuine options exist, plus a free-text **Something else** option.
- Recommend the best-supported option and explain why.
- Separate verified facts, assumptions, unknowns, and closest matches.
- Produce a refined brief, then continue with the task already authorized by the user.

Intract reduces hallucination risk; it cannot guarantee hallucination-free output. Factual claims and tool actions still need verification.

## Install with npm

The package name is ai-skill-intractive, and its CLI installs the skill into Claude Code.

### One-time use with npx

Project install (current project):

    npx ai-skill-intractive install --agent claude-code

User-wide install (all projects for your OS account):

    npx ai-skill-intractive install --agent claude-code --global

### Install the CLI globally

    npm install -g ai-skill-intractive
    ai-skill-intractive install --agent claude-code --global

You can also use the short alias:

    intract install --agent claude-code --global

### Important: npm install versus skill installation

Running npm install ai-skill-intractive adds the CLI package to the current Node.js project. It does not automatically install an agent skill. Run the CLI after npm install:

    npx ai-skill-intractive install --agent claude-code

This is intentional: package installation and copying a skill into an agent's discovery folder are separate operations.

### Other CLI commands

    npx ai-skill-intractive status --agent claude-code
    npx ai-skill-intractive uninstall --agent claude-code --yes
    npx ai-skill-intractive --help

By default, install targets the current project's .claude/skills/intract directory. Add --global to target the user's ~/.claude/skills/intract directory. Existing installations are never silently overwritten: use --force to move the old folder to a timestamped backup before replacing it. Uninstall targets only the Intract skill folder and requires explicit confirmation.

## Install manually in Claude Code

Project-level location:

    .claude/skills/intract/SKILL.md

User-level location:

    ~/.claude/skills/intract/SKILL.md

Copy the complete skills/intract directory into the desired location. Invoke it in Claude Code using /intract.

## Upload to Claude.ai

Claude.ai custom Skills use a ZIP upload rather than the npm CLI. Upload a ZIP whose root contains an intract folder with SKILL.md and the referenced resources. The ZIP distributed in GitHub releases is intended for this upload flow. Claude Code and Claude.ai are separate installation targets.

## Development

Requires Node.js 18 or newer. No runtime npm dependencies are required.

    npm test
    npm run validate
    npm pack --dry-run

The package runs validation during npm pack and npm publish through the prepack lifecycle.

## Publishing to npm

Before publishing, verify that the exact unscoped package name is available:

    npm view ai-skill-intractive

If npm returns package metadata, the name is already taken; select a new available name and update package.json and README. If it returns E404, the name is available at the time of checking, but recheck immediately before publishing.

To publish the first public version from an npm-authenticated maintainer account:

    npm login
    npm publish --access public

npm requires a valid account and publishing authentication; account-level 2FA or an appropriately configured granular access token may be required. Do not put an npm token in source code or commit it to GitHub.

### Automated publishing with GitHub Actions

The repository includes a tag-triggered workflow at .github/workflows/publish-npm.yml. For secure OIDC publishing:

1. Publish the package once manually, so the npm package exists.
2. In npmjs.com, open the package settings and add a GitHub Actions trusted publisher.
3. Set owner to Pavithran26, repository to AI-Skill, and workflow filename to publish-npm.yml.
4. Allow direct npm publish for that trusted publisher.
5. Create and push a version tag, for example v0.1.0, after the version in package.json is ready.

The workflow runs validation and tests before publishing. npm Trusted Publishing requires a supported npm CLI and GitHub-hosted runner; setup is described in the official npm documentation.

## Repository structure

    AI-Skill/
    ├── bin/cli.cjs
    ├── skills/intract/SKILL.md
    ├── skills/intract/references/
    ├── skills/intract/evals/scenarios.json
    ├── scripts/validate-package.cjs
    ├── test/cli.test.cjs
    ├── .github/workflows/publish-npm.yml
    ├── package.json
    └── README.md

## Scope

Intract is a skill—structured instructions for an agent—not a separate foundation model, fact-checking engine, or guarantee of correct answers. Its behavior depends on the host model, available tools, context, and sources.
