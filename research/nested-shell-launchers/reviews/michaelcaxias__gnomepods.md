# michaelcaxias/gnomepods `dev/dev-shell.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME and XDG_DATA_HOME are exported into a `mktemp -d` dir [dev-shell.sh:14, dev-shell.sh:18]. HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are real.
A2. The exported XDG_CONFIG_HOME reaches dbus-run-session [dev-shell.sh:18, dev-shell.sh:26].
A3. `dbus-run-session` with the exported XDG_CONFIG_HOME and XDG_DATA_HOME [dev-shell.sh:18, dev-shell.sh:26]. Systemd user manager: Not handled; XDG_RUNTIME_DIR is inherited [dev-shell.sh:26].
A4. Not handled.
A5. `--devkit --wayland` without a display name or `--no-x11` [dev-shell.sh:23]; the host's display variables are inherited [dev-shell.sh:26].
A6. Not handled: XDG_RUNTIME_DIR is inherited [dev-shell.sh:26].
A7. Not handled: SSH_AUTH_SOCK, keyring variables and HOME are inherited [dev-shell.sh:26].
A8. Not handled.
A9. The mock daemon is started in the background and killed with `kill %1` after the shell exits, errors discarded [dev-shell.sh:20, dev-shell.sh:24]; no signal traps.
A10. Not handled.
A11. Not handled.
A12. The extension dir is symlinked from the repo, real user extensions are not in the redirected data dir [dev-shell.sh:17-18]. Crash flag: Not handled; XDG_RUNTIME_DIR is inherited [dev-shell.sh:26].
A13. Not handled; the default mode replaces the real daemon with dev/mock_daemon.py [dev-shell.sh:4, dev-shell.sh:20].

## B. Lifecycle

B1. Not handled.
B2. Not handled: no build and no schema compilation [dev-shell.sh:7, dev-shell.sh:17].
B3. A new mktemp dir each run, removed on EXIT [dev-shell.sh:14-15].
B4. `dbus-run-session -- bash -c`, the script's last command [dev-shell.sh:26].
B5. enabled-extensions and disable-user-extensions [dev-shell.sh:19-22].
B6. Symlink of `extension/` [dev-shell.sh:17].
B7. enabled-extensions [dev-shell.sh:21].
B8. `gnome-shell --devkit --wayland`; no size or scale [dev-shell.sh:23].
B9. Not handled; the mock daemon starts without a readiness check [dev-shell.sh:20].
B10. Depends on dev/mock_daemon.py, started unless `--real` is given [dev-shell.sh:4-6, dev-shell.sh:20].
B11. Not handled.
B12. Output goes to the terminal; the inner script ends with `kill %1 ... || true` [dev-shell.sh:24].
B13. No signal traps. No timeout.
B14. The EXIT trap removes the tmp dir [dev-shell.sh:15]; the mock daemon is killed [dev-shell.sh:24].

## C. Properties

C1. Bound to gnomepods: uuid and mock_daemon.py [dev-shell.sh:11, dev-shell.sh:20].
C2. Optional `--real`, forwarded into the inner script [dev-shell.sh:4-6, dev-shell.sh:20, dev-shell.sh:26].
C3. Unique tmp dir, no fixed display name [dev-shell.sh:14, dev-shell.sh:23].
C4. The comment names the Fedora package mutter-devkit [dev-shell.sh:9]; Wayland [dev-shell.sh:23].
C5. Bash, python3 for the mock, gsettings, dbus-run-session and gnome-shell; 26 lines [dev-shell.sh:1-26].
C6. Nothing [dev-shell.sh:15].
C7. GPL-3.0-or-later per SPDX header [dev-shell.sh:2].
