# kaorii-ako/nublet `dev/nested.sh`

## A. Shared with the real session

A1. XDG_CONFIG_HOME and XDG_DATA_HOME point into `${XDG_CACHE_HOME:-$HOME/.cache}/nublet-nested`, set in front of dbus-run-session. Depends on the distrobox container `nublet-dev` for what else is shared; the script changes neither HOME nor XDG_RUNTIME_DIR. [nested.sh:5, nested.sh:13-14, nested.sh:18, nested.sh:11]
A2. dconf stays the backend; the state config dir is set as XDG_CONFIG_HOME before the bus. GSETTINGS_SCHEMA_DIR is set to the checkout's schemas dir. [nested.sh:13, nested.sh:18, nested.sh:15]
A3. The shell runs under dbus-run-session inside the container. The systemd user manager is not touched. [nested.sh:11-18]
A4. The host system bus is passed in explicitly through `/run/host/run/dbus/system_bus_socket`. [nested.sh:12]
A5. Not handled; depends on distrobox. [nested.sh:11]
A6. Not handled; depends on distrobox for the runtime dir sockets. [nested.sh:11]
A7. Not handled; depends on distrobox for SSH_AUTH_SOCK and the keyring. [nested.sh:11]
A8. Not handled; depends on distrobox. [nested.sh:11]
A9. Not handled; no trap, PIDs or kill patterns. [nested.sh:11-24]
A10. Not handled. [nested.sh:23]
A11. Not handled; depends on distrobox for device access. [nested.sh:11]
A12. After the run, the script deletes `$XDG_RUNTIME_DIR/gnome-shell-disable-extensions` in the real runtime dir. The nested shell enables only nublet and resets disabled-extensions. [nested.sh:26, nested.sh:19-21]
A13. No downloads or tokens; the host time zone comes from `timedatectl`. [nested.sh:17]

## B. Lifecycle

B1. No prerequisite or version checks; depends on the `nublet-dev` distrobox container. [nested.sh:11]
B2. `glib-compile-schemas` into the checkout's schemas dir; failure ends the script via `set -e`. [nested.sh:2, nested.sh:9]
B3. The state dir is created if missing and reused; no reset. [nested.sh:5, nested.sh:7]
B4. `dbus-run-session` inside the container; its failure, like that of the whole `distrobox enter`, is discarded by `|| true`. [nested.sh:18, nested.sh:24]
B5. Inside the bus: disable-user-extensions false, reset disabled-extensions, enabled-extensions nublet, font-family from NUBLET_FONT. The inner `sh -c` has no `set -e`. [nested.sh:19-22, nested.sh:18-23]
B6. A symlink from the state extension dir to the checkout; failure ends the script via `set -e`. [nested.sh:8, nested.sh:2]
B7. Through `gsettings set ... enabled-extensions` and `disable-user-extensions false`. [nested.sh:19-21]
B8. `gnome-shell --devkit --wayland` with no size or scale options. [nested.sh:23]
B9. Not handled.
B10. Not handled; no prefs, eval, screenshot or external control.
B11. Not handled.
B12. Output goes to the terminal; the exit status of the whole `distrobox enter` is discarded by `|| true`. [nested.sh:24]
B13. Not handled: no trap or timeout.
B14. Removes the crash flag; the state dir and symlink stay. [nested.sh:26, nested.sh:7-8]

## C. Properties

C1. Bound to this project: UUID, container name, NUBLET_FONT key. [nested.sh:8, nested.sh:11, nested.sh:22]
C2. No arguments; reads NUBLET_FONT, XDG_CACHE_HOME and XDG_RUNTIME_DIR. [nested.sh:5, nested.sh:16, nested.sh:26]
C3. No: one fixed state dir, and the crash-flag removal is shared. [nested.sh:5, nested.sh:26]
C4. Depends on the `nublet-dev` container's GNOME Shell; uses `--devkit --wayland`. Uses distrobox and timedatectl on the host. [nested.sh:11, nested.sh:23, nested.sh:17]
C5. POSIX sh, distrobox, glib-compile-schemas, timedatectl, dbus-run-session, gsettings, gnome-shell. 26 lines. [nested.sh:1, nested.sh:9-23]
C6. The state dir with its dconf database and symlink, and compiled schemas in the checkout. [nested.sh:7-9]
C7. Not stated in the script.
