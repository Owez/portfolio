---
layout: post
title: Continued work on Jingo 🖥️
tagline: An update about the language I've been working on
categories: Updates
---

I'm switching out my previous main project (learning Vue.js by creating a [markdown editor]({{ site.github }}/zypo)) to an older project I have been slowly working on over the last couple of months. It is a large stepping stone in learning compiler development to me and is my first "proper" programming language, **Jingo**.

The plan for Jingo is to be lightweight (excluding building from source), statically linked, easy to write and *simple*. I also wanted to write everything 100% myself inside the language to know what everything does and therefore the lexer and parser are hand-written. By simple I mean a very functional and easy-to-use language but not a high degree of syntaxic complexity.

## Syntax

The syntax of Jingo relates back to [Python](https://en.wikipedia.org/wiki/Python_(programming_language)) and [Lua](https://en.wikipedia.org/wiki/Lua_(programming_language)) syntax, borrowing the ergonomics of Python and accidently inspired class system and simpleness of Lua:

```jingo
-!- This snippet shows how classes work in Jingo.

--- The breakfast class, providing the main breakfast implamentations found
--- inside of this snippet
class Breakfast;

--- Automatically gets passed `this`
fun Breakfast.new(food) {
    this.food = food;
}

--- Prints out food for breakfeast
fun Breakfast.print_food() {
    print(this.food);
}

var my_breakfast = Breakfast.new("cool_food");

my_breakfast.print_food(); -- Will print `Apples`
my_breakfast.food = "Cherries"; -- Change `Apples` to `Cherries`
my_breakfast.print_food(); -- Will now print `Cherries`
```

I say accidently inspired for objects as I was brainstorming and jotting initial ideas down and eventually ended up with a very lua-like syntax! Here is some basic classes in lua:

```lua
-- Meta class
Rectangle = {area = 0, length = 0, breadth = 0}

-- Derived class method new

function Rectangle:new (o,length,breadth)
   o = o or {}
   setmetatable(o, self)
   self.__index = self
   self.length = length or 0
   self.breadth = breadth or 0
   self.area = length*breadth;
   return o
end

-- Derived class method printArea

function Rectangle:printArea ()
   print("The area of Rectangle is ",self.area)
end
```

As you can see, some parts are accidently very similar 😄

## Naming

I picked the name "Jingo" after having an earworm similar to [this song](https://en.wikipedia.org/wiki/Jingle_Jangle_(The_Archies_song)) for whatever reason and "jingo" being similar to "jingle jangle". Once I searched on a dictionary for the meaning of Jingo (as I felt I heard it occasionally in usage), it provided me: `extreme chauvinism or nationalism marked especially by a belligerent foreign policy` which seemed suitable and quite funny for a new programming language with some new concepts.

![The definition]({{ site.baseurl }}{% link public/img/jingoism-definition.png %})

## Links

Some links to find Jingo-related bits and bobs:

- **[Compiler core + official CLI]({{ site.github }}/jingo)**
- [Example of Jingo in use]({{ site.github }}/jingo/tree/master/examples)
- [Tutorial used for inspiration](https://craftinginterpreters.com/)
