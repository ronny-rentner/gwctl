# matteo-pacini/Magunetto `tests/harness/watch.sh`

## A. Shared with the real session

A1. HOME, XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_CACHE_HOME point into a `mktemp -d` dir; XDG_STATE_HOME is left as the host has it; XDG_RUNTIME_DIR and TMPDIR are inherited. [watch.sh:24, watch.sh:43-46]
A2. `GSETTINGS_BACKEND=keyfile` is exported before dbus-run-session; the script writes the keyfile into the temp config dir. [watch.sh:31-41, watch.sh:47, watch.sh:53]
A3. dbus-run-session gives the shell a private session bus; the test window starts outside it; the systemd user manager is not addressed. [watch.sh:53, watch.sh:58-61]
A4. Not handled.
A5. `--devkit --wayland` with host display variables inherited and Xwayland not disabled; the test window gets as WAYLAND_DISPLAY the last `wayland-N` name that `ls` lists in the host XDG_RUNTIME_DIR. [watch.sh:53, watch.sh:58]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [watch.sh:43-47]
A7. Not handled; the host environment apart from HOME and the XDG dirs is inherited. [watch.sh:43-47]
A8. Not handled.
A9. Records the shell's PID and waits for it; the test window process is not tracked; no kill. [watch.sh:53-54, watch.sh:58-63]
A10. Binds the extension to `<Alt>x` instead of its own Z and disables hot corners; no grab or lock handling. [watch.sh:36-40]
A11. Not handled.
A12. The keyfile enables only `magunetto@matteopacini.me` with version validation off. [watch.sh:32-34]
A13. Not handled.

## B. Lifecycle

B1. None; `MAGUNETTO_TYPELIB_PATH` is passed on as GI_TYPELIB_PATH when set. [watch.sh:60]
B2. None; the repo's extension dir is linked as is. [watch.sh:29]
B3. New `mktemp -d` dir per run, removed on EXIT. [watch.sh:24-25]
B4. `dbus-run-session -- gnome-shell …` as a background job. [watch.sh:53-54]
B5. Keyfile with disable-extension-version-validation, enabled-extensions, hot corners off and the `<Alt>x` shortcut. [watch.sh:31-41]
B6. `ln -sfn` of `$REPO_DIR/$UUID` into the temp extension dir. [watch.sh:27-29]
B7. Through the keyfile; no check. [watch.sh:34]
B8. `gnome-shell --devkit --wayland`; no size or scale. [watch.sh:53]
B9. Fixed `sleep 6`; no readiness check, the test window starts after it regardless. [watch.sh:56-61]
B10. Starts `gjs -m testwindow.js --title "Snap me"` on the picked Wayland display with output discarded; depends on `tests/harness/testwindow.js`. [watch.sh:57-61]
B11. Not handled.
B12. Shell output goes to the terminal, test window output to `/dev/null`. [watch.sh:61]
B13. Only an EXIT trap; dbus-run-session runs as a background job; no timeout. [watch.sh:25, watch.sh:53]
B14. `rm -rf "$SESSION_DIR"` on EXIT; the test window process is not stopped. [watch.sh:25, watch.sh:61]

## C. Properties

C1. Bound to Magunetto: UUID, settings schema, shortcut and test window. [watch.sh:22, watch.sh:39-40, watch.sh:61]
C2. No arguments; optional `MAGUNETTO_TYPELIB_PATH`. [watch.sh:6, watch.sh:60]
C3. Each run has its own temp dir and bus, but every run picks the test window's display by the same name pattern. [watch.sh:24, watch.sh:53, watch.sh:58]
C4. `--devkit --wayland`; the comment names GNOME 50 and the removal of `--nested`; no version detection. [watch.sh:52-53]
C5. Bash; mktemp, ln, dbus-run-session, gnome-shell, gjs, ls, grep, tail; 63 lines. [watch.sh:1, watch.sh:24, watch.sh:29, watch.sh:53, watch.sh:58-61]
C6. Nothing; the temp dir is removed. [watch.sh:25]
C7. Not stated in the given file.
