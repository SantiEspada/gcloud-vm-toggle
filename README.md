# gcloud-vm-toggle

Simple script to toggle up/down a VM instance in Google Cloud Compute Engine.

## Motivation

I've recently set up a VSCode server in a Compute Engine instance using the amazing [code-server project](https://github.com/cdr/code-server) and it's great! It's really cool to have access to a performant, custom development environment wherever I am :D

Buuuut, I'm obviously not using it at all times, so keeping it running 24/7 would be a waste of resources and ultimately money: I needed some way to turn it off when I'm not using it. So I made this.

There are probably better/cooler solutions but I just wanted something quick and simple to start/stop the VM. Now, I can turn on/off the server with just a command! I don't know about you but I call that M A G I C 🎩🐇✨

## Requirements

- [Node.js](https://nodejs.org/en/) installed. I've tested it v12 LTS so I guess you should use that at least (?)
- An instance you want to turn on/off in [Google Cloud Compute Engine](https://cloud.google.com/compute) as the name of the project suggests 😅

## Quick start

1. Clone the project somewhere
1. Create a [Google Cloud Service Account Key](https://cloud.google.com/docs/authentication/getting-started). It must have write access to Compute Engine resources.
1. Create a `.env` file based on the provided `.env.example`.
1. _(Optional)_ Create an alias in your `.zshrc`, `.bashrc` or similar file:

```bash
alias codeup=`node /path-to-the-project/index.js up`
alias codedown=`node /path-to-the-project/index.js down`
alias codetgl=`node /path-to-the-project/index.js`
```

## Usage

`node index.js [up|down]`

- **`up`**: starts the machine and pings until it's reachable
- **`down`**: stops the machine
- When called with no arguments, it will check the current status and toggle it (i.e. `RUNNING` -> stop, `TERMINATED` -> start)
