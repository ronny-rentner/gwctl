# atayoez/desktop-launcher `scripts/nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME goes to $STATE/config and $STATE/data is prepended to XDG_DATA_DIRS [nested.sh:15, 24-25]. XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR, HOME and TMPDIR stay the host's [nested.sh:24-26].
A2. GSETTINGS_BACKEND=keyfile with the keyfile under $STATE/config, exported before `dbus-run-session` [nested.sh:24, 26, 31].
A3. `dbus-run-session` private bus, its address written to $STATE/bus [nested.sh:31-32]; the systemd user manager is not addressed and the host runtime dir is kept.
A4. Not handled; the host system bus is inherited.
A5. WAYLAND_DISPLAY and DISPLAY are inherited; `--no-x11` in both modes; neither mode sets a socket name [nested.sh:33-37].
A6. Not handled.
A7. Not handled.
A8. Not handled.
A9. Not handled; `exec` into dbus-run-session [nested.sh:31].
A10. Not handled.
A11. Not handled.
A12. The tested extension is not installed by the script [nested.sh:25, 27]; the enabled list is in the keyfile [nested.sh:27-29].
A13. Not handled.

## B. Lifecycle

B1. Not handled; no checks.
B2. Not handled; Depends on how the extension was installed beforehand.
B3. $STATE is $XDG_RUNTIME_DIR/desktop-launcher-nested, or /tmp/desktop-launcher-nested, created with `mkdir -p`, reused and never reset [nested.sh:15, 17].
B4. `exec dbus-run-session -- sh -c` [nested.sh:31].
B5. gsettings writes enabled-extensions (UUID and helper), disabled-extensions [], disable-user-extensions false and welcome-dialog-last-shown-version '999' into the keyfile [nested.sh:27-30].
B6. Only the helper unsafe-mode-dev@local is written, as a system extension in $STATE/data [nested.sh:16-23, 25]; the extension under test: Depends on a prior install.
B7. enabled-extensions, an empty disabled-extensions and disable-user-extensions false [nested.sh:27-29]; the state after start is not checked.
B8. Headless by default with `--virtual-monitor $SIZE` (default 1600x900); `devkit` as $2 opens a window; both `--wayland --no-x11`; no scale [nested.sh:13-14, 33-37].
B9. Not handled.
B10. The helper extension sets `global.context.unsafe_mode = true` [nested.sh:21-23]; the bus address is written to $STATE/bus [nested.sh:32].
B11. Not handled.
B12. Output goes to the terminal [nested.sh:31].
B13. No trap, no timeout.
B14. Not handled; $STATE and the bus file remain [nested.sh:15, 32].

## C. Properties

C1. Bound to the project by the hardcoded UUID and the state dir name desktop-launcher-nested; the rest has no project-specific values [nested.sh:12, 15].
C2. Positional SIZE and MODE [nested.sh:13-14]; any MODE other than `devkit` runs headless [nested.sh:33-37]; reads XDG_RUNTIME_DIR and XDG_DATA_DIRS [nested.sh:15, 25].
C3. No: $STATE, the keyfile and the bus file have fixed paths [nested.sh:15, 32].
C4. No detection; the helper metadata lists shell versions 48 to 51 [nested.sh:19].
C5. Bash plus sh, gsettings, dbus-run-session, gnome-shell [nested.sh:1, 27-38]. 38 lines.
C6. $STATE: keyfile, helper extension, bus file [nested.sh:15-32].
C7. GPL-2.0-or-later, from the SPDX header [nested.sh:2-3].
