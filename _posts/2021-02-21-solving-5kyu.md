---
layout: post
title: Solving 5kyu
tagline: Solving a 5kyu challenge on CodeWars
categories: Guides
---

{% include toc.md %}

# Introduction

## About

The term "competitive coding" means to essentially race to craft a solution to a programming/math problem in the fastest time possible. In the first of hopefully a multipart series on this blog, I will be solving one of these problems!

## Difficulties

In this series, I will be using a website called [CodeWars](https://www.codewars.com/) which allows users to post problems and compete with other developers. For this first post, as the title tells, I will be completing a "5kyu" challenge. Challenges are ranked in difficulty from high --> low numbers like so:

![CodeWars]({{ site.baseurl }}{% link public/img/codewars-kyu.png %})

As this series progresses, I will be going down these ranks. I hope to get to ~2kyu before ~~giving up~~ postponing indefinitely.

# Problem

The problem goes like so:

> Complete the function `scramble(str1, str2)` that returns `true` if a portion of `str1` characters can be rearranged to match `str2`, otherwise returns `false`.

This problem is taken directly from [this](https://www.codewars.com/kata/55c04b4cc56a697bb0000048) CodeWars challenge. Here are the provided examples which will eventually be tested against:

```python
scramble('rkqodlw', 'world') ==> True
scramble('cedewaraaossoqqyt', 'codewars') ==> True
scramble('katas', 'steak') ==> False
```

The notes provided say to watch out for performance issues and that I will only ever need to check for lowercase letters.

# Solution

The first main dilemma I have with these problems is what language to use -- Python is typically more *hackable* but I'm more used to Rust and it's method chaining (which is taken from the land of [functional programming](https://en.wikipedia.org/wiki/Functional_programming)).

For this challenge, it seems like a good opportunity to learn some more Python-specific [l33tc0d3](https://en.wikipedia.org/wiki/Code_golf), so I'll use it in this case.[^norust]

After looking and thinking at/about the problem for a couple of seconds, I think this calls for a basic double loop; linearly checking each char in the sequence and erroring out if it's not found.

The tests provided are the following:

```python
Test.assert_equals(scramble('rkqodlw', 'world'),  True)
Test.assert_equals(scramble('cedewaraaossoqqyt', 'codewars'), True)
Test.assert_equals(scramble('katas', 'steak'), False)
Test.assert_equals(scramble('scriptjava', 'javascript'), True)
Test.assert_equals(scramble('scriptingjava', 'javascript'), True)
```

Which seem to backup what I have to do in terms of erroring -- which is essentially to use `break` in the inner loop if found and if not, return `False`, then if fully escaped just return `True` at the bottom.

Actually, thinking about the problem for a couple of seconds longer, I could just use a typical linear check with Python's `in` keyword; which I wasn't thinking of as I was thinking in terms of manual Rust mapping.

My first thought of the final implementation looks like the following (no code golfing, just directly applied):

```python
def scramble(s1, s2):
    for o in s2:
        if not o in s1:
            return False
    
    return True
```

Which is already seeming deceptively simple for a challenge of this difficulty. Time to test:

![CodeWars]({{ site.baseurl }}{% link public/img/codewars-5kyu-test.png %})

And.. wow. It surprisingly works first time! Perhaps I should have started this series on a 4kyu challenge.

This could easily be made into a list generator + length check/similar but it's outside the time I currently have to write this.

I hope you enjoyed this short writeup/guide on a CodeWars challenge. Time for me to submit!

[^norust]: It also seems like the solution in question doesn't allow Rust, so Python is/was the only choice.
