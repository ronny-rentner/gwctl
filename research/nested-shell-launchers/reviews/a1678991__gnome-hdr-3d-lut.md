# a1678991/gnome-hdr-3d-lut `tests/test-nested.zsh`

## A. Shared with the real session

A1. XDG_DATA_HOME and XDG_CONFIG_HOME point into `mktemp -d /tmp/hdr-3d-lut-nested.XXXXXX`; HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. [test-nested.zsh:4, test-nested.zsh:7-8]
A2. `GSETTINGS_BACKEND=keyfile` is exported before all gsettings calls and dbus-run-session. [test-nested.zsh:8-9, test-nested.zsh:22-28]
A3. dbus-run-session wraps only gnome-shell, the earlier gsettings calls run in the host environment with the keyfile backend; the systemd user manager is not addressed. [test-nested.zsh:22-28]
A4. Not handled.
A5. `--devkit --wayland`; host display variables are inherited and Xwayland is not disabled; the LUT assignment targets the monitor name `Virtual-1`. [test-nested.zsh:21, test-nested.zsh:28]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [test-nested.zsh:7-11]
A7. Not handled; the full host environment is inherited. [test-nested.zsh:7-11]
A8. Not handled.
A9. No own process handling; dbus-run-session runs under `timeout --signal=TERM 15s` without `--foreground`. [test-nested.zsh:28]
A10. Not handled.
A11. Not handled; the extension gets a LUT atlas for `Virtual-1` and `HDR_3D_LUT_TEST=1`. [test-nested.zsh:10, test-nested.zsh:21]
A12. The keyfile sets disable-user-extensions false and enables only `hdr-3d-lut@local`. [test-nested.zsh:25-26]
A13. Not handled.

## B. Lifecycle

B1. Not handled.
B2. Copies `hdr-3d-lut@local/`, compiles its schemas with `--strict` and converts a `.cube` fixture with `python3 tools/convert_cube.py`; depends on `tools/convert_cube.py`. [test-nested.zsh:13-19]
B3. New temp dir per run, removed on EXIT. [test-nested.zsh:4-5]
B4. `dbus-run-session -- gnome-shell …` under `timeout` as the last command. [test-nested.zsh:28]
B5. Sets `assignments-json` for `Virtual-1` via `--schemadir`, then disable-user-extensions false and enabled-extensions. [test-nested.zsh:21-26]
B6. `cp -R` of `hdr-3d-lut@local/.` into the temp extension dir. [test-nested.zsh:13-15]
B7. Through gsettings on the keyfile; no check. [test-nested.zsh:25-26]
B8. `gnome-shell --devkit --wayland`; no size or scale. [test-nested.zsh:28]
B9. Not handled.
B10. Not handled.
B11. Not handled.
B12. `SHELL_DEBUG=backtrace-warnings`; terminal output. [test-nested.zsh:11, test-nested.zsh:28]
B13. `timeout --signal=TERM 15s`, without `--foreground`; otherwise only an EXIT trap. [test-nested.zsh:5, test-nested.zsh:28]
B14. `rm -rf -- "$test_root"` on EXIT. [test-nested.zsh:5]

## C. Properties

C1. Bound to hdr-3d-lut: UUID, schema, fixture and monitor name. [test-nested.zsh:13, test-nested.zsh:17-23]
C2. No arguments; `HDR_3D_LUT_TEST=1` is set for the extension. [test-nested.zsh:10]
C3. Each run has its own temp dir and bus. [test-nested.zsh:4, test-nested.zsh:28]
C4. `--devkit --wayland`; no version detection. [test-nested.zsh:28]
C5. zsh; python3, glib-compile-schemas, gsettings, dbus-run-session, gnome-shell, coreutils `timeout`; 28 lines. [test-nested.zsh:1, test-nested.zsh:16-17, test-nested.zsh:22, test-nested.zsh:28]
C6. Nothing; the temp dir is removed. [test-nested.zsh:5]
C7. Not stated in the given file.
