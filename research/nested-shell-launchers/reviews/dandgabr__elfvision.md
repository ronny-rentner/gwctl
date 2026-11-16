# dandgabr/elfvision `tools/nested-shell.sh`

## A. Shared with the real session

A1. HOME and all XDG dirs including XDG_RUNTIME_DIR point into a `mktemp -d` work dir; inside bwrap only `/usr`, `/etc/passwd`, `/etc/group`, the repo (read-only), the work dir, the host Wayland socket, a new `/proc` and a minimal `/dev` are visible, `/tmp` and `/run` are private tmpfs, and `env -i` drops TMPDIR; build.sh and the demo `gsettings` calls run outside bwrap. [tools/nested-shell.sh:21, tools/nested-shell.sh:32, tools/nested-shell.sh:42-48, tools/nested-shell.sh:54-59, tools/nested-shell.sh:65-71]
A2. `GSETTINGS_BACKEND=keyfile`; the demo keys are set before start with the repo's schemas. [tools/nested-shell.sh:47-60, tools/nested-shell.sh:74]
A3. A private session bus from `dbus-run-session` with tools/no-secrets-session.conf inside the namespaces; no activation-environment update; the bus config depends on that file. [tools/nested-shell.sh:65-67, tools/nested-shell.sh:71-77]
A4. A private `dbus-daemon` with the same config at `$XDG_RUNTIME_DIR/system-bus` serves as system bus; `/run` is a tmpfs. [tools/nested-shell.sh:67, tools/nested-shell.sh:79-83]
A5. Only the host Wayland socket is bound read-only at `/run/parent-wayland` and passed as WAYLAND_DISPLAY; `env -i` drops DISPLAY and `/tmp` is a private tmpfs. Xwayland is not disabled (no `--no-x11`). [tools/nested-shell.sh:23-30, tools/nested-shell.sh:67, tools/nested-shell.sh:70-77, tools/nested-shell.sh:92]
A6. Own runtime dir, private `/run`, `env -i`; no audio server is started and the host runtime dir is not mounted. [tools/nested-shell.sh:42-43, tools/nested-shell.sh:65-71]
A7. GNOME_KEYRING_CONTROL and SSH_AUTH_SOCK are unset, `env -i` passes a fixed list. [tools/nested-shell.sh:62-63, tools/nested-shell.sh:71-77]
A8. `GIO_USE_VFS=local`; bwrap gets `--dev /dev`; portals depend on no-secrets-session.conf. [tools/nested-shell.sh:48, tools/nested-shell.sh:67, tools/nested-shell.sh:74, tools/nested-shell.sh:77]
A9. `--die-with-parent` and `--unshare-all`; the inner trap kills its own jobs; no pkill; outer cleanup depends on private-session-cleanup.sh. [tools/nested-shell.sh:35-36, tools/nested-shell.sh:65, tools/nested-shell.sh:84, tools/nested-shell.sh:91]
A10. Not handled: no lock settings. [tools/nested-shell.sh:54-59]
A11. bwrap gets `--dev /dev`, and `__EGL_VENDOR_LIBRARY_FILENAMES` points at Mesa's EGL vendor file. [tools/nested-shell.sh:67, tools/nested-shell.sh:76]
A12. The extension is a symlink to the repo in the work data dir; enabling goes through D-Bus, not the host's settings; host config is not mounted. [tools/nested-shell.sh:39-43, tools/nested-shell.sh:65-70, tools/nested-shell.sh:99-100]
A13. `--unshare-all`; DATA_SOURCE must be `demo` and the data source key is set to `demo`; no downloads in the given file; build.sh runs outside bwrap and depends on build.sh. [tools/nested-shell.sh:14-17, tools/nested-shell.sh:21, tools/nested-shell.sh:51-54, tools/nested-shell.sh:65]

## B. Lifecycle

