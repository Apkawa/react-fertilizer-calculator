---
name: subagents-local
description: Important instruction before use subagents tool

disable-model-invocation: false
user-invocable: true
---

# Local Subagents — Sequential Execution

The LLM backend runs **locally** and allows **exactly one** concurrent agent.
Subagents must therefore run **strictly sequentially**:

- Never launch more than one subagent in a single message — multiple `subagent` / `subagent_fork` calls in one message start in parallel.
- Wait for the previous run to settle before starting the next (sync result or a background settlement notice); check `list_agents` that no subagent is still active before a new task.
- As soon as a task is dispatched to a subagent, immediately stop all other work and wait for its result; do not interleave any other activity with its run — continue only after the subagent has reported back (sync result or settlement notice).
- Fast, self-contained tasks — one-shot (`run_in_background: false`); long tasks — background (`run_in_background: true`), continue later turns via `send_message` if needed.
- Prefer a fresh subagent per task (clean context); retire persistent "ping-pong" agents after their last use — `interrupt_agent` if a turn is still running, and no further messages (there is no delete/forget API).
