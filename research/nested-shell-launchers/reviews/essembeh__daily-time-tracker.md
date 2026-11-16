# essembeh/daily-time-tracker `tests/nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME and XDG_DATA_HOME point into two `mktemp -d` dirs; a `user-dirs.dirs` points every XDG user dir at a third temp dir. HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR, TMPDIR and XDG_DATA_DIRS stay the host's. [nested.sh:14-32]
A2. No GSETTINGS_BACKEND; the redirected XDG_CONFIG_HOME is exported before dbus-run-session. [nested.sh:14, nested.sh:44-46]
A3. dbus-run-session gives gsettings and the shell a private session bus; the systemd user manager is not addressed. [nested.sh:44-48]
A4. Not handled.
A5. `--devkit --wayland`; host display variables are inherited and Xwayland is not disabled. [nested.sh:47]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [nested.sh:14, nested.sh:30]
A7. Not handled; the full host environment is inherited. [nested.sh:14, nested.sh:30]
A8. Not handled.
A9. No process handling; `exec` replaces the script with dbus-run-session and the inner bash with gnome-shell. [nested.sh:44, nested.sh:47]
A10. Sets the nested input sources to `xkb fr`; no grab or lock handling. [nested.sh:46]
A11. Not handled.
A12. Enables only `daily-time-tracker@essembeh.org` in the nested settings. [nested.sh:45]
A13. Not handled.

## B. Lifecycle

B1. Uses `glib-compile-schemas` if on PATH, else `nix-shell -p glib`. [nested.sh:36-40]
B2. Compiles `src/schemas` inside the repo on every run. [nested.sh:34-40]
B3. Creates three temp dirs per run; never reuses or removes them. [nested.sh:14, nested.sh:19, nested.sh:30]
B4. `exec dbus-run-session -- bash -c "…"`. [nested.sh:44-48]
B5. Sets enabled-extensions and input sources `fr`. [nested.sh:44-47]
B6. `ln -sfn` of `src/` into the temp extension dir. [nested.sh:31-32]
B7. gsettings inside the bus before the shell starts; no check. [nested.sh:45, nested.sh:47]
B8. `gnome-shell --devkit --wayland`; no size or scale. [nested.sh:47]
B9. Not handled.
B10. Not handled.
B11. Not handled; schemas are recompiled each run. [nested.sh:37]
B12. Prints the nested XDG_DATA_HOME; terminal output only. [nested.sh:42, nested.sh:44]
B13. No traps; no timeout.
B14. Not handled; the three temp dirs stay. [nested.sh:14, nested.sh:19, nested.sh:30]

## C. Properties

C1. Bound to daily-time-tracker by UUID, plus a French keyboard layout. [nested.sh:11, nested.sh:46]
C2. No arguments or variables. [nested.sh:11-48]
C3. Each run has its own temp dirs and bus; all runs compile into the same `src/schemas`. [nested.sh:14, nested.sh:19, nested.sh:30, nested.sh:37, nested.sh:44]
C4. `--devkit --wayland`; no version detection; a Nix fallback for glib. [nested.sh:39, nested.sh:47]
C5. Bash; mktemp, ln, glib-compile-schemas or nix-shell, dbus-run-session, gsettings, gnome-shell; 48 lines. [nested.sh:1, nested.sh:14, nested.sh:32, nested.sh:36-40, nested.sh:44-47]
C6. The temp config, user-dirs target and data dirs stay after each run, and `gschemas.compiled` stays in `src/schemas`. [nested.sh:14, nested.sh:19, nested.sh:30, nested.sh:34-37]
C7. Not stated in the given file.
