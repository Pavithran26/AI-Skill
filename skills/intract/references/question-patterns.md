# Intract question patterns

Use these as adaptable patterns, not a fixed questionnaire.

## Constructing the four closest options

1. Identify the missing decision that changes the outcome.
2. Generate candidate answers from the user's wording and verified context.
3. Remove duplicates, vague choices, and unsupported possibilities.
4. Rank remaining options by fit and explain the strongest recommendation.
5. Add Something else — type your own answer.

Do not invent four options when fewer genuine alternatives exist.

## Missing source or artifact

Offer only applicable ways to provide the missing information, such as:
- Upload the source file or screenshot.
- Paste the relevant text or error.
- Share an accessible link or repository path.
- Describe expected versus actual behavior.
- Something else — another way to provide the context.

Do not imply that an inaccessible private source was inspected.

## Domain-specific decision prompts

| Domain | Material gaps | Useful option dimensions |
|---|---|---|
| Software build | Outcome, existing codebase, platform, stack, authentication, deployment, acceptance criteria | Architecture, target platform, integration, rollout |
| Debugging | Error, reproduction, expected/actual behavior, runtime, recent changes | Evidence to inspect, likely subsystem, reproduction path |
| AI / LLM | Task, data grounding, tools, latency, cost, privacy, evaluation | RAG, tool use, fine-tuning, deterministic flow |
| Prompt design | Target model, objective, audience, output, constraints | Prompt style, output structure, examples, validation |
| Research | Question, period, geography, source quality, depth | Scope, source class, timeframe, evidence standard |
| Data analysis | Dataset, grain, metric, time range, segments, decision | Metric definition, comparison, segmentation, visualization |
| Product / business | User, problem, segment, constraints, success measure | Target segment, solution path, validation plan |
| Travel / local | Dates, starting point, budget, group, mobility | Area, transport, itinerary style, pace; verify current facts |
| Writing | Audience, purpose, tone, length, format | Tone, format, reading level, point of view |

## When the user is unsure

Explain the trade-offs briefly. Recommend a safe, reversible default when one exists. Ask for a preference only when it genuinely changes the result.

## Partial answers

Retain confirmed parts. Ask only for unresolved details that still materially affect the output.

## Conflicting answers

Treat a clear later instruction as an update. Clarify only when a conflict may be accidental and changes the result materially.

## Refined brief

- Goal:
- Deliverable:
- Context:
- Scope:
- Constraints:
- Success criteria:
- Assumptions / open items:
