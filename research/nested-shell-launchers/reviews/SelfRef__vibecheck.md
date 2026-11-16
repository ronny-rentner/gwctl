# SelfRef/vibecheck `scripts/nested.mjs`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is set, to `build/nested` in the repo [nested.mjs:20, nested.mjs:35]. HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited from `process.env` [nested.mjs:35].
A2. XDG_CONFIG_HOME is in dbus-run-session's environment [nested.mjs:22-35].
A3. `dbus-run-session` [nested.mjs:23]. Systemd user manager: Not handled; XDG_RUNTIME_DIR is inherited [nested.mjs:35].
A4. Not handled.
A5. `--devkit --wayland` without a display name or `--no-x11` [nested.mjs:28]; the host's display variables are inherited [nested.mjs:35].
A6. Not handled: XDG_RUNTIME_DIR is inherited [nested.mjs:35].
A7. Not handled: SSH_AUTH_SOCK, keyring variables and HOME are inherited [nested.mjs:35].
A8. Not handled.
A9. `spawnSync` without signal handling or process groups [nested.mjs:22-38].
A10. Not handled.
A11. GSK_RENDERER=gl [nested.mjs:32-35].
A12. The real XDG_DATA_HOME is used; enabled-extensions holds only this uuid [nested.mjs:28, nested.mjs:35]. Where the extension is installed depends on `pnpm dev:install` [nested.mjs:9]. Crash flag: Not handled; XDG_RUNTIME_DIR is inherited [nested.mjs:35].
A13. Depends on `pnpm dev:install` [nested.mjs:9].

## B. Lifecycle

B1. Runs `pnpm dev:install` first, then checks for /usr/lib/mutter-devkit or /usr/libexec/mutter-devkit and exits 1 with package names [nested.mjs:9, nested.mjs:12-15]. No version detection.
B2. Depends on `pnpm dev:install`; a non-zero status exits with that status, a spawn error or signal exit with 1 without a message [nested.mjs:9, nested.mjs:41-45].
B3. `build/nested` is created if missing and reused across runs [nested.mjs:17-21].
B4. `dbus-run-session -- sh -c`; a spawn error is not reported and the script exits 1 [nested.mjs:22-39].
B5. Only enabled-extensions; a gsettings failure skips the shell through `&&` [nested.mjs:28].
B6. Depends on `pnpm dev:install` [nested.mjs:9].
B7. enabled-extensions is set before the shell, chained with `&&` [nested.mjs:28]; disable-user-extensions is not set.
B8. `gnome-shell --devkit --wayland`; no size or scale [nested.mjs:28].
B9. Not handled.
B10. GSK_RENDERER=gl [nested.mjs:32-35]; no other helpers.
B11. Not handled.
B12. Output is inherited; the exit status is the shell's, or 1 when there is none [nested.mjs:36, nested.mjs:39]; a spawn error (`shell.error`) is not reported [nested.mjs:22-39].
B13. No signal handling [nested.mjs:22-39]. No timeout.
B14. Not handled; `build/nested` persists [nested.mjs:19].

## C. Properties

C1. Bound to vibecheck: uuid and the project's `dev:install` script [nested.mjs:7, nested.mjs:9].
C2. No arguments or environment variables.
C3. Instances share `build/nested` [nested.mjs:20].
C4. Arch and Ubuntu package names and paths [nested.mjs:12-13]; Wayland [nested.mjs:28].
C5. Node with `import.meta.dirname` and top-level await, pnpm, sh, gsettings, dbus-run-session and gnome-shell; 46 lines [nested.mjs:6, nested.mjs:21].
C6. `build/nested` [nested.mjs:17-21].
C7. Depends on the repository's license file; the script has no license header [nested.mjs:1-7].
