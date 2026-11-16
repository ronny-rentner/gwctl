# Excelsies/conjure-launcher `tools/preview.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_DATA_HOME, XDG_STATE_HOME and XDG_CACHE_HOME are exported into a mktemp sandbox [preview.sh:27, preview.sh:29-30]. HOME, XDG_RUNTIME_DIR and TMPDIR are real; the real `applications` dir is symlinked into the sandbox data dir [preview.sh:26, preview.sh:33].
A2. Five real settings are read with `gsettings get` before the redirect and written into the nested session only [preview.sh:16-25, preview.sh:44].
A3. `dbus-run-session` with the exported sandbox XDG dirs [preview.sh:29, preview.sh:37]. Systemd user manager: Not handled; XDG_RUNTIME_DIR is inherited [preview.sh:29, preview.sh:37].
A4. Not handled.
A5. `--devkit --wayland --virtual-monitor 1600x1000` without a display name or `--no-x11` [preview.sh:45]; the host's WAYLAND_DISPLAY and DISPLAY are inherited [preview.sh:29, preview.sh:37].
A6. Not handled: XDG_RUNTIME_DIR is inherited [preview.sh:37].
A7. Not handled: SSH_AUTH_SOCK, keyring variables and HOME are inherited [preview.sh:37].
A8. Not handled.
A9. No process tracking; `exec` replaces the inner bash with gnome-shell [preview.sh:45]; the trap only removes the sandbox [preview.sh:28].
A10. Not handled; mirrors the real keybindings [preview.sh:17, preview.sh:20-22].
A11. Not handled.
A12. The extension is symlinked from the checkout into the sandbox data dir, real user extensions are not in that dir [preview.sh:29, preview.sh:31]; the machine's search providers are disabled in the nested dconf [preview.sh:35, preview.sh:41]. Crash flag: Not handled; XDG_RUNTIME_DIR is inherited [preview.sh:29, preview.sh:37].
A13. Depends on tools/preview-script.js [preview.sh:4-5, preview.sh:46].

## B. Lifecycle

B1. Checks /usr/libexec/mutter-devkit and exits 1 with an apt hint [preview.sh:11]; reads the uuid via `python3 -I` [preview.sh:10]. No version detection.
B2. `glib-compile-schemas --strict` on the repo's schemas dir [preview.sh:12].
B3. A new sandbox each run, removed on EXIT [preview.sh:27-28].
B4. `dbus-run-session -- bash -c`, the script's last command [preview.sh:37-46].
B5. Sets enabled-extensions, disable-user-extensions, welcome-dialog-last-shown-version, disabled search providers and the mirrored keys [preview.sh:38-44].
B6. Symlinks the checkout as the extension dir [preview.sh:31].
B7. enabled-extensions [preview.sh:38].
B8. `--devkit --wayland --virtual-monitor 1600x1000 --automation-script=<tools/preview-script.js>`; no scale [preview.sh:45-46].
B9. Depends on tools/preview-script.js [preview.sh:45-46].
B10. Depends on tools/preview-script.js and an optional driver from CONJURE_PREVIEW_DRIVE, turned into an absolute path [preview.sh:6-7, preview.sh:14, preview.sh:46]; CONJURE_TEST_UUID is exported [preview.sh:34].
B11. Not handled.
B12. Output goes to the terminal.
B13. No signal traps [preview.sh:28]. Timeout: depends on the driver.
B14. The EXIT trap removes the sandbox [preview.sh:28]; compiled schemas stay in the repo [preview.sh:12].

## C. Properties

C1. Bound to conjure-launcher: preview-script.js, CONJURE_ variables and the mirrored keys [preview.sh:14, preview.sh:19-25, preview.sh:34, preview.sh:46]; the uuid comes from metadata.json [preview.sh:10].
C2. Environment variables CONJURE_PREVIEW_DRIVE and TMPDIR; no arguments [preview.sh:6-7, preview.sh:14, preview.sh:27].
C3. Unique sandbox, no fixed display name [preview.sh:27, preview.sh:45].
C4. GNOME Shell with `--devkit`, `--virtual-monitor` and `--automation-script`; /usr/libexec path and apt hint for Debian/Ubuntu [preview.sh:11, preview.sh:45]; Wayland.
C5. Bash, python3, glib-compile-schemas, gsettings, realpath, grep, cut, sort, sed, paste, mktemp, dbus-run-session and gnome-shell; 46 lines [preview.sh:1-46].
C6. Compiled schemas in the repo [preview.sh:12]; the sandbox is removed [preview.sh:28].
C7. Depends on the repository's license file; the script has no license header [preview.sh:1-8].
