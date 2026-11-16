# Jackicus/GNOME-EXTENSIONS `.gnome-ai-kit/template/scripts/nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME is its own dir (kept under `$XDG_STATE_HOME/gnome-extensions-nested/<slug>/config`, or a fresh one in the run dir under `--stand-in`). HOME, XDG_DATA_HOME, XDG_CACHE_HOME and XDG_STATE_HOME stay the caller's except under `--stand-in`, which points them at a scratch home in the run dir; XDG_RUNTIME_DIR and TMPDIR stay the caller's in both modes, and in own mode user-dirs.dirs, user-dirs.locale and fontconfig are copied in from the real config. [nested.sh:102-103, nested.sh:122-127, nested.sh:167-169, nested.sh:176-196, nested.sh:236-239]

A2. GSETTINGS_BACKEND=keyfile with the own XDG_CONFIG_HOME and DCONF_PROFILE pointing at an empty file are set on the environment of `dbus-run-session`. The real dconf is only read, with `gsettings get` for the look keys when seeding. [nested.sh:119-121, nested.sh:180, nested.sh:373, nested.sh:397, nested.sh:418-420, nested.sh:227-230]

A3. A private bus from `dbus-run-session`, whose address the inner `bash -c` writes to `$RUN_DIR/bus` and `nested_env` exports to every command. The systemd user manager is not handled, and the mirror viewer is handed the host bus address. [nested.sh:397-400, nested.sh:162-165, nested.sh:205-208, nested.sh:145, nested.sh:701]

A4. Not handled; the `--stand-in` user and mount namespace only overlays /usr/bin. [nested.sh:408-411]

A5. Headless mutter with virtual monitors on its own Wayland display `<slug>-dev`, DISPLAY unset or set to the nested Xwayland with its own cookie; the mirror is a GStreamer window on the host's Wayland display. [nested.sh:130, nested.sh:391-392, nested.sh:199-209, nested.sh:314, nested.sh:144, nested.sh:699-703]

A6. Not handled; the mirror screencast goes from the nested shell to the host through PipeWire. [nested.sh:37-40, nested.sh:680-682, nested_driver.py:371-375]

A7. Not handled in own mode: the caller's environment, SSH_AUTH_SOCK included, passes through with the real HOME. Under `--stand-in`, EXT_STAND_IN_UNSET names and variables whose value equals `$HOME` or contains `$HOME/` are removed; values pointing elsewhere, such as into the runtime dir, pass. [nested.sh:176-182, nested.sh:397, nested.sh:183-189]

A8. Not handled: nothing about portals, gvfs or FUSE in the given files. [nested.sh:176-209]

A9. The session gets its own process group via `setsid` and is stopped by group; stragglers are found by scanning `/proc/*/environ` for the nested bus address or `WAYLAND_DISPLAY=<slug>-dev`, and by `pgrep -f` with a pattern anchored to gnome-shell/dbus-run-session/unshare and the display name. `kill_strays` matches `pgrep -f` on repository paths plus ext.conf's NESTED_STRAYS and sends TERM to `-pid` first. [nested.sh:418-423, nested.sh:583-590, nested.sh:495-511, nested.sh:131-134, nested.sh:525-536]

A10. The driver injects pointer and keyboard events through Mutter's RemoteDesktop API on the nested bus. Screen locking is not handled. [nested_driver.py:129-159, nested_driver.py:224-286]

A11. Not handled: no GPU or renderer variables; mutter runs `--headless` with virtual monitors. [nested.sh:391-392]

A12. For the crash flag `$XDG_RUNTIME_DIR/gnome-shell-disable-extensions`, a start records ownership if it was absent and only an owning stop removes it. The nested enabled list lives in its keyfile, seeded with this UUID only. `dev.sh link --no-enable` writes into the real `~/.local/share/gnome-shell/extensions` in own mode when the extension is absent, and in both modes when the real install's extension.js is a symlink. Depends on dev.sh. [nested.sh:135-140, nested.sh:415, nested.sh:611, nested.sh:357-366, nested.sh:220-221]

A13. Not handled: no network namespace and no downloads; under `--stand-in`, the variables named in EXT_STAND_IN_UNSET are removed. [nested.sh:184, nested.sh:408]

## B. Lifecycle

B1. Checks ext.conf with EXT_UUID and EXT_NAME, refuses linked git worktrees, and checks for `gnome-shell` and `dbus-run-session`; checks `gst-launch-1.0` for the mirror and user namespaces for stand-in bins. No GNOME version detection; python3 and PyGObject are not checked. [nested.sh:82-88, nested.sh:91-100, nested.sh:350-351, nested.sh:692, nested.sh:402-403, nested_driver.py:38-41]

B2. Not handled beyond compiling schemas on reload and stand-in staging; `make pack` is a kit.mk front door to dev.sh. [nested.sh:255, nested.sh:662, kit.mk:15-16]

B3. The run dir is removed and recreated on each start; settings are kept under XDG_STATE_HOME and removed by `--clean`; `--stand-in` builds a scratch home in the run dir each start. A start while one runs reuses it. [nested.sh:368-373, nested.sh:385-389, nested.sh:380-384, nested.sh:341-348]

B4. `setsid env ... dbus-run-session -- bash -c` writes the bus address to a file and execs gnome-shell in the background. [nested.sh:397-400, nested.sh:421-423]

B5. Writes a keyfile with enabled-extensions set to this UUID, disable-user-extensions=false, welcome-dialog-last-shown-version='999' and the host's interface look keys read with `gsettings get`, and copies user-dirs and fontconfig; in own mode only when the kept keyfile is missing or empty. Under `--stand-in` it writes the keyfile on every start without look keys and copies. [nested.sh:212-241, nested.sh:388, nested.sh:384]

