# rghvdberg/ntfy-indicator `tests/run-nested-shell.sh`

## A. Shared with the real session

A1. HOME, XDG_DATA_HOME and XDG_CONFIG_HOME point into a `mktemp -d` dir; XDG_CACHE_HOME and XDG_STATE_HOME are left as the host has them; XDG_RUNTIME_DIR and TMPDIR are inherited; the zip is packed into the repo's `build/`. [run-nested-shell.sh:12-18, run-nested-shell.sh:25-28]
A2. No GSETTINGS_BACKEND; schemas are compiled into the temp XDG_DATA_HOME. [run-nested-shell.sh:43-46, run-nested-shell.sh:84-92]
A3. dbus-run-session gives gsettings and the shell a private session bus; `gnome-extensions install` runs before it with the host session bus address still set; the systemd user manager is not addressed. [run-nested-shell.sh:34, run-nested-shell.sh:84]
A4. Not handled.
A5. `--devkit --wayland`; host display variables are inherited and Xwayland is not disabled. [run-nested-shell.sh:91]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [run-nested-shell.sh:25-28]
A7. Not handled; the host environment apart from HOME and two XDG dirs is inherited. [run-nested-shell.sh:25-28]
A8. Not handled.
A9. Cleanup runs `pkill -f "gnome-shell.*wayland"`. [run-nested-shell.sh:53-58]
A10. Not handled.
A11. Not handled.
A12. Deletes `/run/user/<uid>/gnome-shell-disable-extensions`; the nested settings enable only the extension. [run-nested-shell.sh:50, run-nested-shell.sh:85]
A13. NTFY_SERVER, NTFY_SELF_SIGNED and NTFY_CHANNELS from the environment preconfigure the extension's server; the network is not separated. [run-nested-shell.sh:66-83]

## B. Lifecycle

B1. None; after install it checks the extension dir and exits 1 with a message on stdout. [run-nested-shell.sh:37-41]
B2. `gnome-extensions pack -f -o build` with a list of extra sources, into the repo's `build/`. [run-nested-shell.sh:15-22]
B3. `mktemp -d` per run, removed by the EXIT trap; the trap is set after packing, install and schema compilation. [run-nested-shell.sh:25, run-nested-shell.sh:53-58]
B4. `dbus-run-session bash -c '…'` with the UUID, the PREP string and the schema as arguments, as the last command. [run-nested-shell.sh:84-92]
B5. Sets enabled-extensions, then runs the PREP string with `eval` to set server, accept-self-signed and channels, and prints the values. [run-nested-shell.sh:69-91]
B6. Copies the zip into the temp HOME, runs `gnome-extensions install -f`, checks the dir, copies the schema XML into `XDG_DATA_HOME/glib-2.0/schemas` and compiles it; a missing extension dir exits 1 with a message. [run-nested-shell.sh:30-46]
B7. gsettings enabled-extensions inside the bus and removal of the crash flag file; prints the key; no check that the extension loaded. [run-nested-shell.sh:50, run-nested-shell.sh:85, run-nested-shell.sh:90]
B8. `exec gnome-shell --devkit --wayland`; no size or scale. [run-nested-shell.sh:91]
B9. Not handled.
B10. Not handled beyond the preset server and channels. [run-nested-shell.sh:66-83]
B11. Not handled; each run repacks and reinstalls. [run-nested-shell.sh:15-22, run-nested-shell.sh:34]
B12. Prints the preset values before the start; terminal output only. [run-nested-shell.sh:87-92]
B13. Only an EXIT trap; no timeout. [run-nested-shell.sh:53-58]
B14. `pkill -f "gnome-shell.*wayland"` and `rm -rf "$NESTED_HOME"`; the zip in `build/` stays. [run-nested-shell.sh:12-18, run-nested-shell.sh:53-57]

## C. Properties

C1. Bound to ntfy-indicator: UUID, extra sources, schema and `NTFY_*` variables. [run-nested-shell.sh:11, run-nested-shell.sh:18-22, run-nested-shell.sh:69]
C2. No arguments; optional `NTFY_SERVER`, `NTFY_SELF_SIGNED`, `NTFY_CHANNELS` (comma list). [run-nested-shell.sh:66-83]
C3. Instances share `build/` and the crash flag file. [run-nested-shell.sh:12-18, run-nested-shell.sh:50]
C4. `--devkit --wayland`; the runtime dir is hardcoded as `/run/user/$(id -u)`; no version detection. [run-nested-shell.sh:50, run-nested-shell.sh:91]
C5. Bash; gnome-extensions, glib-compile-schemas, gsettings, dbus-run-session, gnome-shell, pkill, mktemp, id; 92 lines. [run-nested-shell.sh:1, run-nested-shell.sh:18, run-nested-shell.sh:25, run-nested-shell.sh:34, run-nested-shell.sh:46, run-nested-shell.sh:50, run-nested-shell.sh:55, run-nested-shell.sh:84-91]
C6. `build/<uuid>.shell-extension.zip` in the repo; the removed crash flag is not restored. [run-nested-shell.sh:12-18, run-nested-shell.sh:50]
C7. Not stated in the given file; it packs a file named `LICENSE` into the zip. [run-nested-shell.sh:22]
