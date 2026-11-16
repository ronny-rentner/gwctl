# SuperCoolPencil/nowplaying-card `tools/nested/dev.py`

## A. Shared with the real session

A1. XDG_CONFIG/DATA/CACHE/STATE_HOME point to `.dev/<kind>` in the repo [dev.py:10-16]. HOME, XDG_RUNTIME_DIR and TMPDIR are inherited [dev.py:12].
A2. `GSETTINGS_BACKEND=keyfile` with the redirected XDG_CONFIG_HOME is set for install, bus and shell [dev.py:18, dev.py:58-61].
A3. A `dbus-run-session` per start with ENV [dev.py:60-61]. Systemd user manager: Not handled; XDG_RUNTIME_DIR is inherited [dev.py:12].
A4. Not handled.
A5. `--devkit --wayland --no-x11` without a display name [dev.py:38, dev.py:44]; the host's WAYLAND_DISPLAY and DISPLAY are inherited [dev.py:12].
A6. Not handled: XDG_RUNTIME_DIR is inherited [dev.py:12].
A7. Not handled: SSH_AUTH_SOCK, keyring variables and HOME are inherited [dev.py:12].
A8. Not handled.
A9. Each preview runs in its own session and process group; stop sends SIGTERM to that group, and SIGKILL only if dbus-run-session has not exited within 5 s [dev.py:61, dev.py:64-74].
A10. Not handled.
A11. Not handled.
A12. tools/install-local.sh installs the extension with ENV; enabled-extensions and disabled-extensions are replaced in the nested keyfile [dev.py:27-29, dev.py:58-59]. Crash flag: Not handled; XDG_RUNTIME_DIR is inherited [dev.py:12].
A13. Not handled; a gjs MPRIS stub provides a fake player on the private bus [dev.py:34-36].

## B. Lifecycle

B1. Uses /usr/libexec/mutter-devkit, else `.dev/helper/usr/libexec/mutter-devkit`, else exits with an install message [dev.py:19-23]. No version detection.
B2. Depends on tools/install-local.sh; a failure raises CalledProcessError, also during a restart [dev.py:58-59, dev.py:96].
B3. `.dev/{config,data,cache,state}` are created with `exist_ok` and reused; no reset [dev.py:10-16].
B4. A `dbus-run-session` per start [dev.py:60].
B5. Sets enabled and disabled extensions, disable-user-extensions, enable-animations, and the extension's panel-text and scroll-text [dev.py:26-33].
B6. Depends on tools/install-local.sh, run again on each start [dev.py:57-59]; the session reads schemas from `$XDG_DATA_HOME/gnome-shell/extensions/<uuid>/schemas` [dev.py:31].
B7. enabled-extensions [dev.py:27].
B8. `gnome-shell --devkit --wayland --no-x11`; no size or scale [dev.py:38, dev.py:44].
B9. Only with the fallback helper: waits up to 15 s for org.gnome.Mutter.Devkit before starting the helper [dev.py:37-41]; otherwise Not handled.
B10. gjs MPRIS stub with a fixed track and cover [dev.py:34-36]; the fallback devkit viewer [dev.py:41].
B11. Polls mtime and size of the listed sources every 0.5 s, waits 0.3 s after a change, then stops and restarts with reinstall [dev.py:49-54, dev.py:87-96].
B12. Output is inherited; the shell's exit status is not reported [dev.py:60-61, dev.py:87]; status messages are printed [dev.py:86, dev.py:94].
B13. The preview has its own session; the Python process turns Ctrl+C and SIGTERM into KeyboardInterrupt and stops the group [dev.py:61, dev.py:77-81, dev.py:97-101]; stop waits 5 s before SIGKILL [dev.py:70-74].
B14. Kills the process group [dev.py:64-74]; `.dev` stays.

## C. Properties

C1. Bound to nowplaying-card: uuid, watched files, schema keys, MPRIS stub [dev.py:11, dev.py:27-36, dev.py:50-53].
C2. No arguments; NP_SOURCE and NP_DEVKIT_HELPER pass values into the session script [dev.py:17, dev.py:23].
C3. Instances share `.dev` [dev.py:10-18]; no fixed display name [dev.py:38, dev.py:44].
C4. Names the package mutter-dev-bin (Debian/Ubuntu) [dev.py:22]; Wayland without X11 [dev.py:38, dev.py:44].
C5. Python 3, bash, gjs, gdbus, gsettings, dbus-run-session and gnome-shell; 101 lines [dev.py:1-101].
C6. `.dev/{config,data,cache,state}` [dev.py:10-16].
C7. Depends on the repository's license file; the script has no license header [dev.py:1-2].
