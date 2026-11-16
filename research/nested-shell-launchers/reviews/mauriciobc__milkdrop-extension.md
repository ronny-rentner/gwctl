# mauriciobc/milkdrop-extension `tools/nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME and XDG_CACHE_HOME are redirected into a `mktemp -d` dir under XDG_RUNTIME_DIR (or `/tmp`); HOME, XDG_DATA_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR stay the real ones. [tools/nested.sh:7-8, tools/nested.sh:15-18]
A2. `GSETTINGS_BACKEND=keyfile` with the temp XDG_CONFIG_HOME; the private bus inherits both; install.sh also runs with them. [tools/nested.sh:4-5, tools/nested.sh:17-19, tools/nested.sh:28, tools/nested.sh:30]
A3. A private session bus from `dbus-run-session`; install.sh runs before it on the real session bus; systemd user manager not handled. [tools/nested.sh:28, tools/nested.sh:30]
A4. Not handled; the host system bus is inherited. [tools/nested.sh:30]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited; MUTTER_DEBUG_DUMMY_MODE_SPECS is set for the nested output. [tools/nested.sh:20, tools/nested.sh:30]
A6. Not handled; XDG_RUNTIME_DIR is not redirected. [tools/nested.sh:7, tools/nested.sh:30]
A7. Not handled; all variables, SSH_AUTH_SOCK included, are inherited. [tools/nested.sh:30]
A8. Not handled.
A9. Not handled; the script `exec`s `dbus-run-session` and sends no signals. [tools/nested.sh:30]
A10. Not handled.
A11. Not handled.
A12. Not handled for the crash flag, XDG_RUNTIME_DIR stays shared; the real XDG_DATA_HOME stays in use. [tools/nested.sh:7, tools/nested.sh:17-19, tools/nested.sh:30]
A13. Not handled in the given file; depends on install.sh. [tools/nested.sh:28]

## B. Lifecycle

B1. Not handled; no tool or version checks, only `set -eu`. [tools/nested.sh:2]
B2. Depends on install.sh ("latest extension build/schema"). [tools/nested.sh:26-28]
B3. A fresh `mktemp -d` dir per run. [tools/nested.sh:8]
B4. `dbus-run-session` starts the private session bus through `exec`; no system bus. [tools/nested.sh:30]
B5. Only environment: keyfile backend in the fresh, empty temp config dir, output size 1280x720, `G_MESSAGES_DEBUG=all`, `SHELL_DEBUG=all`; the given file writes no settings, install.sh runs with that keyfile backend. [tools/nested.sh:8, tools/nested.sh:15-22, tools/nested.sh:28]
B6. Depends on install.sh. [tools/nested.sh:28]
B7. Not handled in the given file; depends on install.sh, which runs with the temp config dir, the keyfile backend and the real session bus. [tools/nested.sh:17-19, tools/nested.sh:28]
B8. `gnome-shell --devkit --wayland`; size from MUTTER_DEBUG_DUMMY_MODE_SPECS, default 1280x720, overridable; no scale or mode. [tools/nested.sh:20, tools/nested.sh:30]
B9. Not handled.
B10. Not handled.
B11. Not handled.
B12. Debug output (`G_MESSAGES_DEBUG`, `SHELL_DEBUG`, default `all`) goes to the terminal. [tools/nested.sh:21-22]
B13. `exec` replaces the script; no timeout. [tools/nested.sh:30]
B14. `rm -rf "$NESTED_DIR"` in the trap. [tools/nested.sh:10-13]

## C. Properties

C1. Generic except the dir prefix `milkdrop-nested` and the call to the project's install.sh. [tools/nested.sh:8, tools/nested.sh:28]
C2. No arguments; overridable environment variables MUTTER_DEBUG_DUMMY_MODE_SPECS, G_MESSAGES_DEBUG, SHELL_DEBUG. [tools/nested.sh:20-22]
C3. Each run gets its own temp config and cache dir; the real XDG_DATA_HOME and XDG_RUNTIME_DIR stay shared between instances. [tools/nested.sh:7-8, tools/nested.sh:17-18]
C4. Uses `gnome-shell --devkit --wayland` without a version, distribution or display-server check. [tools/nested.sh:30]
C5. POSIX sh, dirname, mktemp, mkdir, rm, dbus-run-session, gnome-shell and install.sh; 30 lines. [tools/nested.sh:1, tools/nested.sh:6, tools/nested.sh:8, tools/nested.sh:11, tools/nested.sh:15, tools/nested.sh:28, tools/nested.sh:30]
C6. install.sh output depends on install.sh.
C7. Not stated in the given file.
