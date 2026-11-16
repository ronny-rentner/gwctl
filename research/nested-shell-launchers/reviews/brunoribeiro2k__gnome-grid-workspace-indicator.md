# brunoribeiro2k/gnome-grid-workspace-indicator `scripts/nested-shell.sh`

## A. Shared with the real session

A1. XDG_CONFIG/DATA/CACHE/STATE_HOME are exported to a fresh `dist/nested/` in the repo before the bus starts; HOME, XDG_RUNTIME_DIR and TMPDIR stay real. An installed Workspace Matrix is copied, read only, from the real data dir. [scripts/nested-shell.sh:47-49, scripts/nested-shell.sh:71-72, scripts/nested-shell.sh:53-55]
A2. The XDG variables are exported before `dbus-run-session`; the inner stage activates dconf-service with a Ping, reads its `/proc/<pid>/environ` and aborts unless XDG_CONFIG_HOME matches. Real Workspace Matrix settings are read with `gsettings get`, never written. [scripts/nested-shell.sh:68-72, scripts/nested-shell.sh:19-26, scripts/nested-shell.sh:56-57]
A3. `exec dbus-run-session` runs the inner stage and the shell; the XDG dirs, BUNDLE, UUID, FLAG and WSM_* are exported before it; the systemd user manager is not touched. [scripts/nested-shell.sh:80, scripts/nested-shell.sh:52, scripts/nested-shell.sh:71-73, scripts/nested-shell.sh:77]
A4. Not handled.
A5. Not separated: the shell runs with `--devkit` or `--nested` and `--wayland`, with DISPLAY, WAYLAND_DISPLAY and XDG_RUNTIME_DIR inherited; `--wayland` comes without `--no-x11`. [scripts/nested-shell.sh:40, scripts/nested-shell.sh:76-78, scripts/nested-shell.sh:71-72]
A6. Not handled: XDG_RUNTIME_DIR stays real. [scripts/nested-shell.sh:71-72]
A7. Not handled: HOME and the environment, SSH_AUTH_SOCK and keyring variables included, are inherited. [scripts/nested-shell.sh:80]
A8. Not handled: XDG_RUNTIME_DIR stays real. [scripts/nested-shell.sh:71-72]
A9. No kills, signal handling or process groups; the script replaces itself with `dbus-run-session`, the inner stage replaces itself with the shell. [scripts/nested-shell.sh:40, scripts/nested-shell.sh:80]
A10. Not handled.
A11. Not handled.
A12. Both extensions go into the private data dir and `enabled-extensions` into the private dconf. The crash flag is not handled. [scripts/nested-shell.sh:28-29, scripts/nested-shell.sh:37]
A13. Without a local Workspace Matrix or `WSMATRIX_ZIP`, it queries extensions.gnome.org with `curl` and downloads the zip into `dist/cache` without an integrity check; no tokens. [scripts/nested-shell.sh:58-66]

## B. Lifecycle