B1. Checks DATA_SOURCE, `/usr/libexec/mutter-devkit` (with a dnf hint), a valid host Wayland socket and `bwrap`, each with a message and exit 1; python3 is used unchecked; no GNOME version detection. [tools/nested-shell.sh:14-17, tools/nested-shell.sh:20, tools/nested-shell.sh:22, tools/nested-shell.sh:23-31]
B2. Depends on tools/build.sh, stdout discarded. [tools/nested-shell.sh:21]
B3. A fresh `mktemp -d` work dir per run; the cleanup trap is set only after sourcing the helper; removal depends on private-session-cleanup.sh. [tools/nested-shell.sh:32-36]
B4. `dbus-run-session --config-file` for the session bus; a private system bus polled up to 100 × 0.02 s, exiting 1 with its log if the daemon dies, or with "private system bus unavailable" if the socket is still missing. [tools/nested-shell.sh:77, tools/nested-shell.sh:79-90]
B5. data-source `demo` and, if given, demo-scenario from DEMO_SCENARIO via keyfile `gsettings` before start. [tools/nested-shell.sh:51-59]
B6. Symlinks the repo into the work extensions dir, with the UUID read from metadata.json by python3; the repo is bound read-only. [tools/nested-shell.sh:22, tools/nested-shell.sh:39-40, tools/nested-shell.sh:69]
B7. `EnableExtension` over D-Bus after the readiness poll; a failure ends the inner script under `set -e`, and its trap kills its jobs. [tools/nested-shell.sh:78, tools/nested-shell.sh:84, tools/nested-shell.sh:99-100]
B8. `gnome-shell --devkit --wayland --unsafe-mode` in the background with output discarded; no size or scale. [tools/nested-shell.sh:92]
B9. Polls `ListExtensions` on org.gnome.Shell up to 60 × 0.5 s. [tools/nested-shell.sh:94-98]
B10. With `prefs`, `OpenExtensionPrefs` after a fixed `sleep 2`; no other helpers; whether the session bus is reachable from outside depends on the listen address in no-secrets-session.conf. [tools/nested-shell.sh:60, tools/nested-shell.sh:77-78, tools/nested-shell.sh:101-105]
B11. Not handled: no reload; the build runs at start and the extension is a symlink to the repo. [tools/nested-shell.sh:21, tools/nested-shell.sh:40]
B12. Shell output and build stdout are discarded; the system bus log is printed only if that bus dies during the startup poll. [tools/nested-shell.sh:21, tools/nested-shell.sh:87, tools/nested-shell.sh:92]
B13. INT exits 130, TERM 143, EXIT runs the cleanup; `--die-with-parent`; the inner trap kills its jobs; the only timeout is the readiness loop. [tools/nested-shell.sh:36-38, tools/nested-shell.sh:65, tools/nested-shell.sh:84, tools/nested-shell.sh:91, tools/nested-shell.sh:94-98]
B14. Work dir removal depends on private-session-cleanup.sh; the inner trap kills background jobs and waits for them. [tools/nested-shell.sh:33-36, tools/nested-shell.sh:84, tools/nested-shell.sh:91]

## C. Properties

C1. Bound to this project: DATA_SOURCE, demo scenarios, schema `org.gnome.shell.extensions.gnome-ai-quota`, the project files build.sh, private-session-cleanup.sh and no-secrets-session.conf; the UUID is read from metadata.json. [tools/nested-shell.sh:14, tools/nested-shell.sh:21-22, tools/nested-shell.sh:35, tools/nested-shell.sh:54-57, tools/nested-shell.sh:77]
C2. `$1` `prefs`; environment DATA_SOURCE (only `demo`) and DEMO_SCENARIO (steady, flaky or drift per the comment). [tools/nested-shell.sh:6-7, tools/nested-shell.sh:14, tools/nested-shell.sh:52-54, tools/nested-shell.sh:60, tools/nested-shell.sh:101]
C3. Each run has its own work dir and namespaces; no fixed paths. [tools/nested-shell.sh:32, tools/nested-shell.sh:65]
C4. `--devkit`, Fedora-style package hint, `/usr/libexec` and `/lib64` layout, Mesa's EGL vendor file; needs a Wayland host socket; none of it is detected. [tools/nested-shell.sh:4, tools/nested-shell.sh:20, tools/nested-shell.sh:30, tools/nested-shell.sh:66, tools/nested-shell.sh:76, tools/nested-shell.sh:92]
C5. bash, bwrap, python3, dbus-run-session, dbus-daemon, gdbus, gsettings, gnome-shell, mutter-devkit, xargs, env, dirname, mktemp, mkdir, ln, seq, sleep, cat, none version-checked, plus build.sh, private-session-cleanup.sh and no-secrets-session.conf; 107 lines. [tools/nested-shell.sh:19, tools/nested-shell.sh:21-22, tools/nested-shell.sh:32, tools/nested-shell.sh:35, tools/nested-shell.sh:39-45, tools/nested-shell.sh:56-57, tools/nested-shell.sh:65-104]
C6. Nothing in the given file; work dir removal depends on private-session-cleanup.sh. [tools/nested-shell.sh:32-36]
C7. Not stated in the given file.
