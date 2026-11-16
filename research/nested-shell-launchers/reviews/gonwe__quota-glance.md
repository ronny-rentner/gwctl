# gonwe/quota-glance `scripts/dev.mjs`

## A. Shared with the real session

A1. Depends on gnome-shell-test-tool. dev.mjs passes `process.env` unchanged except GH_CONFIG_DIR, which it points at the host's `gh` config dir [dev.mjs:25-26, dev.mjs:46-50].
A2. Depends on gnome-shell-test-tool for the backend; the test script copies GSETTINGS_BACKEND and XDG_CACHE/CONFIG/DATA_HOME from the shell into the bus activation environment [gnome-shell-preview.js:36, gnome-shell-preview-environment.js:4-31].
A3. `dbus-run-session` around gnome-shell-test-tool [dev.mjs:32-35]; the activation environment is updated with those of four keys that are set in the shell [gnome-shell-preview-environment.js:4-30]. Systemd user manager: Depends on gnome-shell-test-tool.
A4. Depends on gnome-shell-test-tool; nothing in the given files.
A5. `--devkit` [dev.mjs:36]; dev.mjs passes the host's WAYLAND_DISPLAY and DISPLAY unchanged in `process.env` [dev.mjs:46-47]; the rest depends on gnome-shell-test-tool.
A6. Depends on gnome-shell-test-tool; nothing in the given files.
A7. GH_CONFIG_DIR points the nested session at the host's GitHub CLI config, and the rest of the environment is inherited [dev.mjs:25-26, dev.mjs:47-49].
A8. Depends on gnome-shell-test-tool; nothing in the given files.
A9. `spawnSync` without signal handling or process groups [dev.mjs:32-53].
A10. Not handled.
A11. `--disable-animations` only [dev.mjs:37].
A12. The extension and an optional Dash to Panel fixture are passed as zips to gnome-shell-test-tool [dev.mjs:29-31, dev.mjs:39-40]; installation and enabling depend on gnome-shell-test-tool. Crash flag: Depends on gnome-shell-test-tool.
A13. The host's gh config is reachable via GH_CONFIG_DIR [dev.mjs:48-49]; the test script enables the providers codex, copilot, zai, deepseek and opencode-go [gnome-shell-preview.js:42-45]; the fixture depends on dash-to-panel-fixture.mjs [dev.mjs:7, dev.mjs:24].

## B. Lifecycle

B1. Checks /usr/lib/mutter-devkit and exits 1 with a pacman instruction; the message names GNOME 49+ [dev.mjs:9-22]. No version detection.
B2. Not handled: uses the prebuilt `artifacts/quota-glance@geequlim.shell-extension.zip` [dev.mjs:40]; the fixture depends on dash-to-panel-fixture.mjs [dev.mjs:24].
B3. Depends on gnome-shell-test-tool.
B4. `dbus-run-session`; a spawn error is thrown [dev.mjs:33, dev.mjs:55-56].
B5. Inside the shell the test script sets `enabled-providers` and throws if the settings object is missing [gnome-shell-preview.js:39-45].
B6. `--extension <zip>` for gnome-shell-test-tool [dev.mjs:39-40].
B7. Depends on gnome-shell-test-tool.
B8. `gnome-shell-test-tool --devkit --disable-animations`; size and scale depend on gnome-shell-test-tool [dev.mjs:35-37].
B9. Polls `Main.panel.statusArea[UUID]` every 100 ms up to 5 s and throws on timeout [gnome-shell-preview.js:13-33, gnome-shell-preview.js:38].
B10. Opens the indicator menu and prints a ready message [gnome-shell-preview.js:46-48]; no other helpers.
B11. Not handled.
B12. Output is inherited; the exit code is the child's or 1; a spawn error is thrown [dev.mjs:51, dev.mjs:55-58].
B13. dev.mjs has no signal handling; `finally` runs the fixture cleanup once `spawnSync` returns [dev.mjs:32-61].
B14. Fixture cleanup in `finally`, its content depends on dash-to-panel-fixture.mjs [dev.mjs:59-61]; the rest depends on gnome-shell-test-tool.

## C. Properties

C1. Bound to Quota Glance: artifact name, test scripts and UUID [dev.mjs:40-43, gnome-shell-preview.js:9].
C2. No arguments; reads GH_CONFIG_DIR and XDG_CONFIG_HOME [dev.mjs:25-26, dev.mjs:48-49].
C3. Depends on gnome-shell-test-tool.
C4. Arch path /usr/lib/mutter-devkit and pacman command, GNOME 49+ [dev.mjs:9, dev.mjs:13-16].
C5. Node (ESM, top-level await), gnome-shell-test-tool, dbus-run-session and mutter-devkit; 61, 51 and 31 lines [dev.mjs:24, dev.mjs:33-35].
C6. Depends on gnome-shell-test-tool and dash-to-panel-fixture.mjs.
C7. Depends on the repository's license file; none of the three files has a license header [dev.mjs:1-7, gnome-shell-preview.js:1-9, gnome-shell-preview-environment.js:1-9].
