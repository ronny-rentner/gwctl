# voxik/gnome-shell-extension-auto-headphones `nested-gnome-shell`

## A. Shared with the real session

A1. Not handled; HOME, all XDG dirs and TMPDIR are inherited. [nested-gnome-shell:7]
A2. Not handled; the real XDG_CONFIG_HOME is inherited, only the bus is new. [nested-gnome-shell:7]
A3. `dbus-run-session` gives the shell its own session bus; the systemd user manager is not handled. [nested-gnome-shell:7]
A4. Not handled. [nested-gnome-shell:7]
A5. `gnome-shell --nested --wayland` with the inherited host display variables. [nested-gnome-shell:7]
A6. Not handled. [nested-gnome-shell:7]
A7. Not handled. [nested-gnome-shell:7]
A8. Not handled. [nested-gnome-shell:7]
A9. Not handled. [nested-gnome-shell:7]
A10. Not handled. [nested-gnome-shell:7]
A11. Not handled. [nested-gnome-shell:7]
A12. Not handled. [nested-gnome-shell:7]
A13. Not handled. [nested-gnome-shell:7]

## B. Lifecycle

B1. Not handled. [nested-gnome-shell:7]
B2. Not handled. [nested-gnome-shell:7]
B3. Not handled. [nested-gnome-shell:7]
B4. `dbus-run-session --`. [nested-gnome-shell:7]
B5. Not handled. [nested-gnome-shell:7]
B6. Not handled.
B7. Not handled. [nested-gnome-shell:7]
B8. `gnome-shell --nested --wayland`; size and scale not handled. [nested-gnome-shell:7]
B9. Not handled. [nested-gnome-shell:7]
B10. Not handled. [nested-gnome-shell:7]
B11. Not handled. [nested-gnome-shell:7]
B12. Output to the terminal; the exit status is that of `dbus-run-session`. [nested-gnome-shell:7]
B13. Not handled. [nested-gnome-shell:7]
B14. Not handled. [nested-gnome-shell:7]

## C. Properties

C1. Generic; nothing project-specific in the command. [nested-gnome-shell:7]
C2. None. [nested-gnome-shell:7]
C3. Each run gets its own bus; all files are shared. [nested-gnome-shell:7]
C4. `--nested --wayland`; no version handling. [nested-gnome-shell:7]
C5. Bash at `/usr/bin/bash`, dbus-run-session, gnome-shell; 7 lines. [nested-gnome-shell:1, nested-gnome-shell:7]
C6. Everything; the session uses the real dirs. [nested-gnome-shell:7]
C7. Depends on the repository's license file; the given file has no license notice. [nested-gnome-shell:1-7]
