# toabctl/gnome-shell-extension-window-groups `run-nested.sh`

## A. Shared with the real session

A1. Depends on lib-sandbox.sh (`wg_sandbox_env`) [run-nested.sh:12, run-nested.sh:15]. The sandbox is `$SRC/.sandbox` or WG_SANDBOX, the extension is linked into `$SANDBOX/share`, and the runtime dir is printed [run-nested.sh:8, run-nested.sh:19, run-nested.sh:28].
A2. Depends on lib-sandbox.sh; gsettings writes after `wg_sandbox_env` [run-nested.sh:15, run-nested.sh:22-25].
A3. A separate `dbus-run-session` for each gsettings call and for the shell [run-nested.sh:23-25, run-nested.sh:36]; the rest depends on lib-sandbox.sh.
A4. Depends on lib-sandbox.sh; nothing in this file.
A5. The nested socket name comes from WG_WAYLAND_DISPLAY, default `wg-test`; no `--no-x11` [run-nested.sh:9, run-nested.sh:37]; the host's WAYLAND_DISPLAY is printed [run-nested.sh:29]; X11 handling depends on `wg_snapshot_x` and `wg_reap_x` [run-nested.sh:16-17].
A6. Depends on lib-sandbox.sh; nothing in this file.
A7. Depends on lib-sandbox.sh; nothing in this file.
A8. Depends on lib-sandbox.sh; nothing in this file.
A9. Depends on lib-sandbox.sh: `wg_snapshot_x` before start and `wg_reap_x` on EXIT [run-nested.sh:16-17].
A10. Not handled.
A11. Not handled.
A12. The repo is symlinked as the extension and enabled in the sandbox dconf [run-nested.sh:19, run-nested.sh:23-24]. Crash flag: Depends on lib-sandbox.sh.
A13. Not handled in this file.

## B. Lifecycle

B1. Not handled in this file: no devkit check; depends on lib-sandbox.sh.
B2. `glib-compile-schemas` on the source schemas dir [run-nested.sh:20].
B3. Deletes the sandbox with `rm -rf` each run; then calls `wg_sandbox_env` with its path, what that creates depends on lib-sandbox.sh [run-nested.sh:14-15].
B4. One `dbus-run-session` per gsettings call and one for the shell; the shell's failure is masked by `|| true` [run-nested.sh:23-25, run-nested.sh:36-37].
B5. enabled-extensions, disable-user-extensions and color-scheme prefer-dark [run-nested.sh:23-25].
B6. `ln -sfn` of the repo [run-nested.sh:19].
B7. enabled-extensions [run-nested.sh:23].
B8. `gnome-shell --devkit --wayland --wayland-display=<name>`; no size or scale [run-nested.sh:36-37].
B9. Not handled.
B10. Points to `./spawn-test-apps.sh` [run-nested.sh:31].
B11. Not handled.
B12. Prints sandbox, runtime dir, host and nested socket [run-nested.sh:27-30]; `|| true` discards the shell's exit status [run-nested.sh:37].
B13. EXIT trap `wg_reap_x` only [run-nested.sh:17]. No timeout.
B14. Depends on lib-sandbox.sh (`wg_reap_x`) [run-nested.sh:17]; the sandbox stays until the next run [run-nested.sh:14].

## C. Properties

C1. Bound by the uuid and the `wg_` library [run-nested.sh:6, run-nested.sh:12-17].
C2. Environment variables WG_SANDBOX and WG_WAYLAND_DISPLAY; no arguments [run-nested.sh:8-9].
C3. Default sandbox and display name are fixed; a second run with defaults deletes the first one's sandbox [run-nested.sh:8-9, run-nested.sh:14].
C4. The comment states that GNOME 50 removed `--nested` [run-nested.sh:33]; Wayland [run-nested.sh:37].
C5. Bash, lib-sandbox.sh, glib-compile-schemas, gsettings, dbus-run-session and gnome-shell; 37 lines [run-nested.sh:1-37].
C6. `$SANDBOX` [run-nested.sh:8, run-nested.sh:14]; compiled schemas in the repo [run-nested.sh:20].
C7. Depends on the repository's license file; the script has no license header [run-nested.sh:1-4].
