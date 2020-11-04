---
layout: post
title: Bencoding
---

As part of my current main project which is an extremely compact [BitTorrent implementation]({{ site.github }}/torro), I have developed a standalone implementation of bencode, the byte-first protocol all `.torrent` files use.

This was an interesting side-track for me on the aforementioned main project to learn some more about custom parsers. Previously, I have only implemented simple character-based parsers but this bencode parser is a full top-down parser, fit for a full programming language (bar it containing a lexer, instead it consumes direct byte-based).

Here is an example of bencode:

```none
d8:some keyl11:first valuei64ei-2302eee
```

This would translate into the following JSON*-like* markup:

```json
{
    "some key": [
        "first value",
        64,
        -2302
    ]
}
```

As you can see, it contains a heavy reliance on recursion but also is an interesting format as `i01e` isn't valid. This is because bencode is extremely determenistic and you can only have **one way of representing a value** (python users must hate it!)

Another quirk of this rule that doesn't just apply to `i-0e`, `i023e` or `i--20e` is dictionaries, the `d3:key3:vale` that is equivalent to a JSON object like `{"key": "value"}`.

Dictionaries in bencode must be in **lexographic order** ([Wikipedia](https://en.wikipedia.org/wiki/Lexicographic_order)), this essentially means that all keys must be in alphabetical order, so no `{"xyz": 0, "abc": 0}` or you'll get an "invalid bencode" error message!

That's all for now, see below for the links to my implementation of bencode in Rust 😄

## Project link

This bencoding module is just a small part of my effort to learn network programming and parsing, here are some links:

- Main project: [link]({{ site.github }}/torro)
- `bencode.rs` file (contains parser): [link]({{ site.github }}/torro/blob/master/src/bencode.rs)
