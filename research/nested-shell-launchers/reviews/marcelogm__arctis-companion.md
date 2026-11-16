# marcelogm/arctis-companion `extension/tests/shell-session.sh`

## A. Shared with the real session

A1. Depends on the caller. The file sets no XDG, HOME or TMPDIR variable; the log path is the third argument [shell-session.sh:3-5, 10, 21].
A2. Depends on the caller. `gsettings set` writes disable-user-extensions and enabled-extensions; no backend is set [shell-session.sh:24-25].
A3. Depends on the caller. The shell and the gnome-extensions calls use the inherited session bus [shell-session.sh:9, 13, 15-16, 21].
A4. Not handled; the host system bus is inherited.
A5. Headless: own socket arctis-smoke, `--no-x11` [shell-session.sh:9]. Devkit: uses the inherited WAYLAND_DISPLAY, X11 not disabled [shell-session.sh:21].
A6. Not handled.
A7. Not handled.
A8. Not handled.
A9. Kills only the PIDs it started, the fake app and the headless shell, after the test and from an EXIT trap [shell-session.sh:11-12, 17, 27-28]; no patterns.
A10. Not handled.
A11. Not handled.
A12. Depends on the caller for the crash flag and the extension install. The file enables the extension with gsettings and, in headless mode, disables it again with `gnome-extensions disable` [shell-session.sh:15, 24-25].
A13. Not handled.

## B. Lifecycle

B1. Not handled; three positional arguments are read under `set -u` [shell-session.sh:2-5].
B2. Not handled; Depends on the caller.
B3. Not handled; Depends on the caller.
B4. Not handled; Depends on the caller.
B5. Two gsettings writes [shell-session.sh:24-25].
B6. Not handled; Depends on the caller.
B7. enabled-extensions set to the UUID [shell-session.sh:25]; headless waits for `State: ACTIVE` [shell-session.sh:13]; devkit does not check the state [shell-session.sh:21].
B8. Headless: 1280x800 virtual monitor, Wayland only, socket arctis-smoke [shell-session.sh:9]; devkit: `--devkit --wayland` [shell-session.sh:21]; no scale. Any mode other than `devkit` runs headless [shell-session.sh:29].
B9. Headless polls `gnome-extensions info` for `State: ACTIVE` every 0.5 s under `timeout 30` [shell-session.sh:13]. Devkit: Not handled.
B10. Starts tests/fake_app.js with the scenario as a helper [shell-session.sh:26]; headless disables the extension and waits for INACTIVE [shell-session.sh:15-16]. No eval or screenshots.
B11. Not handled.
B12. Shell output goes to the log, which the trap prints on exit [shell-session.sh:10, 12, 21, 28]; `JS ERROR`, `JS WARNING` or `Arctis Companion:` in the log gives exit 1 [shell-session.sh:30-32]. The exit status of the headless shell and the fake app is not read [shell-session.sh:9-11, 26].
B13. Headless stops itself after the disable check with `kill` [shell-session.sh:15-17]; only the state waits have timeouts, 30 s and 10 s [shell-session.sh:13, 16]. EXIT trap, no INT trap [shell-session.sh:12, 28].
B14. The EXIT trap kills the fake app and the shell [shell-session.sh:12, 28]; there is no `wait` after `kill` before the log is grepped [shell-session.sh:17, 30]. The log file remains.

## C. Properties

C1. Bound to the project: UUID, fake_app.js and the `Arctis Companion:` pattern [shell-session.sh:6, 26, 30].
C2. Positional: mode (`devkit`, anything else is headless), scenario, log path [shell-session.sh:3-5, 29]; no help.
C3. Headless uses the fixed socket name arctis-smoke [shell-session.sh:9]; the rest Depends on the caller.
C4. No version detection; uses `--devkit`, `--headless` and `--virtual-monitor` [shell-session.sh:9, 21].
C5. POSIX sh with GNU grep's `\|`; gnome-shell, gsettings, gjs, gnome-extensions, timeout [shell-session.sh:1, 9-30]. 33 lines.
C6. The log file and the gsettings values in the caller's backend [shell-session.sh:5, 24-25].
C7. Not stated in the file.
