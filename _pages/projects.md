---
layout: default
title: Project
permalink: /projects/
robots: noindex
---

<h2>My Projects</h2>

<br>

<ul>
    {% assign sorted_projects = site.data.projects | sort_natural: "name" %}
    {% for project in sorted_projects %}
    <li>
        <a href="{{ project.url }}">
            {{ project.name }}
        </a>{% if project.description %} - {{ project.description }}{% endif %}
    </li>
    {% endfor %}
</ul>
