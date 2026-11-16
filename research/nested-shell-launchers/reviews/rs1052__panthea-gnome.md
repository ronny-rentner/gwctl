# rs1052/panthea-gnome `scripts/panthea`

## A. Shared with the real session

A1. `dev` moves XDG_CACHE_HOME, XDG_CONFIG_HOME, XDG_DATA_HOME and XDG_RUNTIME_DIR into a fresh `mktemp -d` session dir; HOME, XDG_STATE_HOME and TMPDIR stay the host's [panthea:81-90]. `test`: Depends on gnome-shell-test-tool; the launcher itself only sets XDG_RUNTIME_DIR to a mktemp dir and TMPDIR to /tmp/opencode, config, data, cache and HOME are inherited [panthea:60, 65-72].
A2. `dev`: GSETTINGS_BACKEND=keyfile with XDG_CONFIG_HOME in the session dir, set on `dbus-run-session` [panthea:89-93]. `test`: Depends on gnome-shell-test-tool; the launcher sets no settings backend [panthea:65-72].
A3. Both modes run under `dbus-run-session`, a private session bus [panthea:65-70, 89-93]. The systemd user manager is not addressed.
A4. Not handled; no system-bus variable is set [panthea:65-72, 89-93].
A5. WAYLAND_DISPLAY is turned into an absolute path to the host socket (default wayland-0) [panthea:63-65, 86-90]. DISPLAY is inherited and `dev` passes no `--no-x11` [panthea:97].
A6. PIPEWIRE_RUNTIME_DIR defaults to the host runtime dir and PULSE_SERVER to the host's pulse/native socket [panthea:66-67, 91-92].
A7. Not handled; no `env -i`; SSH_AUTH_SOCK is inherited; the keyring is not addressed [panthea:65-72, 89-93].
A8. GIO_USE_VFS=local in both modes [panthea:67, 92]; on exit the FUSE mounts $runtime/doc and $runtime/gvfs are unmounted with fusermount3 before deletion [panthea:8-14]. Portals are not otherwise handled.
A9. No kill patterns; `test` runs under `timeout --signal=TERM --kill-after=10s 120s` [panthea:69], and both modes clean up from an EXIT trap [panthea:61, 83].
A10. Not handled.
A11. Not handled; no renderer or GPU variables are set [panthea:65-72, 89-93].
A12. XDG_RUNTIME_DIR is private in both modes [panthea:65, 90]. `dev` installs into the private data dir and enables in the keyfile [panthea:89-96]; `test`: Depends on gnome-shell-test-tool; `install` and `remove` act on the real session's extensions [panthea:100-107].
A13. Not handled; the launcher downloads nothing.

## B. Lifecycle

B1. `dev` checks that /usr/libexec/mutter-devkit is executable [panthea:76-79]; XDG_RUNTIME_DIR must be set (`:?`) [panthea:62, 87]. No version detection.
B2. `build` checks the schemas with `glib-compile-schemas --strict --dry-run` and packs dist/panthea@local.shell-extension.zip with `gnome-extensions pack --force` [panthea:6, 17-22]; `test`, `dev` and `install` call it first [panthea:38, 75, 101].
B3. Each run creates a fresh `mktemp -d` dir under /tmp/opencode (`test`: runtime dir only; `dev`: cache, config, data, runtime) and deletes it on exit; nothing is reused [panthea:60-61, 81-85].
B4. `dbus-run-session` in both modes [panthea:70, 93].
B5. `dev`: `gsettings set org.gnome.shell enabled-extensions` into the keyfile backend [panthea:93-96]. `test`: Depends on gnome-shell-test-tool.
B6. `dev`: `gnome-extensions install` of the bundle into the private data dir before the shell starts [panthea:94-95]. `test`: Depends on gnome-shell-test-tool; the bundle is passed as `--extension` [panthea:72].
B7. `dev`: enabled-extensions set to panthea@local only; the extension's state after start is not checked [panthea:96-97]. `test`: Depends on gnome-shell-test-tool.
B8. `dev`: `gnome-shell --devkit --wayland`, no size or scale [panthea:97]. `test`: gnome-shell-test-tool in `--headless` (default) or `--devkit`, optional `--disable-animations`; size Depends on gnome-shell-test-tool [panthea:40-52, 70].
B9. `dev`: Not handled. `test`: Depends on gnome-shell-test-tool.
B10. `test` runs one of tests/shell.js, layoutShell.js, indicatorsShell.js, dockShell.js or workspacesShell.js in the shell and passes PANTHEA_TEST_OUTPUT=/tmp/opencode/panthea-tests [panthea:49-56, 68, 72]. `dev` has no prefs, eval, screenshot or outside control.
B11. Not handled; each `dev` run rebuilds and starts a new sandbox [panthea:75, 81].
B12. Output goes to the terminal, no log file [panthea:69-72, 93-98].
B13. `test` is bounded by a 120 s timeout with SIGKILL 10 s later; `timeout` runs without `--foreground` [panthea:69]. `dev` has no timeout. The EXIT trap cleans up in both modes [panthea:61, 83].
B14. The trap unmounts $runtime/doc and $runtime/gvfs and removes the runtime or session dir [panthea:8-15, 61, 83]; /tmp/opencode/panthea-tests and the dist bundle remain [panthea:6, 39]. No explicit process cleanup.

## C. Properties

C1. Bound to the project: UUID panthea@local, the extra sources lib, shared, LICENSE and the tests/*.js scripts are hardcoded [panthea:5, 21, 49-56, 96].
C2. Subcommands check (default), build, test [--headless|--devkit] [--no-animations|--layout|--indicators|--dock|--workspaces], dev, install, remove [panthea:24-112]; reads WAYLAND_DISPLAY, XDG_RUNTIME_DIR, PIPEWIRE_RUNTIME_DIR and PULSE_SERVER [panthea:62-67, 86-92].
C3. Sandbox dirs are unique per run [panthea:60, 81], but all instances share the dist bundle (rebuilt with `--force`) and /tmp/opencode/panthea-tests [panthea:6, 20, 39, 68].
C4. No version detection; `dev` needs /usr/libexec/mutter-devkit and `gnome-shell --devkit`, the install hint names dnf [panthea:76-79, 97]. WAYLAND_DISPLAY defaults to wayland-0 and is passed on as a host path without an existence check [panthea:63-64, 86-88].
C5. Bash; glib-compile-schemas, gnome-extensions, node, gjs, find, mountpoint, fusermount3, mktemp, timeout, dbus-run-session, gnome-shell-test-tool, gsettings, gnome-shell, mutter-devkit [panthea:10-31, 60-72, 76-97]. 113 lines.
C6. The dist bundle, /tmp/opencode and /tmp/opencode/panthea-tests [panthea:6, 39, 80]; sandboxes are deleted [panthea:61, 83].
C7. Not stated in the launcher; `build` packs a LICENSE file from the repo [panthea:21].
