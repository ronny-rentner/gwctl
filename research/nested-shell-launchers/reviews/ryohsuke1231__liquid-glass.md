# ryohsuke1231/liquid-glass `tools/gnome-versions/run.sh`

## A. Shared with the real session

A1. Depends on `setup.sh` and distrobox; the script itself sets only XDG_RUNTIME_DIR, to a per-run `mktemp -d /tmp/lgrt.XXXXXX`. TMPDIR is not changed, and the host's Dash to Dock dir is read from the real HOME. [tools/gnome-versions/run.sh:114, tools/gnome-versions/run.sh:134, tools/gnome-versions/run.sh:56]
A2. Depends on the box's HOME: no XDG_CONFIG_HOME or backend is set. [tools/gnome-versions/run.sh:150-155]
A3. Inside the box, the shell runs under `dbus-run-session`. On the host, DBUS_SESSION_BUS_ADDRESS is pointed at the systemd user bus, and that address goes into `distrobox enter`. [tools/gnome-versions/run.sh:150, tools/gnome-versions/run.sh:57-59, tools/gnome-versions/run.sh:83-85]
A4. Not separated: DBUS_SYSTEM_BUS_ADDRESS is set to the host's system bus socket under `/run/host`. [tools/gnome-versions/run.sh:135-136]
A5. 49+: the host Wayland socket path is handed to `gnome-shell --devkit`; 46-48: the host DISPLAY to `--nested`. The nested shell runs `--no-x11` with its own `--wayland-display lg<version>`, and DISPLAY is unset for its clients. [tools/gnome-versions/run.sh:121-131, tools/gnome-versions/run.sh:140-141, tools/gnome-versions/run.sh:170-175]
A6. With `--devkit` the inner script starts its own `pipewire` and `wireplumber` in the private runtime dir; with `--nested` audio is not handled. [tools/gnome-versions/run.sh:134, tools/gnome-versions/run.sh:156-166]
A7. Not handled in the file: no `env -i`. [tools/gnome-versions/run.sh:85]
A8. Private runtime dir; cleanup unmounts `runtime/doc` (not lazily) before removal; gvfs is not addressed. [tools/gnome-versions/run.sh:114-119, tools/gnome-versions/run.sh:134]
A9. pipewire and wireplumber are killed by PID once the shell returns; the `LGTEST_AUTOSTART` subshell is not tracked; no process groups or patterns. [tools/gnome-versions/run.sh:160-165, tools/gnome-versions/run.sh:168, tools/gnome-versions/run.sh:176-177]
A10. Not handled; only the host's input-method variables are unset. [tools/gnome-versions/run.sh:142-143]
A11. Not handled.
A12. The extension is unzipped and Dash to Dock copied into the box home's extensions dir, and `enabled-extensions` is written to the box's dconf. The crash flag is not handled. [tools/gnome-versions/run.sh:101-112, tools/gnome-versions/run.sh:151-152]
A13. `--pack` runs `npm run pack` on the host; no downloads or tokens otherwise; the box image depends on `setup.sh`. [tools/gnome-versions/run.sh:47-49, tools/gnome-versions/run.sh:4]

## B. Lifecycle

