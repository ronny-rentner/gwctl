# mauriciobc/gnome-extension-milkdrop-viz `tools/debug_nested.sh`

## A. Shared with the real session

A1. Not handled: HOME, XDG dirs, runtime dir and TMPDIR are inherited; the log is `./nested_shell.log` in the cwd. [debug_nested.sh:3, debug_nested.sh:21]

A2. Not handled: sets `org.gnome.shell.extensions.milkdrop enabled` and adds the UUID to `enabled-extensions` in the real dconf, never restored. [debug_nested.sh:7, debug_nested.sh:11-19]

A3. `dbus-run-session` private bus; the systemd user manager is not handled. [debug_nested.sh:21]

A4. Not handled. [debug_nested.sh:21]

A5. `gnome-shell --devkit --wayland` with the host's display variables inherited. [debug_nested.sh:21]

A6. Not handled. [debug_nested.sh:21]

A7. Not handled: the environment is inherited. [debug_nested.sh:21]

A8. Not handled. [debug_nested.sh:21]

A9. `$!` is the `dbus-run-session` pid, and only that pid gets `kill` (TERM), not gnome-shell. [debug_nested.sh:21-22, debug_nested.sh:26]

A10. Not handled.

A11. Not handled.

A12. The real `enabled-extensions` gains the UUID permanently; the crash flag is not handled. [debug_nested.sh:19]

A13. Not handled.

## B. Lifecycle

B1. Not handled.

B2. Not handled.

B3. Not handled.

B4. `dbus-run-session -- env G_MESSAGES_DEBUG=all gnome-shell ...` in the background. [debug_nested.sh:21]

B5. Writes the real dconf: the renderer key and enabled-extensions, edited as a string from `gsettings get` output with `@as []` handled. [debug_nested.sh:7, debug_nested.sh:11-19]

B6. Not handled: assumes the extension is installed. [debug_nested.sh:8-9]

B7. Through the real enabled-extensions key. [debug_nested.sh:19]

B8. `--devkit --wayland`, default mode, no size or scale. [debug_nested.sh:21]

B9. Not handled: fixed `sleep 45`. [debug_nested.sh:23-24]

B10. Not handled.

B11. Not handled.

B12. All output with G_MESSAGES_DEBUG=all goes to ./nested_shell.log, deleted at start; the exit status is not captured. [debug_nested.sh:3-4, debug_nested.sh:21, debug_nested.sh:27]

B13. After 45 s it sends TERM to the dbus-run-session pid; no trap. [debug_nested.sh:24-26]

B14. Not handled: settings and log stay. [debug_nested.sh:7, debug_nested.sh:19]

## C. Properties

C1. Bound to milkdrop: UUID and schema key are fixed. [debug_nested.sh:7, debug_nested.sh:9]

C2. No arguments, options or variables.

C3. Fixed log name in the cwd and shared real dconf. [debug_nested.sh:3, debug_nested.sh:19]

C4. Requires `gnome-shell --devkit`; no version check. [debug_nested.sh:21]

C5. bash, gsettings, dbus-run-session, gnome-shell; 27 lines. [debug_nested.sh:1, debug_nested.sh:7, debug_nested.sh:21]

C6. The real dconf changes and the log file. [debug_nested.sh:7, debug_nested.sh:19, debug_nested.sh:3]

C7. Not stated in the given file.
