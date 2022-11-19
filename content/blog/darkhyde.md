+++
title = "Dark Hyde"
date = "2022-11-17"
updated = "2022-11-17"
draft = false
[taxonomies]
categories = ["Design"]
+++ 

# Introduction

Around two years ago I was setting up my first blog website and like many people, I used Jekyll. It's a great tool for generating static websites like blogs, and it worked great with GitHub pages.

The problem I always had with it was there was never any good dark themes. The best theme I found for Jekyll was one called Hyde but it was only in light mode. So to fix the issue, I created **Dark Hyde**.

![Example of Dark Hyde](/img/darkhyde/eg.png)

# Installation

This Jekyll theme is used a bit differently to others because it builds on top of the original Hyde theme, which is in turn built on Poole. To use Dark Hyde, go through the normal install process of Hyde. Once you've installed everything like normal, make a new CSS file called `darkhyde.css` and add the following into it:

```css
/* Dark Hyde theme */

.theme-dark .content {
  background-color: #2c2c2c !important;
  color: rgb(214, 214, 214);
}

.theme-dark .highlight, .theme-dark code, .theme-dark pre {
  background-color: #202020;
}

.theme-dark a.older, .theme-dark a.newer {
  color: unset;
  font-weight: bold;
  text-decoration: underline;
}

.theme-dark .content a {
  font-style: italic;
}

.theme-dark .post-title a {
  font-style: unset;
}

.theme-dark blockquote {
  border-left: .25rem solid #5c5c5c;
}

.theme-dark h1, .theme-dark h2, .theme-dark h3, .theme-dark h4, .theme-dark h5,
.theme-dark h6, .theme-dark li a:hover, .theme-dark .post-title a,
.theme-dark strong {
  color: #ffffff !important;
}

.theme-dark tbody tr:nth-child(2n+1) td, .theme-dark tbody tr:nth-child(2n+1) th {
  background-color: #333333 !important;
}
```

The hard part is now over, all you have to do is go into your `default.html` file and add the new dark theme class to the body element of HTML like so:

```html
<body class="theme-dark">
    <!-- ... -->
</body>
```

Now your dark theme should display without any issues!

# Conclusion

This dark theme was made for my old blog and I wanted to make a post about it for the new version of my blog your probably looking at now. Right now the theme is out of development but I hope to redo it sometime in the future.

The repository for my old blog (and therefore the theme) can be downloaded and tried through the archive [here](https://1drv.ms/u/s!Avsd4vOsPRsNkVNTwupz69wmrtoE?e=nUSbtn). Sorry it's not on GitHub, the new portfolio has supplanted it.
