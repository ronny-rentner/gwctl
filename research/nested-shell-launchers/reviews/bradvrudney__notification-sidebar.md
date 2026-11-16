# bradvrudney/notification-sidebar `scripts/dev.sh`

## A. Shared with the real session

A1. XDG_DATA/CONFIG/CACHE/STATE_HOME and XDG_RUNTIME_DIR point into a per-run `mktemp -d` dir, the runtime dir chmod 700; HOME and TMPDIR stay real, and TMPDIR is the temp dir's parent. [scripts/dev.sh:34-38, scripts/dev.sh:52-56]
A2. `GSETTINGS_BACKEND=keyfile` and `DCONF_PROFILE=/dev/null` are exported before `dbus-run-session`. The inner half refuses to write settings unless XDG_CONFIG_HOME matches the `ns-dev.*` temp dir, the runtime dir is in it, and the backend is keyfile. [scripts/dev.sh:57-58, scripts/dev.sh:80-95]
A3. Runs under `dbus-run-session`; the systemd user manager is not touched. [scripts/dev.sh:54-58]
A4. Not handled.
A5. The host Wayland socket is resolved before the runtime dir is replaced and passed as an absolute WAYLAND_DISPLAY; DISPLAY is not unset and the shell starts without `--no-x11`, Xwayland is not addressed. [scripts/dev.sh:22-31, scripts/dev.sh:56, scripts/dev.sh:104]
A6. Not handled: no audio variable is set; XDG_RUNTIME_DIR is private. [scripts/dev.sh:56]
A7. Not handled: SSH_AUTH_SOCK, keyring variables and the rest are inherited and HOME stays real; XDG_RUNTIME_DIR is private. [scripts/dev.sh:56, scripts/dev.sh:58]
A8. Automount is turned off, and cleanup lazily unmounts `runtime/gvfs` and `runtime/doc` in the private runtime dir. [scripts/dev.sh:98-101, scripts/dev.sh:43-45]
A9. Kills only `$SHELL_PID` from an EXIT trap: TERM, up to 5 s wait, then KILL; no patterns or process groups; services the bus starts are not stopped by the script. [scripts/dev.sh:62-78, scripts/dev.sh:104-105]
A10. Not handled.
A11. Not handled.
A12. The extension is installed into the private data dir and `enabled-extensions` goes to the keyfile store. [scripts/dev.sh:97, scripts/dev.sh:102]
A13. Not handled: no downloads or tokens in the file.

## B. Lifecycle

B1. Requires `/usr/libexec/mutter-devkit`, with a Fedora `dnf` hint, and a Wayland socket; exits 1 otherwise. No version detection; `--devkit` is used unconditionally. [scripts/dev.sh:17-21, scripts/dev.sh:28-31, scripts/dev.sh:104]
B2. Depends on `make install`: it runs with `DEST` in the private extensions dir, exit 1 on failure. [scripts/dev.sh:97]
B3. A new `mktemp -d` dir per run, checked for existence, with data, config, cache, state and a 0700 runtime dir; removed on exit. [scripts/dev.sh:34-38, scripts/dev.sh:52-53, scripts/dev.sh:51]
B4. `dbus-run-session -- bash "${BASH_SOURCE[0]}"` re-runs the script as the inner half, selected by `NS_DEV_INNER`; its status is passed on with `exit $?`. [scripts/dev.sh:16, scripts/dev.sh:54, scripts/dev.sh:58-59]
B5. `gsettings` turns off automount and automount-open and sets `enabled-extensions`, each `|| exit 1`, after the guard checks. [scripts/dev.sh:80-102]
B6. `make -C "$ROOT" install DEST=…` into the private data dir, exit 1 on failure. [scripts/dev.sh:97]
B7. `enabled-extensions` is written before the shell starts, exit 1 on failure. [scripts/dev.sh:102]
B8. `gnome-shell --devkit &`; no size or scale. [scripts/dev.sh:104]
B9. Only with `NS_DEV_PREFS`: polls every 0.5 s, up to 30 s, for `State: ACTIVE` in `gnome-extensions info` while checking the PID with `kill -0`. [scripts/dev.sh:107-118]
B10. `NS_DEV_PREFS=1` opens `gnome-extensions prefs` once the extension is active and prints a message on exit or timeout; nothing else. [scripts/dev.sh:12, scripts/dev.sh:119-127]
B11. Not handled.
B12. Shell output goes to the terminal, own messages, prefixed `dev:`, to stderr; the shell's exit status passes through `wait` and `exit $?`. [scripts/dev.sh:129, scripts/dev.sh:58-59]
B13. The inner EXIT trap stops the shell within 5 s, the outer one removes the temp dir. No overall timeout; timeouts exist only for preferences (30 s) and stopping (5 s). [scripts/dev.sh:64-78, scripts/dev.sh:51, scripts/dev.sh:110-118]
B14. `stop_shell` ends gnome-shell; `rm_tmp` lazily unmounts gvfs and doc, then runs `rm -rf --one-file-system`, up to 10 tries 0.5 s apart, and reports a dir it could not remove; services the bus started are not stopped by the script. [scripts/dev.sh:64-77, scripts/dev.sh:39-51]

## C. Properties

C1. Bound to this project through the hardcoded UUID and `make install DEST=`; the rest names no project. [scripts/dev.sh:13, scripts/dev.sh:97]
C2. No arguments; `NS_DEV_PREFS=1` opens preferences; `NS_DEV_INNER` is internal; TMPDIR sets the temp dir location; WAYLAND_DISPLAY is read. [scripts/dev.sh:12, scripts/dev.sh:16, scripts/dev.sh:23-27, scripts/dev.sh:34, scripts/dev.sh:54]
C3. Each run has its own temp dir, runtime dir and bus; no fixed path is shared. [scripts/dev.sh:34, scripts/dev.sh:52-58]
C4. Checks for a Wayland host and `/usr/libexec/mutter-devkit` (Fedora hint); uses `--devkit`; no GNOME version stated; the devkit path is fixed to `/usr/libexec`; FUSE 3 through `fusermount3`. [scripts/dev.sh:17-19, scripts/dev.sh:28-31, scripts/dev.sh:44, scripts/dev.sh:104]
C5. Bash, 129 lines; mutter-devkit, dbus-run-session, fusermount3, gsettings, gnome-shell, gnome-extensions, make, mktemp, seq, grep, without version checks. [scripts/dev.sh:17, scripts/dev.sh:44, scripts/dev.sh:58, scripts/dev.sh:97-104, scripts/dev.sh:110, scripts/dev.sh:114]
C6. Nothing: the temp dir is removed on exit; if removal fails it stays and the script says so; what `make install` leaves in the repo depends on the Makefile. [scripts/dev.sh:41-51, scripts/dev.sh:97]
C7. Not stated in the file.
