---
layout: post
title: Experimentation with Markup Languages
tagline: A new, ill-devised but well-implemented markup language..
categories: Showcases
---

I have recently came back onto an old side project to learn about scanning and parsing in Rust without the use of outside tools (just me and the standard library) and it led to an interesting markup language being created which was a joke at first but became something bigger.

The language I am speaking of looks like this:

```none
hello there, this is valid markup
```

**Yep. Space seperators.**

This translates into the following JSON:

```json
{"hello": ["there,", "this", "is", "valid", "markup"]}
```

At first this may seem odd and quite unsafe but by using the same techniques as json for string escapes, this markup can store something like `{"my title": "content"}` safely with the use of backslashes:

```none
my\ title content
```

This was just a quick fun/update post, if you'd like to see the source code it's hosted on GitHub [here]({{ site.github }}/superconf). The package has no dependancies and is extremely lightweight at only ~330 lines (including tests)!

PS: I've also recently updated the package so you can use the more boring looking `key:value` or `key=value`, **the latter could be used as a full argument parser** if you modified the library to allow just `key` to be valid (it's not as there is no JSON translation).

That's all for now!
