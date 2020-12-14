---
layout: post
title: Irkle Whitepaper
tagline: Whitepaper for Irkle, a merkle tree library and ecosystem designed to be as fast as possible.
---

This document (layed out as a post) is the whitepaper for Irkle, a merkle tree library and ecosystem designed to be as fast as possible.

This whitepaper is not intended to be a full scienfically evaluated report on the speed of Irkle, but more of a technology proposal with a working example of the proposal being a functioning library.

## Proposals

The following sections are technology proposals for speedups in merkle tree technology which are implemented into Irkle. These may not be entirely novel ideas on their own, but with the benifits of each combined, it allows a greater speedup then would otherwise be possible.

### Array-based tree

Using an array-based merkle tree brings some key advantages along with it, suited towards the reading of data and ease of implementation for multithreading.

For example, given the following mapping of a conventional tree data structure (assuming a full & perfect binary tree)[^fullperfect]:

```none
alpha
	bravo
		charlie
		delta
	echo
		foxtrot
		golf
```

This would transform into the following array data structure:

```none
[alpha, bravo, echo, charlie, delta, foxtrot, golf]
```

With this arrangement, the data may become more computationally impactful to expand due to array resizing in some list/array/vector implmentations but the utility it provides by allowing an approximate list of all data blocks in the last half ({% katex %}\frac{n}{2}{% endkatex %}). This will return (assuming {% katex %}2^n{% endkatex %} data blocks like this example is), a list of all data blocks:

```none
[charlie, delta, foxtrot, golf]
```

Note that this may not give a perfect representation of the data blocks as a perfect {% katex %}2^n{% endkatex %} is rare and is what's needed to have *no* empty/filler nodes in the latter {% katex %}\frac{2}{n}{% endkatex %}'s of a tree.

Another key component of array-based trees is the [locality of data (or *locality of reference*)](https://en.wikipedia.org/wiki/Locality_of_reference) presented in any array.[^arrayloc] This is especially useful for traversal of a binary and therefore a merkle tree, as node siblings are next to each other (i.e. left is $n-1$ and right is $n+1$) for example.

[^fullperfect]: D. W. Harder, (2011). *Algorithms and Data Structure*. Department of Electrical and Computer Engineering, University of Waterloo.
[^arrayloc]: T. Cormen, (2001). *Introduction to algorithms*. 2nd ed. Cambridge: MIT Press.

### Data reference list

Continuing on from using the latter half of the tree with {% katex %}\frac{n}{2}{% endkatex %}, this can be further explored by maintaining a seperate list/array/vector of all data nodes in the actual array-based merkle tree. This is useful as such a dataset may be searched using a number of conventional array-based [search algorithms](https://en.wikipedia.org/wiki/Search_algorithm) to find either the hash or the data contained inside.

Using the examples given in the previous proposal of array-based trees, a *data reference list* would look similar to the following:

```none
[&charlie, &delta, &foxtrot, &golf]
```

Another potential use this brings is a concrete pathing method for data, if used in conjunction with an array-based tree as previously discussed. If it is known that parent nodes are always:
{% katex display %}\left\lfloor \frac{n-1}{2} \right\rfloor\\{% endkatex %}

We may recurse up the tree once finding the desired data block to quickly create a path to our data node in order to execute such functions as tree modification quickly; using either the found hash of the parent node and adding it to an array which is reversed (in order to go parent --> child rather than child --> parent) or alternatively using the [modulo](https://en.wikipedia.org/wiki/Modulo_operation)[^whymod] of the previously stated equation each time to figure if the data block/last node was to the left or right of a given parent node.

In [Python](https://www.python.org/), we may write the modulo-based (non-recusive for simplicity) method similar to the following:

```python
array_binary_tree = [
	"alpha",
	"bravo", "echo",
	"charlie", "delta", "foxtrot", "golf"
]

golf_pos = 6
golf = array_binary_tree[golf_pos]

parent = (golf_pos - 1) / 2 # should be 2.5

if parent % 0 == 0:
	print("golf is left")
else:
	print("golf is right")
```

This should output the following:

```none
golf is right
```

[^whymod]: Modulo is used to determine if the number is an integer or a decimal as length determines {% katex %}\frac{n-1}{2}{% endkatex %} may provide a `.5`

### Multithreading

A secondary but often overlooked part of the speed of merkle trees is multithreading -- as seen with the [git package manager](https://en.wikipedia.org/wiki/Git), multithreading is not used (most likely due to the age of this platform). It may speed up systems with little to no overhead, especially on modern systems with a high number of cores.

Multithreading is especially important in the light of merkle trees as compared to other binary trees due to two main factors:

1. [Embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel)[^ebparralel]
2. Hashing is computationally demanding compared to simply inserting data

For example, if given an example list, we could easily split it up and assign each thread a new task by data blocks divided by cores, i.e. {% katex %}\frac{d}{c}{% endkatex %} as a simplistic method of multithreading, which would look similar to the following chunk splitting function in [Rust](https://www.rust-lang.org/):

```rust
pub fn split_n_chunks<T: std::fmt::Debug>(
    mut items: Vec<T>,
    min: usize,
    desired_chunks: usize,
) -> Vec<Vec<T>> {
    if items.len() <= min {
        return vec![items];
    }

    let mut output: Vec<Vec<T>> = vec![];

    let chunk_range = 0..(items.len() / desired_chunks);

    for _ in 0..desired_chunks {
        output.push(items.drain(chunk_range.clone()).collect())
    }

    match output.last_mut() {
        Some(el) => el.extend(items),
        None => output.push(items),
    };

    output
}
```

Where the values inputting into this `split_n_chunks` function match the following:

| Variable Name | Datatype | Description |
|-|-|-|
| `items` | `Vec<T>` -- List containing input (data blocks) | Items to split into chunks for the purposes of multithreading |
| `min` | `usize` -- Unsigned machine-dependant integer (e.g. `u32` on 32-bit) | Minimum allowed length of `items` before function doesnt modify |
| `desired_chunks` | `usize` -- Unsigned machine-dependant integer (e.g. `u32` on 32-bit) | Representative of amount of cores, i.e. how many chunks to divide into |

Note that this is a simple demonstration of splitting data into chunks for  parallelization and it's not representative of the best practises. In reality, you should split large lists/arrays/vectors into smaller then {% katex %}\frac{d}{c}{% endkatex %} and have a thread pool executing so if a thread slows for a specific worktask, the other threads can continue more efficiantly.

[^ebparralel]: Merkle trees may be easily split into chunks for processing cores to compute, scaling perfectly to the number of hashes proportional to the logarithm of the number of leaf nodes of the tree, divided by core count, i.e. {% katex %}\frac{\log\left( n \right)=h}{c}{% endkatex %}

## Links

Some external links to find out more about this whitepaper and any primary work based upon it:

- Git repository for Irkle -- [Link](https://github.com/owez/irkle)
- Whitepaper link (the page your viewing) -- [Link](https://ogriffiths.com/2020/irkle-whitepaper)

## Citations