# lczech/trai `scripts/nested.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME and XDG_CONFIG_HOME point into a `mktemp -d` dir; HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited, and the real `trai` config dir is symlinked in. [scripts/nested.sh:7, scripts/nested.sh:20-24, scripts/nested.sh:28]
A2. The `gsettings` writes run on the private bus from `dbus-run-session`, with the temp XDG_CONFIG_HOME; DCONF_PROFILE is not reset. [scripts/nested.sh:28, scripts/nested.sh:30-32]
A3. `dbus-run-session` provides a private session bus; the systemd user manager is not addressed. [scripts/nested.sh:28-30]
A4. Not handled.
A5. `gnome-shell --nested --wayland` runs as a window on the host; DISPLAY, WAYLAND_DISPLAY and the real XDG_RUNTIME_DIR are inherited. [scripts/nested.sh:33]
A6. Not handled; the real XDG_RUNTIME_DIR is inherited. [scripts/nested.sh:28-33]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited. [scripts/nested.sh:28-33]
A8. Not handled. [scripts/nested.sh:28-33]
A9. On exit the cleanup sends SIGTERM to every process whose `/proc/<pid>/environ` contains `XDG_DATA_HOME=$tmp/data`; trapped on EXIT, INT and TERM. [scripts/nested.sh:9-18]
A10. Not handled. [scripts/nested.sh:33]
A11. Not handled. [scripts/nested.sh:33]
A12. The extension is copied into the temp data dir and enabled only in the temp dconf; the crash flag is not handled. [scripts/nested.sh:20-22, scripts/nested.sh:31]
A13. Not handled; the real `trai` config is shared through a symlink. [scripts/nested.sh:24]

## B. Lifecycle

B1. No tool or version checks; Ubuntu is detected by the presence of `/usr/share/gnome-shell/modes/ubuntu.json`. [scripts/nested.sh:26-27]
B2. Copies `gnome-extension/` into the sandbox and compiles its schemas there. [scripts/nested.sh:22-23]
B3. A new `mktemp -d` per run, removed by the cleanup. [scripts/nested.sh:7, scripts/nested.sh:16, scripts/nested.sh:18]
B4. `dbus-run-session -- sh -c ...` as the last command. [scripts/nested.sh:30]
B5. `enabled-extensions` and `welcome-dialog-last-shown-version '999'`. [scripts/nested.sh:30-33]
B6. `cp -r` into `$tmp/data/gnome-shell/extensions/<uuid>`. [scripts/nested.sh:20-22]
B7. `enabled-extensions` set to this UUID; `disable-user-extensions` is not touched. [scripts/nested.sh:30-33]
B8. `exec gnome-shell --nested --wayland $mode`, with `--mode=ubuntu` on Ubuntu; size from MUTTER_DEBUG_DUMMY_MODE_SPECS, default 1600x900; no scale. [scripts/nested.sh:26-29, scripts/nested.sh:33]
B9. Not handled. [scripts/nested.sh:30-33]
B10. Not handled. [scripts/nested.sh:30-33]
B11. Not handled.
B12. Output goes to the terminal; no explicit exit status handling. [scripts/nested.sh:30-33]
B13. The cleanup is trapped on EXIT, INT and TERM; the INT/TERM handler does not exit. [scripts/nested.sh:11-18]
B14. Kills the processes that carry the sandbox's XDG_DATA_HOME and runs `rm -rf "$tmp"`. [scripts/nested.sh:11-17]

## C. Properties

C1. Bound to this project: fixed UUID, `gnome-extension/` source and the `trai` config link. [scripts/nested.sh:6, scripts/nested.sh:22, scripts/nested.sh:24]
C2. No arguments; MUTTER_DEBUG_DUMMY_MODE_SPECS sets the size and XDG_CONFIG_HOME is read as the link source. [scripts/nested.sh:24, scripts/nested.sh:29]
C3. Each run uses its own temp dir and bus, and the cleanup matches only its own temp path. [scripts/nested.sh:7, scripts/nested.sh:13, scripts/nested.sh:30]
C4. No version detection; Ubuntu mode when ubuntu.json exists. [scripts/nested.sh:27]
C5. POSIX `sh`, `mktemp`, `cp`, `glib-compile-schemas`, `ln`, `tr`, `grep`, `kill`, `basename`, `dirname`, `dbus-run-session`, `gsettings`, `gnome-shell`; Linux `/proc`; 33 lines. [scripts/nested.sh:1-33]
C6. Nothing in the sandbox. [scripts/nested.sh:16]
C7. Not stated; the file has no license header. [scripts/nested.sh:1-33]
