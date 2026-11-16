# JAIDHEER007/Ubuntu-Workspace-Manager `run-nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME and XDG_DATA_HOME are exported into a mktemp dir [run-nested.sh:18, run-nested.sh:24]. HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are real.
A2. The exported XDG_CONFIG_HOME reaches dbus-run-session [run-nested.sh:24, run-nested.sh:28]; three real settings are read before the redirect [run-nested.sh:13-16].
A3. `dbus-run-session` with the exported XDG_CONFIG_HOME and XDG_DATA_HOME [run-nested.sh:24, run-nested.sh:28]. Systemd user manager: Not handled; XDG_RUNTIME_DIR is inherited [run-nested.sh:28].
A4. Not handled.
A5. `--devkit --wayland` without a display name or `--no-x11`; MUTTER_DEBUG_DUMMY_MODE_SPECS is exported, default 1280x800 [run-nested.sh:25, run-nested.sh:33]; the host's WAYLAND_DISPLAY and DISPLAY are inherited [run-nested.sh:28].
A6. Not handled: XDG_RUNTIME_DIR is inherited [run-nested.sh:28].
A7. Not handled: SSH_AUTH_SOCK, keyring variables and HOME are inherited [run-nested.sh:28].
A8. Not handled.
A9. Not handled; the only trap removes the tmp dir [run-nested.sh:19].
A10. Not handled.
A11. Not handled.
A12. The repo is symlinked as the extension and only this uuid is enabled [run-nested.sh:22, run-nested.sh:29]. Crash flag: Not handled; XDG_RUNTIME_DIR is inherited [run-nested.sh:28].
A13. Not handled.

## B. Lifecycle

B1. Not handled.
B2. `glib-compile-schemas schemas/` in the repo [run-nested.sh:8].
B3. A new mktemp dir each run, removed on EXIT [run-nested.sh:18-19].
B4. `dbus-run-session sh -c`, the script's last command [run-nested.sh:28-34].
B5. Mirrors workspace-names, num-workspaces and dynamic-workspaces from the real session [run-nested.sh:14-16, run-nested.sh:30-32].
B6. Symlink of the repo [run-nested.sh:22].
B7. enabled-extensions [run-nested.sh:29]; disable-user-extensions is not set.
B8. `gnome-shell --devkit --wayland` with MUTTER_DEBUG_DUMMY_MODE_SPECS exported (default 1280x800); no `--virtual-monitor` or scale [run-nested.sh:25, run-nested.sh:33].
B9. Not handled.
B10. Not handled.
B11. Not handled.
B12. Output goes to the terminal.
B13. EXIT trap only, no INT or TERM trap [run-nested.sh:19]. No timeout.
B14. `rm -rf "$TMP"` on EXIT [run-nested.sh:19]; compiled schemas stay in the repo [run-nested.sh:8].

## C. Properties

C1. Bound to Ubuntu-Workspace-Manager: uuid and workspace settings [run-nested.sh:10-16].
C2. Environment variable MUTTER_DEBUG_DUMMY_MODE_SPECS; no arguments [run-nested.sh:25].
C3. Unique tmp dir, no fixed display name [run-nested.sh:18, run-nested.sh:33].
C4. apt hint for Debian/Ubuntu [run-nested.sh:5]; Wayland [run-nested.sh:33].
C5. POSIX sh, gsettings, glib-compile-schemas, mktemp, dbus-run-session and gnome-shell; 34 lines [run-nested.sh:1-34].
C6. Compiled schemas in the repo [run-nested.sh:8].
C7. GPL-2.0-or-later per SPDX header [run-nested.sh:2].
