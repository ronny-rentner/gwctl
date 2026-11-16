# sebastjan-rijavec/Wallfred `gnome-ext.sh`

## A. Shared with the real session

A1. `test` points XDG_DATA_HOME, XDG_CONFIG_HOME, XDG_CACHE_HOME, XDG_STATE_HOME and XDG_RUNTIME_DIR at `$REPO_DIR/.dev-home/*`; HOME and TMPDIR are inherited, and CAROUSEL_DIR defaults to the real `~/Pictures/Wallpapers`. [gnome-ext.sh:36, gnome-ext.sh:41, gnome-ext.sh:128-130, gnome-ext.sh:141-147]
A2. The `gsettings` writes run on the private bus, with the redirected XDG_CONFIG_HOME; GSETTINGS_SCHEMA_DIR points at the repo's schemas; DCONF_PROFILE is not reset. [gnome-ext.sh:141-159]
A3. `dbus-run-session` provides a private session bus; the systemd user manager is not addressed. [gnome-ext.sh:141-152]
A4. Not handled.
A5. `--nested --wayland` window on the host with DISPLAY and WAYLAND_DISPLAY inherited; XDG_RUNTIME_DIR is `.dev-home/run`. [gnome-ext.sh:129, gnome-ext.sh:145, gnome-ext.sh:160-161]
A6. Not handled; XDG_RUNTIME_DIR is `.dev-home/run`. [gnome-ext.sh:129, gnome-ext.sh:145]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited. [gnome-ext.sh:141-152]
A8. Not handled; nothing unmounts anything under `.dev-home/run`. [gnome-ext.sh:120-166]
A9. Not handled in `test`; no traps or kills, while `reload` runs `gnome-shell --replace` on the real session. [gnome-ext.sh:95-102, gnome-ext.sh:120-166]
A10. Not handled. [gnome-ext.sh:160-161]
A11. Not handled. [gnome-ext.sh:160-161]
A12. `test` links the extension into `.dev-home` and enables it only in its dconf; `install`, `enable`, `disable` and `reload` act on the real session. [gnome-ext.sh:54-71, gnome-ext.sh:82-83, gnome-ext.sh:95-102, gnome-ext.sh:132, gnome-ext.sh:155]
A13. Not handled; no downloads or tokens. [gnome-ext.sh:1-189]

## B. Lifecycle

B1. Checks `dbus-run-session` and `gnome-shell` and dies with a message; no version detection. [gnome-ext.sh:121-122]
B2. Compiles the schemas into the repo's `schemas/`; no build step; `pack` is separate. [gnome-ext.sh:47-50, gnome-ext.sh:109-117, gnome-ext.sh:124]
B3. `.dev-home` in the repo is created with `mkdir -p` and reused; the script never resets it and only prints an `rm -rf` hint. [gnome-ext.sh:41, gnome-ext.sh:128-130, gnome-ext.sh:165]
B4. `dbus-run-session -- bash -c ...`. [gnome-ext.sh:152]
B5. `enabled-extensions`, `carousel-dir`, `interval-minutes`, `shuffle`, `rotate-enabled`. [gnome-ext.sh:153-159]
B6. `ln -sfn` of the repo root into `.dev-home/data/gnome-shell/extensions/<uuid>`. [gnome-ext.sh:28-31, gnome-ext.sh:132]
B7. `enabled-extensions` set to this UUID; `disable-user-extensions` is not set. [gnome-ext.sh:155]
B8. `gnome-shell --nested --wayland` with MUTTER_DEBUG_DUMMY_MODE_SPECS from NESTED_SIZE, default 1600x1000; no scale. [gnome-ext.sh:134, gnome-ext.sh:160-161]
B9. Not handled. [gnome-ext.sh:152-162]
B10. `prefs`, `enable`, `disable` and `status` call `gnome-extensions` on the caller's session bus, not the nested one. [gnome-ext.sh:82-93]
B11. Not handled for the nested shell; `reload` restarts the real shell on X11 only. [gnome-ext.sh:95-102]
B12. Output goes to the terminal; `logs` follows the real gnome-shell journal. [gnome-ext.sh:104-107, gnome-ext.sh:152-165]
B13. Not handled; no traps. [gnome-ext.sh:120-166]
B14. Not handled; the script only prints an `rm -rf` hint. [gnome-ext.sh:164-165]

## C. Properties

C1. Bound to this project: UUID, schema id and carousel settings. [gnome-ext.sh:27, gnome-ext.sh:33, gnome-ext.sh:156-159]
C2. Subcommands `test`, `install`, `uninstall`, `enable`, `disable`, `reload`, `prefs`, `status`, `schemas`, `logs`, `pack`, `help`; environment CAROUSEL_DIR, NESTED_SIZE, TEST_INTERVAL, XDG_DATA_HOME. [gnome-ext.sh:11-24, gnome-ext.sh:36, gnome-ext.sh:38, gnome-ext.sh:134-135, gnome-ext.sh:168-186]
C3. Instances share `.dev-home`, including dconf and the runtime dir. [gnome-ext.sh:41, gnome-ext.sh:128-130]
C4. No version detection; `reload` refuses on Wayland. [gnome-ext.sh:96-98]
C5. bash, `glib-compile-schemas`, `gsettings`, `dbus-run-session`, `gnome-shell`, `gnome-extensions`, `journalctl`, `grep`, `sed`; 189 lines. [gnome-ext.sh:1-189]
C6. `.dev-home` (dconf, cache, state, runtime dir) and the compiled schemas in the repo. [gnome-ext.sh:49, gnome-ext.sh:128-130, gnome-ext.sh:165]
C7. Not stated; the file has no license header. [gnome-ext.sh:1-189]
