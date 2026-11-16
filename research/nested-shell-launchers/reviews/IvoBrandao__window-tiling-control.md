# IvoBrandao/window-tiling-control `scripts/nested-dev.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME, XDG_STATE_HOME and XDG_CACHE_HOME point under `$SANDBOX`, default `/tmp/wtc-nested-sandbox`; HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. [scripts/nested-dev.sh:22, scripts/nested-dev.sh:40-44]
A2. The `dconf write`s run inside `dbus-run-session`, with the sandbox XDG_CONFIG_HOME; GSETTINGS_SCHEMA_DIR is exported; DCONF_PROFILE is not reset. [scripts/nested-dev.sh:51, scripts/nested-dev.sh:59-68]
A3. `dbus-run-session` provides a private session bus; the systemd user manager is not addressed. [scripts/nested-dev.sh:65]
A4. Not handled.
A5. `--nested --wayland` window on the host with DISPLAY, WAYLAND_DISPLAY and the real XDG_RUNTIME_DIR inherited. [scripts/nested-dev.sh:69]
A6. Not handled; the real XDG_RUNTIME_DIR is inherited. [scripts/nested-dev.sh:65-70]
A7. Not handled; the full environment is inherited. [scripts/nested-dev.sh:65]
A8. Not handled. [scripts/nested-dev.sh:65-70]
A9. Not handled; the script `exec`s into `dbus-run-session`, no traps or kills. [scripts/nested-dev.sh:65-70]
A10. Not handled. [scripts/nested-dev.sh:69]
A11. Not handled. [scripts/nested-dev.sh:69]
A12. The extension is copied into the sandbox and enabled only in the sandbox dconf; the crash flag is not handled. [scripts/nested-dev.sh:46-49, scripts/nested-dev.sh:68]
A13. Not handled; the build depends on the Makefile's `build` target. [scripts/nested-dev.sh:37]

## B. Lifecycle

B1. Checks that `gnome-shell` is on PATH and exits 1 with a message; no version detection, and extension version validation is switched off. [scripts/nested-dev.sh:31-34, scripts/nested-dev.sh:67]
B2. `make -C "$REPO" build` with stdout discarded (depends on the Makefile). [scripts/nested-dev.sh:37]
B3. A fixed sandbox dir reused across runs; reset only with `--clean`, which deletes it and exits. [scripts/nested-dev.sh:22, scripts/nested-dev.sh:25-29, scripts/nested-dev.sh:44]
B4. `exec dbus-run-session -- bash -c ...`. [scripts/nested-dev.sh:65]
B5. `disable-user-extensions false`, `disable-extension-version-validation true`, `enabled-extensions`. [scripts/nested-dev.sh:65-69]
B6. `cp -r` of `build/<uuid>/.` into the sandbox extensions dir; stale files from earlier copies are not removed. [scripts/nested-dev.sh:46-49]
B7. `enabled-extensions` set to this UUID, with `disable-user-extensions false`. [scripts/nested-dev.sh:65-69]
B8. `exec gnome-shell --nested --wayland`; size from RES, default 1600x900; no scale. [scripts/nested-dev.sh:23, scripts/nested-dev.sh:57, scripts/nested-dev.sh:69]
B9. Not handled. [scripts/nested-dev.sh:65-70]
B10. Not handled. [scripts/nested-dev.sh:65-70]
B11. Not handled.
B12. Output goes to the terminal except the build's stdout. [scripts/nested-dev.sh:37, scripts/nested-dev.sh:69]
B13. Not handled; no traps. [scripts/nested-dev.sh:65-70]
B14. Not handled; the sandbox stays until `--clean`. [scripts/nested-dev.sh:25-29]

## C. Properties

C1. Bound to this project: UUID and `build/<uuid>` path. [scripts/nested-dev.sh:20, scripts/nested-dev.sh:49]
C2. `--clean`; environment SANDBOX and RES. [scripts/nested-dev.sh:13-16, scripts/nested-dev.sh:22-23]
C3. Concurrent runs share the default sandbox; separate SANDBOX values separate them. [scripts/nested-dev.sh:22]
C4. No version detection; version validation disabled. [scripts/nested-dev.sh:67]
C5. bash, make, `dconf`, `dbus-run-session`, `gnome-shell`; 70 lines. [scripts/nested-dev.sh:1-70]
C6. The whole sandbox at its fixed path persists: dconf, data, state, cache. [scripts/nested-dev.sh:22, scripts/nested-dev.sh:40-44]
C7. Not stated; the file has no license header. [scripts/nested-dev.sh:1-70]
