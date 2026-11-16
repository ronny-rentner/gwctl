# BuenGenio/Tuxistant `tools/try-nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_DATA_HOME and XDG_CACHE_HOME point into a `mktemp` dir under /tmp, set only on the gnome-shell command line [try-nested.sh:14, try-nested.sh:24]. HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited; the daemon runs with the real environment and both logs go to the real `$XDG_CACHE_HOME/tuxistant` [try-nested.sh:3, try-nested.sh:7, try-nested.sh:12, try-nested.sh:16].
A2. gnome-shell gets `GSETTINGS_BACKEND=keyfile` with a keyfile in the sandbox config dir [try-nested.sh:15, try-nested.sh:29-34]. The daemon gets the outer environment without the keyfile backend and with the real XDG_CONFIG_HOME [try-nested.sh:12].
A3. `dbus-run-session` gives daemon and shell a private session bus [try-nested.sh:35]. Systemd user manager: Not handled; XDG_RUNTIME_DIR is inherited [try-nested.sh:14-16].
A4. Not handled: the system bus address is not changed [try-nested.sh:12, try-nested.sh:16].
A5. The shell runs `--devkit --wayland --no-x11 --wayland-display tux-try` [try-nested.sh:16]. The host's WAYLAND_DISPLAY and DISPLAY are inherited by daemon and shell [try-nested.sh:12, try-nested.sh:14-16].
A6. Not handled: XDG_RUNTIME_DIR is inherited [try-nested.sh:12].
A7. Not handled: SSH_AUTH_SOCK, keyring variables and HOME are inherited [try-nested.sh:8, try-nested.sh:14-16].
A8. Not handled.
A9. The daemon's PID is stored and the daemon gets SIGTERM after the shell exits [try-nested.sh:12-13, try-nested.sh:18]. No signal traps, process groups or kill patterns.
A10. Not handled.
A11. Not handled: no renderer or GPU variables are set [try-nested.sh:14-16].
A12. The extension is copied into the sandbox data dir and enabled only in the sandbox keyfile; XDG_DATA_DIRS is unchanged [try-nested.sh:14-16, try-nested.sh:27, try-nested.sh:31]. Crash flag: Not handled; XDG_RUNTIME_DIR is inherited [try-nested.sh:14-16].
A13. Not handled: the daemon runs with the real config [try-nested.sh:3, try-nested.sh:12]; no downloads.

## B. Lifecycle

B1. Checks that /usr/libexec/mutter-devkit and `~/.local/bin/tuxistant` are executable, exits 1 with a hint otherwise [try-nested.sh:8, try-nested.sh:22-23]. No version detection.
B2. No build; requires a prior `./install.sh` [try-nested.sh:23] and compiles the copied schemas [try-nested.sh:28].
B3. Creates a new sandbox with `mktemp -d /tmp/tux-try.XXXXXX` each run and removes it on EXIT [try-nested.sh:24-25]; no reuse.
B4. Re-runs itself with `--inner` under `dbus-run-session` [try-nested.sh:10, try-nested.sh:35].
B5. Writes a keyfile with enabled-extensions, disable-user-extensions=false and welcome-dialog-last-shown-version='999' through a heredoc [try-nested.sh:29-34].
B6. Copies `extension/<uuid>` into the sandbox data dir with `cp -R` [try-nested.sh:27].
B7. Through enabled-extensions in the keyfile [try-nested.sh:31].
B8. `gnome-shell --devkit --wayland --no-x11 --wayland-display tux-try`; no size or scale [try-nested.sh:16].
B9. Not handled.
B10. Starts the real tuxistant daemon on the private bus before the shell [try-nested.sh:12]; no preferences, eval, screenshot or remote-control helpers.
B11. Not handled: the extension is copied at start [try-nested.sh:27].
B12. Shell and daemon output go to `try-shell.log` and `try-daemon.log` in the real cache dir [try-nested.sh:7, try-nested.sh:12, try-nested.sh:16]; the shell's exit status passes through both levels [try-nested.sh:17, try-nested.sh:19, try-nested.sh:35].
B13. No INT or TERM trap in either run; the outer EXIT trap removes the sandbox [try-nested.sh:12-18, try-nested.sh:25]. No timeout.
B14. The EXIT trap removes the sandbox [try-nested.sh:25]; the daemon is killed by PID [try-nested.sh:18]; logs stay.

## C. Properties

C1. Bound to Tuxistant: fixed uuid, daemon binary and extension path [try-nested.sh:6, try-nested.sh:8, try-nested.sh:27].
C2. No user arguments; `--inner <dir>` is the internal re-entry [try-nested.sh:10-11, try-nested.sh:35]. Reads XDG_CACHE_HOME for the log dir [try-nested.sh:7].
C3. The sandbox is unique [try-nested.sh:24], but the Wayland display name `tux-try` and the log file names are fixed [try-nested.sh:12, try-nested.sh:16].
C4. Requires gnome-shell `--devkit` and /usr/libexec/mutter-devkit, the hint names the Debian/Ubuntu package mutter-dev-bin [try-nested.sh:3, try-nested.sh:22]; Wayland only, no X11 [try-nested.sh:16].
C5. Bash, mutter-devkit, gnome-shell, dbus-run-session, glib-compile-schemas, mktemp and the installed tuxistant binary; 35 lines [try-nested.sh:1, try-nested.sh:8, try-nested.sh:16, try-nested.sh:22-35].
C6. Log files in `$XDG_CACHE_HOME/tuxistant` [try-nested.sh:7, try-nested.sh:26]; the sandbox is removed [try-nested.sh:25].
C7. Depends on the repository's license file; the script has no license header [try-nested.sh:1-4].
