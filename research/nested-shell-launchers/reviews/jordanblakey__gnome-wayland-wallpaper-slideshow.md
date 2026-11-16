# jordanblakey/gnome-wayland-wallpaper-slideshow `run-debug-session.sh`

## A. Shared with the real session

A1. Not handled; HOME, all XDG dirs and TMPDIR are inherited. [run-debug-session.sh:16]
A2. Not handled; the real XDG_CONFIG_HOME is inherited, only the bus is new. [run-debug-session.sh:16]
A3. `dbus-run-session` gives the shell its own session bus; the systemd user manager is not handled. [run-debug-session.sh:16]
A4. Not handled. [run-debug-session.sh:16]
A5. `gnome-shell --devkit --wayland` with the inherited host display variables; Xwayland not disabled. [run-debug-session.sh:16]
A6. Not handled. [run-debug-session.sh:16]
A7. Not handled. [run-debug-session.sh:16]
A8. Not handled. [run-debug-session.sh:16]
A9. Runs `pkill -f "gnome-shell --devkit"`. [run-debug-session.sh:20]
A10. Not handled. [run-debug-session.sh:16]
A11. Not handled. [run-debug-session.sh:16]
A12. Not handled; the gnome-extensions commands are commented out. [run-debug-session.sh:10-13]
A13. Not handled. [run-debug-session.sh:16]

## B. Lifecycle

B1. Not handled. [run-debug-session.sh:1-25]
B2. Not handled. [run-debug-session.sh:1-25]
B3. Not handled. [run-debug-session.sh:1-25]
B4. `dbus-run-session` in a background pipeline; its exit status is not checked. [run-debug-session.sh:16]
B5. Not handled. [run-debug-session.sh:1-25]
B6. Not handled. [run-debug-session.sh:1-25]
B7. Not handled; EXTENSION_ID is exported but unused, the enable commands are commented out. [run-debug-session.sh:7-13]
B8. `gnome-shell --devkit --wayland` in the background; size and scale not handled. [run-debug-session.sh:16]
B9. Not handled. [run-debug-session.sh:16-19]
B10. Not handled. [run-debug-session.sh:1-25]
B11. Not handled. [run-debug-session.sh:1-25]
B12. Sets G_MESSAGES_DEBUG=all and SHELL_DEBUG=all and filters all output through `grep "Wallpaper Slideshow"`; the printed PID is `$!`. The shell's exit status is not checked. [run-debug-session.sh:4-5, run-debug-session.sh:15-17]
B13. Runs a fixed 12 s, then `pkill -f "gnome-shell --devkit"`, then prints STOPPED without checking; no trap. [run-debug-session.sh:16-24]
B14. Only the `pkill`. [run-debug-session.sh:20]

## C. Properties

C1. Bound to this extension through the grep filter. [run-debug-session.sh:16]
C2. None. [run-debug-session.sh:1-25]
C3. No: it runs `pkill -f "gnome-shell --devkit"`. [run-debug-session.sh:20]
C4. `--devkit`; no version handling. [run-debug-session.sh:16]
C5. Bash, dbus-run-session, gnome-shell, grep, pkill; 25 lines. [run-debug-session.sh:1, run-debug-session.sh:16, run-debug-session.sh:20]
C6. Everything; the session uses the real dirs. [run-debug-session.sh:16]
C7. Depends on the repository's license file; the given file has no license notice. [run-debug-session.sh:1-25]
