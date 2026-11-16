# TheBlackPrism/surface-dial-evolved `tools/nested.sh`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to NESTED_CONFIG (default `$XDG_RUNTIME_DIR/surface-dial-nested` or `/tmp/surface-dial-nested`); the real IntelliJ token is copied in if it exists; HOME, data, cache, state, runtime dir and TMPDIR stay the real ones. [tools/nested.sh:12, tools/nested.sh:14-17, tools/nested.sh:21]
A2. The redirected XDG_CONFIG_HOME is inherited by the private bus; XDG_RUNTIME_DIR stays shared. [tools/nested.sh:21-22]
A3. A private session bus from `dbus-run-session`, its address written to `$NESTED_CONFIG/bus`; systemd user manager not handled. [tools/nested.sh:22, tools/nested.sh:28]
A4. Not handled; the host system bus is inherited. [tools/nested.sh:22-29]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [tools/nested.sh:29]
A6. Not handled; XDG_RUNTIME_DIR is not redirected. [tools/nested.sh:21]
A7. Not handled; all variables are inherited. [tools/nested.sh:21-22]
A8. Not handled.
A9. Not handled; the script `exec`s `dbus-run-session`. [tools/nested.sh:22]
A10. Not handled.
A11. Not handled.
A12. Crash flag not handled, XDG_RUNTIME_DIR stays shared; no install step, the real XDG_DATA_HOME stays in use; enabled-extensions is set only in the nested dconf. [tools/nested.sh:21-23]
A13. The real IntelliJ token from the real config dir is copied into NESTED_CONFIG if it exists. [tools/nested.sh:15-17]

## B. Lifecycle

B1. Not handled; no tool or version checks.
B2. Not handled; no build or install in the file.
B3. `mkdir -p` of NESTED_CONFIG, reused across runs and never removed; no reset. [tools/nested.sh:12, tools/nested.sh:14]
B4. `dbus-run-session` starts the private session bus through `exec`; no system bus. [tools/nested.sh:22]
B5. `dconf write` of enabled-extensions, disable-user-extensions, welcome-dialog-last-shown-version, color-scheme from `$1` and the extension's debug key. [tools/nested.sh:19, tools/nested.sh:22-27]
B6. Not handled.
B7. `dconf write` of enabled-extensions to only this UUID and disable-user-extensions false before the shell starts. [tools/nested.sh:23-24]
B8. `gnome-shell --devkit --wayland`; no mode, size or scale; light or dark color scheme from `$1`. [tools/nested.sh:11, tools/nested.sh:19, tools/nested.sh:26, tools/nested.sh:29]
B9. Not handled.
B10. `SURFACE_DIAL_DEV=1` is exported; the private bus address is written to `$NESTED_CONFIG/bus`; the development D-Bus hooks depend on extension/lib/devtools.js. [tools/nested.sh:21, tools/nested.sh:28]
B11. Not handled.
B12. Output to the terminal.
B13. No traps; after the `exec` the script is `dbus-run-session`; no timeout. [tools/nested.sh:22]
B14. Not handled; NESTED_CONFIG, the token copy and the bus file remain. [tools/nested.sh:14-17, tools/nested.sh:28]

## C. Properties

C1. Bound to this project: UUID, token path, debug key and `SURFACE_DIAL_DEV`. [tools/nested.sh:9, tools/nested.sh:16, tools/nested.sh:21, tools/nested.sh:27]
C2. `$1` `light|dark` (default dark, any other value gives the light scheme) and the NESTED_CONFIG environment variable. [tools/nested.sh:6, tools/nested.sh:11-12, tools/nested.sh:19]
C3. Not handled; instances share the default NESTED_CONFIG and overwrite its bus file; a different NESTED_CONFIG separates them. [tools/nested.sh:12, tools/nested.sh:28]
C4. Uses `gnome-shell --devkit --wayland` without a version, distribution or display-server check. [tools/nested.sh:29]
C5. bash, dirname, mkdir, cp, dbus-run-session, dconf, gnome-shell; 30 lines. [tools/nested.sh:1, tools/nested.sh:10, tools/nested.sh:14, tools/nested.sh:17, tools/nested.sh:22-29]
C6. NESTED_CONFIG with the token copy and the bus address file. [tools/nested.sh:12-17, tools/nested.sh:28]
C7. Not stated in the given file.
