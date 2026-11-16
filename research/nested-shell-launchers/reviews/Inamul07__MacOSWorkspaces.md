# Inamul07/MacOSWorkspaces `scripts/dev-session.sh`

## A. Shared with the real session

A1. Not handled; HOME and all XDG dirs are inherited, the extension is installed into the real `~/.local/share/gnome-shell/extensions/<uuid>`, and the dconf profile lives in the real config dir. [scripts/dev-session.sh:13, scripts/dev-session.sh:18, scripts/dev-session.sh:59-66, scripts/dev-session.sh:77-80]
A2. DCONF_PROFILE points at a user profile whose only line selects the separate user db `macos_workspaces_dev`; it is in `dbus-run-session`'s environment. [scripts/dev-session.sh:21, scripts/dev-session.sh:69-80, scripts/dev-session.sh:84]
A3. `dbus-run-session` provides a private session bus; the systemd user manager is not addressed. [scripts/dev-session.sh:84]
A4. Not handled.
A5. Requires DISPLAY; the nested window runs on the host, and WAYLAND_DISPLAY and XDG_RUNTIME_DIR are inherited. [scripts/dev-session.sh:37-41, scripts/dev-session.sh:88-89]
A6. Not handled; the real XDG_RUNTIME_DIR is inherited. [scripts/dev-session.sh:84-90]
A7. Not handled; the full environment is inherited. [scripts/dev-session.sh:84]
A8. Not handled. [scripts/dev-session.sh:84-90]
A9. Not handled; the script `exec`s into `dbus-run-session`, no traps or kills. [scripts/dev-session.sh:84]
A10. Not handled. [scripts/dev-session.sh:88-89]
A11. Not handled. [scripts/dev-session.sh:88-89]
A12. Deletes and replaces the real session's installed copy of the extension; enabled-extensions is written to the separate dconf db; the crash flag is not handled. [scripts/dev-session.sh:13, scripts/dev-session.sh:60-66, scripts/dev-session.sh:84-86]
A13. Not handled. [scripts/dev-session.sh:1-90]

## B. Lifecycle

B1. Checks `gnome-shell`, `glib-compile-schemas`, `dbus-run-session`, DISPLAY and snap/flatpak confinement, failing with messages; warns when the shell major version is not 46 or the session is not Wayland. [scripts/dev-session.sh:26-28, scripts/dev-session.sh:37-56]
B2. No build; copies a fixed list of files and compiles schemas with `--strict`. [scripts/dev-session.sh:62-66]
B3. No sandbox dir; the dconf profile and database are reused across runs. [scripts/dev-session.sh:77-80]
B4. `exec env DCONF_PROFILE=... dbus-run-session -- bash -c ...`. [scripts/dev-session.sh:84]
B5. `enabled-extensions`, `disable-user-extensions false`, `workspaces-only-on-primary false`. [scripts/dev-session.sh:84-90]
B6. `rm -rf` of the real extension dir, then copy. [scripts/dev-session.sh:59-66]
B7. `enabled-extensions` and `disable-user-extensions false`. [scripts/dev-session.sh:84-89]
B8. `gnome-shell --nested --wayland` with MUTTER_DEBUG_DUMMY_MODE_SPECS from NESTED_RES, default 1024x576; no scale. [scripts/dev-session.sh:14-16, scripts/dev-session.sh:88-89]
B9. Not handled. [scripts/dev-session.sh:84-90]
B10. Not handled. [scripts/dev-session.sh:84-90]
B11. Not handled; rerun reinstalls. [scripts/dev-session.sh:59-66]
B12. Output goes to the terminal with status lines. [scripts/dev-session.sh:59, scripts/dev-session.sh:80, scripts/dev-session.sh:83-89]
B13. Not handled; no traps. [scripts/dev-session.sh:84]
B14. Not handled; the installed extension, profile and dconf db remain. [scripts/dev-session.sh:60-66, scripts/dev-session.sh:77-80]

## C. Properties

C1. Bound to this project: UUID, dconf db name, file list. [scripts/dev-session.sh:11, scripts/dev-session.sh:21, scripts/dev-session.sh:63]
C2. No arguments; NESTED_RES sets the size. [scripts/dev-session.sh:16]
C3. Instances share the real extension dir and the same dconf db. [scripts/dev-session.sh:13, scripts/dev-session.sh:21, scripts/dev-session.sh:77]
C4. Targets Ubuntu 24.04 / GNOME Shell 46 and warns on other versions; needs an X display. [scripts/dev-session.sh:6, scripts/dev-session.sh:37-50]
C5. bash, `gnome-shell`, `glib-compile-schemas`, `dbus-run-session`, `gsettings`, `grep`, `head`, `env`; 90 lines. [scripts/dev-session.sh:1-90]
C6. The extension in the real data dir, the profile file and the private dconf db. [scripts/dev-session.sh:13, scripts/dev-session.sh:77-80]
C7. Not stated; the file has no license header. [scripts/dev-session.sh:1-90]
