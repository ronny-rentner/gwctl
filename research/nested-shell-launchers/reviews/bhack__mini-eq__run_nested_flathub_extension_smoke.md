# bhack/mini-eq `tools/run_nested_flathub_extension_smoke.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_CACHE_HOME point into a `mktemp -d` dir in `${XDG_RUNTIME_DIR:-/tmp}` and are exported before dbus-run-session. HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited; the Flatpak app gets the three XDG variables unset. [run_nested_flathub_extension_smoke.sh:59-63, run_nested_flathub_extension_smoke.sh:109-111, run_nested_flathub_extension_smoke.sh:161]
A2. GSETTINGS_BACKEND=keyfile is exported before dbus-run-session. The variable is not unset for the Flatpak app. [run_nested_flathub_extension_smoke.sh:105-112, run_nested_flathub_extension_smoke.sh:161-163]
A3. The shell and the Flatpak app run under dbus-run-session. The systemd user manager is not touched, and XDG_RUNTIME_DIR is inherited. [run_nested_flathub_extension_smoke.sh:124, run_nested_flathub_extension_smoke.sh:161-163, run_nested_flathub_extension_smoke.sh:109-115]
A4. Not handled; the system bus is not redirected for the shell or the app. [run_nested_flathub_extension_smoke.sh:140, run_nested_flathub_extension_smoke.sh:161-163]
A5. The shell keeps the inherited host display variables; the app gets the nested WAYLAND_DISPLAY found in the shell log, while DISPLAY stays the host's. [run_nested_flathub_extension_smoke.sh:140, run_nested_flathub_extension_smoke.sh:145-146, run_nested_flathub_extension_smoke.sh:161-163]
A6. Not handled; XDG_RUNTIME_DIR is inherited by the shell and the app. [run_nested_flathub_extension_smoke.sh:161-163]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited. [run_nested_flathub_extension_smoke.sh:109-115, run_nested_flathub_extension_smoke.sh:161]
A8. Creates `doc/by-app/<app_id>` in the real runtime dir. [run_nested_flathub_extension_smoke.sh:102]
A9. `flatpak kill` by app ID at start with `--replace-running` and in the inner cleanup, and `kill` of the shell's own PID. [run_nested_flathub_extension_smoke.sh:93-99, run_nested_flathub_extension_smoke.sh:131-136]
A10. Not handled.
A11. Not handled; no renderer or GPU settings.
A12. Crash flag not handled. The nested data dir and enabled list hold only this extension. [run_nested_flathub_extension_smoke.sh:103-107]
A13. No downloads; checks that the app ref is in the user Flatpak installation. [run_nested_flathub_extension_smoke.sh:86-91]

## B. Lifecycle

B1. Checks the extension source dir, `--devkit` support via `gnome-shell --help`, a mutter-devkit binary, the installed Flatpak ref and an already running app, each failure exiting 1 with a message; with `--replace-running`, a running app is killed instead. [run_nested_flathub_extension_smoke.sh:70-99]
B2. No build; the source tree is copied as is. [run_nested_flathub_extension_smoke.sh:103]
B3. A fresh `mktemp -d` dev home per run, removed by an EXIT trap. [run_nested_flathub_extension_smoke.sh:60, run_nested_flathub_extension_smoke.sh:65-68]
B4. `dbus-run-session` around an inner bash script. [run_nested_flathub_extension_smoke.sh:124]
B5. `enabled-extensions` set to this UUID in the keyfile backend before the bus starts; failure ends the script via `set -e`. [run_nested_flathub_extension_smoke.sh:105-107]
B6. `cp -a` of the source tree into the dev data dir; failure ends the script via `set -e`. [run_nested_flathub_extension_smoke.sh:103, run_nested_flathub_extension_smoke.sh:2]
B7. Through the keyfile `enabled-extensions`. [run_nested_flathub_extension_smoke.sh:105-107]
B8. `gnome-shell --devkit` in the background with no size or scale options. [run_nested_flathub_extension_smoke.sh:140]
B9. Polls the log for "Using Wayland display name" and the socket up to 160 times at 0.1 s, else prints the last 120 log lines and exits 1; then a fixed `sleep 2`. [run_nested_flathub_extension_smoke.sh:143-159]
B10. Launches the installed Flatpak app into the nested display and private bus; no eval or screenshots. [run_nested_flathub_extension_smoke.sh:160-165]
B11. Not handled.
B12. Shell and app output are appended to a log file; status lines go to the log and stderr. The exit status comes from `wait` on the shell. [run_nested_flathub_extension_smoke.sh:140, run_nested_flathub_extension_smoke.sh:158-165, run_nested_flathub_extension_smoke.sh:167]
B13. The inner trap on EXIT, INT and TERM kills the app by ID and the shell by PID; the outer EXIT trap removes the dev home. The only timeout is the 16 s display wait. [run_nested_flathub_extension_smoke.sh:65-68, run_nested_flathub_extension_smoke.sh:131-138]
B14. Removes the dev home and stops the app and shell; the log file and the `doc/by-app` dir stay. [run_nested_flathub_extension_smoke.sh:66, run_nested_flathub_extension_smoke.sh:131-136, run_nested_flathub_extension_smoke.sh:8, run_nested_flathub_extension_smoke.sh:102]

## C. Properties

C1. Bound to mini-eq: UUID, source path and default app ref. [run_nested_flathub_extension_smoke.sh:5-7]
C2. Options `--replace-running`, `--app-ref APP_REF`, `--log LOG_FILE`, `-h`; TMPDIR and XDG_RUNTIME_DIR are read. [run_nested_flathub_extension_smoke.sh:11-56, run_nested_flathub_extension_smoke.sh:8, run_nested_flathub_extension_smoke.sh:59]
C3. The dev home is unique per run; the default log path is fixed and deleted at start, and the app is killed by ID. [run_nested_flathub_extension_smoke.sh:60, run_nested_flathub_extension_smoke.sh:8, run_nested_flathub_extension_smoke.sh:101, run_nested_flathub_extension_smoke.sh:132]
C4. Requires `--devkit`, no fallback; mutter-devkit in /usr/libexec, /usr/lib or PATH with a Debian/Ubuntu hint; a user Flatpak installation. [run_nested_flathub_extension_smoke.sh:75-78, run_nested_flathub_extension_smoke.sh:80-91]
C5. bash, mktemp, grep, gnome-shell, mutter-devkit, flatpak, dbus-run-session, gsettings, sed, tail, seq, tee. 168 lines. [run_nested_flathub_extension_smoke.sh:60, run_nested_flathub_extension_smoke.sh:75-165]
C6. The log file and the `doc/by-app/<app_id>` dir. [run_nested_flathub_extension_smoke.sh:8, run_nested_flathub_extension_smoke.sh:102]
C7. Not stated in the script.
