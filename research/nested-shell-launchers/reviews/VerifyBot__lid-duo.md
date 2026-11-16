# VerifyBot/lid-duo `test/launch-nested.sh`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to a `mktemp -d` dir; data, cache, state, runtime dir, HOME and TMPDIR are inherited. Log and bus file default to fixed names in `${TMPDIR:-/tmp}`. [launch-nested.sh:7-9, launch-nested.sh:11]
A2. XDG_CONFIG_HOME is set before `dbus-run-session`; GSETTINGS_BACKEND and DCONF_PROFILE are inherited. [launch-nested.sh:11]
A3. Private bus via `dbus-run-session`; its address is written to a file for `test/duoctl`. The systemd user manager is not addressed. [launch-nested.sh:2-4, launch-nested.sh:11-12]
A4. Not handled; the host system bus is inherited. [launch-nested.sh:11]
A5. `--devkit --wayland` without `--wayland-display` or `--no-x11`. [launch-nested.sh:11, launch-nested.sh:15]
A6. Not handled; runtime dir and audio variables are inherited. [launch-nested.sh:11]
A7. Not handled; the whole environment is inherited. [launch-nested.sh:11]
A8. Not handled.
A9. The session runs in the background and only its PID is printed; the script neither tracks nor stops it. [launch-nested.sh:16-17]
A10. Not handled.
A11. Not handled; COGL_DEBUG is passed through when set. [launch-nested.sh:15]
A12. The script installs nothing. The real dconf is not written; the crash flag is not addressed. [launch-nested.sh:11, launch-nested.sh:14]
A13. None.

## B. Lifecycle

B1. Not handled; only `set -u`. [launch-nested.sh:5]
B2. Not handled.
B3. A new `mktemp -d` config dir each run, never removed; log and bus file are deleted at start. [launch-nested.sh:8, launch-nested.sh:10]
B4. `dbus-run-session` in the background. [launch-nested.sh:11-16]
B5. Sets disable-user-extensions false and enabled-extensions. [launch-nested.sh:13-14]
B6. Not handled; depends on `lid-duo@local` already being installed in the inherited XDG data dirs. [launch-nested.sh:6, launch-nested.sh:14]
B7. Through enabled-extensions before the shell starts. [launch-nested.sh:14]
B8. `exec env [COGL_DEBUG=...] gnome-shell --devkit --wayland`; size and scale are not set. [launch-nested.sh:15]
B9. Not handled; the script returns at once and the bus address is written before the shell starts. [launch-nested.sh:12, launch-nested.sh:15-19]
B10. External control through the bus file, used by `test/duoctl`; depends on that tool. [launch-nested.sh:2-4, launch-nested.sh:12, launch-nested.sh:19]
B11. Not handled.
B12. Output goes to the log file; PID, log path and bus file path are printed as `key=value`; the script does not wait, so the shell's exit status is not read. [launch-nested.sh:16-19]
B13. Not handled; the PID of `dbus-run-session` is printed as `nested_pid`. [launch-nested.sh:16-17]
B14. Not handled; the config dir, log and bus file remain. [launch-nested.sh:7-9]

## C. Properties

C1. Bound to lid-duo through UUID and file names. [launch-nested.sh:6-7, launch-nested.sh:9]
C2. $1 = log path; environment variables TMPDIR and COGL_DEBUG; output is `key=value` lines. [launch-nested.sh:7, launch-nested.sh:9, launch-nested.sh:15, launch-nested.sh:17-19]
C3. The default log name and the bus file name are fixed. [launch-nested.sh:7, launch-nested.sh:9]
C4. No version check; uses `gnome-shell --devkit --wayland`. [launch-nested.sh:15]
C5. Bash, mktemp, dbus-run-session, gsettings, gnome-shell; 19 lines. [launch-nested.sh:1, launch-nested.sh:8, launch-nested.sh:11-15]
C6. Each run's config dir, the log file and the bus file. [launch-nested.sh:7-9]
C7. Depends on the repository's license file; the script has no license header. [launch-nested.sh:1-4]
