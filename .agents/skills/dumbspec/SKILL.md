---
name: dumbspec
description: A structured, staged workflow for turning a raw user request into a researched specification and an executable work plan.

disable-model-invocation: true
user-invocable: true
---

# Spec Process

A staged workflow that takes a raw user request and turns it into a researched, reviewed specification with an executable work plan. Work proceeds in discrete stages; each stage has a single artifact and a clear gate before the next stage begins.

## Hard rules (ordering)

These are non-negotiable and override any urge to "be helpful" by jumping ahead:

- **New tasks only:** MUST create `draft.md` (step 2) **before** doing ANY research, analysis, or reading of source code. The first action on a NEW task is always writing the raw input into `draft.md`.
- **Resuming:** when continuing an existing task, do NOT recreate or overwrite its files. Determine the current stage from which files already exist (see "Resuming an existing task") and continue from there.
- **DO NOT** begin research (step 4) until `draft.md` exists and the refinement gate (step 3) has been passed.
- **Immediate `research.md` appends:** every time you find something useful for the task — a critical technical constraint, a file path, a method signature, or any other relevant detail — you MUST immediately append it to `research.md` (a file append operation). Do not defer this to the end of the step and do not batch findings in your head.
- Each stage MUST be completed before the next begins; do not merge stages or write later artifacts before their inputs exist.
- The only way to skip a gate is an explicit user instruction (e.g. "run it fully autonomously"); never assume autonomy on your own.

## Directory layout

Specs live in `.dumbspec/`: active tasks in `current/<task-tag>/`, completed/frozen tasks move to `archive/<task-tag>/`. See `.dumbspec/AGENTS.md` for the full layout, tag rules, and per-task file conventions.

## Language

- **User-facing content** is written in the user's language — the language they use when talking to you. This includes `draft.md`, `spec.md`, and every question, confirmation, or message directed at the user.
- **Internal artifacts** are written in English: `research.md` and `plan.md`.

Detect the user's language from their messages and keep it consistent throughout a task. If unsure, ask once.

## Plan format (`plan.md`)

`plan.md` is a **living progress journal**: its checkboxes are updated as work proceeds, not written once and frozen. Every stage follows TDD (failing test → implementation → refactor) and ends with a commit. Use this template:

```
# <task-tag>: implementation plan (<short name>)

Spec — [spec.md](./spec.md); research — [research.md](./research.md).

**Format:** each stage = TDD (red test → green implementation → refactor) + a commit at the end.
This file is a **living progress journal** — update statuses as work proceeds.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done.

---

## Stage 0 — Research + spec + plan
- [x] <concrete step>
- [x] <concrete step>

**Criterion:** <observable acceptance criterion for the stage>
**Commit:** `<type>(<scope>): <summary>`

## Stage N — <stage name>
- [x] <concrete step>
- [~] <concrete step>
- [ ] <concrete step>

**Criterion:** <observable acceptance criterion for the stage>
**Commit:** N/A 
```

Rules:
- One `## Stage` heading per work stage; each stage is independently committable.
- Each stage lists concrete checkbox steps, then a **Criterion** (how you know the stage is done) and a **Commit** line. The **Commit** line stays empty until the stage is actually executed — fill in the real conventional-commit message only when that stage's checkboxes are `[x]` (a not-yet-done stage has no commit).
- Start with **Stage 0** covering research + spec + plan itself.
- Update checkboxes in place as work progresses; do not rewrite the whole file.

## Process

1. **Capture input.** Receive the user's request. If the user did not specify a task tag (for example `v2`), invent one yourself using the tag rules above.
2. **Create or update `draft.md`.** **MUST be the first file written on a new task.** Record the raw input verbatim. Do not rewrite, summarize, or interpret at this stage — no research, no source reading, no "let me check how it works" before this file exists.
3. **Confirm refinement.** Ask the user whether to refine the draft before proceeding. Apply any requested edits to `draft.md`.
4. **Research.** Begin only after step 3 is passed. Investigate feasibility, constraints, and options. **Important:** update `research.md` continuously as you go — do not defer writing findings until the end, so nothing is lost after context compaction.
5. **Write the specification.** Produce `spec.md` from the draft together with the research results. Note that some items may turn out to be infeasible or costly based on the research; reflect this honestly in the spec.
6. **Review the specification.** Work through `spec.md` and resolve any open questions or problems.
7. **Write the plan.** If no blocking questions or problems remain, produce `plan.md`.
8. **Execute after confirmation.** Begin execution only once the user has confirmed the plan.

## Resuming an existing task

The user may point at an existing task by its directory (`current/<task-tag>/` under `.dumbspec/`) or a file inside it (e.g. `.../draft.md`). In that case the task is **not** new — do not restart from step 1 and do not overwrite existing artifacts unless explicitly asked. Instead, inspect the task directory and resume from the stage indicated by which files already exist:

| Files present in the task dir | Current stage            | Continue with                    |
| ----------------------------- | ------------------------ | -------------------------------- |
| only `draft.md`               | draft (steps 2–3)        | refine / confirm the draft       |
| `draft.md` + `research.md`    | research (step 4)        | finish research, then write spec |
| … + `spec.md`                 | specification (steps 5–6)| review the specification         |
| … + `plan.md`                 | plan (steps 7–8)         | execute after confirmation       |

If a file exists but is clearly incomplete, continue it in place rather than rewriting from scratch. If the stage is ambiguous, state your read of the current stage and confirm before proceeding.

## Notes

- Commit the task (the plan) before executing it, to freeze the agreed scope.
- Commit at the end of each major stage of the work.
- Using a todo list and/or goal tools is recommended but not required; what matters is that progress is recorded in `plan.md`.
