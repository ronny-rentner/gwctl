# bgpat/gnome-shell-extension-genai-usage `scripts/dev.ts`

## A. Shared with the real session

A1. XDG_DATA_HOME and XDG_CONFIG_HOME point at dirs inside a `mkdtempSync` dir under `os.tmpdir()`; HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited, and the real `cursor` and `Cursor` config dirs are symlinked into the temp config. [scripts/dev.ts:13-18, scripts/dev.ts:20-27, scripts/dev.ts:59-63]
A2. The generated script runs its `gsettings` writes on the private bus from `dbus-run-session`, with the temp XDG_CONFIG_HOME; DCONF_PROFILE is not reset. [scripts/dev.ts:39-43, scripts/dev.ts:56-63]
A3. `dbus-run-session` provides a private session bus and is started with `process.env` plus the two XDG overrides; the systemd user manager is not addressed. [scripts/dev.ts:56-63]
A4. Not handled; nothing replaces the system bus, and `process.env` is passed on with only the two XDG overrides. [scripts/dev.ts:56-63]
A5. `gnome-shell --nested --wayland` runs as a window on the host; DISPLAY, WAYLAND_DISPLAY and the real XDG_RUNTIME_DIR are inherited. [scripts/dev.ts:52, scripts/dev.ts:59-60]
A6. Not handled; XDG_RUNTIME_DIR is inherited. [scripts/dev.ts:59-60]
A7. Not handled; SSH_AUTH_SOCK and the rest of `process.env` are passed on. [scripts/dev.ts:59-60]
A8. Not handled; nothing addresses portals, gvfs or FUSE, and the real runtime dir is inherited. [scripts/dev.ts:56-63]
A9. Not handled; `spawnSync` blocks until `dbus-run-session` exits, with no signal handling or kills. [scripts/dev.ts:56-65]
A10. Not handled. [scripts/dev.ts:52]
A11. Not handled. [scripts/dev.ts:52]
A12. The extension is unzipped into the temp data dir and enabled only in the temp dconf; the crash flag is not handled. [scripts/dev.ts:16, scripts/dev.ts:29, scripts/dev.ts:39-40]
A13. The real `cursor`/`Cursor` config dirs, when they exist, are symlinked into the temp XDG_CONFIG_HOME; no downloads in this file (packing depends on scripts/pack.ts). [scripts/dev.ts:9, scripts/dev.ts:20-27]

## B. Lifecycle

B1. Not handled; no tool or version checks; a missing `bun`, `unzip` or `dbus-run-session` gives `status === null`, which exits with 1 without printing the spawn error. [scripts/dev.ts:9-11, scripts/dev.ts:29-33, scripts/dev.ts:65]
B2. Runs `bun scripts/pack.ts` in the repo root and exits with its status on failure (depends on scripts/pack.ts). [scripts/dev.ts:9-11]
B3. Creates a fresh `mkdtempSync` dir per run; it is never reused or removed. [scripts/dev.ts:13-18]
B4. `dbus-run-session -- <session.sh>`; its exit status is passed through, 1 if it could not be started. [scripts/dev.ts:56, scripts/dev.ts:65]
B5. The generated script sets `disable-user-extensions false`, `enabled-extensions`, and `color-scheme` from GENAI_COLOR_SCHEME after checking it against three values. [scripts/dev.ts:37-51]
B6. `unzip -q -o` of `<uuid>.zip` into the temp extensions dir; a non-zero status exits the script. [scripts/dev.ts:16, scripts/dev.ts:29-33]
B7. `enabled-extensions` set to this UUID only and `disable-user-extensions false`. [scripts/dev.ts:39-40]
B8. `exec gnome-shell --nested --wayland`; size from MUTTER_DEBUG_DUMMY_MODE_SPECS, default 1920x1080; no scale. [scripts/dev.ts:38, scripts/dev.ts:52]
B9. Not handled. [scripts/dev.ts:52-65]
B10. Not handled; only the colour scheme preset. [scripts/dev.ts:41-51]
B11. Not handled; a rerun packs again and creates a new sandbox. [scripts/dev.ts:9-18]
B12. stdio is inherited; the script exits with `dbus-run-session`'s status, or 1 if none. [scripts/dev.ts:56-58, scripts/dev.ts:65]
B13. No signal handling. [scripts/dev.ts:56-65]
B14. Not handled; the temp dir with session.sh, the unzipped extension and dconf stays. [scripts/dev.ts:13, scripts/dev.ts:35]

## C. Properties

C1. Bound to this project: fixed UUID, scripts/pack.ts, the Cursor config links and GENAI_COLOR_SCHEME. [scripts/dev.ts:7, scripts/dev.ts:9, scripts/dev.ts:23, scripts/dev.ts:41]
C2. No arguments; environment MUTTER_DEBUG_DUMMY_MODE_SPECS and GENAI_COLOR_SCHEME, and XDG_CONFIG_HOME is read as the link source. [scripts/dev.ts:20-22, scripts/dev.ts:38, scripts/dev.ts:41-50]
C3. Each run has its own temp dir and bus, and the file uses no fixed names. [scripts/dev.ts:13, scripts/dev.ts:56]
C4. No version, distro or display detection.
C5. Bun (`import.meta.dir`, `bun`), `unzip`, `/bin/sh`, `gsettings`, `dbus-run-session`, `gnome-shell`; 65 lines. [scripts/dev.ts:6, scripts/dev.ts:9, scripts/dev.ts:29, scripts/dev.ts:36, scripts/dev.ts:56]
C6. Every run leaves its temp dir behind. [scripts/dev.ts:13]
C7. Not stated; the file has no license header. [scripts/dev.ts:1-65]
