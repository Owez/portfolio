---
layout: post
title: The merkle tree
---

## Intro

For an upcoming, *secret* project, I have been making a small crate for speedy [merkle trees](https://en.wikipedia.org/wiki/Merkle_tree) called "irkle". The usage syntax looks like:

```rust
use irkle::Tree;

fn main() {
    println!("{:#?}", Tree::new(vec!["whatever", "here"]))
}
```

And this will create a well-formed merkle tree!

## The hash

This crate is based off of the (semi) new [BLAKE3](https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE3) cryptographic hash which is much, much faster compared to other contemporary methods, as seen here:

![](https://raw.githubusercontent.com/BLAKE3-team/BLAKE3/master/media/speed.svg)

With this, it should make the typically slow task of merkle trees faster! 🎉

If you've ever worked with git and especially such things as [rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing), you have most likely came across git being awfully slow; this is because of the `SHA-1`/`SHA-2` git uses for [it's merkle tree](https://git-scm.com/docs/git-hash-object) being a slow hash compared to `BLAKE3`..

## Links

That's about all for now, here are some links to where you may find details about my new "irkle" library:

- **[GitHub (repository)](https://github.com/owez/irkle)**
- [Crates.io (crate)](https://crates.io/crates/irkle)
- [Docs.rs (documentation)](https://docs.rs/irkle)
