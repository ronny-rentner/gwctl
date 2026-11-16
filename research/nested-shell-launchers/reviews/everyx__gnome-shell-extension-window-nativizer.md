# everyx/gnome-shell-extension-window-nativizer `tools/devkit.sh`

## A. Shared with the real session

A1. Not handled: HOME, XDG dirs, runtime dir and TMPDIR are inherited; log and pidfile sit at fixed /tmp paths; deployment depends on tools/deploy-ext.sh. [devkit.sh:24-29, devkit.sh:32, devkit.sh:62]

A2. Not handled. [devkit.sh:32, devkit.sh:62]

A3. `dbus-run-session` private bus; the systemd user manager is not handled. [devkit.sh:32, devkit.sh:62]

A4. Not handled. [devkit.sh:32, devkit.sh:62]

A5. `--devkit --wayland` with the host's display variables inherited. [devkit.sh:32, devkit.sh:62]

A6. Not handled. [devkit.sh:32, devkit.sh:62]

A7. Not handled: the environment is inherited. [devkit.sh:32, devkit.sh:62]

A8. Not handled. [devkit.sh:32, devkit.sh:62]

A9. Background mode runs under `setsid`; readiness uses `pgrep -f "gnome-shell --devkit"`; if the session does not come up, it kills its own process group with `kill -- "-$session_pid"`. [devkit.sh:32-48]

A10. Not handled.

A11. Not handled.

A12. Depends on deploy-ext.sh; the crash flag is not handled. [devkit.sh:25, devkit.sh:29]

A13. Not handled.

## B. Lifecycle

B1. Not handled: no checks.

B2. Depends on `deploy_ext` from tools/deploy-ext.sh. [devkit.sh:24-25, devkit.sh:29]

B3. Not handled; access is serialized by tools/with-session-lock.sh (depends on it). [devkit.sh:17-23]

B4. `dbus-run-session gnome-shell ...`. [devkit.sh:32, devkit.sh:62]

B5. Not handled.

B6. Depends on deploy-ext.sh. [devkit.sh:29]

B7. Not handled in this file; depends on deploy-ext.sh. [devkit.sh:29]

B8. `--devkit --wayland --unsafe-mode`. [devkit.sh:32, devkit.sh:62]

B9. `bg`: polls 30 × 0.5 s for a `gnome-shell --devkit` process or the pid's death, then prints the log's last "display name" line; foreground: none. [devkit.sh:37-53]

B10. `--unsafe-mode` on the nested bus. [devkit.sh:32, devkit.sh:62]

B11. Not handled.

B12. `bg`: log to /tmp; foreground: `tee` to the log and a two-stage grep filter. [devkit.sh:26, devkit.sh:62-66]

B13. `bg`: no stop command here, the pid goes to a /tmp pidfile; no trap or timeout. [devkit.sh:34, devkit.sh:58]

B14. If a `bg` start does not come up, it kills the session's process group, removes the pidfile and exits 1; otherwise no cleanup. [devkit.sh:42-50]

## C. Properties

C1. Bound to window-nativizer: /tmp names, lock and deploy helpers. [devkit.sh:22, devkit.sh:25-27]

C2. Optional `bg` argument; WN_SESSION_LOCK_HELD marks a held lock. [devkit.sh:7-9, devkit.sh:21, devkit.sh:31]

C3. Serialized by the session lock (depends on with-session-lock.sh); fixed /tmp names. [devkit.sh:17-23, devkit.sh:26-27]

C4. `--devkit`, GNOME 50+ per header; no check. [devkit.sh:2]

C5. bash, setsid, pgrep, seq, tee, grep, dbus-run-session, gnome-shell; 66 lines. [devkit.sh:1, devkit.sh:32, devkit.sh:37-38, devkit.sh:62-65]

C6. /tmp log and pidfile; deployed extension (depends on deploy-ext.sh). [devkit.sh:26-27, devkit.sh:29]

C7. Not stated in the given file.
