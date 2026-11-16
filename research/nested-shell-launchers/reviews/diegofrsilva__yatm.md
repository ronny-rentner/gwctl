# diegofrsilva/yatm `scripts/dev.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_STATE_HOME are redirected into `$ROOT/.dev`; HOME, XDG_CACHE_HOME, XDG_RUNTIME_DIR and TMPDIR stay the real ones. [scripts/dev.sh:6-12]
A2. The redirected XDG_CONFIG_HOME is inherited by the private bus; XDG_RUNTIME_DIR stays shared. [scripts/dev.sh:10, scripts/dev.sh:20]
A3. A private session bus from `dbus-run-session`; `make` runs before it on the real session bus; systemd user manager not handled. [scripts/dev.sh:14, scripts/dev.sh:20]
A4. Not handled; the host system bus is inherited. [scripts/dev.sh:20-25]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [scripts/dev.sh:25]
A6. Not handled; XDG_RUNTIME_DIR is not redirected. [scripts/dev.sh:9-11]
A7. Not handled; all variables are inherited. [scripts/dev.sh:20]
A8. Not handled.
A9. Not handled; the script `exec`s `dbus-run-session`. [scripts/dev.sh:20]
A10. Not handled.
A11. Not handled.
A12. Crash flag not handled, XDG_RUNTIME_DIR stays shared.
A13. Not handled; depends on the Makefile. [scripts/dev.sh:14]

## B. Lifecycle

B1. Not handled; no tool or version checks. [scripts/dev.sh:4]
B2. `make -C "$ROOT" compile install`; depends on the Makefile. [scripts/dev.sh:14]
B3. `$ROOT/.dev` is created with `mkdir -p` and reused; no reset. [scripts/dev.sh:7, scripts/dev.sh:12]
B4. `dbus-run-session` starts the private session bus through `exec`; no system bus. [scripts/dev.sh:20]
B5. `dconf write` of the extension's log-level (`uint32 4`) and tile-by-default. [scripts/dev.sh:23-24]
B6. Depends on the Makefile's `install` target, run with the redirected XDG_DATA_HOME. [scripts/dev.sh:9, scripts/dev.sh:14]
B7. Sets disable-user-extensions false and enabled-extensions to `yatm@diegofrsilva` before the shell starts. [scripts/dev.sh:21-22]
B8. `gnome-shell --devkit` without `--wayland`, mode, size or scale. [scripts/dev.sh:25]
B9. Not handled.
B10. Not handled.
B11. Not handled; a rerun rebuilds and reinstalls. [scripts/dev.sh:14]
B12. All output of the bus and the shell goes to a timestamped log in `$ROOT/.dev/logs` with a `latest.log` symlink; the terminal shows the `make` output and the log path. [scripts/dev.sh:14, scripts/dev.sh:16-18, scripts/dev.sh:26]
B13. No traps; after the `exec` the script is `dbus-run-session`; no timeout. [scripts/dev.sh:20]
B14. Not handled; `.dev` and the logs remain. [scripts/dev.sh:7, scripts/dev.sh:16]

## C. Properties

C1. Bound to this project: UUID, settings path and make targets are hardcoded. [scripts/dev.sh:14, scripts/dev.sh:22-24]
C2. No arguments or environment variables.
C3. Not handled; instances share the fixed `$ROOT/.dev`; log names differ per second. [scripts/dev.sh:7, scripts/dev.sh:16]
C4. Uses `gnome-shell --devkit` without a version, distribution or display-server check. [scripts/dev.sh:25]
C5. POSIX sh, dirname, mkdir, make, date, ln, dbus-run-session, gsettings, dconf, gnome-shell; 26 lines. [scripts/dev.sh:1, scripts/dev.sh:6, scripts/dev.sh:12, scripts/dev.sh:14-17, scripts/dev.sh:20-25]
C6. `$ROOT/.dev` with data, config, state and logs. [scripts/dev.sh:7-12, scripts/dev.sh:16]
C7. Not stated in the given file.
