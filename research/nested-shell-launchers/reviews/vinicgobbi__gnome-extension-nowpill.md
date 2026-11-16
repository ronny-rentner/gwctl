# vinicgobbi/gnome-extension-nowpill `Makefile`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME, XDG_STATE_HOME and XDG_CACHE_HOME point into `$(CURDIR)/.nested` and are set in front of dbus-run-session. HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. [Makefile:39, Makefile:43-45]
A2. dconf stays the backend; `.nested/config` is set as XDG_CONFIG_HOME before the bus. [Makefile:43-45]
A3. The shell runs under dbus-run-session. The systemd user manager is not touched, and XDG_RUNTIME_DIR is inherited. [Makefile:43-45]
A4. Not handled; the system bus is not redirected. [Makefile:43-45]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited, and the shell runs without `--no-x11`. [Makefile:45]
A6. Not handled; XDG_RUNTIME_DIR is inherited. [Makefile:43-45]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment pass through `env` unchanged. [Makefile:43]
A8. Not handled.
A9. Not handled; no kill, trap or process-group handling. [Makefile:43-45]
A10. Not handled. [Makefile:45]
A11. Not handled; no renderer or GPU settings. [Makefile:45]
A12. Crash flag not handled. The nested data dir holds only this extension. [Makefile:41-43]
A13. No downloads or tokens.

## B. Lifecycle

B1. No prerequisite or version checks. [Makefile:40-45]
B2. The `schemas` prerequisite compiles the schemas into the source dir, and a failure stops make; `styles`, which `install` runs, is not a prerequisite of `nested`. [Makefile:7-8, Makefile:40, Makefile:16]
B3. `.nested` is deleted and recreated on every run. [Makefile:41]
B4. `dbus-run-session` in the `nested` recipe. [Makefile:45]
B5. `gsettings set org.gnome.shell enabled-extensions` inside the private bus; the value is written with `\x27`. [Makefile:1, Makefile:45]
B6. `cp -r` of the source dir into `.nested/data/gnome-shell/extensions`; a failure stops make before the shell starts. [Makefile:42]
B7. Through the `gsettings set` in B5. [Makefile:45]
B8. `gnome-shell --devkit --wayland` with no size or scale options. [Makefile:45]
B9. Not handled.
B10. Not handled; no prefs, eval, screenshot or external control.
B11. Not handled.
B12. Output goes to the terminal. [Makefile:45]
B13. Not handled: no trap or timeout.
B14. `.nested` stays in the project dir until the next run deletes it. [Makefile:39, Makefile:41]

## C. Properties

C1. Bound to this project: UUID and source dir. [Makefile:1-2]
C2. `make nested`; no arguments or environment inputs. [Makefile:40]
C3. No: `.nested` is a fixed path deleted at every start. [Makefile:39, Makefile:41]
C4. Uses `--devkit --wayland` without fallback; no GNOME version or distribution stated or checked. [Makefile:45]
C5. GNU make with sh recipes, glib-compile-schemas, dbus-run-session, gsettings, gnome-shell. The nested part is lines 36-45 of a 45-line Makefile. [Makefile:7-8, Makefile:40-45]
C6. `.nested` in the project dir and the compiled schemas in the source dir. [Makefile:39, Makefile:8]
C7. Not stated in the Makefile.
