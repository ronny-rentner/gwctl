# codebymarshall/gnome-movement-breaks `justfile`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to a `mktemp -d` dir set in front of dbus-run-session. HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited, and the `install` prerequisite runs `gnome-extensions install --force` into the real ~/.local/share. [justfile:29, justfile:31, justfile:16-18, justfile:26]
A2. dconf stays the backend; the empty temp XDG_CONFIG_HOME is exported before D-Bus starts. [justfile:31]
A3. The shell runs under dbus-run-session. The systemd user manager is not touched, and XDG_RUNTIME_DIR is inherited. [justfile:31]
A4. Not handled; the system bus is not redirected. [justfile:31-32]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [justfile:32]
A6. Not handled; XDG_RUNTIME_DIR is inherited. [justfile:31-32]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited. [justfile:31]
A8. Not handled.
A9. Not handled beyond the EXIT trap that removes the temp dir; no kill or process-group handling. [justfile:30]
A10. Not handled. [justfile:32]
A11. Not handled; no renderer or GPU settings. [justfile:32]
A12. Crash flag not handled. The nested enabled list holds only this UUID, and `install` overwrites the real installed copy. [justfile:18, justfile:32]
A13. No downloads or tokens.

## B. Lifecycle

B1. No prerequisite or version checks; `pack` validates the schema with `glib-compile-schemas --strict --dry-run`. [justfile:9]
B2. `install` → `pack`: schema check and `gnome-extensions pack` into dist/. Any failure stops just before the shell starts. [justfile:8-18]
B3. A fresh `mktemp -d` config dir per run, removed by an EXIT trap. [justfile:29-30]
B4. `dbus-run-session` in the `devkit` recipe; under `set -euo pipefail` its failure ends the script. [justfile:31, justfile:28]
B5. Empty database, then `gsettings set org.gnome.shell enabled-extensions` inside the private bus. A failing gsettings stops the `&&` chain before the shell starts. [justfile:32]
B6. `gnome-extensions install --force` of the packed zip into the real user extension dir; a failure stops just before the shell starts. [justfile:17-18, justfile:26]
B7. `enabled-extensions` set to this UUID only, through the private bus's dconf; a failing gsettings stops the `&&` chain before the shell starts. [justfile:32]
B8. `gnome-shell --devkit --wayland` with no size or scale options. [justfile:32]
B9. Not handled.
B10. Not handled; no prefs, eval, screenshot or external control. `check` depends on scripts/headless-check.sh. [justfile:21-22]
B11. Not handled; `just devkit` repacks and reinstalls. [justfile:26]
B12. Output goes to the terminal. [justfile:31-32]
B13. No timeout; the EXIT trap removes the temp dir. [justfile:30]
B14. The temp config dir is removed; the installed extension stays in the real data dir. [justfile:30, justfile:18]

## C. Properties

C1. Bound to this project: the UUID and the pack step. [justfile:1, justfile:8-14]
C2. just recipe `devkit` beside `test`, `pack`, `install`, `check` and `uninstall`; no arguments or environment inputs. [justfile:4-36]
C3. The config dir is unique per run; all instances install into the same real extension dir. [justfile:29, justfile:18]
C4. Uses `--devkit --wayland` without fallback; no GNOME version or distribution stated or checked. [justfile:32]
C5. just, bash, mktemp, dbus-run-session, gsettings, gnome-shell, gnome-extensions, glib-compile-schemas. The recipe is 9 lines of a 36-line justfile. [justfile:9-32]
C6. The installed extension in the real data dir and the packed zip in dist/. [justfile:18, justfile:10-11]
C7. Not stated in the justfile; `pack` includes a LICENSE file. [justfile:13]
