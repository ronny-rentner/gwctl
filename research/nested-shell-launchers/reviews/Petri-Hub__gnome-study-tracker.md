# Petri-Hub/gnome-study-tracker `dev.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_CACHE_HOME go to a fresh mktemp dir [dev.sh:24, 35-37]; XDG_RUNTIME_DIR is private with --headless [dev.sh:41-43]. HOME, XDG_STATE_HOME and TMPDIR stay the host's, and windowed mode keeps the host runtime dir [dev.sh:50-52].
A2. GSETTINGS_BACKEND=keyfile with the keyfile in the temp config dir, exported before `dbus-run-session` [dev.sh:32-38, 44, 52].
A3. `dbus-run-session` private bus [dev.sh:44, 52]; the systemd user manager is not addressed, and windowed mode keeps the host runtime dir [dev.sh:50-52].
A4. Not handled; the host system bus is inherited.
A5. Headless: own socket study-tracker-dev, `--no-x11` [dev.sh:44-47]. Windowed: host WAYLAND_DISPLAY and runtime dir, X11 not disabled [dev.sh:50-52].
A6. Not handled; windowed mode keeps the host runtime dir [dev.sh:50-52].
A7. Not handled; SSH_AUTH_SOCK is inherited, and windowed mode keeps the host runtime dir [dev.sh:50-52].
A8. Not handled.
A9. Not handled; no kill, `exec` hands over to dbus-run-session [dev.sh:44, 52].
A10. Not handled.
A11. Not handled.
A12. The extension is copied into the temp data dir and enabled in the temp keyfile [dev.sh:27-33]. Windowed mode keeps the host runtime dir, headless uses a private one [dev.sh:43, 50-52].
A13. Not handled.

## B. Lifecycle

B1. Unless --headless, checks that /usr/libexec/mutter-devkit is executable [dev.sh:11-22]; no version detection.
B2. No build: copies the repo dir and deletes .git, node_modules, renders, tests and scripts from the copy; schemas are not compiled [dev.sh:29-30].
B3. A fresh `mktemp -d` per run [dev.sh:24].
B4. `exec dbus-run-session` [dev.sh:44, 52].
B5. A keyfile with enabled-extensions only [dev.sh:32-33].
B6. `cp -r` of the repo into the temp extensions dir [dev.sh:27-30].
B7. enabled-extensions set to the UUID [dev.sh:32]; the extension's state after start is not checked [dev.sh:44, 52].
B8. Headless: 1280x800 virtual monitor, socket study-tracker-dev, Wayland only [dev.sh:44-47]; otherwise `--devkit --wayland` [dev.sh:52]; no scale.
B9. Not handled.
B10. Not handled.
B11. Not handled; each run copies the tree again [dev.sh:24-30].
B12. Output goes to the terminal [dev.sh:44, 52].
B13. An EXIT trap is set before `exec`; no timeout [dev.sh:25, 44, 52].
B14. An EXIT trap with `rm -rf` on the temp dir, set before `exec` [dev.sh:25, 44, 52].

## C. Properties

C1. Bound to the project by the hardcoded UUID and the list of removed dirs; the rest copies the script's own dir [dev.sh:7-8, 29-30].
C2. One optional argument: --headless, anything else runs windowed [dev.sh:9, 11, 40].
C3. Per-run mktemp dirs [dev.sh:24]; headless uses a fixed socket name and a per-run runtime dir [dev.sh:41-47]; windowed instances share the host runtime dir [dev.sh:50-52].
C4. No detection; the message names GNOME Shell 49 and Debian/Ubuntu [dev.sh:13-16].
C5. Bash, mktemp, cp, dbus-run-session, gnome-shell, mutter-devkit [dev.sh:1, 11, 24, 29, 44, 52]. 52 lines.
C6. Every run's temp dir in TMPDIR [dev.sh:24-25, 44, 52].
C7. Not stated in the file.
