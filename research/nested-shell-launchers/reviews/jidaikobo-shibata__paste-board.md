# jidaikobo-shibata/paste-board `scripts/start-dev-shell.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME and XDG_CACHE_HOME point into a new `mktemp -d /tmp/paste-board-dev.XXXXXX` dir; Chrome gets a temp `--user-data-dir`, Chromium `--temp-profile`. HOME, XDG_DATA_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR stay the host's. [start-dev-shell.sh:5, start-dev-shell.sh:17-25, start-dev-shell.sh:40, start-dev-shell.sh:88-93]
A2. `GSETTINGS_BACKEND=keyfile` and the redirected XDG_CONFIG_HOME are in the environment dbus-run-session starts with. Before that, the outer phase reads three paste-board keys from the real settings backend and copies them in. [start-dev-shell.sh:10-15, start-dev-shell.sh:17-25, start-dev-shell.sh:42-49]
A3. dbus-run-session gives the inner phase, the shell and the browser a private session bus; the systemd user manager is not addressed. [start-dev-shell.sh:25]
A4. Not handled.
A5. The nested compositor gets the socket name `paste-board-dev-$$`; host WAYLAND_DISPLAY and DISPLAY stay in the environment, only the browser is pointed at the nested socket; no `--no-x11`. [start-dev-shell.sh:51-53, start-dev-shell.sh:70-71, start-dev-shell.sh:95-97]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [start-dev-shell.sh:40]
A7. Not handled; `env` adds variables to the full host environment. [start-dev-shell.sh:17-25]
A8. Not handled.
A9. Records the PIDs of the shell and the browser and kills only those. [start-dev-shell.sh:54-65, start-dev-shell.sh:72, start-dev-shell.sh:98]
A10. Not handled.
A11. Not handled; no renderer options for the shell or the browser. [start-dev-shell.sh:70-71, start-dev-shell.sh:95-97]
A12. The nested keyfile enables only `paste-board@jidaikobo.shibata` with disable-user-extensions false. [start-dev-shell.sh:45-47]
A13. Not handled; the browser opens `about:blank` on the host network. [start-dev-shell.sh:95-97]

## B. Lifecycle

B1. Picks google-chrome if on PATH, else requires chromium with a bare `command -v chromium`; requires XDG_RUNTIME_DIR with a message. No check for gnome-shell, mutter-devkit or the GNOME version. [start-dev-shell.sh:32-40]
B2. Not handled; no build, packaging or schema compilation, gsettings uses the repo's `schemas/` as found. [start-dev-shell.sh:7, start-dev-shell.sh:10-15, start-dev-shell.sh:18]
B3. Creates a new temp dir per run; never reuses or removes it. [start-dev-shell.sh:5]
B4. Runs `dbus-run-session -- bash <self> --session`; its exit status becomes the script's. [start-dev-shell.sh:25-27]
B5. Writes the three copied shortcut keys, disable-user-extensions, enabled-extensions and favorite-apps (TextEditor, emacs, browser) into the keyfile. [start-dev-shell.sh:42-49]
B6. Not handled; nothing is copied or linked.
B7. Sets enabled-extensions to paste-board only and disable-user-extensions false before the shell starts; no check that the extension loaded. [start-dev-shell.sh:45-47]
B8. Starts `gnome-shell --devkit --wayland --wayland-display=paste-board-dev-$$` in the background; no size or scale options. [start-dev-shell.sh:53, start-dev-shell.sh:70-72]
B9. Polls for the nested Wayland socket every 0.1 s up to 200 times; exits 1 with a message if the shell dies first or after 20 s. [start-dev-shell.sh:73-86]
B10. Starts google-chrome with a temp profile or chromium with `--temp-profile` on the nested display in the background; a browser failure is not checked; no prefs, eval, screenshot or external control. [start-dev-shell.sh:88-98]
B11. Not handled.
B12. All output of the bus session goes through `tee` to the terminal and to `/tmp/paste-board-dev-shell.log`; the inner phase ends with gnome-shell's status from `wait`. [start-dev-shell.sh:25-27, start-dev-shell.sh:99]
B13. The inner phase traps EXIT, INT (exit 130) and TERM (exit 143); no timeout; the outer phase sets no trap. [start-dev-shell.sh:4-28, start-dev-shell.sh:66-68]
B14. Kills the browser PID and kills and waits for the shell PID; the temp root, the Chrome profile dir and the log file stay. [start-dev-shell.sh:5, start-dev-shell.sh:26, start-dev-shell.sh:56-65, start-dev-shell.sh:89]

## C. Properties

C1. Bound to paste-board: schema, UUID, variable names and favorite apps. [start-dev-shell.sh:8, start-dev-shell.sh:19-21, start-dev-shell.sh:47-49]
C2. No user arguments; `--session` is the internal re-exec marker and `PASTE_BOARD_SAVED_*` carry values from the outer to the inner phase. [start-dev-shell.sh:4, start-dev-shell.sh:19-21, start-dev-shell.sh:25]
C3. Temp dirs and the socket name (`$$`) are unique per run, but all runs write the same `/tmp/paste-board-dev-shell.log`. [start-dev-shell.sh:5, start-dev-shell.sh:26, start-dev-shell.sh:53, start-dev-shell.sh:89]
C4. Uses `gnome-shell --devkit --wayland` without version detection; the Chromium fallback uses the Snap desktop file name `chromium_chromium.desktop`. [start-dev-shell.sh:37, start-dev-shell.sh:70-71]
C5. Bash; gnome-shell, mutter-devkit (per comment), dbus-run-session, gsettings, mktemp, GNU `readlink -f`, tee, google-chrome or chromium; 99 lines. [start-dev-shell.sh:1, start-dev-shell.sh:5-6, start-dev-shell.sh:26, start-dev-shell.sh:32-39, start-dev-shell.sh:51]
C6. Each run leaves its temp root (keyfile, cache) and the Chrome profile in `/tmp`, which no later run reuses; the log file stays. [start-dev-shell.sh:5, start-dev-shell.sh:26, start-dev-shell.sh:89]
C7. Not stated in the given file.
