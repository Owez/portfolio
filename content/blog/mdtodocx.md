+++
title = "Markdown to Word"
date = "2022-07-21"
[taxonomies]
categories = ["Parsers"]
+++

# Introduction

In the past year I've wrote a lot of documentation for my schoolwork, but there's always been one big issue: word processors. No matter what software I use, whether it be Word or LibreOffice, documents find new ways to break themselves.

This has a huge impact when I'm working on documents up to 30 thousand words long day-in day-out, which is why I've developed a new tool to solve this problem.

<!-- TODO: redo this:
# Solution

As a developer I use [Markdown](https://www.markdownguide.org/basic-syntax/) a lot, and there's lots of reasons to do so. It's a simple format yet you can format text in just about every way possible; allowing you to read and write files using notepad.

```markdown
# My Document

Hello there and *thanks* for reading my **little** document!

1. There's not much on this list.
2. But I hope you __enjoy__ it anyway.
```

The only real downside to Markdown is that theres no canonical way to display it to a reader. The document above, for example, can be rendered in an infinite amount of ways — so what if I rendered it as a Word document? -->

# Getting Started

To make a Markdown renderer that produces Word documents, I need to realistically convert a `.md` document to a `.docx` document.

## Rust

My first plan was to make it using [Rust](https://www.rust-lang.org) which is the programming language I use for most of my development currently. It's a fast language and once it compiles your code, it creates a "statically-linked" binary which contains everything it needs in a single file.

One of the reasons why modern word processors are still so inconsistent is because the format Word uses is horrible to work with. The specification which defines how it works is about the length of a novel, so I need to use a third-party [library](https://en.wikipedia.org/wiki/Library_(computing)) to generate all of the hard `.docx` stuff.

![Library's homepage](/img/mdtodocx/pydocx.png)

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

This layout is as simple as it gets for code, and it's luckily exactly what I need for my converter!

# Markdown

To convert Markdown to a Word document, I need to give my program the ability to *parse* a Markdown file. My program needs to be able to read each line of Markdown and actually understand it, rather than just loading some random file. Rubbish in, rubbish out.

There are a load of libraries for parsing Markdown inside of Python, but the vast majority are for converting Markdown to [HTML](https://en.wikipedia.org/wiki/HTML). This is useful in many situations — the text your reading has gone through this exact process.

![Example of this process](/img/mdtodocx/mdtohtml.png)

Unfortunately, Markdown to HTML isn't that useful for this project because I need to be able to convert to the Word document in real-time. This is due to some intricacies when it comes to "run formatting" inside of Word documents, so I need to make a custom solution.

I've created some custom parsers in Python before but I'm more experienced with parsing inside of Rust. Markdown parsing is simple compared to some other projects I've tried and failed t before, such as [KiCAD parsing](https://github.com/Owez/kicad-schema-parser) used for generating circuit boards.

## Headings

One of the good things about Markdown is that it's quite line-based, meaning that each line of a Markdown file designates a new element; such as headings or paragraphs of text. Getting the parser to understand headings is a good starting point:

```python
class Heading:
    """Representation of a Markdown heading"""

    def __init__(self, line: str) -> Self:
        """Parses a line of Markdown into new heading"""
        stripped = line.lstrip("#")
        self.level = len(line) - len(stripped)
        self.text = stripped.strip()
```

This new `Heading` class allows me to input a line of Markdown into it and have it be parsed. The `self.level` variable here is calculated by calculating the lengths of two versions of the Markdown line — one with the hashtags and one without.

Now that we have the heading stored as information we understand, we can use the library mentioned before to translate it into an actual word document. To do this in the future, I'll add a method onto this `Heading` which translates it:

```python
    def docx(self, doc: docx.Document):
        """Adds a corresponding docx heading"""
        doc.add_heading(self.text, self.level)
```

## Bulletpoints

The next component in Markdown that comes to my head are bulletpoints. On every line of Markdown you can have a new bulletpoint, making them easy to parse at first glance. Unfortunately, bulletpoints can look like this:

```md
- This is a very long single
  bulletpoint on multiple lines
  for some reason.
```
