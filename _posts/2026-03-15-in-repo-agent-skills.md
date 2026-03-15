---
layout: post
title: "From 'Please Implement This' to 'Please Review This': Designing Repos for Humans and Agents"
author: Ryan Merolle
date: 2026-03-15
categories: [Engineering, AI]
tags: [Open Source, Agentic AI, Developer Experience, Documentation]
---

## TL;DR

AI coding agents are already contributing to your repo. The only question is whether they’ll follow your patterns or propagate anti-patterns at machine speed. Here’s how to make "the right way" the obvious way—for humans and agents alike.

---

## The Onboarding Tax Just Went Global

When I was helping community manage and maintain [NetBox](https://github.com/netbox-community/netbox) (20k+ GitHub star repo), we hit a wall familiar to every popular project. Most interactions were: *"When will you implement X?"* The dream was: *"I read the guide, matched your patterns, and opened a minimal PR. Please review."*

We had good user docs, but they weren't good enough to lower the barrier to contribution. Tribal knowledge lived in maintainer Slack channels and weekly meetings, not the code. Today, that friction isn't just a nuisance—it's a bottleneck. **AI coding agents are your new power-contributors.** If your repo structure is vague, an agent will cheerfully fill it with AI slop. If it’s structured, they’ll handle your grunt work while you sleep.

---

## The ROI of Good Structure Just Got Exponential

We've moved past code search and doc retrieval into **agentic workflows** — AI that
reads your repo, writes code, runs tests, and opens a PR. That's not hypothetical.
It's happening now.

The ROI of good documentation has always been positive. AI multiplies it. An agent
that reads a well-structured `AGENTS.md` can follow your patterns from day one —
no onboarding thread, no Slack DM, no stalled PR.

The risk is symmetric. **Bad habits scale just as fast.** Without clear guardrails,
an agent will cheerfully propagate AI slop across your entire codebase. The onboarding
problem I struggled with at NetBox? AI can solve it at scale — but only if you've done
the work to make "the right way" explicit.

> "The best way to foresee the future is to shape it." — Jarek Potiuk,
> [Talk Python #540](https://talkpython.fm/episodes/show/540/modern-python-monorepo-with-uv-and-prek)

So let's shape it.

### Paved Paths: Make the Right Way the Only Way

The goal: lower the barrier to entry for every contributor — human or AI — while
raising the floor on quality. Here's the stack.

---

## 1. AGENTS.md: The Repo Constitution for AI

If `CONTRIBUTING.md` is for humans, `AGENTS.md` is for the bots. It’s where you define the "laws" of your codebase for tools like Claude Code, GitHub Copilot, or Cursor.

Why bother? Because **context beats tools.** Current models often struggle to reliably use available tools (skills), but they excel at following instructions provided in the context window. By providing an `AGENTS.md`, you're giving the model a direct map of when and how to load specific context.

**Pro-tip: Don't duplicate effort.** Keep your standards in sync by pointing your agent instructions to your existing docs. If your environment handles symlinks, use them; if not, use a simple markdown redirect/link:

```text
├── docs/
│   ├── guide-admin/
│   ├── guide-dev/
│   |   └── contributing.md   ← symlink to CONTRIBUTING.md
│   ├── guide-user/
│   └── index.md              ← symlink to README.md
├── AGENTS.md                 ← source of truth for AI coding agents
├── CLAUDE.md                 ← symlink to AGENTS.md
├── CONTRIBUTING.md
└── README.md                 ← primary entrypoint for human contributors
```

**When the file an agent reads and the file a human reads are the same file, your
standards stay in sync automatically.** No drift. No duplication.

Recent evals show that [context in an AGENTS.md outperforms custom skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) because it eliminates the "decision fatigue" of the model trying to figure out which tool to call.

### Nested `AGENTS.md` for Larger Projects

For bigger codebases, a single top-level file isn't always enough. You can scope
instructions by directory — an agent working in `/scripts` follows different rules
than one in `/core`. This pattern works well in practice and is effective at keeping
AI slop out of sensitive parts of your codebase.

If embedding an `AGENTS.md` in every directory feels like overkill, keep a single
top-level file that *points to* markdown docs in `/docs` and tells the agent when to
load each one. Context stays lean; the agent still gets everything it needs, on demand.
This approach works equally well for scoping PR review guidelines.

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

This is one to watch.

---

## 3. Save the Context Window for What Matters

Every cycle spent checking formatting and other mechanical issues is attention not spent on design and implementation. Those checks belong in local tooling and CI, where the rules are explicit and enforced automatically. That keeps everyone in the loop — PR authors, AI coding agents, AI PR reviewers, and human reviewers — focused on correctness, architecture, and the parts of the work that actually deserve limited context and attention.

Whatever your stack, lean on **code quality tooling**: linters, formatters, type
checkers, and hooks. Two worth calling out specifically:

- **[pre-commit](https://pre-commit.com)** — the established standard for
  pre-commit hooks, with a massive plugin ecosystem
- **[prek](https://prek.j178.dev)** — a modern alternative built in Rust, inspired
  by both `uv` and `pre-commit`; faster and more portable and leverages the same plugin ecosystem as pre-commit.

Pair either with CI checks and test-driven development and you get code that's
correct-by-construction. The compounding effect:

- **PR authors** aren't debugging CI in back-and-forth commits
- **AI coding agents** aren't burning tokens on style fixes — and when they do
  encounter one, they know exactly how to resolve it
- **AI PR reviewers** aren't flagging issues a linter already catches
- **Human reviewers** aren't burning attention on whitespace when they should be
  evaluating logic

Everyone stays focused on architecture and pattern matching — the work that actually
moves the project forward.

---

## 4. Docs That Stay Current (Without Manual Effort)

Documentation that falls behind code is worse than no documentation — it actively
misleads contributors. Close the loop with CI. Skip wikis; they're hard for both AI
and humans to consume, and they have no tooling story.

**[Material for MkDocs](https://squidfunk.github.io/mkdocs-material)** with
`mkdocstrings` can keep API docs in lockstep with your code. More important is
the layering of purpose-built hooks and scripts on top that are built with your
your repo's specific patterns:

- **Automated doc-gap detection** — CI fails when a new CLI flag or API endpoint
  ships without corresponding documentation
- **PR review bots** — agents that verify CHANGELOG updates, check for missing
  docstrings, and confirm new features appear in the user guide
- **Living architecture diagrams** — regenerated from code annotations on every merge
- **Automated documentation builds** — MkDocs hooks that construct as much of your
  docs as possible during the build process itself

When you shape the contributor experience this deeply, you're not just automating
tasks — **you're encoding your project's standards into the environment itself.**
The tribal knowledge that was a barrier at NetBox becomes machine-readable
instructions that any contributor, human or AI, can follow from day one.

---

## 5. Bonus: llms.txt — The robots.txt Moment for AI

*This one is specifically for library, CLI, and API maintainers — where agents are
consuming your project to build on top of it, not contributing to it.*

[llms.txt](https://llmstxt.org) is a growing community specification — think
[robots.txt](https://www.cloudflare.com/learning/bots/what-is-robots-txt), but for
AI agents — that gives tools a machine-readable map of your documentation.
Using [mkdocs-llmstxt](https://github.com/pawamoy/mkdocs-llmstxt), you can
generate this automatically on every docs build.

The payoff: tools like [context7](https://context7.com) can ingest your library's
patterns immediately, giving anyone building on top of your project faster, more
accurate context. Less time hunting for docs. More time actually building.

It's early — but the [adoption list](https://github.com/SecretiveShell/Awesome-llms-txt)
is longer than you have heard.

---

## Try It on One Project

Every project has different constraints, contributors, and tolerance for process. If
your repo sees minimal activity today, you don't need all of this — start with an
`AGENTS.md` and one new skill, and scale from there. But the projects investing in
this now will be the ones that scale gracefully as agentic tooling matures.

Want to see what a well-structured repo looks like in production? Study
[ruff](https://github.com/astral-sh/ruff) and [uv](https://github.com/astral-sh/uv)
from Astral. Both are exemplary in contributor experience, tooling, and documentation
at scale leveraging tools like mkdocs and an `llms.txt`.

**My recommendation: pick one repo, add an `AGENTS.md`, wire up a check you don't
already have, and see what breaks.** Then share what you learn — and tell me where
I'm wrong. The reality is that this space is changing so quickly and no one really knows where this is all headed, but "The best way to foresee the future is to shape it."

Find me on [GitHub](https://github.com/ryanmerolle) and
[LinkedIn](https://www.linkedin.com/in/ryanmerolle).

---

## References & Projects to Keep an Eye on

- [Agent Skills](https://agentskills.io)
- [AGENTS.md Outperforms Skills in our Agent Evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
- [Anthropic's Best practices for CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/memory)
- [AGENTS.md specification](https://agents.md)
- [prek](https://prek.j178.dev)
- [mkdocs-llmstxt](https://github.com/pawamoy/mkdocs-llmstxt)
- [llms.txt adoption list](https://github.com/SecretiveShell/Awesome-llms-txt)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material)
- [llms.txt standard](https://llmstxt.org)
- [context7](https://context7.com)
- [MkDocs](https://www.mkdocs.org) - MkDocs — current preference for its plugin ecosystem, though [maintenance has stalled](https://github.com/mkdocs/mkdocs/discussions/4010)
- [Zensical](https://zensical.org) — an emerging MkDocs alternative worth watching by the people who maintain Material for MkDocs.
