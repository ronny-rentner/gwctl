# Gawad-B/Gnome-Widgets `tools/devshell.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME and XDG_RUNTIME_DIR point under `$ROOT/.devshell`, exported before the bus and shell start, the runtime dir chmod 700; HOME and TMPDIR are inherited. [tools/devshell.sh:22-23, tools/devshell.sh:33-36, tools/devshell.sh:116-117, tools/devshell.sh:123-125]
A2. The isolated XDG_CONFIG_HOME and XDG_RUNTIME_DIR are exported before the private `dbus-daemon` starts, and the activation environment carries the isolated XDG dirs; DCONF_PROFILE is not reset; GSETTINGS_BACKEND is not set and is inherited from the caller. [tools/devshell.sh:33-36, tools/devshell.sh:123-128, tools/devshell.sh:166-177]
A3. A private `dbus-daemon --session --fork`, started from the script environment, with its address in `.devshell/bus`; without that file the bus address is `disabled:`; `dbus-update-activation-environment` adds explicit pairs to its activation environment, never with `--systemd` or `--all`; the systemd user manager is not addressed. [tools/devshell.sh:44-50, tools/devshell.sh:123-124, tools/devshell.sh:158-177]
A4. Not handled; DBUS_SYSTEM_BUS_ADDRESS is not set. [tools/devshell.sh:33-51]
A5. WAYLAND_DISPLAY, DISPLAY and GDK_BACKEND are unset, both modes pass `--no-x11`, and the default mode is `--headless --virtual-monitor`; `--devkit` hands the host's Wayland socket path to gnome-shell. Activated services and `app` children get the nested socket found in `.devshell/run`. [tools/devshell.sh:37-43, tools/devshell.sh:130-139, tools/devshell.sh:168-171, tools/devshell.sh:213-215]
A6. The headless mode uses the isolated runtime dir; the script starts no PipeWire or PulseAudio. `--devkit` points PIPEWIRE_RUNTIME_DIR at the real runtime dir. [tools/devshell.sh:36, tools/devshell.sh:131-135]
A7. Not handled; SSH_AUTH_SOCK, GNOME_KEYRING_CONTROL and the rest of the environment are inherited by the shell and by `dbus-daemon`; `dbus-update-activation-environment` only adds explicit pairs. [tools/devshell.sh:33-50, tools/devshell.sh:123-124, tools/devshell.sh:162-176]
A8. FUSE mounts under `.devshell/run` are unmounted deepest first, up to 20 tries, before deletion, refusing to delete if one stays; `rm` uses `--one-file-system`. GIO_USE_VFS and GIO_USE_VOLUME_MONITOR are not set. [tools/devshell.sh:65-83, tools/devshell.sh:105-106, tools/devshell.sh:114-115]
A9. Shell and bus PIDs are stored in files and killed only when their `/proc` environ carries the isolated XDG_RUNTIME_DIR; no pkill patterns; the shell and `app` children run under `setsid`, in their own sessions; bus-activated services and processes started by `app` are not tracked or killed. [tools/devshell.sh:57-63, tools/devshell.sh:85-103, tools/devshell.sh:135-140, tools/devshell.sh:215]
A10. Not handled; the default mode is headless. [tools/devshell.sh:137]
A11. Not handled; no renderer settings; the default mode uses a headless virtual monitor. [tools/devshell.sh:134-138]
A12. Extensions are copied into the isolated data dir and enabled in the isolated dconf. [tools/devshell.sh:118-121, tools/devshell.sh:126-128]
A13. Not handled; no downloads or tokens; the network is shared with the host; `add-event` goes through tools/add-test-event.js. [tools/devshell.sh:1-231, tools/devshell.sh:228]

## B. Lifecycle

