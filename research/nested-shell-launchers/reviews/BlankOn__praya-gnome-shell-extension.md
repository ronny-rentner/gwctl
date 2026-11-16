# BlankOn/praya-gnome-shell-extension `tools/run-devkit.sh`

## A. Shared with the real session

A1. Depends on `tools/dev-datahome.sh`: the file sources it and redirects nothing itself. [tools/run-devkit.sh:16]
A2. Depends on `tools/dev-datahome.sh` and `make run-mutter-devkit`: the file sets no config or dconf variable before `gnome-extensions enable`. [tools/run-devkit.sh:16, tools/run-devkit.sh:39]
A3. Depends on `make run-mutter-devkit`; the file starts no bus and does not touch the systemd user manager. [tools/run-devkit.sh:6-8]
A4. Not handled.
A5. Not separated: `gnome-shell --devkit --wayland` runs with the inherited host display variables. [tools/run-devkit.sh:30]
A6. Not handled. [tools/run-devkit.sh:30]
A7. Not handled: the environment is inherited. [tools/run-devkit.sh:30]
A8. Not handled.
A9. `cleanup` kills only `$SHELL_PID`, then a bare `wait` waits for all children; no process groups. [tools/run-devkit.sh:19-26]
A10. Not handled.
A11. Not handled.
A12. Depends on `tools/dev-datahome.sh`; the crash flag is not handled. [tools/run-devkit.sh:16]
A13. Not handled: no downloads or tokens.

## B. Lifecycle

B1. Not handled: no tool or version checks; UUID comes from `$UUID` or `tools/uuid.sh`. [tools/run-devkit.sh:12-13]
B2. Not handled.
B3. Depends on `tools/dev-datahome.sh`. [tools/run-devkit.sh:16]
B4. Depends on `make run-mutter-devkit`. [tools/run-devkit.sh:6-8]
B5. Not handled.
B6. Depends on `tools/dev-datahome.sh`. [tools/run-devkit.sh:15-16]
B7. When `gnome-extensions list` shows the UUID it runs `gnome-extensions enable`, failure ignored with `|| true`; if the UUID never appears the loop ends silently. [tools/run-devkit.sh:33-43]
B8. `gnome-shell --devkit --wayland` in the background; no size or scale. [tools/run-devkit.sh:30-31]
B9. Polls `gnome-extensions list` for the UUID every 0.5 s, up to 60 times, no message on timeout. [tools/run-devkit.sh:36-43]
B10. Not handled.
B11. Not handled.
B12. Shell output goes to the terminal; `cleanup` always exits 0. [tools/run-devkit.sh:30, tools/run-devkit.sh:25, tools/run-devkit.sh:45]
B13. Ctrl+C or TERM runs `cleanup`, which kills the shell and waits; after `wait "$SHELL_PID"` the EXIT trap runs `cleanup`; no timeout. [tools/run-devkit.sh:19-27, tools/run-devkit.sh:45]
B14. Kills the shell; directory cleanup depends on `tools/dev-datahome.sh`. [tools/run-devkit.sh:23, tools/run-devkit.sh:16]

## C. Properties

C1. Bound to this repo's layout: `tools/uuid.sh`, `tools/dev-datahome.sh`; Praya appears only in comments, the messages are generic; the UUID can be overridden. [tools/run-devkit.sh:3, tools/run-devkit.sh:11-16, tools/run-devkit.sh:22, tools/run-devkit.sh:29]
C2. No arguments; environment variable `UUID`. [tools/run-devkit.sh:13]
C3. Depends on `tools/dev-datahome.sh` and the make target.
C4. `--devkit`; no distribution check; the host display is whatever the inherited display variables name. [tools/run-devkit.sh:30]
C5. Bash, 45 lines; gnome-shell, gnome-extensions, seq, grep, plus `tools/uuid.sh`, `tools/dev-datahome.sh` and `dbus-run-session` from make. [tools/run-devkit.sh:13, tools/run-devkit.sh:16, tools/run-devkit.sh:30, tools/run-devkit.sh:36-39]
C6. Depends on `tools/dev-datahome.sh`.
C7. Not stated in the file.
