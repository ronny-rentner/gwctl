# foobarto/gapia-desktop `scripts/run-nested-shell.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_STATE_HOME and XDG_DATA_HOME point into `$project_root/.tmp/nested-shell/<mutter>__<schemas>`, XDG_CACHE_HOME into a per-run `cache/run-$$`; the host user data dir is removed from XDG_DATA_DIRS; HOME, XDG_RUNTIME_DIR and TMPDIR stay the real ones. [scripts/run-nested-shell.sh:17-63]
A2. `GSETTINGS_BACKEND=keyfile` in the state config dir and GSETTINGS_SCHEMA_DIR from the state dir; the bus started afterwards inherits both. [scripts/run-nested-shell.sh:57-59, scripts/run-nested-shell.sh:68]
A3. A private session bus from `dbus-run-session`; prepare-nested-shell.sh runs before it on the real session bus; systemd user manager not handled. [scripts/run-nested-shell.sh:15, scripts/run-nested-shell.sh:68]
A4. Not handled; bwrap binds `/`. [scripts/run-nested-shell.sh:68-69]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [scripts/run-nested-shell.sh:68-74]
A6. Not handled; XDG_RUNTIME_DIR is not redirected. [scripts/run-nested-shell.sh:57-64]
A7. Not handled; all variables are inherited; `NO_AT_BRIDGE=1` is set. [scripts/run-nested-shell.sh:64]
A8. Not handled; `dbus-run-session` runs outside bwrap. [scripts/run-nested-shell.sh:68]
A9. Not handled; the script `exec`s `dbus-run-session`. [scripts/run-nested-shell.sh:68]
A10. Not handled.
A11. Not handled; `/dev` is dev-bound into bwrap. [scripts/run-nested-shell.sh:70]
A12. Crash flag not handled, XDG_RUNTIME_DIR stays shared; the host user data dir is filtered out of XDG_DATA_DIRS; install and enable depend on prepare-nested-shell.sh. [scripts/run-nested-shell.sh:15, scripts/run-nested-shell.sh:23-55, scripts/run-nested-shell.sh:62-63]
A13. Not handled in the given file; depends on prepare-nested-shell.sh. [scripts/run-nested-shell.sh:15]

## B. Lifecycle

B1. Checks `bwrap`, `dbus-run-session`, `gnome-shell` and `rpm` with a message and exit 1; queries the rpm versions of mutter and gsettings-desktop-schemas to key the state dir. [scripts/run-nested-shell.sh:8-13, scripts/run-nested-shell.sh:17-20]
B2. Depends on prepare-nested-shell.sh; the launcher uses the mutter-devkit helper and the schemas dir in the state dir. [scripts/run-nested-shell.sh:15, scripts/run-nested-shell.sh:21, scripts/run-nested-shell.sh:57, scripts/run-nested-shell.sh:73]
B3. One state dir per mutter and schemas version, reused; a new cache dir per PID, whose `mkdir -p` also creates the state dir; no reset; its config, data, state, schemas and devkit-root contents depend on prepare-nested-shell.sh. [scripts/run-nested-shell.sh:15, scripts/run-nested-shell.sh:17-21, scripts/run-nested-shell.sh:57-62, scripts/run-nested-shell.sh:65]
B4. `dbus-run-session` starts the private session bus through `exec`; no system bus. [scripts/run-nested-shell.sh:68]
B5. Depends on prepare-nested-shell.sh; the launcher sets only environment variables. [scripts/run-nested-shell.sh:15, scripts/run-nested-shell.sh:57-64]
B6. Depends on prepare-nested-shell.sh. [scripts/run-nested-shell.sh:15]
B7. Depends on prepare-nested-shell.sh. [scripts/run-nested-shell.sh:15]
B8. `gnome-shell --devkit --wayland "$@"` inside bwrap, which overlays the prepared mutter-devkit helper at `/usr/libexec/mutter-devkit`; no size or scale. [scripts/run-nested-shell.sh:21, scripts/run-nested-shell.sh:68-74]
B9. Not handled.
B10. Extra arguments are forwarded to gnome-shell; nothing else. [scripts/run-nested-shell.sh:74]
B11. Not handled.
B12. Output to the terminal.
B13. No traps; `exec`; no timeout. [scripts/run-nested-shell.sh:68]
B14. Not handled; per-run cache dirs accumulate. [scripts/run-nested-shell.sh:60, scripts/run-nested-shell.sh:65]

## C. Properties

C1. No extension name in the given file; it calls the project's prepare-nested-shell.sh and keeps its state under the project's `.tmp`; bound to rpm-based systems. [scripts/run-nested-shell.sh:15, scripts/run-nested-shell.sh:17-20]
C2. Arguments are forwarded to gnome-shell; reads HOME, XDG_DATA_HOME and XDG_DATA_DIRS. [scripts/run-nested-shell.sh:23, scripts/run-nested-shell.sh:27, scripts/run-nested-shell.sh:74]
C3. Separate cache per PID; config, state and data are shared between instances on the same versions. [scripts/run-nested-shell.sh:59-62]
C4. rpm-based distributions only; GNOME with `--devkit`; host display server not checked. [scripts/run-nested-shell.sh:8, scripts/run-nested-shell.sh:17-18, scripts/run-nested-shell.sh:74]
C5. POSIX sh, dirname, mkdir, bwrap with `--overlay-src` and `--tmp-overlay`, dbus-run-session, gnome-shell, rpm, prepare-nested-shell.sh; 74 lines. [scripts/run-nested-shell.sh:1, scripts/run-nested-shell.sh:5, scripts/run-nested-shell.sh:8, scripts/run-nested-shell.sh:15, scripts/run-nested-shell.sh:65, scripts/run-nested-shell.sh:68-74]
C6. The state dir with config, state, data, schemas and devkit-root per version pair, and every `cache/run-$$`. [scripts/run-nested-shell.sh:20-21, scripts/run-nested-shell.sh:57-62]
C7. Not stated in the given file.
