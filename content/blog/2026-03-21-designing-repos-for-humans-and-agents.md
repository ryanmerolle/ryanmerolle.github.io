---
title: "Designing Repos for Humans and Agents"
description: "How to make your repo work for both human contributors and AI agents; and why getting this right matters more now than ever."
author: Ryan Merolle
date: 2026-03-21
tags: [Open Source, Agentic AI, Developer Experience, Documentation, Engineering, AI]
image:
  path: "images/blog_posts/2026-03-21-designing-repos-for-humans-and-agents.webp"
  alt: "Designing Repos for Humans and Agents"
---

## Most Repos Make Contribution Hard

When I was helping maintain [NetBox](https://github.com/netbox-community/netbox)
(a 20k+ star GitHub repo), we hit a wall familiar to every popular project. Most interactions were:
*"When will you implement X?"* The dream was:
*"I read the guide, matched your patterns, and opened a minimal PR. Please review."*

We had good user docs, but they weren't good enough to lower the barrier to contribution. Tribal
knowledge lived in maintainer Slack channels and weekly meetings, not the code. Today, that
friction is a bottleneck. AI coding agents are your new power-contributors.
If the structure is vague, it's anyone's guess how an agent will try to contribute.

## Good Structure Was Always Worth It

Getting to that "structured" state used to be a nice-to-have, but now it's a must.
We've moved past simple code search and doc retrieval into agentic workflows — AI that
reads your repo, writes code, runs tests, and opens a PR.

An agent that reads a well-structured `AGENTS.md` can follow your patterns from day one —
no onboarding thread, no Slack DM, no stalled PR.

Now, without clear guardrails, a new contributor or agent will quickly propagate antipatterns across your entire codebase.
AI doesn't solve the contributor onboarding problem we struggled with in the NetBox community; it just further exposes it. I just think we are now way more incentivized to invest in some of our dev experience type items to curtail these issues and enable more contributions.

That point became clear for me while listening to [Talk Python #540](https://talkpython.fm/episodes/show/540/modern-python-monorepo-with-uv-and-prek) with Jarek Potiuk, where
he walks through how Airflow handles contributor experience and project structure at monorepo
scale. Potiuk made a point on the podcast that stuck with me: the structure you build shapes what contributors default to. It pushed me to write down something I've been circling for a while: project curation
and guardrails matter more now because agents will amplify whatever patterns your repo makes
easiest to follow.

## Delivering Context

### Using AGENTS.md to Set the Stage for Agents

If `README.md` and `CONTRIBUTING.md` are the onboarding guides for humans,
`AGENTS.md` (interchangeable with `CLAUDE.md`) is the operating manual for coding agents.
These files define the rules of engagement for tools like Claude Code, GitHub Copilot, or Cursor.

Why bother? Recent evals show that
[context in an AGENTS.md outperforms custom skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
because it eliminates "decision fatigue." While models sometimes struggle to choose the right tool autonomously, they are
good at following explicit instructions in the context window.

### My Documentation Hierarchy

I like a consistent structure for your `docs/` folder. This gives the consumer a clear idea of where to find the content they need:

1. Admin Guide: Deployment, environment variables, and infrastructure.
2. Dev Guide: Internal architecture, pattern matching, and the `CONTRIBUTING.md` logic.
3. User Guide: End-user features and CLI usage.

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

Just like with source code, I like to further avoid documentation drift and content duplication. If your environment handles symlinks, use them to point your agent instructions to your existing docs.

The structure matters less than having one you commit to consistently. Before this, every project I touched had a different layout and the cognitive overhead of figuring out where things belonged was enough that I'd just skip documenting entirely. Its just so much easier and less of a drain for me.

### Moving From Context to Defined Workflows with Skills

Context tells the contributor the how and why. Skills give them the exact workflows and tools to execute. To provide truly great guidance, you must move the agent
from guessing how to write code to executing verified workflows.

Following the [progressive disclosure pattern](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices#progressive-disclosure-patterns) littered across the Anthropic docs, your `SKILL.md` should act as the table of contents — not a dumping ground.

- The context window is a valuable resource. Keep the `SKILL.md` body concise (ideally under 500 lines). It should serve as a high-level map that links to focused reference files like `references/EXAMPLES.md` or `references/API_REFERENCE.md`. Coding agents should only load these extra files when the task makes them relevant.
- Use text-based instructions for creative or subjective tasks, like code reviews or architectural brainstorming.
- Script Inclusion: Provide scripts for deterministic tasks.

Early in my experimentation, when my markdown files (skills, agents, etc.) got too bloated, output quality suffered resulting in ignored instructions, hallucinations, or the agent just stalling mid-process.

## Issue Templates as Specs

Think of structured GitHub Issue templates as the input schema for your repo.

An agent parsing a well-structured issue can act on it immediately. A wall of freeform text just wastes context window and produces worse output.

Tools like [GitHub Copilot agent](https://docs.github.com/en/copilot/using-github-copilot/using-claude-sonnet-in-github-copilot)
already let you assign an issue directly to an agent, which then picks it up and works
it in Codespaces. The quality of that agent's output is influenced by the quality
of the issue it receives. A structured issue — with
clear acceptance criteria, relevant context, and explicit constraints is more likely to produce something worth reviewing.

Issue templates that optimize for
agentic consumption look somewhat different from templates optimized purely for human
reporters, and I don't have a definitive pattern yet. Even a basic template with fields for *expected behavior*, *actual behavior*, and *acceptance criteria* beats a blank text box for everyone involved.

## Keeping Docs Current

Documentation that falls behind code actively misleads. Material for MkDocs
with `mkdocstrings` is a popular approach for rendering API docs from docstrings, but it won't write your guides for you.
The real power comes from the custom hooks and CI checks you build on top of it.

When your docs live in the repo, you can treat "missing documentation" like a "broken build." As the maintainer, you build
the guardrails that keep the contributors honest:

I've had this catch real "violations" where a contributor updated a function that changed its output, and the mkdocs build broke until they either updated the reference docs or updated the script pulling that data. Nobody argued about whether it needed documenting. The check made it a build problem, not a conversation.

## Save the Context Window for What Matters

Every token spent fixing a linting error is a token wasted. Shift those scriptable checks entirely out of the model's focus.
Those mechanical fixes burn through your context window, and instead you should look to move those checks out of the model's focus entirely and into tools that run before a single token is wasted on them.

Stop asking the AI to be careful. Make the environment enforce it instead — that's what pre-commit hooks and linters are for.

Pre-commit hook runners like [prek](https://prek.j178.dev) can catch simple issues before a commit lands:

Task runners (Makefile, just, pyinvok) wrap common workflows in a single command

When an agent runs a tool like `prek` before opening a PR, the reviewer(s) focus on the actual change, and not the style.

## llms.txt — The robots.txt Moment for AI

*This one is specifically for library, CLI, and API maintainers where agents are
consuming your project to build on top of it, not contributing to it.*

[llms.txt](https://llmstxt.org) is a growing community specification — think of
[robots.txt](https://www.cloudflare.com/learning/bots/what-is-robots-txt), but for
AI agents — that gives tools a machine-readable map of your documentation.
Using [mkdocs-llmstxt](https://github.com/pawamoy/mkdocs-llmstxt), you can
generate this automatically on every docs build.

Tools like [context7](https://context7.com) can ingest your library's
patterns immediately, giving anyone building on top of your project faster, more
accurate context. Less time hunting for docs or following the wrong docs.

It's early — but the [adoption list](https://github.com/SecretiveShell/Awesome-llms-txt)
is longer than you might expect.

## Try It on One Project

Every project has different constraints, contributors, and tolerance for process. If
your repo sees minimal activity today, you don't need all of this — start with an
`AGENTS.md` and one new skill, and adjust it from there.

Want to see what a well-structured repo looks like in production? Check out
[ruff](https://github.com/astral-sh/ruff) and [uv](https://github.com/astral-sh/uv)
from Astral — both seem to do a pretty decent job at contributor experience including tooling and documentation, and both ship an `llms.txt`.

My recommendation is to pick one repo, add an `AGENTS.md`, wire up a check you don't
already have, and see what breaks. Then share what you learn.

Find me on [GitHub](https://github.com/ryanmerolle) and
[LinkedIn](https://www.linkedin.com/in/ryanmerolle).

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
- [MkDocs](https://www.mkdocs.org) - MkDocs — my current preference for its plugin ecosystem, though [there is much concern about its current and future state](https://squidfunk.github.io/mkdocs-material/blog/2026/02/18/mkdocs-2.0/)
- [Zensical](https://zensical.org) — an emerging MkDocs alternative worth watching by the people who maintain Material for MkDocs.
