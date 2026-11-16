# samuelba/dropshade `scripts/gnome-dev.sh`

## A. Shared with the real session

A1. XDG_DATA/CONFIG/STATE/CACHE_HOME are exported to `target/gnome-dev` in the repo; HOME, XDG_RUNTIME_DIR and TMPDIR stay real. [scripts/gnome-dev.sh:9, scripts/gnome-dev.sh:21, scripts/gnome-dev.sh:24-27]
A2. The variables are exported before `dbus-run-session`. The inner script aborts unless the private `dconf/user` exists and the mtime of the real `$HOME/.config/dconf/user` is unchanged after its gsettings writes. [scripts/gnome-dev.sh:24-28, scripts/gnome-dev.sh:35, scripts/gnome-dev.sh:38-47]
A3. The session runs under `dbus-run-session`; the bus address goes to `target/gnome-dev/bus-address`; the systemd user manager is not touched. [scripts/gnome-dev.sh:30, scripts/gnome-dev.sh:35, scripts/gnome-dev.sh:37]
A4. Not handled.
A5. Not separated: `gnome-shell --devkit --wayland` runs with the inherited display variables. [scripts/gnome-dev.sh:13-16, scripts/gnome-dev.sh:48]
A6. Not handled: XDG_RUNTIME_DIR stays real.
A7. Not handled: HOME and the environment are inherited. [scripts/gnome-dev.sh:35]
A8. Not handled: XDG_RUNTIME_DIR stays real.
A9. No kills or signal handling; `exec` chains to `dbus-run-session` and then to `gnome-shell`. [scripts/gnome-dev.sh:35, scripts/gnome-dev.sh:48]
A10. Not handled.
A11. Not handled.
A12. The extension is symlinked into the private data dir, and `enabled-extensions` and `disable-user-extensions` are set in the private dconf; the crash flag is not handled. [scripts/gnome-dev.sh:22, scripts/gnome-dev.sh:39-40]
A13. No downloads or tokens in the file.

## B. Lifecycle

B1. Requires `mutter-devkit` through `rpm -q` or `command -v`, else prints a `dnf install` hint and exits 1; no version detection. [scripts/gnome-dev.sh:13-16]
B2. `cargo build -p dropshade` and `glib-compile-schemas --strict` on every start; `set -e` stops on failure. [scripts/gnome-dev.sh:6, scripts/gnome-dev.sh:18-19]
B3. `mkdir -p` creates `target/gnome-dev` once and reuses it, never reset. [scripts/gnome-dev.sh:21]
B4. `exec dbus-run-session -- bash -c '…'`, with the bus address written to a file. [scripts/gnome-dev.sh:35, scripts/gnome-dev.sh:37]
B5. `gsettings` sets `disable-user-extensions false`, `enabled-extensions` and the extension's `command` to `target/debug/dropshade`, then checks that the writes stayed private, exit 1 otherwise. [scripts/gnome-dev.sh:38-47]
B6. `ln -sfn` of `gnome-extension/` into the private extensions dir. [scripts/gnome-dev.sh:22]
B7. `enabled-extensions` is written before the shell starts. [scripts/gnome-dev.sh:40]
B8. `exec gnome-shell --devkit --wayland`; no size or scale. [scripts/gnome-dev.sh:48]
B9. Not handled: no readiness check; settings are in place before the start. [scripts/gnome-dev.sh:39-48]
B10. F12 inside the shell, or `scripts/gnome-dev-toggle.sh` from another terminal with the saved bus address; the toggle script is not in the given file. [scripts/gnome-dev.sh:32-33, scripts/gnome-dev.sh:37]
B11. Not handled: rerunning rebuilds and starts a new shell on the kept state. [scripts/gnome-dev.sh:18, scripts/gnome-dev.sh:21]
B12. Output goes to the terminal. [scripts/gnome-dev.sh:48]
B13. Not handled: no traps and no timeout.
B14. Not handled: `target/gnome-dev` and the bus-address file remain. [scripts/gnome-dev.sh:21, scripts/gnome-dev.sh:30]

## C. Properties

C1. Bound to this project: hardcoded UUID, cargo package and schema path. [scripts/gnome-dev.sh:10-11, scripts/gnome-dev.sh:18]
C2. No arguments or options; `DROPSHADE_DEV_*` variables only carry values into the inner script. [scripts/gnome-dev.sh:28-30]
C3. No: fixed state dir and bus-address file in `target/gnome-dev`. [scripts/gnome-dev.sh:9, scripts/gnome-dev.sh:30]
C4. Fedora-oriented: finds the devkit through `rpm -q` or else `command -v` and suggests `dnf`; runs with `--devkit`; no GNOME version stated. [scripts/gnome-dev.sh:13-14, scripts/gnome-dev.sh:48]
C5. Bash, 49 lines; rpm, mutter-devkit, cargo, glib-compile-schemas, dbus-run-session, gsettings, GNU `stat -c`, gnome-shell. [scripts/gnome-dev.sh:13, scripts/gnome-dev.sh:18-19, scripts/gnome-dev.sh:35-48]
C6. `target/gnome-dev` with private dconf, data, state, cache and the bus address persists, as do the cargo build output and the compiled schemas in `gnome-extension/schemas`. [scripts/gnome-dev.sh:21-22, scripts/gnome-dev.sh:30, scripts/gnome-dev.sh:18-19]
C7. Not stated in the file.
