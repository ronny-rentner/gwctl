# AstraExt/astra-monitor `test.sh`

## A. Shared with the real session

A1. Not handled: HOME, XDG dirs, runtime dir and TMPDIR are inherited; the extension is installed into the real user extensions dir, and dist/ is built in the script's directory. [test.sh:13-14, test.sh:56-60, test.sh:98, test.sh:153]

A2. Not handled: no GSettings backend change. [test.sh:133-141, test.sh:153]

A3. `dbus-run-session` gives the shell a private bus, after an extra `dbus-daemon --session --fork` with exported address; the systemd user manager is not handled. [test.sh:149-150, test.sh:153]

A4. Not handled. [test.sh:153]

A5. GNOME < 49: Xephyr on fixed `:2` with `-ac` (access control off), started before the export, then `DISPLAY=:2` and `WAYLAND_DISPLAY=wayland-1` exported; GNOME ≥ 49: `--devkit` with the host's DISPLAY and WAYLAND_DISPLAY inherited. [test.sh:10, test.sh:116-124, test.sh:143-146, test.sh:26]

A6. Not handled: PipeWire and PulseAudio variables are inherited. [test.sh:153]

A7. Not handled: the environment, SSH_AUTH_SOCK included, is inherited. [test.sh:153]

A8. Not handled. [test.sh:153]

A9. Runs `pkill -f "$GNOME_SHELL_CMD"` and `wait $(pgrep -f ...)`. [test.sh:158, test.sh:160, test.sh:171]

A10. Not handled. [test.sh:119, test.sh:153]

A11. Not handled: only MUTTER_DEBUG_DUMMY_MODE_SPECS is set; the scale variable is commented out. [test.sh:136-137]

A12. Installs with `--force` into the real extensions dir and, while DBUS_SESSION_BUS_ADDRESS is still the host's, enables the extension when `info` reports DISABLED; the crash flag is not handled. [test.sh:98, test.sh:127-131, test.sh:149]

A13. Not handled: no downloads, no network separation. [test.sh:153]

## B. Lifecycle

B1. Takes the first number of `gnome-shell --version` with `grep -oP`; ≥ 49 requires `mutter-devkit`, otherwise `--nested` with Xephyr; checks `tsc` and, only when schemas are uncompiled, `glib-compile-schemas`. Xephyr, screen, gnome-extensions, dbus-daemon and dbus-run-session are not checked. [test.sh:16-32, test.sh:34-43, test.sh:119, test.sh:149, test.sh:153]

B2. Runs `glib-compile-schemas` on `./schemas` (relative to the cwd) when gschemas.compiled is missing, then `tsc`, copies build/* and a file list into dist/, checking that each listed file exists, then `gnome-extensions pack --force`; only tsc and pack exit codes are checked. `--extra-source` names ./src, ./ROADMAP.md and ./COMPARISON.md, which the file list does not copy into dist/. [test.sh:34-95, test.sh:63, test.sh:80-89]

B3. Not handled: dist/ is deleted and recreated each run. [test.sh:56-57]

B4. Starts `dbus-daemon --session --fork`, then `dbus-run-session` in the background; neither result is checked. [test.sh:149, test.sh:153]

B5. Not handled: only environment variables (SHELL_DEBUG, MUTTER_DEBUG_DUMMY_MODE_SPECS, XDG_SESSION_*, XDG_CURRENT_DESKTOP, ASTRA_MONITOR_NESTED_SESSION). [test.sh:134-141, test.sh:151]

B6. `gnome-extensions install --force` of the packed zip into the real user dir, exit code checked. [test.sh:97-104]

B7. Runs `gnome-extensions enable` on the host bus if `info` reports DISABLED; other states and the enable result are not checked. [test.sh:126-131]

B8. `gnome-shell --wayland --mode=minimal` plus `--nested` inside Xephyr `-screen 1867x1050`, or `--devkit`; MUTTER_DEBUG_DUMMY_MODE_SPECS=1867x1050; no scale. [test.sh:11, test.sh:26, test.sh:29, test.sh:119, test.sh:136-137]

B9. Not handled: fixed `sleep 1` after Xephyr and after the shell start. [test.sh:120, test.sh:154]

B10. Not handled.

B11. Not handled: each run rebuilds, reinstalls and restarts. [test.sh:45-104]

B12. Output goes to the terminal with SHELL_DEBUG=all; the script exits 0 after the wait regardless of the shell's status. [test.sh:134, test.sh:153, test.sh:171-174]

B13. The EXIT/INT/TERM trap, set after the 1 s start sleep, runs `pkill -f` and waits; the INT/TERM handler does not exit; no timeout. [test.sh:153-154, test.sh:156-169]

B14. Removes dist/ by its path as given, after `cd ..` from the extension dir, then `rm` targets the zip in the script's directory; the Xephyr screen session and the extra dbus-daemon are not stopped; the install and enable in the real session remain. [test.sh:77-80, test.sh:107-113, test.sh:119, test.sh:149-150, test.sh:164-166]

## C. Properties

C1. Bound to astra-monitor: UUID, file list, pack sources and ASTRA_MONITOR_NESTED_SESSION are fixed. [test.sh:9, test.sh:63, test.sh:80-89, test.sh:151]

C2. No arguments, options or variables read; resolution and display are edited in the file. [test.sh:9-11]

C3. No: fixed Xephyr `:2` reused if running, fixed `WAYLAND_DISPLAY=wayland-1`, shared dist/, and `pkill -f` on the shell command string. [test.sh:10, test.sh:117, test.sh:145, test.sh:56, test.sh:158]

C4. GNOME < 49 via `--nested` in Xephyr, ≥ 49 via `--devkit` with mutter-devkit; install hints for apt, dnf and nix-shell. [test.sh:16-31]

C5. bash, GNU grep `-P`, gnome-shell, gnome-extensions, tsc, glib-compile-schemas, dbus-daemon, dbus-run-session, screen, Xephyr, mutter-devkit (≥ 49), pgrep and pkill; 174 lines. [test.sh:18, test.sh:21, test.sh:36, test.sh:43, test.sh:119, test.sh:149, test.sh:153, test.sh:158]

C6. The installed and enabled extension in the real session, the Xephyr screen session, the forked dbus-daemon, compiled schemas and build/ in the repo. [test.sh:98, test.sh:130, test.sh:119, test.sh:149, test.sh:39, test.sh:47]

C7. Not stated in the given file.
