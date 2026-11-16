# timcharper/dictation `test/scripts/child-gnome-session.sh`

## A. Shared with the real session

A1. Inside bwrap the script sets HOME and XDG_CONFIG/DATA/STATE/CACHE_HOME to the fixed dir `/tmp/gnome-sandbox-dictation` and XDG_DATA_DIRS to system paths; XDG_RUNTIME_DIR and TMPDIR stay real. bwrap binds `/`, `/run` and `/tmp` read-write. [test/scripts/child-gnome-session.sh:5, test/scripts/child-gnome-session.sh:60-65, test/scripts/child-gnome-session.sh:51-54]
A2. Not handled for the bus: `dbus-run-session` starts outside bwrap and before the exports. Besides the shell inside bwrap, only `gnome-extensions enable` gets the sandbox variables. [test/scripts/child-gnome-session.sh:50, test/scripts/child-gnome-session.sh:58-64, test/scripts/child-gnome-session.sh:121]
A3. The session runs under `dbus-run-session`; the bus address is written to `/tmp/nested_dbus_address` and exported for the launcher's own later calls. The systemd user manager is not touched. [test/scripts/child-gnome-session.sh:50, test/scripts/child-gnome-session.sh:77, test/scripts/child-gnome-session.sh:105]
A4. Not handled: `/run` is bound from the host and no `--unshare-*` option is given. [test/scripts/child-gnome-session.sh:50-57]
A5. Not separated: the shell runs `--devkit --wayland` with the host's WAYLAND_DISPLAY (default `wayland-0`), DISPLAY and XAUTHORITY passed in, and `/run` and `/tmp` bound from the host. [test/scripts/child-gnome-session.sh:53-54, test/scripts/child-gnome-session.sh:71-74, test/scripts/child-gnome-session.sh:80]
A6. Not handled: XDG_RUNTIME_DIR is not changed and `/run` is bound. [test/scripts/child-gnome-session.sh:53, test/scripts/child-gnome-session.sh:59-74]
A7. Not handled: no `env -i`; SSH_AUTH_SOCK and keyring variables are not touched; HOME is moved to the sandbox; `/` is bound read-write. [test/scripts/child-gnome-session.sh:50-51, test/scripts/child-gnome-session.sh:60]
A8. Not handled: the real runtime dir under `/run` is bound in. [test/scripts/child-gnome-session.sh:53]
A9. The session starts under `setsid`; its leader PID goes to `/tmp/nested_gnome.pid`; `stop` sends TERM, then KILL after 2 s, to that process group. It checks only that the PID is numeric. [test/scripts/child-gnome-session.sh:47-50, test/scripts/child-gnome-session.sh:83-84, test/scripts/child-gnome-session.sh:137-145]
A10. Not handled.
A11. `/dev/dri` is hidden with a tmpfs, and `LIBGL_ALWAYS_SOFTWARE=1` is set with the Mesa EGL vendor file. [test/scripts/child-gnome-session.sh:57, test/scripts/child-gnome-session.sh:67-69]
A12. The extension is unpacked only into the sandbox data dir; XDG_DATA_DIRS keeps `/usr/share` and `/usr/local/share`; the crash flag is not handled. [test/scripts/child-gnome-session.sh:31, test/scripts/child-gnome-session.sh:38, test/scripts/child-gnome-session.sh:65]
A13. Not handled: bwrap has no `--unshare-net`; no downloads or tokens in the file. [test/scripts/child-gnome-session.sh:50-57]

## B. Lifecycle

