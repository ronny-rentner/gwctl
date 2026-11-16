# jerrinot/chorus `scripts/dev-shell.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME and XDG_DATA_HOME point into a `mktemp -d` dir in `${XDG_RUNTIME_DIR:-/tmp}`, but are set after dbus-run-session, for gnome-shell only. HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. [dev-shell.sh:7, dev-shell.sh:14-17, dev-shell.sh:38-43]
A2. gnome-shell uses GSETTINGS_BACKEND=keyfile in the temp config dir. [dev-shell.sh:27-33, dev-shell.sh:38-41]
A3. The shell runs under dbus-run-session. The systemd user manager is not touched, and XDG_RUNTIME_DIR is inherited. [dev-shell.sh:38-43]
A4. Not handled; the system bus is not redirected. [dev-shell.sh:38-43]
A5. Requires an inherited WAYLAND_DISPLAY or DISPLAY. [dev-shell.sh:9-12]
A6. Not handled; XDG_RUNTIME_DIR is inherited. [dev-shell.sh:38-43]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited. [dev-shell.sh:38]
A8. Not handled.
A9. Not handled beyond the trap that removes the temp dir; no kill or process-group handling. [dev-shell.sh:19-22]
A10. Not handled. [dev-shell.sh:43]
A11. Not handled; no renderer or GPU settings. [dev-shell.sh:43]
A12. Crash flag not handled. The temp data dir and the keyfile enabled list hold only this extension. [dev-shell.sh:17, dev-shell.sh:25, dev-shell.sh:33]
A13. No downloads or tokens.

## B. Lifecycle

B1. Requires WAYLAND_DISPLAY or DISPLAY, else exits 1 with a message; no tool or version checks. [dev-shell.sh:9-12]
B2. Depends on the `stage` target of the project Makefile, called with DEST set to the temp extension dir; failure ends the script via `set -e`. [dev-shell.sh:25]
B3. A fresh `mktemp -d` dir per run, removed by a trap. [dev-shell.sh:14, dev-shell.sh:19-22]
B4. `dbus-run-session`, as the last command. [dev-shell.sh:38-43]
B5. `enabled-extensions` written to the keyfile before the shell starts; failure ends the script via `set -e`. [dev-shell.sh:27-33]
B6. Depends on `make stage`. [dev-shell.sh:25]
B7. Through the keyfile `enabled-extensions`. [dev-shell.sh:33]
B8. `gnome-shell --devkit --wayland` with SHELL_DEBUG defaulting to `all`, no size or scale options. [dev-shell.sh:42-43]
B9. Not handled.
B10. Not handled; no prefs, eval, screenshot or external control.
B11. Not handled.
B12. Output goes to the terminal with SHELL_DEBUG=all by default. [dev-shell.sh:42]
B13. The trap on EXIT, HUP, INT and TERM removes the temp dir; the INT/HUP/TERM handler does not exit. No timeout. [dev-shell.sh:19-22]
B14. The temp dir is removed. [dev-shell.sh:20]

## C. Properties

C1. Bound to this project: UUID and the `stage` target. [dev-shell.sh:5, dev-shell.sh:25]
C2. No arguments; reads WAYLAND_DISPLAY, DISPLAY, XDG_RUNTIME_DIR and SHELL_DEBUG. [dev-shell.sh:7, dev-shell.sh:9, dev-shell.sh:42]
C3. Yes for the dirs, each run gets its own temp dir. [dev-shell.sh:14]
C4. Uses `--devkit --wayland` without fallback; no GNOME version or distribution stated or checked. [dev-shell.sh:43]
C5. POSIX sh, mktemp, install, make, gsettings, dbus-run-session, gnome-shell. 43 lines. [dev-shell.sh:1, dev-shell.sh:14-43]
C6. Nothing.
C7. Not stated in the script.
