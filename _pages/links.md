---
layout: default
title: Links
permalink: /links/
robots: noindex
---

<h2>Links</h2>

<br>

<h4>My Various Feeds</h4>

<ul>
    {% assign sorted_feeds = site.data.links_feeds | sort_natural: "name" %}
    {% for feed in sorted_feeds %}
    <li>
        <a href="{{ feed.url }}">
            {{ feed.name }}
        </a>{% if feed.description %} - {{ feed.description }}{% endif %}
    </li>
    {% endfor %}
</ul>

<br>

<h4>Blogs of Note I Follow</h4>

<ul>
    {% assign sorted_blogs = site.data.links_blogs | sort_natural: "name" %}
    {% for blog in sorted_blogs %}
    <li>
        <a href="{{ blog.url }}">
            {{ blog.name }}
        </a>{% if blog.description %} - {{ blog.description }}{% endif %}{% if blog.author %} - {{ blog.author }}{% endif %}
    </li>
    {% endfor %}
</ul>

<br>

<h4>Projects of Note I Follow</h4>

<br>

<h5>Network Automation</h5>

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

<h5>Monitoring/Performance</h5>

<ul>
    {% assign sorted_projects = site.data.links_projects.monitoring | sort_natural: "name" %}
    {% for project in sorted_projects %}
    <li>
        <a href="{{ project.url }}">
            {{ project.name }}
        </a>{% if project.description %} - {{ project.description }}{% endif %}
    </li>
    {% endfor %}
</ul>

<h5>DevOps (CI Pipelines, Containers, etc)</h5>

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
