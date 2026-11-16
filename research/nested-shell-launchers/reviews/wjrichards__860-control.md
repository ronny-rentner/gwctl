# wjrichards/860-control `gnome-extension/tests/nested.sh`

## A. Shared with the real session

A1. `env -i` clears the environment and sets XDG_RUNTIME_DIR (mode 700), data, config, cache and state into a `mktemp -d` dir; HOME stays the real one and TMPDIR is dropped. [nested.sh:24-25, nested.sh:31-33]
A2. GSETTINGS_BACKEND=memory, set for `dbus-run-session`. [nested.sh:33, nested.sh:35]
A3. `env -i` drops the host bus address and `dbus-run-session` starts a private bus; the systemd user manager is not addressed. [nested.sh:31-35]
A4. Not handled; `env -i` drops DBUS_SYSTEM_BUS_ADDRESS; what the `dev` toolbox named in the header exposes depends on that toolbox. [nested.sh:3-5, nested.sh:31]
A5. Default: headless with a 1280x800 virtual monitor and socket `g512-test`; `--devkit` points WAYLAND_DISPLAY at the host's socket path. X11 is off in both. [nested.sh:25, nested.sh:34, nested.sh:65-72]
A6. `--devkit` sets PIPEWIRE_RUNTIME_DIR to the host runtime dir. [nested.sh:66-68]
A7. `env -i` drops SSH_AUTH_SOCK and keyring variables; the real HOME is passed. [nested.sh:31]
A8. The document portal's FUSE mount in the private runtime dir is lazily unmounted after the run; gvfs is not addressed. [nested.sh:36-37]
A9. The inner part kills its own shell and fake-service PIDs in an EXIT trap; no kill patterns; the outer part has no trap. [nested.sh:63-64, nested.sh:74-80]
A10. Dialogs, overview and notifications are closed via Eval; screen lock is not addressed. [nested.sh:94-97]
A11. Not handled.
A12. Extension and helper are copied into the private data dir, the settings backend is memory, and the runtime dir is private. [nested.sh:25-29, nested.sh:32-33]
A13. Starts `tests/fake_service.py` on the private bus; what it replaces depends on that file. [nested.sh:2, nested.sh:63]

## B. Lifecycle

B1. Not handled; the header says to run inside the `dev` toolbox. [nested.sh:3-5]
B2. No build; copies `metadata.json`, `extension.js`, `logic.js` and the helper's two files. [nested.sh:28-29]
B3. A new `mktemp -d` per run, deleted after the session. [nested.sh:24, nested.sh:38]
B4. Re-runs itself with `--inside` under `env -i ... dbus-run-session`; the exit status is kept and returned. [nested.sh:30-35, nested.sh:39]
B5. Not handled.
B6. Copies the files into the private data dir. [nested.sh:24-29]
B7. `gnome-extensions enable` for helper and extension after readiness. [nested.sh:91-92]
B8. Headless 1280x800 by default, devkit window with `--devkit`; scale not set. [nested.sh:65-73]
B9. Polls `gnome-extensions list` every 0.1 s, at most 300 times; then fixed `sleep 1` after enabling and after tidying. [nested.sh:82-93, nested.sh:98]
B10. Sources the check script inside the session with the helpers `shell_eval` (org.gnome.Shell.Eval), `screenshot`, `fake_set` and `calls`; no control from outside. [nested.sh:46-61, nested.sh:100]
B11. Not handled.
B12. `shell.log` and `service.log` in the output dir; the inner exit status is the script's exit status. [nested.sh:35, nested.sh:39, nested.sh:63, nested.sh:69, nested.sh:72]
B13. The inner EXIT trap kills shell and fake service; startup has a 30 s limit, the run none; no outer trap. [nested.sh:75-90]
B14. Lazy FUSE unmount, then `rm -rf` of the temp dir; the output dir is kept. [nested.sh:36-38]

## C. Properties

C1. Bound to the g512-control tile: UUIDs, file list, fake service and its D-Bus names. [nested.sh:16-17, nested.sh:28, nested.sh:55, nested.sh:63]
C2. `CHECK_SCRIPT OUT_DIR [--devkit]` plus the internal `--inside`; check scripts get helper functions and `$out`. [nested.sh:5, nested.sh:12-13, nested.sh:19-22]
C3. Temp dir, runtime dir and bus are per run; the output dir is the caller's choice. [nested.sh:24-25, nested.sh:31-35]
C4. No version check; Wayland only, headless or devkit; meant for a toolbox named `dev`. [nested.sh:3-5, nested.sh:65-73]
C5. POSIX sh, GNU `realpath -m`, dbus-run-session, gdbus, gnome-extensions, gnome-shell, python3, fusermount3; 100 lines. [nested.sh:1, nested.sh:21, nested.sh:35, nested.sh:37, nested.sh:47, nested.sh:63, nested.sh:83]
C6. Only the output dir with logs and screenshots. [nested.sh:21-23, nested.sh:52, nested.sh:63, nested.sh:69, nested.sh:72]
C7. Depends on the repository's license file; the script has no license header. [nested.sh:1-13]
