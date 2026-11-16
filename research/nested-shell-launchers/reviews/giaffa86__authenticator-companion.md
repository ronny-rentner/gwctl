# giaffa86/authenticator-companion `tools/devkit-env.sh`

## A. Shared with the real session

A1. Not handled: HOME, XDG dirs, runtime dir and TMPDIR are inherited; installation depends on scripts/sync-extension.sh. [devkit-env.sh:23-24, devkit-env.sh:42]

A2. Not handled: adds the UUID to the real dconf enabled-extensions, never restored. [devkit-env.sh:26-36]

A3. Private bus via `dbus-run-session`, with the host bus address exported as HOST_DBUS_ADDRESS into it for provider_proxy.js to forward search-provider calls (depends on provider_proxy.js); the systemd user manager is not handled. [devkit-env.sh:5-9, devkit-env.sh:38-44]

A4. Not handled. [devkit-env.sh:42]

A5. `gnome-shell --devkit` with the host's display variables inherited. [devkit-env.sh:48]

A6. Not handled. [devkit-env.sh:42]

A7. The proxy reaches the host's Authenticator (depends on provider_proxy.js); other variables such as SSH_AUTH_SOCK are inherited. [devkit-env.sh:5-9, devkit-env.sh:40-44]

A8. Not handled. [devkit-env.sh:42]

A9. The proxy pid is killed after gnome-shell exits. [devkit-env.sh:43-51]

A10. Not handled.

A11. Not handled.

A12. The real enabled-extensions is changed; installation depends on sync-extension.sh; the crash flag is not handled. [devkit-env.sh:24, devkit-env.sh:28-36]

A13. Bridges to the host's Authenticator over the host bus (depends on provider_proxy.js). [devkit-env.sh:40, devkit-env.sh:44]

## B. Lifecycle

B1. Requires DBUS_SESSION_BUS_ADDRESS; no version detection. [devkit-env.sh:16-21]

B2. Depends on scripts/sync-extension.sh. [devkit-env.sh:24]

B3. Not handled.

B4. `exec dbus-run-session -- bash -c` starts the proxy in the background, then the shell. [devkit-env.sh:42-48]

B5. Appends the UUID to the real list by string surgery. [devkit-env.sh:28-36]

B6. Depends on scripts/sync-extension.sh. [devkit-env.sh:24]

B7. Through the real enabled-extensions key. [devkit-env.sh:28-36]

B8. `gnome-shell --devkit` without `--wayland`, default mode, no size or scale. [devkit-env.sh:48]

B9. Not handled: fixed `sleep 2` for the proxy only. [devkit-env.sh:46]

B10. Search provider bridged through provider_proxy.js (depends on it). [devkit-env.sh:44]

B11. Not handled.

B12. Output to the terminal; prints the proxy pid; the inner bash exits with gnome-shell's status through `exit "$RC"`. [devkit-env.sh:43, devkit-env.sh:47-51]

B13. No trap; when gnome-shell exits, the proxy is killed; no timeout. [devkit-env.sh:43-51]

B14. Only the proxy kill; the enabled-extensions change stays. [devkit-env.sh:48-50, devkit-env.sh:28-36]

## C. Properties

C1. Bound to authenticator-companion: UUID and provider_proxy.js. [devkit-env.sh:15, devkit-env.sh:44]

C2. No arguments or options; needs DBUS_SESSION_BUS_ADDRESS. [devkit-env.sh:11, devkit-env.sh:16-21]

C3. No fixed names in this file; the real dconf is shared. [devkit-env.sh:28-36]

C4. `gnome-shell --devkit`; no version check. [devkit-env.sh:48]

C5. bash, gsettings, gjs, dbus-run-session, gnome-shell; 52 lines. [devkit-env.sh:1, devkit-env.sh:28, devkit-env.sh:42-48]

C6. The real enabled-extensions change and installed files (depends on sync-extension.sh). [devkit-env.sh:24, devkit-env.sh:32, devkit-env.sh:34]

C7. Not stated in the given file.
