# NGdev2/earful `Makefile`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is pointed at a fresh `mktemp -d` dir; HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. [Makefile:34-35]
A2. `gsettings` runs inside `dbus-run-session` with the temp XDG_CONFIG_HOME; DCONF_PROFILE is not reset; the `install` prerequisite runs before, with the real XDG_CONFIG_HOME and session bus. [Makefile:26-27, Makefile:34-36]
A3. `dbus-run-session` gives the nested shell a private session bus; the systemd user manager is not addressed. [Makefile:35]
A4. Not handled.
A5. The shell runs as `--nested --wayland` window on the host display; DISPLAY, WAYLAND_DISPLAY and the real XDG_RUNTIME_DIR are inherited. [Makefile:35-37]
A6. Not handled; the real XDG_RUNTIME_DIR is inherited. [Makefile:35-37]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited. [Makefile:35]
A8. Not handled; nothing in the target addresses portals, gvfs or FUSE mounts, and the real runtime dir is inherited. [Makefile:35-37]
A9. Not handled; no kill, trap or signal handling. [Makefile:35-37]
A10. Not handled; the nested shell runs as a window on the host with no input or lock settings. [Makefile:37]
A11. Not handled; no renderer or GPU settings. [Makefile:37]
A12. enabled-extensions is written only to the temp dconf; the `install` prerequisite runs install.sh (depends on install.sh); the crash flag is not handled. [Makefile:26-27, Makefile:34-36]
A13. Depends on install.sh; the nested recipe itself does no downloads and handles no tokens. [Makefile:27, Makefile:34-37]

## B. Lifecycle

B1. Not handled; no tool or version checks, only the comment "GNOME 46-48". [Makefile:32-37]
B2. `nested` depends on `install`, which runs `sh install.sh --from .`; `pack`/`schemas` are not prerequisites (depends on install.sh). [Makefile:13-20, Makefile:26-27, Makefile:34]
B3. Creates a new `mktemp -d` config dir on every run; it is never reused or reset. [Makefile:35]
B4. `dbus-run-session -- sh -c ...`. [Makefile:35]
B5. One `gsettings set org.gnome.shell enabled-extensions`. [Makefile:36-37]
B6. Depends on install.sh, run through the `install` prerequisite. [Makefile:26-27, Makefile:34]
B7. enabled-extensions set to the UUID in the private dconf; disable-user-extensions is not set. [Makefile:1, Makefile:36]
B8. `gnome-shell --nested --wayland` with `MUTTER_DEBUG_DUMMY_MODE_SPECS=1366x768` fixed in the recipe; no scale. [Makefile:37]
B9. Not handled. [Makefile:35-37]
B10. Not handled; the target starts no prefs, apps, eval or screenshot helpers and offers no outside control; `bridge-install`/`bridge-uninstall` run `gjs -m tools/bridge.js` in the unredirected make environment. [Makefile:34-37, Makefile:39-45]
B11. Not handled; each `make nested` reinstalls and starts a new shell. [Makefile:34-37]
B12. Shell output goes to the terminal unredirected. [Makefile:35-37]
B13. Not handled; no trap. [Makefile:35-37]
B14. Not handled; the temp config dir is never removed. [Makefile:35]

## C. Properties

C1. Bound to this project: fixed UUID and its own install.sh. [Makefile:1, Makefile:27]
C2. `make nested`; no arguments or environment variables, and the size is a literal. [Makefile:34-37]
C3. Each run gets its own temp config dir and bus; the installed extension location comes from install.sh (depends on install.sh). [Makefile:34-35]
C4. Comment states GNOME 46-48; no detection. [Makefile:33]
C5. GNU make, POSIX `sh`, `mktemp`, `dbus-run-session`, `gsettings`, `gnome-shell`, plus install.sh; the target is 6 lines of a 116-line Makefile. [Makefile:32-37]
C6. The temp config dirs accumulate; the installed extension depends on install.sh. [Makefile:27, Makefile:35]
C7. Not stated; the file has no license header. [Makefile:1-116]
