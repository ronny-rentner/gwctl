# Disk-MTH/Quick-Settings-Scroll `Makefile`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to the fixed path /tmp/quick-settings-scroll-nested-config. HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited, and `install` writes the extension into the real ~/.local/share. [Makefile:8, Makefile:70, Makefile:5, Makefile:27-31, Makefile:69]
A2. The nested dconf gets a copy of the real `dconf/user` database, and XDG_CONFIG_HOME is set in front of dbus-run-session. The real database is only read. [Makefile:70, Makefile:74-76, Makefile:75]
A3. The shell runs under dbus-run-session. The systemd user manager is not touched, XDG_RUNTIME_DIR is inherited, and `nested-config` queries the real shell over the real bus with `gnome-extensions list --enabled`. [Makefile:70, Makefile:77]
A4. Not handled; the system bus is not redirected. [Makefile:70]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [Makefile:70]
A6. Not handled; XDG_RUNTIME_DIR is inherited. [Makefile:70]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment pass through `env` unchanged. [Makefile:70]
A8. Not handled.
A9. Not handled; no kill, trap or process-group handling. [Makefile:70]
A10. Not handled. [Makefile:70]
A11. Not handled; no renderer or GPU settings. [Makefile:70]
A12. Crash flag not handled. `install` overwrites the real installed copy. [Makefile:27-31]
A13. No downloads or tokens.

## B. Lifecycle

B1. No prerequisite or version checks. `nested-config` prints a note when the extension is not enabled in the real session and continues. [Makefile:77-78]
B2. No build step; `install` copies the files, with the docs copy as `2>/dev/null || true`. [Makefile:27-32]
B3. The config dir is deleted and recreated on every run; `clean` also removes it. [Makefile:72-74, Makefile:98]
B4. `dbus-run-session` in the `nested` recipe. [Makefile:70]
B5. Initial settings are a copy of the real dconf database; if the copy fails, a message is printed. [Makefile:75-76]
B6. Via the `install` prerequisite into the real user extension dir; a failing step stops make before the shell starts, except the docs copy, which is `2>/dev/null || true`. [Makefile:27-35, Makefile:69, Makefile:32]
B7. Not done for the nested shell; it prints a hint to run `make enable` when the extension is not enabled in the real session. [Makefile:77-78]
B8. `gnome-shell --devkit` with no mode, size or scale options. [Makefile:70]
B9. Not handled.
B10. Not handled; no prefs, eval, screenshot or external control for the nested shell.
B11. Not handled.
B12. Shell output goes straight to the terminal. [Makefile:70]
B13. Not handled: no trap or timeout.
B14. The /tmp config dir stays after the run and is removed only by the next run or `make clean`; the installed copy stays in the real data dir. [Makefile:73, Makefile:98, Makefile:27-31]

## C. Properties

C1. Bound to this project: UUID and config path are project specific. [Makefile:4, Makefile:8]
C2. Make targets `nested` and `nested-config` beside install/enable/pack; no arguments, only HOME and XDG_CONFIG_HOME are read. [Makefile:12, Makefile:14-23, Makefile:5, Makefile:75]
C3. No: the config path is fixed and deleted on each start, and the install dir is the real one. [Makefile:8, Makefile:73, Makefile:5]
C4. Header states GNOME Shell 49, 50 and 51; the recipe uses `--devkit` only. No distribution or display-server checks. [Makefile:2, Makefile:70]
C5. GNU make with sh recipes, gnome-shell, dbus-run-session, cp, grep, gnome-extensions. The nested part spans lines 47-78 of a 98-line Makefile. [Makefile:27-35, Makefile:69-78]
C6. The /tmp config copy until the next run or `make clean`, and the installed extension in the real data dir. [Makefile:73, Makefile:98, Makefile:27-31]
C7. Not stated in the Makefile; it copies a LICENSE file into the install and the zip. [Makefile:32, Makefile:93]
