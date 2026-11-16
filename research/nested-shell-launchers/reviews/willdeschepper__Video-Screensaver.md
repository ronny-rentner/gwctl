# willdeschepper/Video-Screensaver `dev.sh`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to `${XDG_CACHE_HOME:-$HOME/.cache}/video-screensaver-dev`; HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR stay the real ones, and install.sh copies the extension into the real `~/.local/share/gnome-shell/extensions`. [dev.sh:16, dev.sh:23-24, dev.sh:36-37, dev.sh:44]
A2. The redirected XDG_CONFIG_HOME is inherited by the private bus; the real dconf is read once (`dconf dump` of the extension path) and loaded into the nested one; XDG_RUNTIME_DIR stays shared. [dev.sh:27, dev.sh:33-37, dev.sh:69-70]
A3. A private session bus from `dbus-run-session`; the systemd user manager and its activation environment are not handled. [dev.sh:67-69]
A4. Not handled; DBUS_SYSTEM_BUS_ADDRESS is untouched. [dev.sh:69-73]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited by `gnome-shell --devkit --wayland`. [dev.sh:73]
A6. Not handled; XDG_RUNTIME_DIR is not redirected. [dev.sh:44, dev.sh:73]
A7. Not handled; SSH_AUTH_SOCK and keyring variables are inherited. [dev.sh:69-73]
A8. Not handled.
A9. On exit it kills only mpv processes whose `/proc/<pid>/environ` contains `VIDEO_SCREENSAVER_DEV_SESSION=$$`; the shell itself is never signalled by the script. [dev.sh:48-51, dev.sh:57-63, dev.sh:65]
A10. Not handled.
A11. Not handled.
A12. The crash flag `gnome-shell-disable-extensions` lies in the shared XDG_RUNTIME_DIR; the EXIT trap deletes it unless it existed at start; the extension lands in the real extensions dir, enabled-extensions is set only in the nested dconf. [dev.sh:23-24, dev.sh:39-46, dev.sh:54-56, dev.sh:71]
A13. Not handled; no downloads or tokens in the file.

## B. Lifecycle

B1. Checks that `gnome-shell --help` lists `--devkit`, else exits 1 with a message; no other tool is checked. [dev.sh:18-21]
B2. Depends on install.sh, which per the comment copies the source files into `~/.local/share/gnome-shell/extensions`. [dev.sh:23-24]
B3. `mkdir -p` of the fixed DEV_CONFIG dir, reused across runs; no reset. [dev.sh:16, dev.sh:36]
B4. `dbus-run-session` starts the private session bus; no system bus is started. [dev.sh:69-74]
B5. Dumps the real extension settings before XDG_CONFIG_HOME is redirected, loads them into the nested dconf and sets enabled-extensions and welcome-dialog-last-shown-version. [dev.sh:27, dev.sh:37, dev.sh:69-72]
B6. Depends on install.sh; it installs into the real data dir. [dev.sh:23-24]
B7. `gsettings set org.gnome.shell enabled-extensions` to only this UUID before the shell starts; disable-user-extensions is not set. [dev.sh:71]
B8. `gnome-shell --devkit --wayland --mode=ubuntu`; no scale. [dev.sh:73]
B9. Not handled.
B10. Not handled.
B11. Not handled; a rerun reruns install.sh. [dev.sh:24]
B12. Shell and extension output go to the terminal. [dev.sh:29-31]
B13. EXIT trap; no timeout. [dev.sh:53-65]
B14. The EXIT trap removes the crash flag (if new) and kills tagged mpv processes; DEV_CONFIG and the installed extension stay. [dev.sh:53-65]

## C. Properties

C1. Bound to this project: UUID, settings path, `mpv`, the tag variable and mode `ubuntu` are hardcoded. [dev.sh:13, dev.sh:15, dev.sh:51, dev.sh:58, dev.sh:73]
C2. No arguments, options or own environment variables; usage `./dev.sh`. [dev.sh:4]
C3. Not handled; instances share the fixed DEV_CONFIG and the crash flag, only the mpv cleanup is per PID. [dev.sh:16, dev.sh:44, dev.sh:51, dev.sh:60]
C4. GNOME Shell 49+ with `--devkit` (checked), session mode `ubuntu`, package `mutter-dev-bin` named; distribution and host display server not checked. [dev.sh:7, dev.sh:18-21, dev.sh:73]
C5. bash, gnome-shell, dconf, gsettings, dbus-run-session, pgrep, grep, tr, id, dirname, rm and install.sh; 74 lines. [dev.sh:1, dev.sh:14, dev.sh:18, dev.sh:24, dev.sh:27, dev.sh:44, dev.sh:55, dev.sh:58-59, dev.sh:69-73]
C6. DEV_CONFIG, and the extension in the real data dir. [dev.sh:16, dev.sh:23-24, dev.sh:36]
C7. Not stated in the given file.
