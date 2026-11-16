# tedeling/gnome-spotify-extension `scripts/dev.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_CACHE_HOME point into a `mktemp -d` dir under TMPDIR or `/tmp`; HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR stay the real ones. [scripts/dev.sh:18, scripts/dev.sh:32-34]
A2. `GSETTINGS_BACKEND=keyfile` in the temp config dir; the private bus inherits it. [scripts/dev.sh:33, scripts/dev.sh:35, scripts/dev.sh:42]
A3. A private session bus from `dbus-run-session`; the host session bus address is saved first and handed to the extension as SPOTIFY_PLAYING_BUS_ADDRESS; systemd user manager not handled. [scripts/dev.sh:7-16, scripts/dev.sh:36, scripts/dev.sh:42]
A4. Not handled; the host system bus is inherited. [scripts/dev.sh:42-45]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [scripts/dev.sh:45]
A6. Not handled; XDG_RUNTIME_DIR is not redirected. [scripts/dev.sh:32-36]
A7. Not handled; all variables are inherited. [scripts/dev.sh:42]
A8. Not handled.
A9. Not handled; no signals are sent. [scripts/dev.sh:19-21]
A10. Not handled.
A11. Not handled.
A12. Crash flag not handled, XDG_RUNTIME_DIR stays shared; the extension is copied into the temp data dir. [scripts/dev.sh:23-29, scripts/dev.sh:32]
A13. The host session bus address is handed to the extension. [scripts/dev.sh:36]

## B. Lifecycle

B1. Requires a host session bus (DBUS_SESSION_BUS_ADDRESS or `$XDG_RUNTIME_DIR/bus`), else a message and exit 1; no gnome-shell or tool checks. [scripts/dev.sh:8-16]
B2. Copies the listed source files and the schema, then `glib-compile-schemas --strict`. [scripts/dev.sh:25-29]
B3. A fresh `mktemp -d` dir per run, removed on exit. [scripts/dev.sh:18-19]
B4. `dbus-run-session` starts the private session bus; no system bus. [scripts/dev.sh:42-46]
B5. enabled-extensions and disable-user-extensions in an `sh -eu` script. [scripts/dev.sh:42-44]
B6. Copies files into the temp extensions dir. [scripts/dev.sh:23-28]
B7. `gsettings set` of enabled-extensions and disable-user-extensions before the shell starts. [scripts/dev.sh:42-44]
B8. `gnome-shell --devkit --wayland` plus the script's arguments; no size or scale. [scripts/dev.sh:45-46]
B9. Not handled.
B10. The host bus address is forwarded; arguments go to gnome-shell. [scripts/dev.sh:36, scripts/dev.sh:46]
B11. Not handled.
B12. Output to the terminal; `dbus-run-session` is the last command. [scripts/dev.sh:42-46]
B13. INT exits 130, TERM 143, the EXIT trap removes the temp dir; no HUP trap; no timeout. [scripts/dev.sh:19-21]
B14. `rm -rf -- "$dev_dir"` on exit, INT and TERM. [scripts/dev.sh:19-21]

## C. Properties

C1. Bound to this project: UUID, file list and schema name. [scripts/dev.sh:5, scripts/dev.sh:25-28, scripts/dev.sh:43]
C2. Arguments are forwarded to gnome-shell; reads TMPDIR, DBUS_SESSION_BUS_ADDRESS and XDG_RUNTIME_DIR. [scripts/dev.sh:8-10, scripts/dev.sh:18, scripts/dev.sh:46]
C3. Each run has its own temp dir; XDG_RUNTIME_DIR stays shared between instances. [scripts/dev.sh:18, scripts/dev.sh:32-35]
C4. Uses `gnome-shell --devkit --wayland` without a version, distribution or display-server check; needs a host session bus. [scripts/dev.sh:8-16, scripts/dev.sh:45]
C5. POSIX sh, dirname, mktemp, mkdir, cp, rm, glib-compile-schemas, dbus-run-session, gsettings, gnome-shell; 46 lines. [scripts/dev.sh:1, scripts/dev.sh:4, scripts/dev.sh:18-19, scripts/dev.sh:24-29, scripts/dev.sh:42-45]
C6. The temp dir is removed. [scripts/dev.sh:19-21]
C7. Not stated in the given file; it copies a LICENSE file into the extension. [scripts/dev.sh:25]
