---
layout: post
title: "Designing Repos for Humans and Agents"
author: Ryan Merolle
date: 2026-03-21
categories: [Engineering, AI]
tags: [Open Source, Agentic AI, Developer Experience, Documentation]
---

Here's my take on how to make your repo work for both human contributors and AI
agents — and why getting this right matters more now than ever.

---

## The Onboarding Tax Just Went Global

When I was helping maintain [NetBox](https://github.com/netbox-community/netbox)
(a 20k+ star GitHub repo), we hit a wall familiar to every popular project. Most interactions were:
*"When will you implement X?"* The dream was:
*"I read the guide, matched your patterns, and opened a minimal PR. Please review."*

We had good user docs, but they weren't good enough to lower the barrier to contribution. Tribal
knowledge lived in maintainer Slack channels and weekly meetings, not the code. Today, that
friction isn't just a nuisance — it's a bottleneck. **AI coding agents are your new power-contributors.**
If your repo structure is vague, an agent will cheerfully fill it with AI slop. If it’s structured,
they’ll handle your grunt work while you sleep.

---

## The ROI of Good Structure Just Got Exponential

Getting to that "structured" state used to be a nice-to-have. Now, it's a multiplier.
We've moved past simple code search and doc retrieval into agentic workflows — AI that
reads your repo, writes code, runs tests, and opens a PR. That's not hypothetical. It's
happening now.

The ROI of good documentation has always been positive, but AI scales it exponentially.
An agent that reads a well-structured `AGENTS.md` can follow your patterns from day one —
no onboarding thread, no Slack DM, no stalled PR.

The risk is also symmetric. Bad habits scale just as fast. Without clear guardrails,
a new contributor or agent will cheerfully propagate antipatterns across your entire codebase.
The onboarding problem I struggled with at NetBox? AI can solve it at scale, but only if
you’ve done the work to make those patterns explicit.

That point crystallized for me while listening to [Talk Python #540](https://talkpython.fm/episodes/show/540/modern-python-monorepo-with-uv-and-prek) with Jarek Potiuk, where
he walks through how Airflow handles contributor experience and project structure at monorepo
scale. It pushed me to write down something I've been circling for a while: project curation
and guardrails matter more now because agents will amplify whatever patterns your repo makes
easiest to follow.

> "The best way to foresee the future is to shape it." — Jarek Potiuk,
> [Talk Python #540](https://talkpython.fm/episodes/show/540/modern-python-monorepo-with-uv-and-prek)

So let's shape it.

### Paved Paths: Make Good Practices the Default

A paved path is a contributor experience designed so that the right way to do something is also the easiest
way—removing the decision points that slow humans down and cause agents to guess.

The goal: lower the barrier to entry for every contributor — human or AI — while
raising the floor on quality. Here's the stack.

---

## 1. Delivering Context

### 1.1 Project Context: The "Laws" of the Land

If `README.md` and `CONTRIBUTING.md` are the onboarding guides for humans,
`AGENTS.md` (interchangeable with `CLAUDE.md`) is the operating manual for coding agents.
These files define the rules of engagement for tools like Claude Code, GitHub Copilot, or Cursor.

Why bother? Because **context currently beats skills.** Recent evals show that
[context in an AGENTS.md outperforms custom skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
because it eliminates "decision fatigue." While models sometimes struggle to choose the right tool autonomously, they are
world-class at following explicit instructions in the context window.

### 1.2 The Documentation Hierarchy

An agent is only as good as its reference material. I recommend a consistent "Triad Structure" for your `docs/` folder. This gives the agent a predictable map to navigate:

1. **Admin Guide:** Deployment, environment variables, and infrastructure.
2. **Dev Guide:** Internal architecture, pattern matching, and the `CONTRIBUTING.md` logic.
3. **User Guide:** End-user features and CLI usage.

```text
├── docs/
│   ├── guide-admin/
│   ├── guide-dev/
│   │   └── contributing.md   ← symlink to CONTRIBUTING.md
│   ├── guide-user/
│   └── index.md              ← symlink to README.md
├── AGENTS.md                 ← source of truth for AI coding agents
├── CLAUDE.md                 ← symlink to AGENTS.md
├── CONTRIBUTING.md
└── README.md                 ← primary entrypoint for human contributors
```

**Pro-Tip: Sync via Symlinks.** To avoid "documentation drift," make the agent read exactly what the human reads. If your environment handles symlinks, use them to point your agent instructions to your existing docs.

### 1.3 Project Skills: Defining the Experience

Context sets the stage, but **Skills** provide the tools. To provide truly great guidance, you must move the agent
from guessing how to write code to executing verified workflows.

Following the **"Progressive Disclosure"** pattern, your `SKILL.md` should act as the table of contents — not a dumping ground.

- **Don’t Bloat Your `SKILL.md`:** The context window is a valuable resource; don't waste it. Keep the `SKILL.md` body concise (ideally under 500 lines). It should serve as a high-level map that links to focused reference files like `references/EXAMPLES.md` or `references/API_REFERENCE.md`. Coding agents should only load these extra files when the task makes them relevant.
- **Match Degrees of Freedom**
  - **High Freedom:** Use text-based instructions for creative or subjective tasks, like code reviews or architectural brainstorming.
  - **Low Freedom:** For deterministic tasks, provide a script. If the script is generally useful (CI, local tooling, or tests), keep it in the main repo structure. If it is specifically designed to power the agent's workflow, house it within the skill’s directory structure.

**The goal:** Take the ambiguity out of the task.

---

## 2. Issue Templates as API Specs

Think of structured GitHub Issue templates as the **input schema** for your repo —
for humans today, and for agentic workflows tomorrow.

An agent parsing a well-structured issue can act on it immediately. An agent parsing
a wall of freeform text burns context window and produces worse output. The structure
you add for human clarity is the same structure that makes issues machine-actionable.

Where this gets interesting: tools like
[GitHub Copilot agent](https://docs.github.com/en/copilot/using-github-copilot/using-claude-sonnet-in-github-copilot)
already let you assign an issue directly to an agent, which then picks it up and works
it in Codespaces. The quality of that agent's output is directly gated on the quality
of the issue it receives. A vague issue gets a vague PR. A structured issue — with
clear acceptance criteria, relevant context, and explicit constraints — gives the agent
what it needs to produce something worth reviewing.

I'll be honest: **I'm still experimenting here.** Issue templates that optimize for
agentic consumption look somewhat different from templates optimized purely for human
reporters, and I don't have a definitive pattern yet. But the direction is clear enough
to start moving — even a basic template with fields for *expected behavior*, *actual
behavior*, and *acceptance criteria* is meaningfully better than a blank text box for
both audiences.

---

## 3. Docs That Stay Current (The "Docs-as-Code" Advantage)

Everything we've covered so far optimizes the inner loop for contributors. But there is a massive secondary benefit:
by moving your documentation out of a detached wiki and into the repo alongside your source code, you unlock a level
of automation that is impossible with static docs.

Documentation that falls behind code is worse than no documentation at all — it actively misleads. **Material for MkDocs**
with `mkdocstrings` is a popular approach for rendering API docs from docstrings, but it won't write your guides for you.
The real power comes from the **custom hooks and CI checks** you build on top of it.

When your docs live in the repo, you can treat "missing documentation" like a "broken build." As the maintainer, you build
the guardrails that keep the agent (and the humans) honest:

- **Automated Doc-Gap Detection:** Write mkdocs scripts that fails the docs build if a new CLI flag or API endpoint is added to the code but doesn't appear in the Markdown docs.
- **Contextual Validation:** Since your docs and code share a file system, your build scripts can verify that code examples in your documentation actually run and pass.

When you shape the contributor experience this deeply, you're not just automating tasks — **you're encoding your project's standards into the environment itself.** The tribal knowledge that was once a barrier at NetBox becomes machine-readable instructions that any contributor, human or AI, can follow from day one.

---

## 4. Save the Context Window for What Matters

Every cycle an AI agent spends fixing a trailing comma or wrestling with import sorting is a cycle it isn't spending on your core logic.
More importantly, those mechanical fixes burn through your **context window**—the limited "short-term memory" of the model.
The fix isn't better prompting — it's moving those checks out of the model's focus entirely and into tools that run before a single token is wasted on them.

The most effective "tools" you can give an agent are **Automated Guardrails** that provide immediate, structured feedback.
By offloading these to deterministic tools, you move from "asking the AI to be careful" to "making the environment enforce care."

**The "Correct-by-Construction" Stack:**
Pair these scripts with local tooling to ensure the agent never even *attempts* to commit bad code:

Pre-commit hook runners (catch issues before a commit lands):

- [prek](https://prek.j178.dev) — a fast, Rust-based hook runner
- `pre-commit` — the established standard it builds on

Task runners (wrap common workflows in a single command):

- Makefile — no dependencies, universally available
- just / pyinvoke — richer syntax if your team already uses them

When an agent runs a local dev tool like `prek`, it isn't just checking code; it's
**preserving your attention.** You get a PR that already passed the "grunt work" checks,
leaving you to review the architecture—the part that actually moves the project forward.

---

## 5. Bonus: llms.txt — The robots.txt Moment for AI

*This one is specifically for library, CLI, and API maintainers — where agents are
consuming your project to build on top of it, not contributing to it.*

[llms.txt](https://llmstxt.org) is a growing community specification — think of
[robots.txt](https://www.cloudflare.com/learning/bots/what-is-robots-txt), but for
AI agents — that gives tools a machine-readable map of your documentation.
Using [mkdocs-llmstxt](https://github.com/pawamoy/mkdocs-llmstxt), you can
generate this automatically on every docs build.

The payoff: tools like [context7](https://context7.com) can ingest your library's
patterns immediately, giving anyone building on top of your project faster, more
accurate context. Less time hunting for docs. More time actually building.

It's early — but the [adoption list](https://github.com/SecretiveShell/Awesome-llms-txt)
is longer than you might expect.

---

## Try It on One Project

Every project has different constraints, contributors, and tolerance for process. If
your repo sees minimal activity today, you don't need all of this — start with an
`AGENTS.md` and one new skill, and scale from there. But the projects investing in
this now will be the ones that scale gracefully as agentic tooling matures.

Want to see what a well-structured repo looks like in production? Check out
[ruff](https://github.com/astral-sh/ruff) and [uv](https://github.com/astral-sh/uv)
from Astral — both are exemplary in contributor experience, tooling, and documentation
at scale, and both ship an `llms.txt`.

**My recommendation: pick one repo, add an `AGENTS.md`, wire up a check you don't
already have, and see what breaks.** Then share what you learn — and tell me where
I'm wrong.

Find me on [GitHub](https://github.com/ryanmerolle) and
[LinkedIn](https://www.linkedin.com/in/ryanmerolle).

---

## References & Projects to Keep an Eye on

- [Agent Skills](https://agentskills.io)
- [AGENTS.md Outperforms Skills in our Agent Evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
- [Anthropic's Best practices for CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/memory)
- [Anthropic's Best practices for skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Agent Skills Using Scripts](https://agentskills.io/skill-creation/using-scripts)
- [AGENTS.md specification](https://agents.md)
- [prek](https://prek.j178.dev)
- [llms.txt adoption list](https://github.com/SecretiveShell/Awesome-llms-txt)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material)
- [llms.txt standard](https://llmstxt.org)
- [context7](https://context7.com)
- [MkDocs](https://www.mkdocs.org) - MkDocs — current preference for its plugin ecosystem, though [there is much concern about its current and future state](https://squidfunk.github.io/mkdocs-material/blog/2026/02/18/mkdocs-2.0/)
- [Zensical](https://zensical.org) — an emerging MkDocs alternative worth watching by the people who maintain Material for MkDocs.
