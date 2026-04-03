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

CLIs vs MCP vs API

I really don't care. That debate will shake out eventually and likely swing back and forth.

The first question I ask people when talking about AI approach is whether they have:

1. A defined list of the [plugins](https://code.claude.com/docs/en/plugins) and [skills](https://agentskills.io/home) they actually want to build. Bonus points if they are defined as individual GitHub issues.
2. A marketplace or centralized repo to host these skills.
3. Bundled scripts included with each skill to enforce consistent outputs and minimize overall context waste.
4. Evals designed for each specific plugin and skill to measure reliability and improve them over time.

If a skill or plugin proves to be a high-value tool, you might eventually hand it over to an autonomous agent using frameworks like [langchain deepagents](https://github.com/langchain-ai/deepagents) or the [pydantic-ai framework](https://github.com/pydantic/pydantic-ai). But you don't need to wait for full autonomy. You can extract a ton of immediate value and gain valuable experience just by building out a library of skills today.
