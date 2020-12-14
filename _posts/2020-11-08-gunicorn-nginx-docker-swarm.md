---
layout: post
title: Gunicorn + Nginx + Docker Swarm = 💖
tagline: An in-depth guide to using gunicorn, nginx and docker swarm in harmony
---

{% include toc.md %}

## About

This semi-tutorial, semi-writeup will demonstrate how to properly configure a DevOps setup involving [docker-swarm](https://docs.docker.com/engine/swarm/) using [gunicorn](https://gunicorn.org/) and [nginx](https://www.nginx.com/) for automated container management for as small api or web app.

For this, I will be using [Flask](https://palletsprojects.com/p/flask/) as the app for gunicorn to run but this can just as easily be done with [Django](https://www.djangoproject.com/) or even switching gunicorn out entirely in favour of a [Quart](https://pypi.org/project/Quart/) + [Hypercorn](https://pypi.org/project/Hypercorn/) based solution (which should just be a drop in!).

First we'll be looking at the project file setup. This is quite an in depth tutorial, so buckle up! 

## Project setup

### File structure

The method I personally recommend is to make a file structure following such:

```none
Repository root        | Your repository directory
    Dockerfile         | Dockerfile to run your_app from
    docker-compose.yml | Compose file to manage containers
    conf               | Configuration files, optional
        nginx.conf     | Nginx base file which imports prod.conf
        prod.conf      | nginx production reverse-proxy
    your_app           | Your flask/django/quant/etc app
        __init__.py    | Module file containing `app`
        other files    | Anything else you require
    wsgi.py            | WSGI file to run production gunicorn
```

Make sure the `__init__.py` file has an `app` that you can easily run without any configuration from the `wsgi.py` files (which will be what docker runs to run gunicorn in a production environment).

### Installing dependencies

You will need to install the following dependencies in order to follow this tutorial:

- [Docker](https://www.docker.com/)
- [docker-compose](https://github.com/docker/compose)
- [Python 3.8](https://www.python.org/downloads/releases)/similar
- [gunicorn](https://gunicorn.org/) (inside python dependencies)
- [Flask](https://palletsprojects.com/p/flask/)/etc for your webapp (inside python dependencies)

As for python package management, I'd reccomend using [pipenv](https://pipenv.pypa.io/en/latest/) for this task and will be presenting this document herein using it -- with commands such as `pipenv install --system --deploy` for installing to the system.

## The WSGI (`wsgi.py`)

To make gunicorn run correctly, you should make a file running a variation of a Flask-like `app` which can `.run()` (or similar) to start the code.

If you are following along to this tutorial with Flask, you should be able to copy and paste the following `wsgi.py` file -- as long as you change the importing name of `my_web_app`!:

```py
# wsgi.py

from my_web_app import app

def launch():
    """Launcher for WSGI (gunicorn) to allow it to easily bind"""

    app.run()
```

## The `Dockerfile`

Now that everything is setup for development, it's time to open your newly-created `Dockerfile` and start writing!

I won't go over in too much depth what each line of a `Dockerfile` does but the jist of it is: a strange shell-like language where every command is separated on each line. To write a good `Dockerfile`, you will have to be weary of the position of each command so Docker can properly understand how to cache it.

As for the what the file should look like, here's my file from my recent [verata](https://github.com/verata) project:

```docker
# Dockerfile

FROM python:3.8

RUN pip install pipenv

WORKDIR /code

COPY Pipfile .
COPY Pipfile.lock .

RUN pipenv install --system --deploy

COPY verata-api.py
```

Even if you don't know the `Dockerfile`/"docker" language very well, you may be able to make out what's going on here.

First, it downloads the `python:3.8` image which is just like installing `apt install python3.8`. Once it has installed the basic python installation, we tell the pip package manager to install pipenv. Once pipenv is installed, we can then set our production folder as `/code` and copy our `Pipfile` into there -- this is similar to a `requirements.txt` file you may see floating about in repositories, it just lists all the packages that are needed to run the web app.

The last thing docker does when executing this file is copy over my `verata-api.py` file. **This should be substituted for your own web app files** because `verata-api.py` is a distinctly individual file tailored to my uses.

## Nginx Configuration

This section underlines the configuration of the nginx files. This tutorial expects you to have prior knowledge of nginx and how the configuration files are formatted. If you need a refresher, [here](https://medium.com/adrixus/beginners-guide-to-nginx-configuration-files-527fcd6d5efd) is a nice tutorial 😄

### The `nginx.conf`

> Note: This file is optional but recommended; if you are not using this, simply delete any future lines referencing the path

The `nginx.conf` file outlines the fundimential management of the nginx install and generally what global settings it should run. This file is typically stored in `/etc/nginx/nginx.conf` but in this case, as we are applying it to a container, it's just in the `./conf/nginx.conf` route:

```nginx
user  nginx;
worker_processes  1;
 
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    multi_accept       on;
    worker_connections 65535;
}

http {
    charset              utf-8;
    sendfile             on;
    tcp_nopush           on;
    tcp_nodelay          on;
    server_tokens        off;
    log_not_found        off;
    types_hash_max_size  2048;
    client_max_body_size 16M;

    # MIME
    include              mime.types;
    default_type         application/octet-stream;

    # Logging
    access_log           /var/log/nginx/access.log;
    error_log            /var/log/nginx/error.log warn;

    # Load configs
    include              /etc/nginx/conf.d/prod.conf;
}
```

The main thing that should be changed from any normal configuration file is potentially a direct link to the `prod.conf` file as we see on the 2nd to last line:

> ```nginx
include              /etc/nginx/conf.d/prod.conf;
```

But as stated previously, this entire configuration file is optional!

### The `prod.conf`

This is where the real magic happens: the production configuration file ✨

Lets see the file:

```nginx
upstream api_server {
    server api:8000;
    server localhost:8000;
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name localhost;

    location / {
          proxy_pass http://api_server/;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
  }
}
```

#### The `upstream` tag

As you can see, this configuration does many things. Let's focus on that first block of code:

>```nginx
upstream api_server {
    server api:8000;
    server localhost:8000;
    server 127.0.0.1:8000;
}
```

This indicates to docker that the server (where nginx should be connecting to) is located on whatever "`api`" is. As you may have seen in our docker-compose, our service is also named `api` and Docker actually is clever and links this "`api`" in nginx to our api/web app's network automatically!

As for the other `localhost:8000` and `127.0.0.1:8000`, they are just used for debugging and **should be removed for production**.

#### Main files

The rest of the configuration files follow along the lines of:

> ```nginx
> server {
>     listen 80;
>     server_name localhost;
>  
>     location / {
>         proxy_pass http://api_server/;
>         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
>         proxy_set_header Host $host;
>         proxy_redirect off;
>     }
> }
> ```

This is just typical nginx configuration as you can see. $host is also a Docker-centric alias to automatically generate a host name (presumably based on an [environment variable](https://en.wikipedia.org/wiki/Environment_variable)).

Once you have added the basic `server {}` block, it's time to add the Compose file!

## The Compose file (`docker-compose.yml`)

Docker uses a system called "Compose" -- or `docker-compose` -- to manage multiple containers. This is extremely useful for doing something called "side-carting": the practise of having a main container and a side container that's only goal is to assist the main container.

In this project, the real-world example of a sidecart is the nginx installation that helps just to serve the webapp. We can see this here in my `docker-compose.yml`:

```yml
# docker-compose.yml

version: "3.8"

services:
    api:
        build:
            context: .
            dockerfile: Dockerfile
        image: verata/api:latest
        command: gunicorn --bind 0.0.0.0:8000 --workers 8 verata-api:app
        secrets:
            - SECRET_KEY
            - PG_URL

    nginx:
        image: nginx:latest
        ports:
            - 80:80
        volumes:
            - "./conf/nginx.conf:/etc/nginx/nginx.conf"
            - "./conf/prod.conf:/etc/nginx/conf.d/prod.conf"
        depends_on:
            - api
        deploy:
            mode: global

secrets:
    SECRET_KEY:
        external: true
    PG_URL:
        external: true
```

As you may be able to see, we have two "services"; one is called `api` which uses the `Dockerfile` we just made to copy all of our web app files to a container ready to run. Lets take a look at this first!

### The `api` service

The `api` service is the following block from the code block in the last section:

> ```yml
services:
    api:
        build:
            context: .
            dockerfile: Dockerfile
        image: verata/api:latest
        command: gunicorn --bind 0.0.0.0:8000 --workers 8 verata-api:app
        secrets:
            - SECRET_KEY
            - PG_URL
```

We will be further understanding each line in the sub-sections below!

#### `Dockerfile` reference

This service is the "runner" of our main container, of which the `Dockerfile` acts as the script to deploy this container. This may be seen with the following lines:

> ```yml
build:
    context: .
    dockerfile: Dockerfile
```

These lines tell Compose that the management is based off of the container we specified inside of the `Dockerfile`. The rest of the sections under the `api` service just dictate how to manage this Dockerfile.

#### Docker Hub pulling

The following line I will go over briefly:

> ```yml
image: verata/api:latest
```

All this line does is allow `docker-swarm` to properly pull a new container by specifying one on the [Docker Hub](https://hub.docker.com/) instead of building from our `Dockerfile`. This is because ideally many servers shouldn't ever have to build a container, only pull one from a constantly updating source when required to by docker-swarm.

Once you are further through this tutorial, add your username here and the repository you `docker-compose push api` (where `api` is the name of your service), but for now this doesn't matter too much 😄

#### Gunicorn command

Now is where we really get into the fun stuff!

> ```yml
command: gunicorn --bind 0.0.0.0:8000 --workers 8 verata-api:app
```

This line tells gunicorn, which should have been installed through pipenv, to bind to my `verata-api.py` file (expressed as `[module name]:[function]`). If you where following the previous parts of the tutorial, you should have made a `wsgi.py` file with the following inside of it:

> ```py
> # wsgi.py
>  
> from my_web_app import app
>  
> def launch():
>     """Launcher for WSGI (gunicorn) to allow it to easily bind"""
>  
>     app.run()
> ```

As we can also see in the YAML code block, there is a `--workers 8`. This is referring to gunicorn's [workers](https://stackoverflow.com/questions/38425620/gunicorn-workers-and-threads), which allow multiple threads and similar to work in concurrency with each other.

#### Secrets

After the gunicorn startup command, we can observe the file making "[Docker secrets](https://docs.docker.com/engine/swarm/secrets/)", a method in which sensitive information can be shared securely throughout an entire docker-swarm instance:

> ```yml
secrets:
    - SECRET_KEY
    - PG_URL
```

In this section of the `api` service, we define which secrets to store. This is reflected at the end of our `Dockerfile` with the following lines:

> ```yml
secrets:
    SECRET_KEY:
        external: true
    PG_URL:
        external: true
```

This sets the secrets to be used and the point at which they may be defined. The `external: true` tag just forces the secrets to be externally defined using the `docker secret [..]` command.

### The `nginx` service

The `nginx` service is the following block from the code block in the upper-level "*The Compose file (`docker-compose.yml`)*" section:

> ```yml
    nginx:
        image: nginx:latest
        ports:
            - 80:80
        volumes:
            - "./conf/nginx.conf:/etc/nginx/nginx.conf"
            - "./conf/prod.conf:/etc/nginx/conf.d/prod.conf"
        depends_on:
            - api
        deploy:
            mode: global
```

This service defines our nginx container and the configuration files to use.

#### Nginx image

As you can see with the following line:

> ```yml
image: nginx:latest
```

This nginx container is pulled from the official docker repositories and **requires no custom nginx container**, which is very handy for easy nginx management and less costs of [Docker Hub](https://hub.docker.com/)'s repositories which cost ***[$5 per month](https://www.docker.com/pricing)*** minimum with more then one -- but luckily we only need one because we use the official container! 🎉

So this line first pulls the official nginx container image, defining the actual nginx environment to run.

#### Port setup

In order to route our networks, we need to define our input and output ports in the schema of `[output]:[input]` (e.g. the public input maps to the output inside of the swarm network).

We can do this with the following line as shown:

> ```yml
ports:
    - 80:80
```

#### Volume setup

Once we have defined our nginx configuration files as we have done in one of the previous sections, we import them for the Compose file to use as so:

> ```yml
volumes:
    - "./conf/nginx.conf:/etc/nginx/nginx.conf"
    - "./conf/prod.conf:/etc/nginx/conf.d/prod.conf"
```

This just maps our volumes straight over like a `mv` command to where we want them. So for example in our case:

```none
./conf/nginx.conf GETS MOVED TO /etc/nginx/nginx.conf, OVERWRITING ANYTHING THERE PREVIOUSLY
```

#### The `depends_on` and `deploy`

These two are simple:

> ```yml
depends_on:
    - api
deploy:
    mode: global
```

They just say that the `nginx` service must be built/ran *after* the `api` service is built/ran in order for there not to be any conflicts.

As for the `deploy` section, the `mode: global` simply states to the Compose file that for each running `api` container (or "replica"), an `nginx` container must be built alongside it, as is specified in [the documnentation](https://docs.docker.com/engine/swarm/how-swarm-mode-works/services/).

## Working with Docker commands

***TODO: soon™️***

I have currently not gotten around to finish this blog post as it has gotten quite long. I'd be happy to help if you need any small assistance; you can find me on my *contact* page 😄
