# fhaefele/screenshot-utils `scripts/test-shell.sh`

## A. Shared with the real session

A1. Data, config, cache and runtime dir (mode 700) point into a `mktemp -d` dir; HOME, XDG_STATE_HOME and TMPDIR are inherited. [test-shell.sh:12, test-shell.sh:22-27]
A2. GSETTINGS_BACKEND=dconf with DCONF_PROFILE unset and XDG_CONFIG_HOME set before `dbus-run-session`. [test-shell.sh:23, test-shell.sh:29-30, test-shell.sh:39, test-shell.sh:41]
A3. The host bus address is unset and `dbus-run-session` starts a private bus; the systemd user manager is not addressed. [test-shell.sh:39-41]
A4. DBUS_SYSTEM_BUS_ADDRESS is set to the private session bus inside the inner script, after `dbus-run-session` started the daemon. [test-shell.sh:41-42]
A5. DISPLAY is unset; modern runs headless at 1280x800, legacy runs `--nested` inside `xvfb-run`; X11 is off. WAYLAND_DISPLAY is not unset. [test-shell.sh:25, test-shell.sh:39, test-shell.sh:63-67]
A6. PIPEWIRE_* and PULSE_* variables are not unset. [test-shell.sh:39]
A7. SSH_AUTH_SOCK is not unset. [test-shell.sh:39]
A8. GIO_USE_VFS=local; the document portal's FUSE mount is unmounted in cleanup if present. [test-shell.sh:15-17, test-shell.sh:38]
A9. No kill commands; the shell runs in the foreground under `dbus-run-session`; cleanup is trapped on EXIT, HUP, INT and TERM. [test-shell.sh:13-21, test-shell.sh:41-67]
A10. Headless or Xvfb; the cursor theme is set; screen lock is not addressed. [test-shell.sh:55, test-shell.sh:64, test-shell.sh:66]
A11. Sets LIBGL_ALWAYS_SOFTWARE=1. [test-shell.sh:37]
A12. The extension is installed by `gnome-extensions install` into the temp data dir; the runtime dir is private; Ubuntu mode disables the mode's bundled extensions in the nested settings. [test-shell.sh:22, test-shell.sh:25, test-shell.sh:44-54]
A13. None; Ubuntu mode reads `/usr/share/gnome-shell/modes/ubuntu.json` locally. [test-shell.sh:50]

## B. Lifecycle

B1. Takes the major version from `gnome-shell --version`, accepts legacy for 42-44 and modern for 45-51; $1 is required. Tools are not checked. [test-shell.sh:4-9]
B2. Not handled; depends on `dist/<target>/screenshot-utils@fxth.dev.shell-extension.zip` and `dist/tests` from a separate build. [test-shell.sh:32, test-shell.sh:34, test-shell.sh:44]
B3. A new temp dir per run, removed by the cleanup trap. [test-shell.sh:12-21]
B4. `dbus-run-session` after unsetting the host bus address. [test-shell.sh:39, test-shell.sh:41]
B5. Sets enabled-extensions, disabled-extensions (Ubuntu mode), cursor-theme and welcome-dialog-last-shown-version. [test-shell.sh:45-56]
B6. `gnome-extensions install --force` from the zip. [test-shell.sh:44]
B7. Through enabled-extensions before the shell starts. [test-shell.sh:45]
B8. Modern: `gnome-shell --headless --wayland --no-x11 --virtual-monitor 1280x800` plus `--automation-script "$PWD/tests/shell.js" --force-animations`; legacy: `xvfb-run -a -s "-screen 0 1280x800x24" gnome-shell --nested --wayland --no-x11`; both pass `--mode=` from SCREENSHOT_UTILS_TEST_SHELL_MODE, default `user`; scale not set. [test-shell.sh:58-67]
B9. Not handled in the file; depends on `tests/shell.js` (modern) and the perf module in `dist/tests` (legacy). [test-shell.sh:32-34, test-shell.sh:59]
B10. Tests run inside the shell through the automation script or SHELL_PERF_MODULE; MUTTER_WM_CLASS_FILTER names the perf helper and the preferences window. Depends on those scripts. [test-shell.sh:32-36, test-shell.sh:59]
B11. Not handled.
B12. Progress lines and shell output go to the terminal; the shell's exit status becomes the script's through cleanup's `exit "$result"`. [test-shell.sh:11, test-shell.sh:14, test-shell.sh:19, test-shell.sh:43, test-shell.sh:57]
B13. Cleanup is trapped on EXIT, HUP, INT and TERM and does not signal dbus-run-session or gnome-shell; no timeout. [test-shell.sh:13-21]
B14. Unmounts the document portal if mounted and fusermount3 exists, then removes the temp dir. [test-shell.sh:15-18]

## C. Properties

C1. Bound to screenshot-utils: UUID, dist paths and variable names. [test-shell.sh:10, test-shell.sh:32-34, test-shell.sh:44-45]
C2. $1 `legacy|modern` (required); environment variable SCREENSHOT_UTILS_TEST_SHELL_MODE, default `user`, passed to `--mode=`, with extra setup for `ubuntu`. [test-shell.sh:4, test-shell.sh:46, test-shell.sh:64, test-shell.sh:66]
C3. All per-run state is under its temp dir, the buses are private, and legacy uses `xvfb-run -a`. [test-shell.sh:12, test-shell.sh:22-25, test-shell.sh:41, test-shell.sh:64]
C4. GNOME 42-44 (legacy) and 45-51 (modern); Ubuntu mode reads Ubuntu's mode file; headless or Xvfb, Wayland compositor only. [test-shell.sh:6-9, test-shell.sh:46-53, test-shell.sh:64, test-shell.sh:66]
C5. POSIX sh, awk, mountpoint, fusermount3, gnome-extensions, gsettings, dbus-run-session, gnome-shell, node (Ubuntu mode), xvfb-run (legacy); 68 lines. [test-shell.sh:1, test-shell.sh:5, test-shell.sh:15, test-shell.sh:44, test-shell.sh:48, test-shell.sh:64]
C6. Nothing; the temp dir is removed. [test-shell.sh:18]
C7. Depends on the repository's license file; the script has no license header. [test-shell.sh:1-3]
