---
layout: post
title: Rocket.rs basic authentication
tagline: A high-level basic access authentication request guard for Rocket.rs ✨
categories: Showcases
---

## About

Recently, I've created a simple library called `rocket-basicauth` which allows a high-level interface to [basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) using request guards, as an extension for the [Rocket.rs](https://rocket.rs) web framework ✨

## Demonstration

Here is the jist of the *entire* functionality of this library:

```rust
/// Hello route with `auth` request guard
#[get("/hello/<age>")]
fn hello(auth: BasicAuth, age: u8) -> String {
    format!("Hello, {} year old named {}!", age, auth.name)
}
```

This example excludes the `use rocket;` imports and main function setups and just shows the crux of this library; the "BasicAuth" structure, documented [here](https://docs.rs/rocket-basicauth/1.0.0/rocket_basicauth/struct.BasicAuth.html).

## Links

Here are some links to find out more about this quick library:

- **Github: [{{ site.github }}/rocket-basicauth]({{ site.github }}/rocket-basicauth)**
- Crates.io: [https://crates.io/crates/rocket-basicauth](https://crates.io/crates/rocket-basicauth)
- Docs.rs: [https://docs.rs/rocket-basicauth](https://docs.rs/rocket-basicauth)
