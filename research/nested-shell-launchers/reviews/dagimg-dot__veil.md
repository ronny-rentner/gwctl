# dagimg-dot/veil `scripts/ui/session.sh`

## A. Shared with the real session

A1. Depends on the caller: the script sets no dirs and uses XDG_DATA_HOME from its environment; it writes logs to fixed `/tmp` files. [session.sh:5, session.sh:8, session.sh:15-16]
A2. Depends on the caller.
A3. Depends on the caller; the script starts no bus. [session.sh:10-21]
A4. Depends on the caller; not handled in the script. [session.sh:1-21]
A5. `gnome-shell --devkit --wayland --no-x11`: the display comes from the caller's env, Xwayland is off. [session.sh:21]
A6. Starts its own `pipewire` and `wireplumber` in the background, in the caller's env. [session.sh:15-16]
A7. Depends on the caller; not handled in the script. [session.sh:1-21]
A8. Depends on the caller; not handled in the script. [session.sh:1-21]
A9. pipewire and wireplumber run in the background without recorded PIDs; the shell replaces the script through `exec`. [session.sh:15-16, session.sh:21]
A10. Not handled. [session.sh:1-21]
A11. Not handled. [session.sh:1-21]
A12. Unpacks the extension into XDG_DATA_HOME, touches `update-check-<major>`, sets enabled-extensions to only this UUID, disables version validation and sets the welcome dialog version. Crash flag not handled. [session.sh:4-13]
A13. Not handled. [session.sh:1-21]

## B. Lifecycle

B1. Reads the major version from `gnome-shell --version`, only to name the update-check file; no prerequisite checks. [session.sh:7-8]
B2. Not handled; takes the fixed `/ext.zip`. [session.sh:4]
B3. Depends on the caller; `unzip -o` overwrites an existing copy. [session.sh:6]
B4. Depends on the caller; the script starts no bus. [session.sh:10-21]
B5. Four `gsettings set` calls: user extensions on, version validation off, enabled list, welcome dialog version `999`. [session.sh:10-13]
B6. Unzips into `<data>/gnome-shell/extensions/<uuid>` and runs `glib-compile-schemas` on `schemas` unconditionally. [session.sh:5-6]
B7. Through enabled-extensions `['<uuid>']`. [session.sh:12]
B8. `--devkit --wayland --no-x11`, size from UI_SIZE (default 1440x900) via MUTTER_DEBUG_DUMMY_MODE_SPECS; scale not handled. [session.sh:20-21]
B9. Not handled; a fixed `sleep 1` after starting pipewire. [session.sh:17]
B10. Not handled. [session.sh:1-21]
B11. Not handled. [session.sh:1-21]
B12. pipewire and wireplumber log to `/tmp`, the shell to stdout; the exit status is the shell's through `exec`. [session.sh:15-16, session.sh:21]
B13. Not handled; pipewire and wireplumber are not stopped. [session.sh:15-16, session.sh:21]
B14. Depends on the caller; the script cleans nothing. [session.sh:1-21]

## C. Properties

C1. Generic in the extension (UUID from the zip), bound to a caller that provides `/ext.zip` and XDG_DATA_HOME. [session.sh:4-5]
C2. Input file `/ext.zip`; env UI_SIZE and XDG_DATA_HOME; no arguments. [session.sh:4-5, session.sh:20]
C3. Depends on the caller; the log paths in `/tmp` are fixed. [session.sh:15-16]
C4. `--devkit`; no other version, distribution or display-server handling. [session.sh:7, session.sh:21]
C5. Bash, unzip, jq, glib-compile-schemas, gnome-shell, awk, cut, gsettings, pipewire, wireplumber; 21 lines. [session.sh:1-21]
C6. Depends on the caller. [session.sh:1-21]
C7. Depends on the repository's license file; the given file has no license notice. [session.sh:1-21]
