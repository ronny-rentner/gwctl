# Review questions

## A. Shared with the real session

For each item: what does the launcher do to separate it from the real session?

1. Files: config, data, cache, state, runtime dir, HOME, TMPDIR.
2. Settings: dconf or another GSettings backend, also for services the bus starts.
3. Session bus and its activation environment, including the systemd user manager.
4. System bus: logind, NetworkManager, polkit.
5. Display: the host's Wayland socket, X11 and Xwayland.
6. Audio and video: PipeWire, PulseAudio.
7. Secrets: keyring, SSH agent.
8. Portals, gvfs, FUSE mounts.
9. Processes: kill patterns, signals, process groups.
10. Input: keyboard and pointer grabs, screen locking.
11. GPU and rendering.
12. The real shell's state: crash flag, installed and enabled extensions.
13. Network and external services: downloads, tokens.

## B. Lifecycle

For each phase: what does the launcher do?

1. Prerequisites and version detection.
2. Build and packaging.
3. Sandbox: create, reuse, reset.
4. Starting the bus or buses.
5. Initial settings.
6. Installing the extension.
7. Enabling it.
8. Starting the shell: mode, size, scale.
9. Detecting that the shell is ready.
10. Interaction: preferences, apps, helpers, eval and screenshots, control from outside.
11. Iteration: reloading after changes.
12. Observing: logs, exit status.
13. Stopping: traps, signals, timeouts.
14. Cleanup: processes, mounts, directories.

## C. Properties

1. Is it generic or bound to one project?
2. What is its interface: arguments, environment variables, subcommands?
3. What does it provide for running several instances at once?
4. Which GNOME versions, distributions and display servers does it target?
5. What does it depend on: language, external tools? How long is it?
6. What does it keep between runs?
7. Under which license is it published?
