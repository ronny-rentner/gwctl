# Disk-MTH/Tailscale-Gnome `Makefile`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to the fixed path /tmp/tailscale-gnome-nested-config. HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited, and the `install` prerequisite writes the extension into the real ~/.local/share/gnome-shell/extensions. [Makefile:12, Makefile:171, Makefile:178, Makefile:7, Makefile:90-96, Makefile:170]
A2. The nested dconf gets a copy of the real `dconf/user` database, and XDG_CONFIG_HOME is set in front of dbus-run-session. The real database is only read. [Makefile:171, Makefile:182-184, Makefile:183]
A3. The shell runs under dbus-run-session. The systemd user manager is not touched, XDG_RUNTIME_DIR is inherited, and `nested-config` queries the real shell over the real bus with `gnome-extensions list --enabled`. [Makefile:171, Makefile:178, Makefile:185]
A4. Not handled; the system bus is not redirected. [Makefile:171]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [Makefile:171, Makefile:178]
A6. Not handled; XDG_RUNTIME_DIR is inherited. [Makefile:171]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment pass through `env` unchanged. [Makefile:171]
A8. Not handled.
A9. Not handled; no kill, trap or process-group handling, the shell runs in the foreground of a pipeline into awk. [Makefile:171-172]
A10. Not handled. [Makefile:171]
A11. Not handled; no renderer or GPU settings. [Makefile:171]
A12. Crash flag not handled. `install` overwrites the real installed copy. [Makefile:90-96]
A13. No downloads or tokens.

## B. Lifecycle

B1. No prerequisite or version checks; the recipe uses `--devkit` without fallback. `nested-config` prints a note when the extension is not enabled in the real session and continues. [Makefile:171, Makefile:185-186]
B2. `install` builds via `schemas` (glib-compile-schemas) and `translations` (msgfmt), then copies files. Failures stop make, except copying locale and docs, which are `2>/dev/null || true`. [Makefile:52-55, Makefile:80-84, Makefile:90-99, Makefile:98-99]
B3. The config dir is deleted and recreated on every run; `clean` also removes it. [Makefile:180-182, Makefile:232]
B4. `dbus-run-session` in the `nested` recipe; the recipe is a pipeline into awk without pipefail. [Makefile:171, Makefile:171-172]
B5. Initial settings are a copy of the real dconf database; if the copy fails, a message is printed. [Makefile:183-184]
B6. Via the `install` prerequisite into the real user extension dir; a failing step stops make before the shell starts, except the locale and docs copies, which are `2>/dev/null || true`. [Makefile:90-100, Makefile:170, Makefile:177, Makefile:98-99]
B7. Not done for the nested shell; it prints a hint to run `make enable` when the extension is not enabled in the real session. `enable` enables it in the real session. [Makefile:185-186, Makefile:108-109]
B8. `gnome-shell --devkit` with no mode, size or scale options. [Makefile:171, Makefile:178]
B9. Not handled.
B10. Not handled; no prefs, eval, screenshot or external control for the nested shell.
B11. Not handled.
B12. `nested` pipes stdout and stderr through an awk filter that keeps lines naming this extension plus their stack trace frames; `nested-raw` shows everything. [Makefile:151-168, Makefile:171-172, Makefile:174-178]
B13. Not handled: no trap or timeout.
B14. The /tmp config dir stays after the run and is removed only by the next run or `make clean`; the installed copy stays in the real data dir. [Makefile:181, Makefile:232, Makefile:90-96]

## C. Properties

C1. Bound to this project: UUID, config path and the awk filter patterns are project specific. [Makefile:4, Makefile:12, Makefile:166]
C2. Make targets `nested`, `nested-raw` and `nested-config` beside install/enable/reset/pack; no arguments, only HOME and XDG_CONFIG_HOME are read. [Makefile:29-30, Makefile:34-50, Makefile:7, Makefile:183]
C3. No: the config path is fixed and deleted on each start, and the install dir is the real one. [Makefile:12, Makefile:181, Makefile:7]
C4. Header states GNOME Shell 46 → 51; the recipe uses `--devkit` only. No distribution or display-server checks. [Makefile:2, Makefile:171]
C5. GNU make with sh recipes, gnome-shell, dbus-run-session, awk, cp, grep, gnome-extensions, glib-compile-schemas, msgfmt. The nested part spans lines 117-186 of a 232-line Makefile. [Makefile:52-53, Makefile:80-82, Makefile:90-99, Makefile:163-186]
C6. The /tmp config copy until the next run or `make clean`, and the installed extension in the real data dir. [Makefile:181, Makefile:232, Makefile:90-96]
C7. Not stated in the Makefile; it copies a LICENSE file into the install and the zip. [Makefile:99, Makefile:226]
