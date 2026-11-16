# iotserver24/wall-in `tests/nested-gnome.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_DATA_HOME and XDG_CACHE_HOME point into `.wall-in-test-data/nested` in the checkout or WALL_IN_NESTED_DIR; XDG_DATA_DIRS is reset to `/usr/local/share:/usr/share`. HOME, state, runtime dir and TMPDIR are inherited. [nested-gnome.sh:4-8]
A2. XDG_CONFIG_HOME is exported before `dbus-run-session`; GSETTINGS_BACKEND and DCONF_PROFILE are inherited. [nested-gnome.sh:5, nested-gnome.sh:13]
A3. Private bus via `dbus-run-session`; its address is written to `environment.json`. The systemd user manager is not addressed. [nested-gnome.sh:13, nested-gnome.sh:17]
A4. Not handled; the host system bus is inherited. [nested-gnome.sh:13]
A5. `--devkit --wayland --virtual-monitor 1280x720 --wayland-display "$WALL_IN_NESTED_DISPLAY" --no-x11` with the display name `wall-in-test-0`. [nested-gnome.sh:10, nested-gnome.sh:18]
A6. Not handled; runtime dir and audio variables are inherited. [nested-gnome.sh:13]
A7. Not handled; the whole environment is inherited. [nested-gnome.sh:13]
A8. Not handled.
A9. An `exec` chain without PIDs, traps or kill commands. [nested-gnome.sh:13, nested-gnome.sh:18]
A10. Not handled.
A11. Not handled.
A12. `extension.js` and `metadata.json` are copied into the test data dir. The real dconf is not written; the crash flag is not addressed. [nested-gnome.sh:11-12]
A13. None.

## B. Lifecycle

B1. Not handled; Python is hardcoded as `/usr/bin/python3`. [nested-gnome.sh:17]
B2. No build; two files are copied. [nested-gnome.sh:12]
B3. A fixed dir in the checkout, created with `mkdir -p`, reused and never reset; WALL_IN_NESTED_DIR overrides it. [nested-gnome.sh:4, nested-gnome.sh:11]
B4. `exec dbus-run-session`. [nested-gnome.sh:13]
B5. Sets enabled-extensions and disable-user-extensions false. [nested-gnome.sh:15-16]
B6. `cp` of `extension.js` and `metadata.json` only. [nested-gnome.sh:11-12]
B7. Through enabled-extensions before the shell starts. [nested-gnome.sh:15]
B8. Devkit, 1280x720 virtual monitor, Wayland only, fixed display name; scale not set. [nested-gnome.sh:18]
B9. Not handled; `environment.json` is written before the shell starts. [nested-gnome.sh:17-18]
B10. `environment.json` gives outside clients the bus address, XDG paths, WAYLAND_DISPLAY, XDG_CURRENT_DESKTOP and XDG_SESSION_TYPE; its use depends on those clients. [nested-gnome.sh:17]
B11. Not handled; a rerun copies the two files again. [nested-gnome.sh:12]
B12. Output goes to the terminal. [nested-gnome.sh:13, nested-gnome.sh:18]
B13. Not handled.
B14. Not handled; the test dir and `environment.json` remain. [nested-gnome.sh:4, nested-gnome.sh:17]

## C. Properties

C1. Bound to wall-in: UUID, paths and variable names. [nested-gnome.sh:4, nested-gnome.sh:9-12, nested-gnome.sh:15]
C2. No arguments; environment variable WALL_IN_NESTED_DIR. [nested-gnome.sh:4]
C3. The default test dir and the display name `wall-in-test-0` are fixed. [nested-gnome.sh:4, nested-gnome.sh:10, nested-gnome.sh:18]
C4. No version check; uses `gnome-shell --devkit`; Wayland only. [nested-gnome.sh:18]
C5. Bash, `/usr/bin/python3`, dbus-run-session, gsettings, gnome-shell; 19 lines. [nested-gnome.sh:1, nested-gnome.sh:13-18]
C6. The test dir: dconf database, extension copy, cache and `environment.json`. [nested-gnome.sh:4-7, nested-gnome.sh:11-12, nested-gnome.sh:17]
C7. Depends on the repository's license file; the script has no license header. [nested-gnome.sh:1-2]
