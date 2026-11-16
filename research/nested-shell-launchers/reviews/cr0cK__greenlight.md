# cr0cK/greenlight `scripts/sandbox.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME and XDG_CONFIG_HOME point into `${GREENLIGHT_SANDBOX:-${XDG_CACHE_HOME:-$HOME/.cache}/greenlight-sandbox}` and are set in front of dbus-run-session. HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited, and GH_CONFIG_DIR points at the real gh config. [sandbox.sh:9, sandbox.sh:55-58, sandbox.sh:59]
A2. GSETTINGS_BACKEND=keyfile in the sandbox config dir, set before the bus. The real GSettings are read once, for numlock-state. [sandbox.sh:42-48, sandbox.sh:55-58, sandbox.sh:51-52]
A3. The shell runs under dbus-run-session. The systemd user manager is not touched, and XDG_RUNTIME_DIR is inherited. [sandbox.sh:55-61]
A4. Not handled; the system bus is not redirected. [sandbox.sh:55-61]
A5. Not handled; WAYLAND_DISPLAY and DISPLAY are inherited. [sandbox.sh:61]
A6. Not handled; XDG_RUNTIME_DIR is inherited. [sandbox.sh:55-61]
A7. The GitHub token is read from the host with `gh auth token` and passed in as GH_TOKEN. SSH_AUTH_SOCK and the rest of the environment are inherited. [sandbox.sh:31, sandbox.sh:60, sandbox.sh:55-61]
A8. Not handled.
A9. Not handled; the script `exec`s into dbus-run-session, no traps or kills. [sandbox.sh:55]
A10. Not handled; the numlock state is copied from the desktop. [sandbox.sh:51-52]
A11. Not handled; no renderer or GPU settings. [sandbox.sh:61]
A12. Crash flag not handled. The sandbox data dir and enabled list hold only this extension. [sandbox.sh:10, sandbox.sh:46]
A13. Forwards the host's GitHub token and gh config dir into the nested session; the pack step depends on the project Makefile. [sandbox.sh:31, sandbox.sh:59-60, sandbox.sh:36]

## B. Lifecycle

B1. Checks for gh, gnome-shell, dbus-run-session, glib-compile-schemas, unzip and /usr/libexec/mutter-devkit, and that gh is logged in, each failure exiting 1 with a message. No version detection. [sandbox.sh:19-34]
B2. Depends on the `pack` target of the project Makefile, then unzips `dist/<uuid>.shell-extension.zip` and compiles its schemas; failures end the script via `set -e`. [sandbox.sh:36-40]
B3. The sandbox dir is reused between runs; `--reset` deletes it first. The extension dir inside is replaced on every run. [sandbox.sh:2-4, sandbox.sh:12-13, sandbox.sh:37-39]
B4. `dbus-run-session` through `exec`. [sandbox.sh:55-61]
B5. Sets enabled-extensions, disable-user-extensions false, welcome-dialog-last-shown-version '999' and the desktop's numlock-state in the keyfile on every run; failures end the script via `set -e`. [sandbox.sh:42-52]
B6. `unzip` of the packed zip into the sandbox extension dir, then `glib-compile-schemas`; failures end the script via `set -e`. [sandbox.sh:37-40, sandbox.sh:5]
B7. Through the keyfile `enabled-extensions` and `disable-user-extensions false`. [sandbox.sh:46-47]
B8. `gnome-shell --devkit --wayland` with no size or scale options. [sandbox.sh:61]
B9. Not handled.
B10. Not handled; no prefs, eval, screenshot or external control.
B11. Not handled; each run repacks and replaces the extension dir. [sandbox.sh:36-39]
B12. Output goes to the terminal. [sandbox.sh:55-61]
B13. Not handled: no trap or timeout.
B14. Not handled; the sandbox stays.

## C. Properties

C1. Bound to this project: UUID, the `pack` target and the gh token. [sandbox.sh:8, sandbox.sh:30-36]
C2. Optional `--reset`, anything else prints usage and exits 2; GREENLIGHT_SANDBOX, XDG_CACHE_HOME and GH_CONFIG_DIR are read. [sandbox.sh:12-17, sandbox.sh:9, sandbox.sh:59]
C3. No: one sandbox dir shared by default, with the extension dir replaced at each start; GREENLIGHT_SANDBOX can select another. [sandbox.sh:9, sandbox.sh:37]
C4. Uses `--devkit --wayland` without fallback; mutter-devkit only in /usr/libexec, with an `install mutter-devel` hint. [sandbox.sh:61, sandbox.sh:25-26]
C5. bash, gh, gnome-shell, dbus-run-session, glib-compile-schemas, unzip, make, gsettings. 61 lines. [sandbox.sh:19-61]
C6. The sandbox dir with preferences. [sandbox.sh:3-4, sandbox.sh:9]
C7. Not stated in the script.
