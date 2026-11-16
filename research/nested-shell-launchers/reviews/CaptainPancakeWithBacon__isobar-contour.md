# CaptainPancakeWithBacon/isobar-contour `tools/nested.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME and XDG_CONFIG_HOME point into a `mktemp -d` dir; cache, state, runtime dir, HOME and TMPDIR are inherited; schemas are compiled into the extension dir. [nested.sh:9-10, nested.sh:13, nested.sh:16]
A2. XDG_CONFIG_HOME is exported before `dbus-run-session`; the inner script checks that its bus differs from the outer one. GSETTINGS_BACKEND and DCONF_PROFILE are inherited. [nested.sh:16, nested.sh:18-21]
A3. Private bus via `dbus-run-session`; the outer bus address is exported into it as ISOBAR_OUTER_BUS for the guard. The systemd user manager is not addressed. [nested.sh:16, nested.sh:19-21]
A4. Not handled; the host system bus is inherited. [nested.sh:20]
A5. `--nested --wayland`; ISOBAR_HEADLESS selects `--headless --virtual-monitor 1280x800`. No `--no-x11` or `--wayland-display`. [nested.sh:20, nested.sh:26-31]
A6. Not handled; runtime dir and audio variables are inherited. [nested.sh:20]
A7. Not handled; the whole environment is inherited. [nested.sh:20]
A8. Not handled.
A9. The inner script kills its shell PID in an EXIT trap; no kill patterns. [nested.sh:32-33]
A10. Not handled; screen lock is not addressed.
A11. Not handled.
A12. Extension and driver are symlinked into the temp data dir; the crash flag is not addressed. [nested.sh:14-15]
A13. None.

## B. Lifecycle

B1. Not handled.
B2. `glib-compile-schemas` in the extension dir. [nested.sh:9]
B3. A new temp dir per run, removed by an EXIT trap. [nested.sh:10-11]
B4. `dbus-run-session`; the inner script checks that the bus is not the outer one. [nested.sh:20-21]
B5. Sets toolkit-accessibility true and disable-user-extensions false. [nested.sh:22-23]
B6. Symlinks the extension and the driver extension into the temp data dir. [nested.sh:14-15]
B7. enabled-extensions with the driver added for `--drive`. [nested.sh:24-25]
B8. `--nested --wayland`, or headless 1280x800 with ISOBAR_HEADLESS; scale not set. [nested.sh:27-31]
B9. `--check`: fixed `sleep 10`; `--drive`: polls each second for `$ISOBAR_DRIVER_OUT/done` up to 480 s; default mode: none. [nested.sh:34-38, nested.sh:45-46]
B10. `--check` runs `tools/check.py`; `--drive` relies on the driver extension, then runs pixel checks. Depends on those tools and on ISOBAR_DRIVER_OUT, which the file never sets. [nested.sh:36-44]
B11. Not handled.
B12. Shell output goes to the terminal; `--drive` prints `driver.log` and checks for a timeout or a FAIL line; the exit status comes from `check.py`, the driver checks, or `wait`. [nested.sh:36-46]
B13. The inner EXIT trap kills the shell, the outer EXIT trap removes the temp dir; `--drive` has a 480 s limit, `--check` and the default mode none. [nested.sh:11, nested.sh:33-46]
B14. The temp dir is removed; compiled schemas remain in the extension dir. [nested.sh:9, nested.sh:11]

## C. Properties

C1. Bound to Isobar; ISOBAR_EXT_DIR runs another copy of the same extension. [nested.sh:7-8, nested.sh:14-15, nested.sh:24]
C2. First argument `--check`, `--drive` or none; environment variables ISOBAR_EXT_DIR, ISOBAR_HEADLESS, ISOBAR_DRIVER_OUT, ISOBAR_BENCH, ISOBAR_ONLY. [nested.sh:8, nested.sh:24, nested.sh:27, nested.sh:34-38, nested.sh:44]
C3. Temp dir and bus are per run and no display name is fixed; instances share the compiled schemas in the extension dir and, if equal, ISOBAR_DRIVER_OUT. [nested.sh:9-10, nested.sh:38]
C4. No version check; uses the `--nested` and `--headless` flags. [nested.sh:28, nested.sh:30]
C5. Bash, glib-compile-schemas, dbus-run-session, gsettings, gnome-shell, python3, gjs, seq; 48 lines. [nested.sh:1, nested.sh:9, nested.sh:20, nested.sh:36, nested.sh:38, nested.sh:44]
C6. Compiled schemas in the extension dir and driver output in ISOBAR_DRIVER_OUT. [nested.sh:9, nested.sh:38-39]
C7. Depends on the repository's license file; the script has no license header. [nested.sh:1-3]
