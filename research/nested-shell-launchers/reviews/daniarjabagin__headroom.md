# daniarjabagin/headroom `shell/gnome/dev/devkit.sh`

## A. Shared with the real session

A1. HOME and XDG_DATA_HOME, XDG_CONFIG_HOME, XDG_CACHE_HOME, XDG_STATE_HOME go to $sandbox/home, by default $XDG_RUNTIME_DIR/headroom-devkit or HEADROOM_DEVKIT_HOME [devkit.sh:16, 20-25]. XDG_RUNTIME_DIR and TMPDIR stay the host's [devkit.sh:15-26].
A2. No GSETTINGS_BACKEND; XDG_CONFIG_HOME is redirected and the gsettings writes run under `dbus-run-session` [devkit.sh:22, 36-39, 65].
A3. `dbus-run-session` re-executes the script with --inner [devkit.sh:56-58, 65]; the systemd user manager is not addressed and the host runtime dir is kept.
A4. Not handled; the host system bus is inherited.
A5. Windowed: WAYLAND_DISPLAY made absolute to the host socket, X11 not disabled, no socket name set [devkit.sh:17-19, 51]. Headless: WAYLAND_DISPLAY and DISPLAY unset, own socket headroom-devkit, `--no-x11` [devkit.sh:49].
A6. Not handled; the host runtime dir is kept.
A7. Not handled; SSH_AUTH_SOCK and the host runtime dir are inherited [devkit.sh:15-26].
A8. Not handled.
A9. Kills only the mock daemon's PID from an EXIT trap [devkit.sh:45-47].
A10. Not handled.
A11. Not handled.
A12. The extension is unpacked into the sandbox and enabled in the sandbox dconf [devkit.sh:28-37].
A13. Depends on mock-daemon.py; the launcher starts it with `--scenario` and `--interval 30` [devkit.sh:45].

## B. Lifecycle

B1. Requires exactly one existing file argument [devkit.sh:60]; no tool or version checks.
B2. Not handled; takes a built BUNDLE.zip [devkit.sh:8, 60-62].
B3. The sandbox is created with `mkdir -p` and reused; the extension dir is replaced each run [devkit.sh:16, 25, 30-32]; no reset.
B4. `exec dbus-run-session -- devkit.sh --inner` [devkit.sh:65].
B5. disable-user-extensions false, enabled-extensions, welcome-dialog-last-shown-version '999', color-scheme from COLOR_SCHEME (default `default`) [devkit.sh:35-40].
B6. `rm -rf` of the target, then `python3 -m zipfile -e` [devkit.sh:28-33].
B7. enabled-extensions set to the UUID [devkit.sh:37]; the state after start is not checked [devkit.sh:48-52].
B8. With HEADLESS set: 1280x800 virtual monitor, socket headroom-devkit, `--no-x11`; otherwise `--devkit --wayland`; no scale [devkit.sh:48-52].
B9. Not handled.
B10. Starts the mock daemon and prepends DEV_DIR to PATH; Depends on the contents of DEV_DIR [devkit.sh:43, 45].
B11. Not handled; a rerun reinstalls the bundle [devkit.sh:30-32].
B12. Output goes to the terminal [devkit.sh:49-51, 65].
B13. No timeout. A single-quoted EXIT trap set in run_inner runs `kill $mock`, where `mock` is a `local` of run_inner [devkit.sh:46-47].
B14. The EXIT trap runs `kill $mock` [devkit.sh:46-47]; the sandbox stays [devkit.sh:16].

## C. Properties

C1. Bound to the project: UUID, scenarios, mock-daemon.py [devkit.sh:4, 9, 45].
C2. One argument BUNDLE.zip; environment SCENARIO, HEADLESS, COLOR_SCHEME, HEADROOM_DEVKIT_HOME; internal --inner [devkit.sh:7-13, 16, 39, 45, 48, 56]; reads WAYLAND_DISPLAY and XDG_RUNTIME_DIR [devkit.sh:16-18].
C3. The sandbox path is fixed by default [devkit.sh:16]; HEADROOM_DEVKIT_HOME separates sandboxes; the headless socket name headroom-devkit is fixed [devkit.sh:49].
C4. No detection; WAYLAND_DISPLAY defaults to wayland-0 and is passed on as a host path without an existence check [devkit.sh:17-19, 51].
C5. Bash, python3, realpath, gsettings, dbus-run-session, gnome-shell [devkit.sh:1, 32, 36-39, 45-51, 62, 65]. 68 lines.
C6. The sandbox: HOME, dconf database, extension [devkit.sh:16-25, 28-33].
C7. Not stated in the file.
