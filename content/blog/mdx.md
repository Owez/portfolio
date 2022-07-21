+++
title = "Markdown to Word"
date = "2022-07-21"
[taxonomies]
categories = ["Parsers"]
+++

# Introduction

In the past year I've wrote a lot of documentation for my schoolwork, but there's always been one big issue: word processors. My documents constantly have broken formatting on Word, LibreOffice, or any of the other packages I've tried.

This has a huge impact when I'm working on documents up to 30 thousand words long day-in day-out, which is why I've developed a new tool to solve this problem.

# The Fix

As a developer I use [Markdown](https://www.markdownguide.org/basic-syntax/) a lot, and there's lots of reasons to do so. It's a simple format yet you can format text in just about every way possible; allowing you to read and write files using notepad.

```markdown
# My Document

Hello there and *thanks* for reading my **little** document!

1. There's not much on this list.
2. But I hope you __enjoy__ it anyway.
```

The only real downside to Markdown is that theres no canonical way to display it to a reader. The document above, for example, can be rendered in an infinite amount of ways — so what if I rendered it as a Word document?

# Getting Started

To make a Markdown renderer that produces Word documents, I need to realistically convert a `.md` document to a `.docx` document.

## Rust

My first plan was to make it using [Rust](https://www.rust-lang.org) which is the programming language I use for most of my development currently. It's a fast language and once it compiles your code, it creates a "statically-linked" binary which contains everything it needs in a single file.

One of the reasons why modern word processors are still so inconsistent is because the format Word uses is horrible to work with. The specification which defines how it works is about the length of a novel, so I need to use a third-party [library](https://en.wikipedia.org/wiki/Library_(computing)) to generate all of the hard `.docx` stuff.

![Excerpt from the specification](/img/docxtoc.png)

The problem with using Rust is that it's a newer language with a smaller community compared to a lot of other languages, so it doesn't have a lot of community-created content which others do. And this turns out to be the case with libraries that create `.docx` files — there's only two available and both of them aren't usable.

After finding this out I started creating my own library, but I realized that it'd take way too long to create, so I needed to find another solution.

## Python

When I was looking at the massive specifications one website kept popping up over and over again, it's name was `python-docx`. Before I learnt Rust I was mainly a [Python](https://www.python.org) developer, so using it for this project seemed like the natural option.

After copying what was in the quickstart guides for `python-docx`, I managed to create my first Word document:

```python
from docx import Document

document = Document()

document.add_heading("My Document", 0)
document.add_paragraph("Hello there and thanks for reading my little document!")
```

TODO
