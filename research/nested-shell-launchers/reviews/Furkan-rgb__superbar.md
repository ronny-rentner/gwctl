# Furkan-rgb/superbar `Makefile`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to a `mktemp -d` dir set in front of dbus-run-session. HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited, and the `install` prerequisite runs `gnome-extensions install --force` into the real user extension dir. [Makefile:199, Makefile:202, Makefile:176-177, Makefile:198]
A2. dconf stays the backend; the empty temp XDG_CONFIG_HOME is set before the bus. [Makefile:202]
A3. The shell runs under dbus-run-session. The systemd user manager is not touched, and XDG_RUNTIME_DIR is inherited. [Makefile:202]
A4. Not handled; the system bus is not redirected. [Makefile:202-204]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [Makefile:204]
A6. Not handled; XDG_RUNTIME_DIR is inherited. [Makefile:202-204]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited. [Makefile:202]
A8. Not handled.
A9. Not handled beyond the EXIT trap that removes the temp dir; no kill or process-group handling. [Makefile:200]
A10. Not handled. [Makefile:204]
A11. Not handled; no renderer or GPU settings. [Makefile:204]
A12. Crash flag not handled. The nested enabled list holds only this UUID, and `install` overwrites the real installed copy. [Makefile:176-177, Makefile:203]
A13. No downloads or tokens in the nested path.

## B. Lifecycle

B1. No prerequisite or version checks in `nested`; the prerequisite chain checks JS syntax with node and validates the schema. [Makefile:198-204, Makefile:48-71, Makefile:157]
B2. `install` → `verify` → `pack` → `check`: syntax and schema checks, `gnome-extensions pack`, `unzip -t` and `sha256sum`. Any failure stops make before the shell starts. [Makefile:48-71, Makefile:157-177]
B3. A fresh `mktemp -d` config dir per run, removed by an EXIT trap. [Makefile:199-201]
B4. `dbus-run-session` in the `nested` recipe. [Makefile:202]
B5. Empty database, then `gsettings set org.gnome.shell enabled-extensions` inside the private bus. A failing gsettings stops the `&&` chain before the shell starts. [Makefile:192-197, Makefile:203]
B6. `gnome-extensions install --force` of the built zip into the real user extension dir; a failure stops make before the shell starts. [Makefile:176-177, Makefile:198]
B7. `enabled-extensions` set to this UUID only, through the private bus's dconf; a failing gsettings stops the `&&` chain before the shell starts. [Makefile:203]
B8. `gnome-shell --devkit --wayland` with no size or scale options. [Makefile:204]
B9. Not handled.
B10. Not handled for the nested shell; `prefs`, `enable` and `status` act on the real session. `smoke` and `renders` depend on scripts/smoke-input.mjs and scripts/render-live.mjs. [Makefile:180-190, Makefile:129-134, Makefile:209-219]
B11. Not handled; `make nested` rebuilds and reinstalls. [Makefile:198]
B12. Output goes to the terminal and prints the temp config path. [Makefile:201]
B13. No timeout; the EXIT trap of the recipe shell removes the temp dir. [Makefile:200]
B14. The temp config dir is removed; the installed extension stays in the real data dir. [Makefile:200, Makefile:177]

## C. Properties

C1. Bound to this project: UUID and the build chain. [Makefile:7, Makefile:157-177]
C2. `make nested`; BUILD_DIR is overridable. No arguments or other inputs. [Makefile:9, Makefile:198]
C3. The config dir is unique per run; all instances install into the same real extension dir. [Makefile:199, Makefile:177]
C4. Uses `--devkit --wayland` without fallback; no GNOME version or distribution stated or checked in the Makefile. [Makefile:204]
C5. GNU make with SHELL=/bin/bash, node, glib-compile-schemas, gnome-extensions, unzip, sha256sum, mktemp, dbus-run-session, gsettings, gnome-shell. The nested recipe is lines 192-204 of a 229-line Makefile. [Makefile:4, Makefile:50-71, Makefile:157-177, Makefile:199-204]
C6. The installed extension in the real data dir and the packed zip in BUILD_DIR. [Makefile:177, Makefile:9-10, Makefile:158-159]
C7. GPL-2.0-or-later via SPDX header. [Makefile:1]
