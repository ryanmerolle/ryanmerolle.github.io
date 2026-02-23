---
layout: default
title: Projects of Note I Follow
permalink: /links/projects/
robots: noindex
---

<h2>Projects of Note I Follow</h2>

<p><a href="{{ site.baseurl }}/links/">← Back to Links</a></p>

<br>

<h3>AI</h3>

<ul>
    {% assign sorted_projects = site.data.links_projects.ai | sort_natural: "name" %}
    {% for project in sorted_projects %}
    <li>
        <a href="{{ project.url }}">
            {{ project.name }}
        </a>{% if project.description %} - {{ project.description }}{% endif %}
    </li>
    {% endfor %}
</ul>

<h3>Dev / DevOps</h3>

<ul>
    {% assign sorted_projects = site.data.links_projects.devops | sort_natural: "name" %}
    {% for project in sorted_projects %}
    <li>
        <a href="{{ project.url }}">
            {{ project.name }}
        </a>{% if project.description %} - {{ project.description }}{% endif %}
    </li>
    {% endfor %}
</ul>

<h3>GoLang</h3>

<ul>
    {% assign sorted_projects = site.data.links_projects.golang | sort_natural: "name" %}
    {% for project in sorted_projects %}
    <li>
        <a href="{{ project.url }}">
            {{ project.name }}
        </a>{% if project.description %} - {{ project.description }}{% endif %}
    </li>
    {% endfor %}
</ul>

<h3>Network Automation</h3>

<ul>
    {% assign sorted_projects = site.data.links_projects.network_automation | sort_natural: "name" %}
    {% for project in sorted_projects %}
    <li>
        <a href="{{ project.url }}">
            {{ project.name }}
        </a>{% if project.description %} - {{ project.description }}{% endif %}
    </li>
    {% endfor %}
</ul>

<h3>Python</h3>

<ul>
    {% assign sorted_projects = site.data.links_projects.python | sort_natural: "name" %}
    {% for project in sorted_projects %}
    <li>
        <a href="{{ project.url }}">
            {{ project.name }}
        </a>{% if project.description %} - {{ project.description }}{% endif %}
    </li>
    {% endfor %}
</ul>
