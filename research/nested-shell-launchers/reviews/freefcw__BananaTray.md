# freefcw/BananaTray `scripts/dev-gnome-extension.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_DATA_HOME, XDG_CACHE_HOME and XDG_STATE_HOME point into PROFILE_DIR, a `mktemp -d` under `${TMPDIR:-/tmp}` or the `--profile-dir` path; HOME, XDG_RUNTIME_DIR and TMPDIR are inherited, and `--app-daemon` gives the app the real XDG dirs back. [dev-gnome-extension.sh:95-101, dev-gnome-extension.sh:145-152, dev-gnome-extension.sh:229-248, dev-gnome-extension.sh:257-260, dev-gnome-extension.sh:321-326, dev-gnome-extension.sh:332-335]
A2. Uses dconf with DCONF_PROFILE pointing at a `user-db:user` profile file and XDG_CONFIG_HOME redirected, both set before dbus-run-session starts. In `--app-daemon` mode the app runs with the real XDG_CONFIG_HOME but keeps the temp DCONF_PROFILE. [dev-gnome-extension.sh:106, dev-gnome-extension.sh:229-233, dev-gnome-extension.sh:261, dev-gnome-extension.sh:332-336, dev-gnome-extension.sh:346]
A3. dbus-run-session provides a private session bus for gsettings, the daemons and the shell; the systemd user manager is not addressed. [dev-gnome-extension.sh:49, dev-gnome-extension.sh:346]
A4. Not handled.
A5. Runs the shell with `--devkit --wayland --no-x11`; host WAYLAND_DISPLAY and DISPLAY are inherited, also by the mock daemon and the app; the nested socket name is left to gnome-shell. [dev-gnome-extension.sh:19, dev-gnome-extension.sh:204-251, dev-gnome-extension.sh:303]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [dev-gnome-extension.sh:332-346]
A7. Not handled; the host environment passes through.
A8. Only the mock daemon runs with `GIO_USE_VFS=local`; otherwise not handled. [dev-gnome-extension.sh:205]
A9. Kills only the recorded mock and app PIDs; gnome-shell runs in the foreground of the child script. [dev-gnome-extension.sh:109-117, dev-gnome-extension.sh:206, dev-gnome-extension.sh:252, dev-gnome-extension.sh:303]
A10. Not handled.
A11. Not handled; extra gnome-shell arguments can be passed after `--`. [dev-gnome-extension.sh:167-170]
A12. Enables only the BananaTray UUID with disable-user-extensions false in the temp dconf db. [dev-gnome-extension.sh:266-267]
A13. The default mock daemon stands in for the real app; `--app-daemon` runs `cargo run` with the real XDG dirs. [dev-gnome-extension.sh:18, dev-gnome-extension.sh:204-254]

## B. Lifecycle

