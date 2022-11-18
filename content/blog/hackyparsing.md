+++
title = "Hacky Parsing"
date = "2022-11-18"
[taxonomies]
categories = ["Parsers"]
+++

# Introduction

This is a bit of an unorthodox post underlining some of my (limited) history whilst creating parsers. One of these parsers, taken from my most recent project, is a 2-stage ordeal:

1. Converting from a plaintext language do an intermediate programmatic representation
2. Converting from the IR to binary data

The use of this parser is to essentially make an easy-to-write language which eventually ends up controlling a microcontroller.

Another limit to this parser is the quickness of development – partially to provide me with a code golf-like or hackathon challenge whilst writing, but also because I have set myself some loose deadlines for this part of the project to be completed.

# Completed Syntax

Before moving into the depths of design considerations whilst writing these parser(s), here is an example snippet of the completed plaintext language:

```c
// intro text
type "Hello world!" then ENTER
wait 2d

// final loop
type F5
loop 5
    loop 20
        type "I'm feeling loopy.."
    end
    
    type CTRL and F5
end

detonate
```

Don’t worry about the `detonate` part, its just a killer feature.

# Designing the IR

In order to design the language properly, I first wanted to have a nice system in place in order to act as a “middle man” for all encoding/decoding to and from the eventual binary format; as a sort of anchor for the limits of the language, and so force me to write a simpler style of parsers: assembly-like.

When I say assembly-like, I mean the methodology whilst having an action and some data attached for some actions, colloquially known as the OPCODE and OPRAND within assembly languages, for example:

<p align="center" style="margin-top:2rem;margin-bottom:2rem;">
    <img src="/img/hackyparsing/Assembly Example.png" alt="Assembly Examples" width="600" />
</p>

To do this, the entire “IR” is simply a large central enumeration with a single default implementation which allows encoding from whatever is defined within the enumeration into the final binary data.

This step of IR –> Binary is a central aspect for this project which I wanted to focus on. The magic of using this unified method is that many kinds of encoding (from different languages) can be used, and even different flavours of binary if potentially needed 😄

## Tradeoffs

A small side point: It can be said that this 2-stage method of parsing is slower then directly from code to binary; but this specific parser isn’t speed-orientated, and the tradeoff is something that is much easier to standardize for the future and work with in my opinion.

# Designing the language

Built on top of the [previously mentioned](#designing-the-ir) intermediate representation is the plaintext language, used for the easy inputting of instructions which are then eventually compiled down into the final binary.

## Design goals

I wanted this language to fulfill 2 main criteria:

1. Easy to write for the user
2. Simple to parse

The final syntax is shown in a couple sections [above](#completed-syntax) this one and as you may be able to see, it is newline separated and is basically just an abstraction for the assembly-like instructions used.

| Plaintext      | Action binary                                  |
| -------------- | ---------------------------------------------- |
| `end`          | `00000101`                                     |
| `wait 2s`      | `00000010 aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa` |
| `loop forever` | `00000011`                                     |

The inspirations for the syntax was partially Python/LUA and partially just guesswork to create a resulting pseudocode-like language which beginners can (hopefully) understand!

## Stripping action + data

Inside of the parser, it loops over all the newlines and simply trims away any whitespace on either side of the actual text. Once this has happened, it splits the action from all of the data at the first space – this is the code which does so:

```rust
fn action_data(input: &str) -> (&str, &str) {
    match input.trim().split_once(' ') {
        Some((action, data)) => do_(action.trim(), data.trim()),
        None => do_(input.trim(), ""),
    }
}
```

If you can’t understand much Rust, here’s approximately the same code in Python:

```python
def action_data(input: str) -> (str, str):
    splitted = input.strip().split(" ")
    action = splitted[0].strip()

    if splitted.len() == 1:
        return (action, "")
    
    return (action, splitted[1:])
```

## Matching

Once stripped and a loop is in session, the parser has to match the action to the ones stored in the program. The vast majority of plaintext actions used line up with the IR version of the actions. There is one notable exception to this law with snippets, but that’s for later!

Here’s an excerpt for the main matching subprogram from the parser:

```rust
for action in the_stuff {
    match action {
        "snippet" => do_snippet(),
        "type" => do_type(),
        "wait" => do_wait(),
        "loop" => do_loop(),
        "end" => do_end(),
        "detonate" => do_detonate(),
        "" => continue,
        unknown => panic!("error here")
    }
}
```

As you can see, this is really just a very simple keyword matcher that could also be done with a long set of if statements.

## Snippets

Halfway through designing the plaintext language for this project, I decided I would like a system in which users could use “snippets”, allowing reuse of code stored on a server which you yourself could upload to. This helps with scripting as users can import more advanced users files easily, giving automated launchers into programs and such.

<p align="center" style="margin-top:2rem;margin-bottom:2rem;">
    <img src="/img/hackyparsing/Snippet API.png" alt="Snippet API Diagram" width="375" />
</p>

The design of the snippet system is a simple API hosted upon a currently *secret* address, which the plaintext library simply fetches and compiles whilst compiling the rest, like a C pre-processor. This is quite a crude way to do this and potentially (though realistically not) allows exploitation within the plaintext –> binary protocol compiler, which is acknowledged by the user if they use the feature.

To do this, a lightweight http library for Rust called `ureq` was used. This is a nice high-level library which is nice to work with for this purpose, but binding to [CURL](https://curl.se/) may be added shortly instead for less dependencies – even though this is made to be used as a full-powered desktop section of this project.

# Designing the binary

The design of the binary format isn’t really that different from the IR used for this project, simply being aliases for it, with all abstract types (such as integers) being formatted into binary little endian format.

Here’s the full list of potential actions, hopefully you can see how they link into the previously explained plaintext format:

<!-- | Denary | Name |
|-|-|
| `0` | Type character(s) |
| `1` | Combo type character(s) |
| `2` | Wait x ms |
| `3` | Loop forever |
| `4` | Loop x times |
| `5` | End block |
| `6` | Detonate |
| `7` | Words per minute | -->

<p style="margin-top:2rem;margin-bottom:2rem;">
    <img src="/img/hackyparsing/Assembly%20Instructions.png" alt="Snippet API Diagram" width="325" />
</p>

An example decoding from this binary format looks like the following:

```rust
use sprawl_format::decode;

fn main() {
    let binary = vec![0, 0, 1, 0, 0, 0, 2, 192, 101, 82, 0, 3, 2, 232, 3, 0, 0, 5];
    let decoded = decode(binary).unwrap();

    println!("Decoded representation: {:?}", decoded);
}
```

Where the numbers in the [`vec![]`](https://doc.rust-lang.org/std/vec/struct.Vec.html) part is the finished binary data in denary form, as Rust formats it like so by default.

The first 6 bytes (numbers) in this vector represent the protocol version and is included at the start of every transmission to block any versions higher then this. It’s encoded in 2 little endian bytes per number and follows the broader versioning for this whole project :)

# Final thoughts

Overall, this was a fun project that took a while to make in my spare time. There are definitely better (as in faster) ways to implement this system from what I have done programmatically, but speed doesn’t purely matter as speed in production will be capped to a limit most likely.

Many of the design decisions from this project was spurred on from the requirement of a [`no_std`](https://docs.rust-embedded.org/book/intro/no-std.html) environment within Rust, which is why this language is essentially assembly disguised as a high-level language. For my next project, I am attempting to implement a parser for a simplified version of markdown using vaguely the same style, but with many changes when it comes to the abstract syntax tree.

Thanks for reading and I hope you’ve learnt a thing or two :)