B6. Runs `dev.sh link --no-enable` in own mode when the extension is absent, and in both modes when the real install's extension.js is a symlink, output discarded (`>/dev/null 2>&1`). Depends on dev.sh. Stand-in additionally: copies src/ into the scratch home, replaces extension.js with dev-extension.js, runs `dev.sh dev-config` and the `nested_stand_in_stage` hook. [nested.sh:357-366, nested.sh:243-259]

B7. If the nested enabled-extensions contains the UUID it polls `gnome-extensions info` for ACTIVE, otherwise runs `gnome-extensions enable` in the nested env. [nested.sh:451-459, nested.sh:465-470, nested.sh:287-299]

B8. `gnome-shell --wayland --wayland-display <slug>-dev --headless` with N `--virtual-monitor WxH` (default 1600x900, N 1-9), default mode, no scale option. Under `--stand-in` with EXT_STAND_IN_BINS it runs inside `unshare --user --mount` with an overlay on /usr/bin. [nested.sh:325-339, nested.sh:391-392, nested.sh:401-412]

B9. Polls every 0.1 s for a non-empty bus file and a successful `Peer.Ping` on org.gnome.Shell, up to 20 s, then polls the extension state for ACTIVE up to 6 s. [nested.sh:425-443, nested.sh:291-299, nested.sh:453-456]

B10. `do` and single steps run a Python driver: OSD text, absolute clicks, moves, scrolls and keys via RemoteDesktop, screenshots via org.gnome.Shell.Screenshot after owning `org.gnome.SettingsDaemon.MediaKeys`, overview toggle. `run CMD` runs any command in the nested env, `preview` saves dist/preview.png, `mirror` shows a live window, and scripts/nested.d/*.sh adds commands and hooks. [nested.sh:643-652, nested_driver.py:43-46, nested_driver.py:209-341, nested.sh:732-739, nested.sh:673-678, nested.sh:684-730, nested.sh:814-822]

B11. `reload` re-stages (stand-in) or compiles schemas, then disables, waits for INACTIVE, enables and waits for ACTIVE. [nested.sh:654-671]

B12. Shell output goes to `$RUN_DIR/log`; `logs [N] [--all]` shows it through a regex filter for D-Bus noise; `status` reports pid, mirror, extension state, settings and log path. The shell's exit status is not recorded. [nested.sh:106, nested.sh:421, nested.sh:741-759, nested.sh:761-787]

B13. `stop` kills the watchdog, closes the mirror, sweeps session processes, sends TERM to the process group, waits 5 s, sends KILL; for Claude Code starts a watchdog runs it after NESTED_IDLE (600 s) idle or when the shell dies, and `session-end` runs it. There is no trap. [nested.sh:560-604, nested.sh:472-493, nested.sh:633-641]

B14. Removes the owned crash guard, the Xwayland cookie, `/tmp/.X*-lock` and `/tmp/.X11-unix/X*` whose lock holds the dead shell's pid, `$XDG_RUNTIME_DIR/<slug>/shell-<pid>`, the Wayland socket and lock, the stand-in bins and the run dir; kept settings stay. [nested.sh:606-631, nested.sh:122-124]

## C. Properties

C1. Generic within the gnome-ai-kit layout: names come from scripts/ext.conf and hooks from scripts/nested.d/*.sh, but it requires scripts/dev.sh, scripts/dev-extension.js and src/. [nested.sh:33-35, nested.sh:82-89, nested.sh:251-254, nested.sh:363, nested.sh:814-822]

C2. Subcommands start (`--headless`/`--no-mirror`, `--mirror`, `--clean`, `--stand-in`/`--demo`, `--monitors N`, `WxH`), reload, do, step, say, shot, click, move, scroll, key, overview, preview, mirror on|off, run, logs, status, stop, session-end, help; variables NESTED_IDLE and CLAUDE_CODE_SESSION_ID; make targets nested, nested-headless, nested-stop, nested-status, preview. [nested.sh:5-31, nested.sh:141, nested.sh:325-337, nested.sh:378, nested.sh:824-844, kit.mk:35-44]

C3. One per extension: run dir, Wayland display and settings carry the slug; a second start of the same one reuses it, and linked worktrees of the checkout are refused. [nested.sh:66-69, nested.sh:103, nested.sh:123, nested.sh:130, nested.sh:341-348, nested.sh:91-100]

C4. No version or distribution check; needs mutter's `--headless`, `--virtual-monitor`, `--wayland-display`, and PipeWire with GStreamer `pipewiresrc` for the mirror, which opens on WAYLAND_DISPLAY or `wayland-0`. Linux constructs `/proc/*/environ`, `ss -xlp`, `unshare --map-user` and GNU options `find -printf`, `stat -c`. [nested.sh:391-392, nested.sh:692, nested.sh:702, nested.sh:144, nested.sh:501, nested.sh:314-316, nested.sh:486, nested.sh:410]

C5. bash, python3 with PyGObject, gnome-shell, dbus-run-session, gdbus, gsettings, gnome-extensions, glib-compile-schemas, gst-launch-1.0, ss, pgrep, ps, setsid, unshare, git; no version checks. 844 + 483 + 58 lines. [nested.sh:71, nested.sh:350-351, nested.sh:692, nested_driver.py:38-41]

C6. The nested settings under XDG_STATE_HOME, the extension link in the real extensions dir, and screenshots in dist/. [nested.sh:122-124, nested.sh:357-366, nested.sh:284, nested.sh:675]

C7. Not stated in the given files.
