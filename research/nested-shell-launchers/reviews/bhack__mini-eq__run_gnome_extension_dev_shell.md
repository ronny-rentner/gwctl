# bhack/mini-eq `tools/run_gnome_extension_dev_shell.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_CACHE_HOME point into the fixed `${XDG_RUNTIME_DIR:-/tmp}/mini-eq-gnome-shell-dev` and are exported before dbus-run-session. HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited; `--real-session-install` installs into the real session instead. [run_gnome_extension_dev_shell.sh:9-12, run_gnome_extension_dev_shell.sh:131-133, run_gnome_extension_dev_shell.sh:83-123]
A2. GSETTINGS_BACKEND=keyfile is exported before dbus-run-session. `--real-session-install` writes the real session's enabled and disabled lists. [run_gnome_extension_dev_shell.sh:127-134, run_gnome_extension_dev_shell.sh:84-116]
A3. The shell runs under dbus-run-session. The systemd user manager is not touched, and XDG_RUNTIME_DIR is inherited. `--real-session-install` runs gnome-extensions and gsettings on the real bus. [run_gnome_extension_dev_shell.sh:131-134, run_gnome_extension_dev_shell.sh:155, run_gnome_extension_dev_shell.sh:159, run_gnome_extension_dev_shell.sh:84-116]
A4. Not handled; the system bus is not redirected. [run_gnome_extension_dev_shell.sh:196, run_gnome_extension_dev_shell.sh:201]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [run_gnome_extension_dev_shell.sh:196, run_gnome_extension_dev_shell.sh:201]
A6. Not handled; XDG_RUNTIME_DIR is inherited. A fake Mini EQ control service runs on the private bus. [run_gnome_extension_dev_shell.sh:131-134, run_gnome_extension_dev_shell.sh:142-148, run_gnome_extension_dev_shell.sh:181]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited. [run_gnome_extension_dev_shell.sh:131-134]
A8. Not handled.
A9. Inside the private bus a trap on EXIT, INT and TERM kills the fake control service by its PID; no kill patterns. [run_gnome_extension_dev_shell.sh:160-166, run_gnome_extension_dev_shell.sh:181-182]
A10. Not handled.
A11. Not handled; no renderer or GPU settings.
A12. Crash flag not handled. The nested data dir and enabled list hold only this extension; `--real-session-install` disables, reinstalls and re-enables it in the real shell. [run_gnome_extension_dev_shell.sh:125-129, run_gnome_extension_dev_shell.sh:84-116]
A13. No downloads or tokens; packing depends on tools/pack_gnome_shell_extension.sh. [run_gnome_extension_dev_shell.sh:8, run_gnome_extension_dev_shell.sh:81]

## B. Lifecycle

B1. Checks the extension source dir and that the pack helper and fake control service are executable, each failure exiting 1 with a message. Detects `--devkit` from `gnome-shell --help`; with it, a missing mutter-devkit binary exits 1 with an apt hint; without it, falls back to `--nested --wayland`. [run_gnome_extension_dev_shell.sh:63-76, run_gnome_extension_dev_shell.sh:188-201]
B2. Depends on tools/pack_gnome_shell_extension.sh, called with the dev home and its output discarded; failure ends the script via `set -e`. The nested modes copy the source tree, not the bundle. [run_gnome_extension_dev_shell.sh:2, run_gnome_extension_dev_shell.sh:81, run_gnome_extension_dev_shell.sh:125]
B3. The fixed dev home is deleted and recreated on every run and never removed at exit. [run_gnome_extension_dev_shell.sh:9, run_gnome_extension_dev_shell.sh:78-79]
B4. `dbus-run-session` only, with or without a wrapper that starts the fake service. The fake service runs in the background and its failure is not checked. [run_gnome_extension_dev_shell.sh:152-186, run_gnome_extension_dev_shell.sh:181-184]
B5. `enabled-extensions` set to this UUID in the keyfile backend before the bus starts; failure ends the script via `set -e`. [run_gnome_extension_dev_shell.sh:127-129]
B6. `cp -a` of the source tree into the dev data dir; in `--real-session-install`, `gnome-extensions install --force` of the bundle into the real session. Failure ends the script via `set -e`. [run_gnome_extension_dev_shell.sh:125, run_gnome_extension_dev_shell.sh:85, run_gnome_extension_dev_shell.sh:2]
B7. Through the keyfile `enabled-extensions`. In `--real-session-install`, `gnome-extensions enable` with a Python fallback that edits the real gsettings lists; a failing gsettings in the fallback raises and ends the script via `set -e`. [run_gnome_extension_dev_shell.sh:127-129, run_gnome_extension_dev_shell.sh:86-116]
B8. `gnome-shell --devkit` with no size or scale, or `gnome-shell --nested --wayland` with MUTTER_DEBUG_DUMMY_MODE_SPECS=1280x800. [run_gnome_extension_dev_shell.sh:196, run_gnome_extension_dev_shell.sh:201]
B9. Not handled; a fixed `sleep 0.5` after starting the fake service is the only wait. [run_gnome_extension_dev_shell.sh:181-184]
B10. A fake Mini EQ D-Bus control service on the private bus, with options for monitoring off and preset count; no eval or screenshots. `--real-session-install` prints how to run the real app. [run_gnome_extension_dev_shell.sh:21-25, run_gnome_extension_dev_shell.sh:173-181, run_gnome_extension_dev_shell.sh:120-121]
B11. Not handled.
B12. Shell output goes to the terminal and its exit status is passed on; pack output is discarded. [run_gnome_extension_dev_shell.sh:196-197, run_gnome_extension_dev_shell.sh:81]
B13. The inner trap stops the fake service on EXIT, INT and TERM. No timeout. [run_gnome_extension_dev_shell.sh:160-166]
B14. The fake service is killed; the dev home stays until the next run deletes it. [run_gnome_extension_dev_shell.sh:160-166, run_gnome_extension_dev_shell.sh:78]

## C. Properties

C1. Bound to mini-eq: UUID, source path, pack helper and fake control service. [run_gnome_extension_dev_shell.sh:5-8]
C2. Options `--fake-control`, `--fake-control-monitor-off`, `--fake-preset-count COUNT`, `--no-fake-control`, `--real-session-install`, `-h`; XDG_RUNTIME_DIR is read. [run_gnome_extension_dev_shell.sh:17-61, run_gnome_extension_dev_shell.sh:9]
C3. No: the dev home is a fixed path deleted at every start. [run_gnome_extension_dev_shell.sh:9, run_gnome_extension_dev_shell.sh:78]
C4. `--devkit` when available, else `--nested --wayland`; mutter-devkit looked up in /usr/libexec, /usr/lib or PATH, with a Debian/Ubuntu install hint. [run_gnome_extension_dev_shell.sh:188-201, run_gnome_extension_dev_shell.sh:189-191]
C5. bash, dbus-run-session, gnome-shell, gsettings, gnome-extensions, python3 for the real-session fallback, plus the pack helper and the fake control service. 201 lines. [run_gnome_extension_dev_shell.sh:7-8, run_gnome_extension_dev_shell.sh:84-116, run_gnome_extension_dev_shell.sh:127-201]
C6. The dev home until the next run; in `--real-session-install`, the real install and settings changes. [run_gnome_extension_dev_shell.sh:9, run_gnome_extension_dev_shell.sh:78, run_gnome_extension_dev_shell.sh:84-116]
C7. Not stated in the script.