B1. The GNOME major version is read from `gnome-shell --version` by the outer stage only for the EGO download and by the inner stage for the Workspace Matrix version check; the outer stage picks `--devkit` or `--nested` from `gnome-shell --help` and exits 2 if the bundle is missing; tools are not checked, `set -e` stops on a failure. The inner stage exits 1 when dconf-service runs with another XDG_CONFIG_HOME. [scripts/nested-shell.sh:15, scripts/nested-shell.sh:34, scripts/nested-shell.sh:59, scripts/nested-shell.sh:76-78, scripts/nested-shell.sh:44-45, scripts/nested-shell.sh:25-26]
B2. `make nested` depends on `bundle`: compile schemas, write `build-info.txt`, `gnome-extensions pack`. A failing `glib-compile-schemas` is masked by `|| echo "No schemas directory present."`. [Makefile:37-38, Makefile:41-44, Makefile:18-19, Makefile:22-25]
B3. Each run deletes and recreates `dist/nested` with config, data, cache and state; the Workspace Matrix zip in `dist/cache` is reused. [scripts/nested-shell.sh:47-49, scripts/nested-shell.sh:62-65]
B4. The script re-executes itself under `dbus-run-session` with `--inside`, then activates dconf-service explicitly and checks its environment. [scripts/nested-shell.sh:80, scripts/nested-shell.sh:18-26]
B5. `gsettings` sets Workspace Matrix rows and columns, `disable-extension-version-validation` when Workspace Matrix does not list the version, `enabled-extensions` and `welcome-dialog-last-shown-version`; `set -e` aborts on failure. [scripts/nested-shell.sh:30-38]
B6. `gnome-extensions install --force` installs the bundle and the Workspace Matrix zip into the private data dir, or the installed Workspace Matrix is copied there. A missing Workspace Matrix zip is skipped without a message. [scripts/nested-shell.sh:28-32, scripts/nested-shell.sh:55, scripts/nested-shell.sh:63-65]
B7. `enabled-extensions` is written before the shell starts; `set -e` stops on failure. [scripts/nested-shell.sh:37, scripts/nested-shell.sh:15]
B8. `exec gnome-shell "$FLAG" --wayland` with `--devkit` or `--nested`; scale not handled. [scripts/nested-shell.sh:40, scripts/nested-shell.sh:76-78]
B9. Not handled: no readiness check for the shell, only dconf-service is checked before use; the settings are in place before the shell starts. [scripts/nested-shell.sh:21-26, scripts/nested-shell.sh:37-40]
B10. Not handled: nothing runs after `exec gnome-shell`. [scripts/nested-shell.sh:40]
B11. Not handled; `make nested` rebuilds the bundle and resets the state. [Makefile:37-38]
B12. Shell output goes to the terminal after one summary line; own errors go to stderr. [scripts/nested-shell.sh:39-40, scripts/nested-shell.sh:26, scripts/nested-shell.sh:45, scripts/nested-shell.sh:61]
B13. Not handled: no traps and no timeout.
B14. Not handled at exit: the state dir is removed at the start of the next run; nothing is unmounted. [scripts/nested-shell.sh:48]

## C. Properties

C1. Bound to this project: the bundle is an argument, but the UUID to enable comes from the repo's `metadata.json`, not from the bundle, and the default bundle name and the Workspace Matrix setup, run on every start, are project-specific. [scripts/nested-shell.sh:44, scripts/nested-shell.sh:74, scripts/nested-shell.sh:52-66]
C2. Optional bundle zip argument, resolved after `cd` to the repo root; `WSMATRIX_ZIP` and `MUTTER_DEBUG_DUMMY_MODE_SPECS`; internal `--inside`; normally `make nested`. [scripts/nested-shell.sh:9-12, scripts/nested-shell.sh:18, scripts/nested-shell.sh:44, scripts/nested-shell.sh:52, Makefile:37-38]
C3. No: the state dir is the fixed `dist/nested`, removed at every start. [scripts/nested-shell.sh:47-48]
C4. `--devkit` when `gnome-shell --help` lists it, else `--nested`; Workspace Matrix is fetched for the detected major version. Distributions and display servers are not stated; no check of the host display. [scripts/nested-shell.sh:76-78, scripts/nested-shell.sh:59-60]
C5. Bash (brace expansion, here-strings, pipefail), 80 lines, plus a 75-line Makefile; dbus-run-session, gdbus, gnome-shell, gnome-extensions, gsettings, jq, curl, realpath, grep, tr, tail, head, glib-compile-schemas, git, GNU `grep -P`, without version checks. [scripts/nested-shell.sh:15, scripts/nested-shell.sh:21-25, scripts/nested-shell.sh:34-35, scripts/nested-shell.sh:44, scripts/nested-shell.sh:49, scripts/nested-shell.sh:60-62, Makefile:3, Makefile:19, Makefile:23]
C6. `dist/nested` until the next run, Workspace Matrix zips in `dist/cache`, the bundle, `build-info.txt` and compiled schemas. [scripts/nested-shell.sh:47, scripts/nested-shell.sh:62, Makefile:19, Makefile:25, Makefile:44]
C7. Not stated in these files; the bundle includes a `LICENSE` file. [Makefile:11]
