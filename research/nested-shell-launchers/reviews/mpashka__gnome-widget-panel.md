# mpashka/gnome-widget-panel `gwp`

## A. Shared with the real session

A1. XDG_DATA_HOME points to .dev/data [gwp:46-48, 259]. XDG_CONFIG_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR, HOME and TMPDIR are the host's, and the shell log goes to /tmp/gnome-widget-panel-dev.log [gwp:55, 255-286, 380].
A2. A private dconf profile `user-db:gwpdev` via DCONF_PROFILE [gwp:260, 334]. `dbus-update-activation-environment --all` hands DCONF_PROFILE, XDG_DATA_HOME and GSETTINGS_SCHEMA_DIR to services the private bus starts [gwp:263-269].
A3. `dbus-run-session` gives a private session bus [gwp:380]; its activation environment receives the whole inherited environment, without `--systemd` [gwp:269]; the host XDG_RUNTIME_DIR is inherited [gwp:380]. The bus address is written to .dev/session-env for the dev-settings commands [gwp:271-277, 459-468].
A4. Not handled; the host system bus is inherited [gwp:380].
A5. Not handled: WAYLAND_DISPLAY, DISPLAY and XDG_RUNTIME_DIR are inherited [gwp:380]. Neither mode passes `--wayland-display` or `--no-x11` [gwp:324, 327].
A6. Not handled; the host XDG_RUNTIME_DIR is inherited [gwp:357, 380].
A7. Not handled; SSH_AUTH_SOCK and the host runtime dir are inherited, and `dbus-update-activation-environment --all` also passes them to services on the private bus [gwp:269, 380].
A8. Not handled; no GIO_USE_VFS, and the host runtime dir is inherited [gwp:357, 380].
A9. Ctrl+C is caught as KeyboardInterrupt and the dbus-run-session child gets SIGTERM if still running [gwp:404-409]; the inner script `wait`s on its own shell PID [gwp:287, 299]. No kill patterns; the child gets no new process group [gwp:380].
A10. Not handled.
A11. Not handled.
A12. The crash flag path is the host's $XDG_RUNTIME_DIR/gnome-shell-disable-extensions; the launcher deletes it before start, in the inner script and on stop [gwp:278, 357-359, 377, 410]. The extension is symlinked into .dev/data and enabled in the gwpdev profile [gwp:85-96, 282]; `install` writes the real ~/.local/share/gnome-shell/extensions [gwp:35, 211-221].
A13. `ensure_dependencies` runs `npm install` when tsc is missing, for install and dev-install [gwp:80-82, 214, 240]. `--collector-port` sets the AI collector port in the dev profile [gwp:346-355].

## B. Lifecycle

B1. `dev` checks that /usr/libexec/mutter-devkit is executable unless --headless [gwp:317-322]; `build` checks for extension-src and tsc [gwp:104-108]; `compile_schemas` checks for glib-compile-schemas [gwp:74-77]. No GNOME version detection.
B2. `build` recreates extension/ from extension-src/, runs tsc, strips trailing spaces, runs tools/format-generated.mjs, compiles schemas and writes build-stamp.json [gwp:102-138].
B3. .dev is created once and reused; dconf-profile, status and inner.sh are rewritten each run and the extension symlink is recreated [gwp:85-96, 333-335, 360-375]. No reset command; the gwpdev database keeps its values.
B4. `dbus-run-session -- .dev/inner.sh` [gwp:380].
B5. The inner script sets disable-user-extensions, enabled-extensions and optionally color-scheme and ai-collector-port [gwp:281-284, 337-355].
B6. Symlink .dev/data/gnome-shell/extensions/<uuid> to extension/ [gwp:85-96, 331].
B7. enabled-extensions set to the UUID only [gwp:282]; after start the state is read with GetExtensionInfo and reported as enabled, unknown or not enabled [gwp:294-297, 383-390].
B8. `gnome-shell --devkit` in a window, or `--headless --virtual-monitor WxH` with default 1600x900 [gwp:56, 323-328, 583-588]; no scale option.
B9. The inner script polls `gdbus introspect` on org.gnome.Shell up to 60 × 0.5 s, then sleeps a fixed 2 s before querying the state [gwp:288-297]. Python polls the status file up to 80 × 0.5 s [gwp:415-424].
B10. `dev-settings` snapshot, monitor, poke and prefs; monitor, poke and prefs reach the dev bus through .dev/session-env [gwp:459-468, 477-509]. No eval or screenshots.
B11. Not handled within a run; rerunning `./gwp dev` rebuilds and restarts [gwp:330-331, 412].
B12. Shell output is appended to the log (default /tmp/gnome-widget-panel-dev.log) and lines matching LOG_FILTER are printed [gwp:55, 59-61, 286, 427-436]. The shell's exit status is never read; `dev` returns 0 [gwp:403-412, 621-625].
B13. Ctrl+C: KeyboardInterrupt, then SIGTERM to dbus-run-session if it still runs [gwp:404-409]. No timeout; there is no SIGTERM handler [gwp:382-412].
B14. `finally` sends SIGTERM to dbus-run-session if it still runs and waits for it, then removes the crash flag and .dev/session-env [gwp:407-411]; no mounts are handled; .dev, inner.sh, status, the gwpdev database and the log remain.

## C. Properties

C1. Bound to the project: UUID, schema, TypeScript build, AI collector option [gwp:27-31, 102-138, 346-355].
C2. Subcommands build, install, dev-install, dev [--theme light|dark] [--headless] [--monitor WxH] [--log PATH] [--collector-port N], dev-settings snapshot|monitor|poke|prefs; no command prints status and the command list [gwp:554-613]; reads XDG_RUNTIME_DIR for the crash flag path [gwp:357].
C3. No: fixed .dev paths, the dconf database name gwpdev, the default log and the host crash flag are shared [gwp:46-55, 334, 359].
C4. No version detection; the docstring names mutter 50 and the package mutter-dev-bin, the hint uses apt [gwp:306-310, 317-322].
C5. Python 3.8+ (`unlink(missing_ok=True)`), a generated bash script, npm, node, tsc, git, glib-compile-schemas, dbus-run-session, dbus-update-activation-environment, gsettings, gdbus, gnome-shell, gnome-extensions [gwp:1, 80-82, 115, 127, 177, 256-299, 377, 509]. 632 lines.
C6. .dev (symlink, profile, status, inner.sh), the gwpdev database including --theme, the log in /tmp and extension/ [gwp:46-55, 334, 576].
C7. Not stated in the launcher.
