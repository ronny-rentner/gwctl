# essembeh/minibar `tests/nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME and XDG_DATA_HOME point into two `mktemp -d` dirs, and a `user-dirs.dirs` points every XDG user dir at a third temp dir, with a `user-dirs.conf` that disables xdg-user-dirs-update; HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR, TMPDIR and XDG_DATA_DIRS stay the host's. [nested.sh:9-27]
A2. No GSETTINGS_BACKEND; the redirected XDG_CONFIG_HOME is exported before dbus-run-session. [nested.sh:9, nested.sh:29-32]
A3. dbus-run-session gives gsettings and the shell a private session bus; the systemd user manager is not addressed. [nested.sh:29-34]
A4. Not handled.
A5. `--devkit --wayland`; host display variables are inherited and Xwayland is not disabled. [nested.sh:33]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [nested.sh:9, nested.sh:25]
A7. Not handled; the full host environment is inherited. [nested.sh:9, nested.sh:25]
A8. Not handled.
A9. No process handling; `exec` replaces the script with dbus-run-session and the inner bash with gnome-shell. [nested.sh:29, nested.sh:33]
A10. Sets the nested input sources to `xkb fr`; no grab or lock handling. [nested.sh:31]
A11. Not handled.
A12. Enables only `minibar@essembeh.org` in the nested settings. [nested.sh:30]
A13. Not handled.

## B. Lifecycle

B1. Not handled.
B2. None; `src/` is linked as is, without schema compilation. [nested.sh:27]
B3. Creates three temp dirs per run; never reuses or removes them. [nested.sh:9, nested.sh:14, nested.sh:25]
B4. `exec dbus-run-session -- bash -c "…"`. [nested.sh:29-34]
B5. Sets enabled-extensions, input sources `fr` and six favorite apps. [nested.sh:29-33]
B6. `ln -sfn` of `src/` into the temp extension dir. [nested.sh:26-27]
B7. gsettings inside the bus before the shell starts; no check. [nested.sh:30, nested.sh:33]
B8. `gnome-shell --devkit --wayland`; no size or scale. [nested.sh:33]
B9. Not handled.
B10. Not handled; only favorites are preset. [nested.sh:32]
B11. Not handled.
B12. Terminal output only. [nested.sh:29]
B13. No traps; no timeout.
B14. Not handled; the three temp dirs stay. [nested.sh:9, nested.sh:14, nested.sh:25]

## C. Properties

C1. Bound to minibar by UUID, plus a French keyboard layout and a fixed favorites list. [nested.sh:27, nested.sh:30-32]
C2. No arguments or variables. [nested.sh:7-34]
C3. Each run has its own temp dirs and bus. [nested.sh:9, nested.sh:14, nested.sh:25, nested.sh:29]
C4. `--devkit --wayland`; no version detection. [nested.sh:33]
C5. Bash; mktemp, ln, dbus-run-session, gsettings, gnome-shell; 34 lines. [nested.sh:1, nested.sh:9, nested.sh:27, nested.sh:29-33]
C6. The temp config, user-dirs target and data dirs stay after each run; no later run reuses them. [nested.sh:9, nested.sh:14, nested.sh:25]
C7. Not stated in the given file.