B1. `require_command` checks dbus-run-session, gnome-shell, gsettings, gdbus and gjs or cargo per mode; `require_mutter_devkit` checks `/usr/libexec/mutter-devkit` or PATH and prints an apt install hint; each failure exits 1 with a message. No GNOME version detection; the help text names 49+. [dev-gnome-extension.sh:53, dev-gnome-extension.sh:59-85, dev-gnome-extension.sh:309-319]
B2. No extension build or schema compilation; `--app-daemon` builds the app through `cargo run` or the given command. [dev-gnome-extension.sh:216-222]
B3. Creates a temp profile per run and deletes it on exit; `--profile-dir` reuses the given dir and keeps it. [dev-gnome-extension.sh:119-121, dev-gnome-extension.sh:145-152, dev-gnome-extension.sh:321-326]
B4. Re-runs itself as `bash "$0"` under dbus-run-session, passing state through `BANANATRAY_GNOME_*` variables. [dev-gnome-extension.sh:332-346, dev-gnome-extension.sh:349-356]
B5. Writes the dconf profile file, sets disable-user-extensions false and enabled-extensions, and exits 1 with a message if `gsettings get` does not show the UUID. [dev-gnome-extension.sh:106, dev-gnome-extension.sh:266-272]
B6. `rm -rf` of the target, then `cp -a` of `gnome-shell-extension/` into the profile's extension dir. [dev-gnome-extension.sh:14, dev-gnome-extension.sh:87-93, dev-gnome-extension.sh:263-264]
B7. Sets enabled-extensions to the UUID and verifies the key; no check that the shell loaded the extension. [dev-gnome-extension.sh:267-272]
B8. Runs `gnome-shell --devkit --wayland --no-x11` in the foreground; `--monitor WxH[@R]` adds `--virtual-monitor`, further arguments pass after `--`; no scale option. [dev-gnome-extension.sh:19, dev-gnome-extension.sh:154-170, dev-gnome-extension.sh:303]
B9. Not handled for the shell; daemons are polled with `gdbus introspect` every 0.1 s (50 tries mock, 1800 app) and fail with a message on timeout or process exit. [dev-gnome-extension.sh:181-202, dev-gnome-extension.sh:207, dev-gnome-extension.sh:253]
B10. Starts a mock D-Bus daemon (default), the real app (`--app-daemon`, `--app-command`), or nothing (`--real-daemon`); the nested bus address is not printed; no eval, screenshot or external control. [dev-gnome-extension.sh:32-36, dev-gnome-extension.sh:127-144, dev-gnome-extension.sh:274-295]
B11. Not handled; each start re-copies the extension. [dev-gnome-extension.sh:87-93]
B12. Prints profile dir, extension dir, daemon mode and shell command; output goes to the terminal only. [dev-gnome-extension.sh:289-295, dev-gnome-extension.sh:303]
B13. Parent and child trap EXIT, INT and TERM with `cleanup`, which neither resets the traps nor exits; no timeout. [dev-gnome-extension.sh:109-122, dev-gnome-extension.sh:330, dev-gnome-extension.sh:355]
B14. Kills and waits for the mock and app PIDs and removes PROFILE_DIR unless it came from `--profile-dir`. [dev-gnome-extension.sh:109-122]

## C. Properties

C1. Bound to BananaTray: UUID, extension source dir, mock daemon, D-Bus name, cargo app and `BANANATRAY_*` variables. [dev-gnome-extension.sh:13-15, dev-gnome-extension.sh:189-190, dev-gnome-extension.sh:226-227]
C2. Options `--real-daemon`, `--app-daemon`, `--app-command CMD`, `--profile-dir DIR`, `--monitor WxH[@R]`, `-h/--help`, `-- GNOME_SHELL_ARGS`; `BANANATRAY_GNOME_DRY_RUN=true` skips the shell start. [dev-gnome-extension.sh:27-57, dev-gnome-extension.sh:124-179, dev-gnome-extension.sh:298-301]
C3. Each run has its own temp profile and bus; app mode uses the fixed single-instance suffix `gnome-dev`. [dev-gnome-extension.sh:227, dev-gnome-extension.sh:321-326]
C4. Wayland only (`--no-x11`) with `--devkit`, the help text says GNOME 49+; mutter-devkit is looked for in `/usr/libexec` or PATH, and the install hint names Ubuntu/Debian's `mutter-dev-bin`. [dev-gnome-extension.sh:19, dev-gnome-extension.sh:53, dev-gnome-extension.sh:68, dev-gnome-extension.sh:76-78]
C5. Bash; dbus-run-session, gnome-shell, mutter-devkit, gsettings, gdbus, gjs (mock) or cargo (app), mktemp, seq, `cp -a`; 359 lines. [dev-gnome-extension.sh:1, dev-gnome-extension.sh:186, dev-gnome-extension.sh:309-319]
C6. Nothing by default; with `--profile-dir` the dir with the dconf db and XDG dirs persists. [dev-gnome-extension.sh:119-121, dev-gnome-extension.sh:151]
C7. Not stated in the given file.
