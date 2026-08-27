# .dumbspec — dumbspec task specs

Home of the tasks for the dumbspec workflow (`.agents/skills/dumbspec/SKILL.md`): raw request → research → spec → plan. This file documents where the tasks live and what a task directory contains; the skill defines the process, gates, and plan format.

## Directory layout

Tasks are distributed across two folders:

- **`current/`** — active tasks. Each task lives in its own directory: `current/<task-tag>/`.
- **`archive/`** — completed / frozen tasks, moved here as-is: `archive/<task-tag>/`.

The task tag is a short identifier matching `[\w-_]+` (lowercase Latin letters, digits, `_`, `-`).

## Files

Every task directory contains up to four files, one per stage:

| File          | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `draft.md`    | The raw input. Record the user's request verbatim (or let the user create it manually). |
| `research.md` | Findings from research into feasibility, constraints, and options. |
| `spec.md`     | The specification, derived from the draft plus the research results. |
| `plan.md`     | The work plan, with each step marked as completed once done.    |

## Lifecycle

- A new task starts in `current/<task-tag>/`.
- When a task is done (all `plan.md` steps `[x]`, committed), move its whole directory from `current/` to `archive/`, keeping the same file set.
