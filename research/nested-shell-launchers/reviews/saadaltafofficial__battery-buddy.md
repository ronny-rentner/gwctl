# saadaltafofficial/battery-buddy `dev.sh`

## A. Shared with the real session

A1. `isolated()` points XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_CACHE_HOME to ./dev and XDG_RUNTIME_DIR to $RUN, i.e. $XDG_RUNTIME_DIR/bb-dev or /tmp/bb-dev [dev.sh:12-16, 78-81]. HOME, XDG_STATE_HOME and TMPDIR stay the host's.
A2. GSETTINGS_BACKEND=keyfile with the keyfile in dev/config, passed through `env` to `dbus-run-session` [dev.sh:62-75, 78-81, 96, 110].
A3. `dbus-run-session` private bus [dev.sh:96, 110]; the systemd user manager is not addressed.
A4. Not handled; the host system bus is inherited.
A5. Windowed: XDG_RUNTIME_DIR becomes $RUN while WAYLAND_DISPLAY stays as inherited; X11 is not disabled [dev.sh:16, 78-81, 96]. Headless: `--no-x11` and the default socket name, with prefs started on a hardcoded WAYLAND_DISPLAY=wayland-0 [dev.sh:112, 119]; DISPLAY is inherited.
A6. Not handled.
A7. Not handled; SSH_AUTH_SOCK is inherited [dev.sh:78-81].
A8. Not handled; no GIO_USE_VFS and no unmount, and $RUN is never removed [dev.sh:16, 56-58].
A9. `shot` kills only the headless shell's PID [dev.sh:112-113, 127]; no patterns.
A10. Not handled.
A11. Not handled.
A12. The extension is copied into dev/data and enabled in the dev keyfile [dev.sh:18-27, 62-75].
A13. Not handled.

## B. Lifecycle

B1. Windowed mode checks `gnome-shell --help` for `--devkit` and `mutter-devkit` on PATH [dev.sh:89-93]; `shot` has no checks.
B2. `install_into` copies an explicit file list and compiles the schemas into the target [dev.sh:18-27].
B3. ./dev and $RUN are created with `mkdir -p` and reused, the extension dir is replaced [dev.sh:19-21, 56-59]; the keyfile is kept and updated [dev.sh:62-75]. No reset.
B4. `dbus-run-session` through `isolated()` [dev.sh:96, 110].
B5. Python configparser sets enabled-extensions, disable-user-extensions and welcome-dialog-last-shown-version in the keyfile and keeps all other keys [dev.sh:62-75].
B6. Copies files and compiles schemas [dev.sh:18-27]; `shot` also writes the screenshot helper bb-shooter@dev [dev.sh:30-54, 61].
B7. enabled-extensions in the keyfile [dev.sh:60-61, 71]; the state after start is not checked [dev.sh:96, 112-114].
B8. Windowed: `--devkit --wayland` [dev.sh:96]; `shot`: `--headless --wayland --no-x11 --virtual-monitor 1280x800` [dev.sh:112]; no scale.
B9. `shot` sleeps a fixed 10 s [dev.sh:114]; windowed: Not handled.
B10. `demo` writes dev/cache/battery-buddy-demo for the running session [dev.sh:83-85, 98-102]; in `shot` the helper extension takes a screenshot whenever dev/shot-request appears [dev.sh:30-54, 115]; prefs open with `gnome-extensions prefs` [dev.sh:119].
B11. Not handled; a rerun reinstalls [dev.sh:94, 107].
B12. Windowed stderr is appended to dev/session.log [dev.sh:96]; the headless shell writes dev/shell.log, which `shot` greps for JS ERROR and battery-buddy errors and prints up to 40 lines [dev.sh:112, 130-133].
B13. `shot` kills the shell after its loop [dev.sh:127]; no trap in either mode and no timeout.
B14. `shot` removes the demo file and kills the shell [dev.sh:126-127]; ./dev and $RUN remain [dev.sh:13, 16].

## C. Properties

C1. Bound to the project: UUID, file list, demo modes [dev.sh:14, 22-25, 99].
C2. Subcommands: none (windowed), `demo <mode>`, `shot [mode[:seconds] ...]` [dev.sh:5-10, 87-134]; unknown arguments print the header [dev.sh:135-136]; reads XDG_RUNTIME_DIR [dev.sh:16].
C3. No: $RUN, ./dev, the shot-request file and the demo file have fixed paths [dev.sh:13, 16, 42, 84].
C4. Checks `gnome-shell --help` for `--devkit` [dev.sh:89]; the helper lists shell versions 46 to 50 [dev.sh:33]; the hint names Ubuntu/Debian [dev.sh:91].
C5. Bash, python3 (configparser), glib-compile-schemas, dbus-run-session, gnome-shell, gnome-extensions, grep, date [dev.sh:1, 26, 64, 84, 96, 112, 119, 130]. 137 lines.
C6. ./dev (data, cache, config keyfile, shots, logs) and $RUN [dev.sh:13, 16, 56-63].
C7. Not stated in the file.
