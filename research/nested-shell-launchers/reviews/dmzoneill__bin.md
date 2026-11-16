# dmzoneill/bin `devshell`

## A. Shared with the real session

A1. Only XDG_DATA_HOME is redirected, to the fixed `/tmp/gnome-dev-$USER`; HOME, XDG_CONFIG_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR stay real. [devshell:5]
A2. GSETTINGS_BACKEND=memory, exported before `dbus-run-session`. [devshell:6, devshell:39]
A3. `dbus-run-session` gives the shell its own bus; the keyring daemon is started before it with the host session env. The systemd user manager is not handled. [devshell:22-23, devshell:39]
A4. Not handled. [devshell:4-39]
A5. `gnome-shell --devkit --wayland` with the inherited host display variables; Xwayland not disabled. [devshell:39]
A6. Not handled. [devshell:4-39]
A7. Runs `gnome-keyring-daemon --start --components=secrets` with the host env, evals its output and exports SSH_AUTH_SOCK. [devshell:21-25]
A8. Sets GTK_USE_PORTAL=0 and GTK_A11Y=none; gvfs and FUSE not handled. [devshell:7-8]
A9. Runs `pkill -f "gnome-shell --devkit"`, then `exec`. [devshell:36, devshell:39]
A10. Not handled. [devshell:4-39]
A11. Not handled. [devshell:4-39]
A12. The extension source is symlinked into the redirected data dir, not the real one; nothing enables it. Crash flag not handled; XDG_CACHE_HOME, XDG_STATE_HOME and XDG_RUNTIME_DIR are real. [devshell:5, devshell:27-33]
A13. Not handled. [devshell:4-39]

## B. Lifecycle

B1. Only checks whether gnome-keyring-daemon exists; no gnome-shell or version check. [devshell:22-25]
B2. Not handled; the source dir is linked directly. [devshell:28, devshell:33]
B3. Reuses `/tmp/gnome-dev-$USER`; each run rewrites the monitor config and replaces the extension link with `rm -rf` plus `ln -s`. [devshell:5, devshell:11-18, devshell:30-33]
B4. `exec dbus-run-session`. [devshell:39]
B5. Not handled. [devshell:6]
B6. Symlinks DEVSHELL_EXT_SRC (default `$HOME/src/wayland-effects`) to `<data>/gnome-shell/extensions/<id>`; the source dir's existence is not checked. [devshell:27-33]
B7. Not handled; no enabled-extensions value is set. [devshell:6, devshell:27-39]
B8. `--devkit --wayland`; size 2560x1600 at 60 Hz through an ini in MUTTER_DEBUG_DUMMY_MONITOR_CONFIG; scale not handled. [devshell:10-19, devshell:39]
B9. Not handled. [devshell:39]
B10. Not handled. [devshell:4-39]
B11. The extension is a symlink to the source; each run runs `pkill -f "gnome-shell --devkit"` before starting the shell. [devshell:33, devshell:36]
B12. Output to the terminal; the exit status is that of `dbus-run-session`. [devshell:39]
B13. Not handled. [devshell:39]
B14. Not handled; the `/tmp` dir and the keyring daemon stay. [devshell:5, devshell:22-23]

## C. Properties

C1. Bound by default to `wayland-effects@daoneill.github.com` in `$HOME/src/wayland-effects`, overridable through env. [devshell:27-28]
C2. Env DEVSHELL_EXT_ID and DEVSHELL_EXT_SRC; no arguments. [devshell:27-28]
C3. No: a new run runs `pkill -f "gnome-shell --devkit"`, and the `/tmp` dir is per user, not per run. [devshell:5, devshell:36]
C4. `gnome-shell --devkit`; no version, distribution or display-server handling. [devshell:39]
C5. Bash, pkill, dbus-run-session, gnome-shell, optional gnome-keyring-daemon; 40 lines. [devshell:1, devshell:22, devshell:36, devshell:39]
C6. `/tmp/gnome-dev-$USER` with the monitor ini and the extension link. [devshell:5, devshell:11-18, devshell:30-33]
C7. Depends on the repository's license file; the given file has no license notice. [devshell:1-40]
