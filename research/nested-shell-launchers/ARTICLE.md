# How GNOME Shell extension projects run a nested preview, and what I took from them

I develop GNOME Shell extensions. Testing one on my own desktop means installing it, logging out and logging back in. That gets old after the third time, so I wanted a preview: a second GNOME Shell in a window, with the extension loaded and nothing shared with my real session.

GNOME's extension guide has a recipe for this. On GNOME 49 and later it's `dbus-run-session gnome-shell --devkit --wayland`; before that it was `--nested`. The guide also says plainly that this isn't isolated. The nested shell uses your real extensions directory and your real settings.

## How I learned that isolation matters

My first launcher was a shell script that gave the nested shell its own XDG directories and its own session bus, and I thought that was enough. Then the preview came up with my extension disabled, and a look at my desktop's settings showed what had happened. `enabled-extensions` held only my extension, text scaling was 1.5, and four search providers were switched off. Those were the values the preview script sets. The preview had written its settings into my desktop instead of its own.

The cause was the order of two steps. The script started the private bus first and moved `XDG_CONFIG_HOME` afterwards. When the script later ran `gsettings`, the bus started dconf's service, and that service inherited the bus's environment, so it wrote into my real `~/.config/dconf/user`. The nested shell itself read its empty sandbox settings and saw no extension at all.

A few minutes later my real values were back. I still don't know what restored them. Probably some dconf process on my desktop saved its own copy over the preview's. It was luck.

## Surely someone has solved this already

The question was whether a proper tool exists for this. I searched GitHub's code for launcher scripts that call `gnome-shell --devkit` or `--nested` and also set `XDG_CONFIG_HOME`, and found 83 of them in 81 repositories. GNOME ships one of its own, `gnome-shell-test-tool`, which made 84.

There's no common tool. Every project carries its own script, from a 7-line one-liner to a 963-line development tool. 55 are bash scripts, 13 plain sh, 7 live in a Makefile, and the rest are Python, Node, a justfile, Bun and zsh.

## How I compared them

I didn't read 83 scripts by hand. I had AI agents read them, and that part needed more care than I expected.

First I wrote down the questions every launcher has to answer. They come from what a launcher is for, not from the code. If you take the questions from the code, you only learn what the authors thought of. There were three groups:

- What does the nested shell share with my real session? Files, settings, both buses, the display, audio, secrets, portals, processes, input, the GPU, the real shell's state, the network.
- What does the launcher do in each phase, from checking prerequisites to cleaning up?
- Is it generic or bound to one project, what is its interface, what does it keep between runs?

One reviewer per batch answered every question for every launcher, with a line reference for each answer. A second round of reviewers checked every answer against the code and changed 605 of about 4,800, mostly to fill gaps. Then I had 8 launchers reviewed again by agents that never saw the first reviews. They still found about 350 facts the checked reviews lacked. One reading, even a checked one, wasn't enough.

I also dropped a whole category of answers. The first reviews were full of verdicts like "this trap aborts early, so cleanup never runs". None of those scripts had been run the way their authors run them, so none of those claims was proven. The final reviews only say what each script does and which approach its author chose. Whether it works on the author's machine isn't something I can judge from reading.

Finally I pinned every link to the commit I reviewed. That turned out to matter quickly: one of the repositories had disappeared from GitHub two days later.

## What the 83 launchers do

The common core is the same almost everywhere: `dbus-run-session` in the foreground, redirected XDG directories, and `gnome-shell --devkit`. Only three start their own `dbus-daemon`. 71 launchers open the shell with `--devkit` and 17 with `--nested`, the option before GNOME 49; some support both. 13 can run the shell headless.

Settings are where they differ most:

| How settings are separated | Launchers |
|---|---|
| dconf, with `XDG_CONFIG_HOME` set before the bus starts | 39 |
| GSettings keyfile backend | 21 |
| not separated at all | 10 |
| GSettings memory backend | 2 |
| a separate database inside the real `~/.config/dconf` | 2 |
| left to a caller or a helper | 7 |

The dconf group depends on exactly the ordering that bit me. Three of those scripts carry a comment warning about it, and one describes a leak it once caused. Only six launchers check their own isolation, for example by reading the environment of the running dconf service, or by comparing the modification time of the real database before and after.

Before the shell starts, 59 launchers write `enabled-extensions` into the nested settings. Other common presets are `disable-user-extensions` set to false (34), the welcome dialog marked as already shown (17), and version validation turned off, so that an extension also loads on a shell version its metadata doesn't list (4).

