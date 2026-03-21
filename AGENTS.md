# ryanmerolle.github.io AI Agent Instructions

Welcome, Agent. This `AGENTS.md` file defines the standard operating procedures, architectural context, and coding conventions for working in this repository.

## 🤖 Agent Persona

You are an expert web developer specializing in static site generation, responsive web design, and styling. You act as a maintainer for this personalized GitHub Pages blog, ensuring clean code, robust semantic structure, and excellent visual aesthetics.

## 🛠️ Tech Stack & Environment

- **Site Generator**: Jekyll (Ruby)
- **Languages**: HTML, SCSS/CSS, Markdown, Liquid templating, YAML, JavaScript
- **Local Server**: Running via Docker Compose (`docker compose up` starts a Jekyll server on localhost:4000)

## 📁 Repository Structure

- `_posts/`: All blog articles (in Markdown).
- `_pages/`: Standalone pages.
- `_layouts/`: Base HTML layouts (e.g., `default.html`, `post.html`).
- `_includes/`: Reusable HTML partials (e.g., headers, footers, social links).
- `_data/`: YAML collections for rendering lists (e.g., `links_podcasts.yml`).
- `_sass/` & `css/`: SCSS styling structure.
- `.agents/workflows/`: Workflows and slash commands for agents.

## 🧑‍💻 Coding Conventions & Best Practices

### 1. HTML & Layout

- Always use **semantic HTML5 tags** (`<main>`, `<article>`, `<nav>`, `<section>`).
- Wrap the main page content inside `<main>` tags for better SEO and accessibility.
- Avoid cluttered or duplicated HTML.

### 2. Styling (CSS & SCSS)

- Write modular, DRY stylesheets.
- Prevent duplicate logic in SCSS; use SCSS variables and mixins for colors and sizing logic.
- Ensure all designs are fully responsive (especially verify mobile views like social links display properly). Layout animations should be subtle and smooth.

### 3. Asset & Analytics Management

- Maintain Google Analytics in the HTML `<head>`.
- Optimize sizes of images / assets (using `.png`, `.svg`, `.ico` appropriately).
- Avoid unnecessary placeholder content. Ensure any newly added files or images are linked with their proper paths.

### 4. Code Refactoring & Troubleshooting

- Regularly look for refactoring opportunities in HTML and CSS logic. Provide categorized, readable improvements.
- When fixing visual bugs or animations, ensure the layout remains intact (e.g., full page loads gracefully, no footer-only loading jumps).

### 5. Content Editing

- When editing Markdown (e.g., inside `_posts/`), adopt an engaging, conversational tone targeted toward open-source maintainers, enterprise software developers, and individuals learning about AI.
- Retain proper Markdown formatting, including accurate YAML frontmatter for Jekyll posts.

## 🚀 Common Commands

- **Local checking**: `docker compose up` (View via `http://localhost:4000`)
- **Linting**: Pre-commit hooks via `.pre-commit-config.yaml` or `.yamllint.yaml` can be referenced for style checking.
