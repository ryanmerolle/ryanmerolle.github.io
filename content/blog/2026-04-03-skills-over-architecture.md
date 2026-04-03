---
title: "Skills Over Architecture"
description: "Stop Arguing Over Architecture and Start Building"
author: Ryan Merolle
date: 2026-04-03
tags: [Agentic AI, Skills, Plugins, AI]
image:
  path: "images/blog_posts/2026-04-03-skills-over-architecture.webp"
  alt: "Skills Over Architecture"
---

## Start Building

CLI vs MCP vs API. I really don't care. That debate will shake out eventually and likely swing back and forth.

When discussing how to get started with AI, the first thing I ask people is whether they have:

1. A defined list of the [plugins](https://code.claude.com/docs/en/plugins) and [skills](https://agentskills.io/home) they actually want to build. Bonus points if they are defined as individual GitHub issues.
2. A marketplace or centralized repository to host these skills.
3. Bundled scripts included with each skill to enforce consistent outputs and minimize overall context waste.
4. Evaluations designed for each specific plugin and skill to measure reliability and improve them over time.

If a skill or plugin proves to be a high-value tool, you might eventually hand it over to an autonomous agent using frameworks like [LangChain DeepAgents](https://github.com/langchain-ai/deepagents) or [Pydantic-AI](https://github.com/pydantic/pydantic-ai). But you don't need to wait for full autonomy. You can extract a ton of immediate value and gain valuable experience just by building out a library of skills today.

### Skill Ideas for Infra Teams

Here are some ideas to get you started:

- **define-topology:** Create a topology definition in a format like [Containerlab](https://containerlab.dev/manual/topo-def-file/).
- **audit-IPAM-dns-records:** Leverage existing IP assignments documented in NetBox, platform configs, AVD structured configs, etc., to define A records and validate DNS entries.
- **build-diagram:** Parse configs, patching schedules, etc., to build a diagram of the environment using draw.io.
- **verify-configs:** Validate configs against a baseline or standard set of common configurations or business logic (e.g., ensure all eBGP peers to third parties have a relevant description, AS number, and a neighbor IP that matches an interface prefix).
- **organize-requirements:** Take a bunch of notes from a project kick-off to document a clear set of infrastructure requirements.
- **investigate-firewall-logs:** Parse firewall logs to identify patterns, anomalies, or specific connectivity failures.
- **build-documents:** See my blog post on [Designing Repos for Humans and Agents](https://www.merolle.net/blog/designing-repos-for-humans-and-agents/) and build a skill for that process.

> [!WARNING]+ There are plenty of skill marketplaces you can leverage to get started, but review what you are taking inspiration from because [prompt injections](https://openai.com/index/prompt-injections/) are a real concern for skills you find online.
