---
layout: post
title: Playlist visualiser
tagline: Creating a playlist visualiser with Pillow and ffmpeg
catagories: Showcases
---

{% include toc.md %}

There has recently been a spike in popularity with playlist videos on youtube, presenting a scrolling playlist of a specific genre as music in video, as well as audio form, I've wanted to create one of these videos but automate the process as much as possible to put programming to a real task!

Not to mention that this was also a perfect oppertunity to tinker with image libraries such as [PIL](https://pypi.org/project/PIL/) or the more recent [Pillow](https://python-pillow.org/) based upon the fomer for the first time, for use in more projects down the road.

# Videos

Some videos of the finshed visualiser in action:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Sl3XgtKYq4E" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/annp92OPZgQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/5kCtzdOUTFw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Creating the script

## Generation process

To make this script work, I first thought up a plan for converting a playlist in a folder all the way to a finished video that went like so:

![Flow diagram]({{ site.baseurl }}{% link public/img/mkplay-diagram.png %})

Essentially, I would loop over all files in a given directory, let's say `/music` and build my own tagging api (which can now be found [here](https://github.com/owez/tagzen)!) to tag all the images and make a nice "\[artist] - \[album] - \[song]" representation of a song in succession.

Once all the songs where tagged and made into a central `Song` class with the tagging attached, I looped over them and used the aforementioned Pillow library to generate an image for each one -- including an optional background image of my choosing.

## Initial success

My first semi-successful test of this playlist generator was this screenshot of a rendered [Radiohead](https://en.wikipedia.org/wiki/Radiohead) album:

![Radiohead album rendered](https://raw.githubusercontent.com/Owez/mkplay/master/examples/eg2.png)

As you can see, I had the basic fonts and layout working -- along with a little indicator which shows the active song which shows as the song in question is playing once generated.

There is some descrepencies and parts that don't look great on this render though; for example, the title font is too large and bold as compared to the rest of the image and the text that goes from "In Rainbows" to "From the Basement" has a strange double-space.

## Continuing on

Once these issues where found, I fixed them with a simple font change to un-bold the font and a [regex](https://en.wikipedia.org/wiki/Regular_expression) fix to match some edgecases in the tagging api.

Eventually, I fixed the tagging api a little more to fix when the album name is the same as the song name which is caused sometimes by strange file metadata.

I also added the option mentioned in the previous section(s) to add a background image, which made the resulting visualisation much nicer, resulting in the image you can see in the [screenshots](#screenshots) section at the top of this post.

# Conclusion

The script, now called "mkplay", is quite easy to use and can be seen/downloaded on it's github repository:

[https://github.com/owez/mkplay](https://github.com/owez/mkplay)

## Links

This program was fun to make, though it does render quite slowly due to it making a single still image into a 1fps stretching over an hour long (making the render time ~10 mins). The Pillow library was suprisingly easy to work with and I did have some [initial trouble](https://github.com/kkroening/ffmpeg-python/issues/468) with ffmpeg due to the lack of documentation, and lack of brains on my part 😄

That's all for now!
