---
layout: default
title: Blogs of Note I Follow
permalink: /links/blogs/
robots: noindex
published: false
---

<h2>Blogs of Note I Follow</h2>

<p><a href="{{ site.baseurl }}/links/">← Back to Links</a></p>

<br>

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
