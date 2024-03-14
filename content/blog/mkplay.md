+++
title = "Playlist Visualiser"
date = "2022-07-27"
updated = "2022-11-18"
draft = false
[taxonomies]
categories = ["Design"]
+++

# Introduction

There has recently been a spike in popularity with playlist videos on youtube, presenting a scrolling playlist of a specific genre as music in video, as well as audio form, I’ve wanted to create one of these videos but automate the process as much as possible to put programming to a real task!

Not to mention that this was also a perfect opportunity to tinker with image libraries such as [PIL](https://pypi.org/project/PIL/) or the more recent [Pillow](https://pillow.readthedocs.io/en/stable/) based upon the former for the first time, for use in more projects down the road.

# Generation

To make this script work, I first thought up a plan for converting a playlist in a folder all the way to a finished video that went like so:

![Generation diagram](/img/mkplay/mkplaydiag.png)

Essentially, I would loop over all files in a given directory, say `/music` for example, and build my own tagging API to tag all the images and make a nice representation of a song in succession like so:

```none
[artist] — [album] — [song]
```

Once all the songs where tagged and made into a central `Song` class with the tagging attached, I looped over them and used the aforementioned Pillow library to generate an image for each one — including an optional background image of my choosing.

# Success

Once I [completed](https://github.com/owez/tagzen) the API, my first semi-successful test of this playlist generator was this screenshot of a rendered Radiohead album:

![First working visualisation](/img/mkplay/mkplayeg.png)

It's good to see the visualiser working but there where still a few bugs to iron out; the title font is too large and bold as compared to the rest of the image and the album name has a strange double-space. 

Once all of the issues where fixed and some polish was added to the whole thing, I created two demo videos:

- [psychedelia.](https://www.youtube.com/watch?v=annp92OPZgQ)
- [one more time.](https://www.youtube.com/watch?v=Sl3XgtKYq4E)

# Conclusion

The script, now called "mkplay", is quite easy to use and can be seen/downloaded on it's GitHub repository:

[**https://github.com/owez/mkplay**](https://github.com/owez/mkplay)

I restored this article to be used in my new blog website, I originally wrote this article in January 2021. I've not done much with this program since, but I'd quite like to mention it to some of the people who make playlists; it would make for a good sequel.
