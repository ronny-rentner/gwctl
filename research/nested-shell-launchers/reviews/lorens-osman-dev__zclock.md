# lorens-osman-dev/zclock `scripts/dev.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_DATA_HOME and XDG_CACHE_HOME are exported into a mktemp dir [dev.sh:7, dev.sh:9-11]. HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are real.
A2. The exported XDG_CONFIG_HOME reaches dbus-run-session [dev.sh:9, dev.sh:17].
A3. `dbus-run-session` with the exported XDG dirs [dev.sh:9-11, dev.sh:17]. Systemd user manager: Not handled; XDG_RUNTIME_DIR is inherited [dev.sh:17].
A4. Not handled.
A5. `--devkit --wayland` without a display name or `--no-x11` [dev.sh:18]; the host's display variables are inherited [dev.sh:17].
A6. Not handled: XDG_RUNTIME_DIR is inherited [dev.sh:17].
A7. Not handled: SSH_AUTH_SOCK, keyring variables and HOME are inherited [dev.sh:17].
A8. Not handled.
A9. The inner EXIT trap kills the shell by PID [dev.sh:18-20]; the outer EXIT trap only removes the dir [dev.sh:8]; no signal traps, no pkill.
A10. Not handled.
A11. Not handled.
A12. The extension is copied from `dists/dist-dev` into the redirected data dir [dev.sh:12-14]. Crash flag: Not handled; XDG_RUNTIME_DIR is inherited [dev.sh:17].
A13. Not handled.

## B. Lifecycle

B1. Not handled: no devkit check; node is used to find the temp dir [dev.sh:7].
B2. Depends on a prior build of `dists/dist-dev` [dev.sh:14]; `glib-compile-schemas --strict` on the copy [dev.sh:15].
B3. A new mktemp dir each run, removed on EXIT [dev.sh:7-8].
B4. `dbus-run-session -- bash -euc` [dev.sh:17].
B5. Not handled.
B6. `cp -r` into the sandbox data dir [dev.sh:14].
B7. `gnome-extensions enable` after the readiness poll; on failure only the message is skipped [dev.sh:31].
B8. `gnome-shell --devkit --wayland`; no size or scale [dev.sh:18].
B9. Polls NameHasOwner for org.gnome.Shell.Extensions every 0.5 s up to 60 times [dev.sh:22-29].
B10. Not handled.
B11. Not handled.
B12. All output passes through `grep`, which keeps only lines with "zclock" or ">>>" [dev.sh:33].
B13. The inner EXIT trap kills the shell [dev.sh:20]. No timeout.
B14. `rm -rf "$ROOT"` on EXIT; the shell is killed by the inner trap [dev.sh:8, dev.sh:20].

## C. Properties

C1. Bound to zclock: uuid, dist path and grep filter [dev.sh:6, dev.sh:14, dev.sh:33].
C2. No arguments; TMPDIR, read through node's `os.tmpdir()`, chooses the sandbox location [dev.sh:7].
C3. Unique dir, no fixed display name [dev.sh:7, dev.sh:18].
C4. `--devkit`, Wayland; no distribution checks [dev.sh:18].
C5. Bash, node, glib-compile-schemas, dbus-run-session, gnome-shell, gdbus, gnome-extensions, GNU grep and seq; 33 lines [dev.sh:1-33].
C6. Nothing [dev.sh:8].
C7. Depends on the repository's license file; the script has no license header [dev.sh:1-3].