B1. Only checks that `./gnome-extension` exists in the current directory, exit 1 otherwise; no tool or version checks. [test/scripts/child-gnome-session.sh:9-15]
B2. `glib-compile-schemas`, `npm run build` and `gnome-extensions pack --force`; none is checked and there is no `set -e`. [test/scripts/child-gnome-session.sh:34-37]
B3. Every `start` deletes and recreates the fixed `/tmp/gnome-sandbox-dictation` with config, data, state and cache; `stop` leaves it. [test/scripts/child-gnome-session.sh:28-31]
B4. `nohup setsid dbus-run-session -- bwrap … sh -c` in the background; the inner script writes the bus address to a file, the launcher polls it for 10 s and on failure sends TERM to the leader PID only, not the group, and exits 1, leaving the PID file. [test/scripts/child-gnome-session.sh:50-58, test/scripts/child-gnome-session.sh:77, test/scripts/child-gnome-session.sh:86-103]
B5. Not handled: no gsettings; only environment variables. [test/scripts/child-gnome-session.sh:60-69]
B6. Unzips the packed zip from the current directory into the sandbox extensions dir, compiles its schemas there and deletes the zip; unchecked. [test/scripts/child-gnome-session.sh:37-42]
B7. `gnome-extensions enable` with the sandbox HOME and XDG variables; on failure it falls back to a `gdbus call` of `EnableExtension`, whose result is not checked; "Started successfully!" follows either way. [test/scripts/child-gnome-session.sh:120-127, test/scripts/child-gnome-session.sh:129-130]
B8. `exec gnome-shell --devkit --wayland`; no size or scale. [test/scripts/child-gnome-session.sh:80]
B9. `gdbus wait --session org.gnome.Shell --timeout 30`, then `sleep 1`; on timeout it prints the log tail, calls `stop` and exits 1. [test/scripts/child-gnome-session.sh:107-117]
B10. No helpers; the nested bus address is printed and kept in `/tmp/nested_dbus_address`, and `status` prints it. [test/scripts/child-gnome-session.sh:77, test/scripts/child-gnome-session.sh:131, test/scripts/child-gnome-session.sh:155-162]
B11. `restart` runs `stop`, `sleep 2`, `start`, which rebuilds and recreates the sandbox. [test/scripts/child-gnome-session.sh:178-182]
B12. All session output goes to `/tmp/nested_gnome.log`, whose `tail -f` command is printed; the last 20 lines are shown on startup timeout. No exit status is collected. [test/scripts/child-gnome-session.sh:8, test/scripts/child-gnome-session.sh:81, test/scripts/child-gnome-session.sh:110, test/scripts/child-gnome-session.sh:132]
B13. The session stops only through `stop`. No trap. [test/scripts/child-gnome-session.sh:136-153]
B14. `stop` kills the process group and deletes the PID and bus files; the sandbox and the log stay until the next `start`. [test/scripts/child-gnome-session.sh:142-147, test/scripts/child-gnome-session.sh:29]

## C. Properties

C1. Bound to this project: hardcoded UUID, `$(pwd)/gnome-extension` and an npm build. [test/scripts/child-gnome-session.sh:4, test/scripts/child-gnome-session.sh:9, test/scripts/child-gnome-session.sh:36]
C2. Subcommands `start`, `stop`, `restart`, `status`; no options or launcher-specific environment variables, only WAYLAND_DISPLAY, DISPLAY and XAUTHORITY are read; input is the current directory, checked before any subcommand. [test/scripts/child-gnome-session.sh:9-15, test/scripts/child-gnome-session.sh:72-74, test/scripts/child-gnome-session.sh:171-190]
C3. No: sandbox, bus file, PID file and log have fixed `/tmp` names, and `start` refuses while the PID is alive. [test/scripts/child-gnome-session.sh:5-8, test/scripts/child-gnome-session.sh:19-24]
C4. Not stated; uses `gnome-shell --devkit --wayland` on a host Wayland or X display and the glvnd path `/usr/share/glvnd/egl_vendor.d/50_mesa.json`. [test/scripts/child-gnome-session.sh:69, test/scripts/child-gnome-session.sh:72-74, test/scripts/child-gnome-session.sh:80]
C5. Bash, 190 lines; uses bwrap, dbus-run-session, nohup, setsid, gnome-shell, gnome-extensions, glib-compile-schemas, npm, unzip and gdbus, without version checks. [test/scripts/child-gnome-session.sh:34-38, test/scripts/child-gnome-session.sh:50, test/scripts/child-gnome-session.sh:108]
C6. The sandbox and the log persist until the next `start`; PID and bus files until `stop`; compiled schemas in the source dir. [test/scripts/child-gnome-session.sh:29, test/scripts/child-gnome-session.sh:81, test/scripts/child-gnome-session.sh:147, test/scripts/child-gnome-session.sh:34]
C7. Not stated in the file.
