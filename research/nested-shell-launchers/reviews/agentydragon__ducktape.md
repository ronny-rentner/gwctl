# agentydragon/ducktape `gnome/devkit.sh`

## A. Shared with the real session

A1. Creates a `mktemp -d` tree and sets XDG_CONFIG_HOME to `$tmpdir/config`, and symlinks every entry of the real config dir matched by the `*` glob except `dconf` into it; XDG_DATA_DIRS gets `$tmpdir/data` prepended. HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR stay real. [devkit.sh:112, devkit.sh:124-134, devkit.sh:148-149, devkit.sh:158]
A2. DCONF_PROFILE points to a profile with a writable `devkit` db and a read-only `user` db, which is a copy of the real `dconf/user` when that exists; DCONF_PROFILE and XDG_CONFIG_HOME are exported before `dbus-run-session`. [devkit.sh:136-145, devkit.sh:149-150, devkit.sh:173]
A3. `dbus-run-session` gives the shell its own session bus; with `--host-daemon`, the host DBUS_SESSION_BUS_ADDRESS is exported into the nested session under a caller-chosen variable name. The systemd user manager is not handled. [devkit.sh:55-65, devkit.sh:173]
A4. Not handled. [devkit.sh:147-173]
A5. Uses the host Wayland display, setting WAYLAND_DISPLAY=wayland-0 when unset and the socket exists, and GDK_BACKEND=wayland when GDK_BACKEND is unset; the nested socket name is `gnome-devkit-<pid>[-n]`. DISPLAY is inherited and Xwayland is not disabled. [devkit.sh:158-165, devkit.sh:200-208]
A6. Not handled; the real XDG_RUNTIME_DIR and audio variables are inherited. [devkit.sh:158, devkit.sh:200]
A7. Not handled; SSH_AUTH_SOCK and keyring variables are inherited, and real config entries are symlinked in. [devkit.sh:129-134, devkit.sh:147-173]
A8. Not handled; nothing is started explicitly, and XDG_RUNTIME_DIR stays the real one. [devkit.sh:158, devkit.sh:200]
A9. The inner script records the daemon and shell PIDs and its trap kills exactly those; no kill patterns, no process groups. [devkit.sh:175-187, devkit.sh:197, devkit.sh:209]
A10. Not handled. [devkit.sh:171-229]
A11. Sets GSK_RENDERER=gl, LIBGL_ALWAYS_SOFTWARE=1, MESA_LOADER_DRIVER_OVERRIDE=llvmpipe and __NV_DISABLE_EXPLICIT_SYNC=1 by default, each overridable from the env. [devkit.sh:166-169]
A12. The extension is unpacked into `$tmpdir/data` and enabled in the devkit dconf db; an existing copy in the real `~/.local/share` aborts the run. Crash flag not handled; XDG_CACHE_HOME, XDG_STATE_HOME and XDG_RUNTIME_DIR are the real ones. [devkit.sh:88-95, devkit.sh:115-119, devkit.sh:158, devkit.sh:188-189]
A13. No downloads; `--host-daemon` exports the host bus address into the nested session, `--live` starts the checkout daemon inside the private session. [devkit.sh:58-65, devkit.sh:191-197]

## B. Lifecycle

B1. Checks gnome-shell on PATH, the zip and the daemon binary; no version detection, and unzip, glib-compile-schemas, gsettings and dbus-run-session are not checked. [devkit.sh:5-9, devkit.sh:98-109]
B2. Depends on the Bazel rule that provides the runfiles: the zip and daemon are resolved with `rlocation`, which the file does not define. [devkit.sh:98-109]
B3. Creates a fresh `mktemp -d` dir per run and removes it on EXIT; no reuse. [devkit.sh:112-113]
B4. `dbus-run-session -- bash -c` wraps the inner script; it is the script's last command. [devkit.sh:173, devkit.sh:229]
B5. Inside the private bus: `disable-user-extensions false` and `enabled-extensions ['<uuid>']` via gsettings. [devkit.sh:188-189]
B6. Unzips the zip into `$tmpdir/data/gnome-shell/extensions/<uuid>` and compiles schemas when a `schemas` dir exists. [devkit.sh:115-122]
B7. Through `enabled-extensions` before the shell starts. [devkit.sh:189]
B8. `gnome-shell --devkit --unsafe-mode --wayland --wayland-display=<name>` in the background; size and scale not handled. [devkit.sh:208-209]
B9. Polls up to 300 × 0.1 s for the nested Wayland socket and checks each round whether the shell still lives. [devkit.sh:211-227]
B10. `--unsafe-mode` is set, on the private bus whose address is not printed; the nested display name is printed; no prefs, eval or screenshot helpers. In `live` mode the daemon runs inside the private session. [devkit.sh:191-197, devkit.sh:208, devkit.sh:227]
B11. Not handled; each run extracts the zip anew. [devkit.sh:112-119]
B12. Shell output goes to the terminal; the shell's exit status is the inner script's last status and so the script's. [devkit.sh:173, devkit.sh:228-229]
B13. The inner trap on EXIT, INT and TERM kills shell and daemon by PID; the outer EXIT trap removes the temp dir. The only timeout is the 30 s startup wait. [devkit.sh:113, devkit.sh:177-187, devkit.sh:211-225]
B14. Kills shell and daemon, waits only for the daemon, then `rm -rf "$tmpdir"`. [devkit.sh:113, devkit.sh:179-185]

## C. Properties

C1. Bound to the ducktape Bazel setup: seven positional arguments from a build rule, runfiles, a desktop daemon and fixtures; the UUID is a parameter. [devkit.sh:15-22, devkit.sh:66-87, devkit.sh:98-109]
C2. Seven positional arguments (uuid, zip runfile, daemon runfile, fixture env name, default fixture runfile, daemon arg, host bus env name), then `--live`, `--host-daemon`, `--fixture FILE`; env: the variable named by the fourth argument, BUILD_WORKING_DIRECTORY, TMPDIR, and the overridable GDK_BACKEND and renderer variables. [devkit.sh:15-54, devkit.sh:77, devkit.sh:112, devkit.sh:163, devkit.sh:166-169]
C3. Yes: per-run temp dir, own bus, and a nested socket name made unique by PID and a suffix loop. [devkit.sh:112, devkit.sh:173, devkit.sh:200-206]
C4. Uses `gnome-shell --devkit` with a host Wayland display; the messages and comments name Nix, home-manager and the host Wyrm2. No version detection. [devkit.sh:6-7, devkit.sh:11-12, devkit.sh:152-157, devkit.sh:208]
C5. Bash; Bazel `rlocation`, unzip, glib-compile-schemas, gsettings, dbus-run-session, gnome-shell, mktemp, seq; 229 lines. [devkit.sh:1, devkit.sh:98, devkit.sh:112, devkit.sh:119-121, devkit.sh:173-211]
C6. Nothing in the temp tree; config entries are symlinks into the real config dir, and the data, cache and state dirs are not redirected. [devkit.sh:113, devkit.sh:129-134, devkit.sh:148-150]
C7. Depends on the repository's license file; the given file has no license notice. [devkit.sh:1-229]
