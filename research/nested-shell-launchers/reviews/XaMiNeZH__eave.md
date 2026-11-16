# XaMiNeZH/eave `tools/try.sh`

## A. Shared with the real session

A1. Not handled: HOME, XDG dirs, runtime dir and TMPDIR are inherited; installation depends on install.sh. [try.sh:11, try.sh:44, try.sh:47]

A2. Not handled: no backend change. [try.sh:44, try.sh:47]

A3. `dbus-run-session` private bus; the systemd user manager is not handled. [try.sh:44, try.sh:47]

A4. Not handled. [try.sh:44, try.sh:47]

A5. `--devkit --wayland` or `--nested --wayland`, host display variables inherited. [try.sh:43-48]

A6. Not handled. [try.sh:44, try.sh:47]

A7. Not handled: the environment is inherited. [try.sh:44, try.sh:47]

A8. Not handled. [try.sh:44, try.sh:47]

A9. `exec` into `dbus-run-session`; no kill or signal handling. [try.sh:44, try.sh:47]

A10. Not handled.

A11. Not handled.

A12. Installation depends on install.sh; enabling is left to the user; the crash flag is not handled. [try.sh:11, try.sh:38-39]

A13. Not handled.

## B. Lifecycle

B1. After running install.sh, checks gnome-shell on PATH, reads the major version from `gnome-shell --version`, detects flags by grepping `--help`, and requires mutter-devkit for ≥ 49 or a `--devkit` build. [try.sh:11, try.sh:13-34]

B2. Depends on install.sh. [try.sh:11]

B3. Not handled.

B4. `exec dbus-run-session -- gnome-shell ...`. [try.sh:44, try.sh:47]

B5. Not handled.

B6. Depends on install.sh, run under `set -e`. [try.sh:6, try.sh:11]

B7. Not handled: prints the `gnome-extensions enable` command for the user. [try.sh:38-39]

B8. `--devkit --wayland` if the help mentions `--devkit`, else `--nested --wayland`; no size, scale or mode. [try.sh:43-48]

B9. Not handled.

B10. Not handled.

B11. Not handled.

B12. Output to the terminal; the exit status is `dbus-run-session`'s through `exec`. [try.sh:44, try.sh:47]

B13. No trap or timeout. [try.sh:44, try.sh:47]

B14. Not handled.

## C. Properties

C1. Generic apart from the UUID in a message and install.sh. [try.sh:8, try.sh:11, try.sh:39]

C2. No arguments, options or variables.

C3. No fixed names in this file. [try.sh:44, try.sh:47]

C4. GNOME ≥ 49 with mutter-devkit, or older with `--nested`; hints name Fedora and dnf. [try.sh:21-34, try.sh:26, try.sh:51]

C5. bash, gnome-shell, awk, grep, dbus-run-session, mutter-devkit; 52 lines. [try.sh:1, try.sh:14, try.sh:18, try.sh:30, try.sh:44]

C6. Depends on install.sh. [try.sh:11]

C7. GPL-3.0-or-later (SPDX header). [try.sh:2]
