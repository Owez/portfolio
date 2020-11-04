---
layout: post
title: A spooky portfolio 🎃
---

Woo a new *dark-mode* portfolio!

I have just spent the last day completely rewriting my portfolio from looking something like this:

[![image.png](https://i.postimg.cc/sDMGTT7C/image.png)](https://postimg.cc/KRyYzr00)

To this:

![]({{ site.baseurl }}{% link public/img/new-portfolio-darkmode.png %})

This was achievable with a complete rewrite; moving from the simple but not greatly made/extendible [Jekyll Now](https://www.jekyllnow.com/) to a custom, [Poole](https://getpoole.com/)-inspired setup -- but completely generated from scratch with basic Jekyll. The theme on the other hand isn't Poole directly but a derivative made by the same folks, it's called "[Hyde](https://github.com/poole/hyde)".

As you may notice, the Hyde theme is lightmode-only whereas my portfolio is fully *dark-mode*. That's right: I customised it 😄

You may also be able to see the new [Posts]({{ site.baseurl }}/posts) which contains a handy overview of every single post on the site, to be used for easy indexing and searching of articles. This is due to the flaw of the Hyde theme installed where it is only really suited to one post like you see here. Any more then a single post and the page gets far too large to easily navigate. Here's a screenshot of the (current) posts section:

![]({{ site.baseurl }}{% link public/img/new-portfolio-darkmode-posts.png %})

For this section, I had to make some custom templating and css, though it was only about 40 lines combined overall. As for the code, here it is:

## The HTML

```html
---
layout: page
title: Posts
---

<p>An overview of the posts contained on my portfolio/blog.</p>

<div class="post-overview">
    {% for post in site.posts %}
    <div class="post-box">
        <div class="post-box-inner">
            <h3 class="post-box-link"><a href="{{ post.url }}" class="clear-link">{{ post.title }}</a></h3>
            <span class="post-date post-box-date">{{ post.date | date_to_string }}</span>
        </div>
        <p class="post-box-tagline">{% if post.tagline %}{{ post.tagline }}{% else %}Click to find out more!{% endif %}
        </p>
    </div>
    {% endfor %}
</div>
```

## The CSS

```css
.clear-link {
    text-decoration: normal;
    color: unset;
    font-style: normal !important;
}

.post-box {
    background-color: #202020;
    padding: 1rem;
    border-radius: 3px;
    margin-bottom: 1rem;
}

.post-box-inner {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
}

.post-box-date {
    margin: 0;
    margin-left: 0.75rem;
}

.post-box-link {
    margin: 0;
    font-size: 1.15rem;
    font-weight: normal;
}

.post-box-tagline {
    margin-bottom: 0;
    font-style: italic;
    border-top: 1px solid #2c2c2c;
    padding-top: 0.25rem;
    margin-top: 0.25rem;
}
```

That's all for now, stay safe in the still ongoing pandemic!