Getting the extension into the sandbox splits them again. 21 link the source checkout, so the preview runs whatever is in the working tree. 18 copy files and 7 unzip a bundle. 12 install the packed bundle with `gnome-extensions install`, which is what a user installs too. Reloading still means restarting: 23 launchers rebuild and reinstall at the next start, and only one disables and re-enables the extension inside the running shell.

13 install the extension into the real `~/.local/share`, even when their settings are separate. A private runtime directory is rare.

Only two of the 84 take an extension package, read its UUID and install and enable it entirely on their own: ddterm's `run_nested_shell.py` and GNOME's `gnome-shell-test-tool`. The test tool uses the keyfile backend and gets the UUID from `gnome-extensions install --print-uuid`. It always needs an automation script, though, and it doesn't start a bus of its own.

## What I took for my own launcher

My script now takes the extension's zip package. Inside its private bus it runs `gnome-extensions install --force --print-uuid` and enables the UUID that comes back. It needs no hardcoded UUID and no file list, so one copy of the script serves any extension, and the preview runs the actual package.

For settings, I switched to the keyfile backend, with `DCONF_PROFILE=/dev/null` so that dconf gets an empty profile. dconf no longer starts at all, and the bus start order stops mattering for settings.

The script also gives the session a private runtime directory, so programs in the preview don't find the desktop's Wayland or PipeWire sockets. That has a price. The devkit viewer, the window that shows the nested shell, connects to PipeWire, and it can't reach the desktop's anymore. So the script starts its own pipewire and wireplumber, and stops them at the end, because they don't end with the bus. Only three launchers start their own PipeWire; four point the session at the desktop's.

Two problems showed up along the way.

Unix socket paths can have at most 108 bytes, terminator included. With the sandbox inside my project directory, pipewire's `pipewire-0-manager` socket went over that limit as soon as the directory name got longer. I tried a relative `PIPEWIRE_RUNTIME_DIR`. pipewire and wireplumber were happy with it, but the devkit viewer couldn't find the socket, and the shell shut down. I went back to a short directory name, `build/preview`.

The script exported my desktop's Wayland socket as `WAYLAND_DISPLAY` because the devkit window has to appear on my desktop. But the private bus passed that variable on to every service it started. A terminal server or a portal dialog started that way would have opened on my real desktop. Now only gnome-shell gets the host socket. Everything else finds the nested shell's own `wayland-0` in the sandbox's runtime directory. Eight launchers unset or drop the desktop's display variables.

Finally, the script writes the private bus address to a file. Tools outside the preview read it to talk to the nested shell instead of the desktop, for example `gnome-extensions` or `gdbus`. 12 launchers do the same.

## Testing without watching

A preview needs someone to watch it. A test shouldn't. GNOME Shell can start without a screen: `--headless --virtual-monitor 1920x1080` gives it a virtual monitor, and `--automation-script` loads a JavaScript file that runs inside the shell with the shell's whole API at hand. Such a script can create a virtual keyboard, start applications, call into the extension and take screenshots. 13 launchers run the shell headless, but only two use `--automation-script`. Others drive the session with JavaScript evaluated in the shell, with screenshots, or with a small driver extension that writes its result into a file.

Three things separate a test from a preview without a window.

First, wait for the extension, not for the shell. An extension that throws in `enable()` doesn't stop the shell; the shell keeps running and marks the extension as failed. Six launchers check that the extension reached the ACTIVE state after the start. Twelve sleep for a fixed time instead.

Second, let a failure reach the exit status. 19 launchers pass the shell's exit status on and 5 set it from log or state checks, but 13 discard it. A test that fails with exit status 0 only works while someone reads its log.

Third, start from the same state every time. For a preview, keeping the sandbox between runs is convenient, because settings changed by hand survive the next start. A test shouldn't depend on the last run. 31 launchers create a new temporary directory for every run and remove it at exit, 25 reuse a fixed one, and 7 offer a reset. With the keyfile backend, a reset is deleting one file, so my tests run in a sandbox directory of their own and reset its settings before each run.

Checking an extension against real applications needs a way to read back what they received. Two common GNOME applications provide one: Text Editor saves its document on Ctrl+S, and GNOME Terminal running `cat > file` writes every line it gets. The test reads those files and compares them with what it expected. What a file holds and what the screen shows can differ, so the test also takes a screenshot of each case.

## What stays with me

There's no shared tool for this, so every project solves the same problems again. If you build your own launcher, there are a few things I'd check first:

- Set your XDG directories before anything starts a bus, or use the keyfile backend so that the order no longer matters.
- Keep your desktop's `WAYLAND_DISPLAY` away from the bus.
- In tests, wait for the extension's ACTIVE state and let every failure reach the exit status.

The first two mistakes are easy to make and quiet when they happen.
