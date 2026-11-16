# xi72yow/xi-extensions `scripts/dev-shell.sh`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME points at a `mktemp -d -t xiws-dev-XXXXXX` dir; HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. [scripts/dev-shell.sh:50-51]
A2. The writes run in a second stage under `dbus-run-session`, with the temp XDG_CONFIG_HOME; the xiws branch is seeded from a dump of the real dconf. [scripts/dev-shell.sh:24-35, scripts/dev-shell.sh:46-51, scripts/dev-shell.sh:72]
A3. `dbus-run-session` provides a private session bus; the systemd user manager is not addressed. [scripts/dev-shell.sh:72]
A4. Not handled.
A5. `--nested --wayland` window on the host with DISPLAY and WAYLAND_DISPLAY inherited; the nested socket name is `xiws-dev`. [scripts/dev-shell.sh:37]
A6. Not handled; the real XDG_RUNTIME_DIR is inherited. [scripts/dev-shell.sh:72]
A7. Not handled; SSH_AUTH_SOCK is inherited.
A8. Not handled. [scripts/dev-shell.sh:72]
A9. Not handled; no kills and no process tracking. [scripts/dev-shell.sh:72]
A10. The nested instance gets Shift variants of the shortcuts; screen locking is not handled. [scripts/dev-shell.sh:34-35]
A11. Not handled. [scripts/dev-shell.sh:37]
A12. enabled-extensions is written only to the temp dconf; the crash marker `$XDG_RUNTIME_DIR/gnome-shell-disable-extensions` is removed on exit if it did not exist before; installed extensions depend on build.sh. [scripts/dev-shell.sh:33, scripts/dev-shell.sh:57-63]
A13. Not handled; depends on build.sh. [scripts/dev-shell.sh:44]

## B. Lifecycle

B1. Not handled; no tool or version checks.
B2. Runs `build.sh` from the repo root (depends on build.sh). [scripts/dev-shell.sh:44]
B3. A new `mktemp -d` profile per run, never reused or removed. [scripts/dev-shell.sh:50-51]
B4. `dbus-run-session` re-invokes the script with `--inner` as the last command. [scripts/dev-shell.sh:27, scripts/dev-shell.sh:72]
B5. `dconf load` of the dumped xiws branch, then enabled-extensions and Shift shortcuts; a failed dump is ignored and loads an empty file. [scripts/dev-shell.sh:30-35, scripts/dev-shell.sh:48]
B6. Depends on build.sh. [scripts/dev-shell.sh:44]
B7. `dconf write /org/gnome/shell/enabled-extensions`; `disable-user-extensions` is not set. [scripts/dev-shell.sh:33]
B8. `exec gnome-shell --nested --wayland --wayland-display=xiws-dev`; size from the first argument, default 1600x900; no scale. [scripts/dev-shell.sh:37, scripts/dev-shell.sh:42, scripts/dev-shell.sh:55]
B9. Not handled. [scripts/dev-shell.sh:37]
B10. Prints the nested shortcuts; no helpers. [scripts/dev-shell.sh:65-70]
B11. Not handled. [scripts/dev-shell.sh:72]
B12. Output goes to the terminal. [scripts/dev-shell.sh:72]
B13. No handling besides the marker trap on EXIT, INT and TERM, which is set only when the marker was absent at start. [scripts/dev-shell.sh:61-63]
B14. Removes the crash marker if it was new and the settings dump inside the inner stage; the profile dir stays. [scripts/dev-shell.sh:30-31, scripts/dev-shell.sh:50, scripts/dev-shell.sh:61-63]

## C. Properties

C1. Bound to this project: UUID, settings branch, shortcut keys and build.sh. [scripts/dev-shell.sh:21-22, scripts/dev-shell.sh:34-35, scripts/dev-shell.sh:44]
C2. One optional `<width>x<height>` argument; `--inner <file>` is the internal second stage. [scripts/dev-shell.sh:7, scripts/dev-shell.sh:27-28, scripts/dev-shell.sh:42]
C3. Profiles and buses are per run; the Wayland display name `xiws-dev` is fixed. [scripts/dev-shell.sh:37, scripts/dev-shell.sh:50, scripts/dev-shell.sh:72]
C4. No version or distro detection.
C5. bash, `dconf`, `mktemp`, `dbus-run-session`, `gnome-shell`, build.sh; 72 lines. [scripts/dev-shell.sh:1-72]
C6. Profile dirs accumulate in the temp dir; the installed extensions depend on build.sh. [scripts/dev-shell.sh:44, scripts/dev-shell.sh:50]
C7. Not stated; the file has no license header. [scripts/dev-shell.sh:1-72]