B1. Only checks that `dist/metadata.json` exists and exits with a message; no tool or version checks. [tools/devshell.sh:112]
B2. Not handled; requires a prior `make build`. [tools/devshell.sh:112]
B3. `.devshell` is reused; `start` stops the previous instance and resets `data/` and `run/`, while `config/`, `cache/` and `state/` persist; no full-reset command. If a mount under `run/` will not unmount, `unmount_run` returns 1. [tools/devshell.sh:111-117, tools/devshell.sh:71-83]
B4. `dbus-daemon --session --fork`, writing address and PID through fds 3 and 4; the written contents are not checked. [tools/devshell.sh:124-125]
B5. `disable-user-extensions false`, `welcome-dialog-last-shown-version '999'`, `enabled-extensions` with helper and extension. [tools/devshell.sh:126-128]
B6. `cp -r` of `dist/` and `tools/testhelper` into the isolated extensions dir, fresh on every start (the helper depends on tools/testhelper). [tools/devshell.sh:115, tools/devshell.sh:118-124]
B7. `enabled-extensions`; then polls the extension state up to 20 × 0.5 s until it is not 6, 8 or null, and `start` exits 0 only for state 1 (ACTIVE), otherwise non-zero with the shell left running. [tools/devshell.sh:128, tools/devshell.sh:180-198]
B8. `gnome-shell --wayland --no-x11 --headless --virtual-monitor 1920x1080`, or `--devkit`; started with `setsid`, output to `.devshell/shell.log`; no scale, and no devkit window size. [tools/devshell.sh:130-140]
B9. Polls `shell_eval '1'` up to 60 × 0.5 s without checking whether the shell process died; on timeout it runs `stop` and exits 1 naming the log (depends on tools/shell-eval.js). [tools/devshell.sh:53, tools/devshell.sh:142-155]
B10. Subcommands `status`, `eval`, `shot`, `gsettings`, `app`, `add-event`, all against the isolated bus through the address in `.devshell/bus` (depends on tools/shell-eval.js and tools/add-test-event.js); `shot` calls the Screenshot D-Bus method after hiding the overview and `sleep 1`; no prefs command; each first exits 1 with a message when `.devshell/bus` is missing, and checks only that file, not that the shell is alive. [tools/devshell.sh:10-17, tools/devshell.sh:29-31, tools/devshell.sh:201-228]
B11. No reload; `start` restarts the shell with a fresh copy of `dist/`. [tools/devshell.sh:10, tools/devshell.sh:109-121]
B12. Shell output in `.devshell/shell.log`, overwritten each start, app output appended to `apps.log`, `log` prints the shell log; dbus-daemon output is not redirected; `start`'s exit status says whether the extension is ACTIVE, and `status` prints `{state, error}` JSON. [tools/devshell.sh:55, tools/devshell.sh:124, tools/devshell.sh:135-138, tools/devshell.sh:198, tools/devshell.sh:215, tools/devshell.sh:223, tools/devshell.sh:229]
B13. `stop` subcommand sends SIGTERM to shell and bus and waits, without SIGKILL; a failed readiness check runs it; no trap. [tools/devshell.sh:85-107, tools/devshell.sh:150-155]
B14. `stop` kills its own PIDs, waits up to 10 s each, removes the pid and bus files, unmounts FUSE under `run/` and deletes `run/` with `--one-file-system`, exiting before the `rm` if a mount stays after ~5 s; bus-activated services and `app` processes are not killed; data, config, cache, state and the logs stay. [tools/devshell.sh:71-83, tools/devshell.sh:85-107, tools/devshell.sh:215]

## C. Properties

C1. Bound to this project: UUID, test helper extension, `add-event`, `dist/` and `tools/shell-eval.js`. [tools/devshell.sh:24-25, tools/devshell.sh:53, tools/devshell.sh:112, tools/devshell.sh:120-121, tools/devshell.sh:228]
C2. Subcommands `start [--devkit]`, `status`, `eval`, `shot`, `gsettings`, `app`, `add-event`, `log`, `stop`; any `start` argument other than `--devkit` means headless, without a message; reads XDG_RUNTIME_DIR and WAYLAND_DISPLAY of the caller. [tools/devshell.sh:10-19, tools/devshell.sh:26-27, tools/devshell.sh:110, tools/devshell.sh:130, tools/devshell.sh:218-231]
C3. No; one fixed `.devshell` dir per checkout, and `start` stops the previous instance. [tools/devshell.sh:22-23, tools/devshell.sh:111]
C4. No version or distro detection; uses `--headless`, `--virtual-monitor`, `--no-x11` and `--devkit`. Devkit mode builds the host socket path from WAYLAND_DISPLAY, default `wayland-0`. [tools/devshell.sh:27, tools/devshell.sh:134-137]
C5. bash, `dbus-daemon`, `dbus-update-activation-environment`, `gsettings`, `gjs`, `gnome-shell`, `gdbus`, `findmnt`, `fusermount3`/`fusermount`, `awk`, `setsid`, GNU `realpath -m` and `rm --one-file-system`, none version-checked; 231 lines plus tools/shell-eval.js, tools/add-test-event.js and tools/testhelper. [tools/devshell.sh:1-231]
C6. `.devshell/config` (dconf), `cache/`, `state/`, `shell.log` and the appended `apps.log`; `data/` and `run/` are recreated on each start. [tools/devshell.sh:113-117, tools/devshell.sh:135-138, tools/devshell.sh:215]
C7. Not stated; the file has no license header. [tools/devshell.sh:1-231]