B1. VERSION must be 46-51 (usage, exit 2); box detection by `CONTAINER_ID` or `/run/.containerenv`; zip, Wayland socket and DISPLAY checked with exit 1; `gnome-shell --version` is printed; the box itself depends on `setup.sh`. [tools/gnome-versions/run.sh:29-33, tools/gnome-versions/run.sh:43, tools/gnome-versions/run.sh:98, tools/gnome-versions/run.sh:123-124, tools/gnome-versions/run.sh:129, tools/gnome-versions/run.sh:149]
B2. `--pack` runs `npm run pack` on the host under `set -e`; inside the box it only prints a message and uses the existing zip. [tools/gnome-versions/run.sh:27, tools/gnome-versions/run.sh:47-49, tools/gnome-versions/run.sh:92]
B3. The box from `setup.sh` is reused; each run deletes and re-unzips the extension, replaces Dash to Dock and creates a new runtime dir; the box's dconf persists. [tools/gnome-versions/run.sh:85, tools/gnome-versions/run.sh:103-110, tools/gnome-versions/run.sh:114]
B4. On the host it points DBUS_SESSION_BUS_ADDRESS at the systemd user bus; in the box it runs `dbus-run-session -- bash -c '…'`. [tools/gnome-versions/run.sh:83-84, tools/gnome-versions/run.sh:150]
B5. `gsettings` sets `disable-user-extensions false`, `enabled-extensions`, `welcome-dialog-last-shown-version` and `output-logs true` in the schema `org.gnome.shell.extensions.$UUID`, whose id is built from the full UUID including `@`; the inner script checks none of them. [tools/gnome-versions/run.sh:151-155]
B6. `rm -rf`, `unzip` and `glib-compile-schemas` in the box home's extensions dir; Dash to Dock is copied from the host when present and not `--no-dock`. [tools/gnome-versions/run.sh:101-112]
B7. `enabled-extensions` is written before the shell starts; `--no-ext` leaves Liquid Glass out. [tools/gnome-versions/run.sh:88, tools/gnome-versions/run.sh:93, tools/gnome-versions/run.sh:111, tools/gnome-versions/run.sh:145, tools/gnome-versions/run.sh:152]
B8. 49+: `--devkit --wayland --no-x11`; 46-48: `--nested --wayland --no-x11`. For 46-48 on sway the size is computed from the focused workspace unless `MUTTER_DEBUG_DUMMY_MODE_SPECS` is set, and a failed probe leaves the size unset; scale not handled. [tools/gnome-versions/run.sh:60-82, tools/gnome-versions/run.sh:171-175]
B9. Not handled: pipewire and wireplumber get fixed 0.5 s sleeps, and `LGTEST_AUTOSTART` waits a fixed 6 s. [tools/gnome-versions/run.sh:162, tools/gnome-versions/run.sh:165, tools/gnome-versions/run.sh:168]
B10. `LGTEST_AUTOSTART` runs commands in the nested session; no eval or screenshots. [tools/gnome-versions/run.sh:9, tools/gnome-versions/run.sh:167-169]
B11. Not handled.
B12. Output goes through `tee` to the terminal and `~/g<version>.log` in the box home, and the inner script sets the extension's `output-logs` to true without checking the result; the inner script ends with `true`. [tools/gnome-versions/run.sh:147, tools/gnome-versions/run.sh:154-155, tools/gnome-versions/run.sh:178-179]
B13. No INT trap and no timeout; the EXIT trap runs `cleanup`, and pipewire and wireplumber are killed once the shell returns. [tools/gnome-versions/run.sh:119, tools/gnome-versions/run.sh:176-177]
B14. `cleanup` unmounts `runtime/doc` with fusermount3 or fusermount and removes the runtime dir, errors ignored; the autostart subshell is not cleaned up. [tools/gnome-versions/run.sh:115-119, tools/gnome-versions/run.sh:168]

## C. Properties

C1. Bound to this project: UUID, Dash to Dock, repo layout and `npm run pack`. [tools/gnome-versions/run.sh:36-41, tools/gnome-versions/run.sh:49]
C2. Positional VERSION 46-51; options `--pack`, `--no-ext`, `--no-dock`; environment `LGTEST_AUTOSTART` and `MUTTER_DEBUG_DUMMY_MODE_SPECS`; `LGTEST_DTD_DIR` is set internally. [tools/gnome-versions/run.sh:7-22, tools/gnome-versions/run.sh:29-33, tools/gnome-versions/run.sh:56, tools/gnome-versions/run.sh:90-97]
C3. Different versions use separate boxes and display names; two runs of one version share the box home, the log name and `lg<version>`; the runtime dir is per run. [tools/gnome-versions/run.sh:35, tools/gnome-versions/run.sh:114, tools/gnome-versions/run.sh:140, tools/gnome-versions/run.sh:147]
C4. GNOME 46-51, one distrobox each: `--devkit` for 49+ on a Wayland host, `--nested` for 46-48 on the host DISPLAY; sway gets size detection. Box distributions depend on `setup.sh`. [tools/gnome-versions/run.sh:12-16, tools/gnome-versions/run.sh:30-31, tools/gnome-versions/run.sh:60-82, tools/gnome-versions/run.sh:121-131]
C5. Bash, 179 lines; distrobox, npm, swaymsg and python3 for sizing, unzip, glib-compile-schemas, fusermount3 or fusermount, gsettings, pipewire, wireplumber, gnome-shell, tee. [tools/gnome-versions/run.sh:49, tools/gnome-versions/run.sh:57, tools/gnome-versions/run.sh:63-80, tools/gnome-versions/run.sh:85, tools/gnome-versions/run.sh:104-105, tools/gnome-versions/run.sh:116, tools/gnome-versions/run.sh:150-179]
C6. The box and its home (dconf, extensions, log) persist; the runtime dir is removed. [tools/gnome-versions/run.sh:3-4, tools/gnome-versions/run.sh:101-112, tools/gnome-versions/run.sh:147, tools/gnome-versions/run.sh:115-119]
C7. Not stated in the file.
