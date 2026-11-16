# jagosar/islet `scripts/nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_DATA_HOME, XDG_CACHE_HOME and XDG_STATE_HOME point into `$XDG_RUNTIME_DIR/islet-devkit` (or `/tmp/islet-devkit`); HOME, XDG_RUNTIME_DIR and TMPDIR stay the real ones. [scripts/nested.sh:15, scripts/nested.sh:17, scripts/nested.sh:38-41]
A2. The redirected XDG_CONFIG_HOME is inherited by the private bus; XDG_RUNTIME_DIR stays shared. [scripts/nested.sh:38, scripts/nested.sh:46]
A3. A private session bus from `dbus-run-session`, its address saved to `$sandbox/bus-address`; the `--zip` install runs with DBUS_SESSION_BUS_ADDRESS unset but the real XDG_RUNTIME_DIR; systemd user manager not handled. [scripts/nested.sh:29-33, scripts/nested.sh:43, scripts/nested.sh:46, scripts/nested.sh:56]
A4. Not handled; the host system bus is inherited. [scripts/nested.sh:46-57]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [scripts/nested.sh:57]
A6. Not handled; XDG_RUNTIME_DIR is not redirected. [scripts/nested.sh:38-41]
A7. Not handled; all variables are inherited. [scripts/nested.sh:46]
A8. Not handled.
A9. Not handled; the script `exec`s `dbus-run-session`. [scripts/nested.sh:46]
A10. Not handled.
A11. Not handled.
A12. Crash flag not handled, XDG_RUNTIME_DIR stays shared.
A13. Not handled in the given file; `--zip` depends on pack.sh. [scripts/nested.sh:28]

## B. Lifecycle

B1. Not handled; no checks.
B2. Default mode links `dist/` without building; `--zip` depends on pack.sh. [scripts/nested.sh:28, scripts/nested.sh:35]
B3. Fixed sandbox dir, created with `mkdir -p` and reused; the extension dir is removed except with `--installed`; no full reset. [scripts/nested.sh:15, scripts/nested.sh:17-20]
B4. `dbus-run-session` starts the private session bus through `exec`; no system bus. [scripts/nested.sh:46]
B5. Sets disable-user-extensions false and enabled-extensions unless `--installed`; enable-animations false when ISLET_NESTED_NO_ANIMATIONS is set. [scripts/nested.sh:46-55]
B6. Default: symlink to `dist/`; `--zip`: `gnome-extensions install --force` of pack.sh output into the sandbox; `--installed`: leaves the sandbox as it is. [scripts/nested.sh:22-36]
B7. `gsettings set` of enabled-extensions before the shell starts, skipped with `--installed`. [scripts/nested.sh:47-50]
B8. `gnome-shell --devkit --wayland` with `ISLET_DEV_DEBUG=1`; no mode, size or scale. [scripts/nested.sh:57]
B9. Not handled.
B10. The bus address file lets scripts/dev-hook.sh send Claude Code hook events into the nested session; depends on dev-hook.sh. [scripts/nested.sh:43, scripts/nested.sh:56]
B11. Not handled; the default mode links `dist/` instead of copying it. [scripts/nested.sh:35]
B12. Output to the terminal.
B13. No traps; after the `exec` the script is `dbus-run-session`; no timeout. [scripts/nested.sh:46]
B14. Not handled; the sandbox and bus-address file remain. [scripts/nested.sh:15, scripts/nested.sh:56]

## C. Properties

C1. Bound to this project: `dist/`, pack.sh, ISLET variables and dev-hook.sh; the UUID is read from metadata.json. [scripts/nested.sh:14, scripts/nested.sh:28, scripts/nested.sh:43, scripts/nested.sh:53, scripts/nested.sh:57]
C2. `$1` is `--installed`, `--zip` or empty, any other value acts as the default; environment ISLET_NESTED_NO_ANIMATIONS. [scripts/nested.sh:19-36, scripts/nested.sh:53]
C3. Not handled; instances share the fixed sandbox dir and overwrite its bus-address file. [scripts/nested.sh:15, scripts/nested.sh:56]
C4. Uses `gnome-shell --devkit --wayland` without a version, distribution or display-server check. [scripts/nested.sh:57]
C5. bash, dirname, node, mkdir, rm, ln, env, gnome-extensions, dbus-run-session, gsettings, gnome-shell and pack.sh; 58 lines. [scripts/nested.sh:1, scripts/nested.sh:13-14, scripts/nested.sh:17, scripts/nested.sh:20, scripts/nested.sh:28, scripts/nested.sh:32-35, scripts/nested.sh:46-57]
C6. The sandbox with config, cache, state, data and bus-address file. [scripts/nested.sh:15-17, scripts/nested.sh:56]
C7. GPL-2.0-or-later (SPDX header). [scripts/nested.sh:2]
