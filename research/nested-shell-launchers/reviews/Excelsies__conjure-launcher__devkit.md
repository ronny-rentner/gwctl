# Excelsies/conjure-launcher `tools/devkit.sh`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is exported into a mktemp sandbox [devkit.sh:18, devkit.sh:45-46]. HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are the real ones.
A2. The exported XDG_CONFIG_HOME is inherited by dbus-run-session [devkit.sh:45, devkit.sh:49]; the code starts from an empty config dir and copies nothing [devkit.sh:46].
A3. `dbus-run-session` gives a private session bus [devkit.sh:49]. Systemd user manager: Not handled; XDG_RUNTIME_DIR is inherited [devkit.sh:49].
A4. Not handled.
A5. `--devkit --wayland` without a display name or `--no-x11` [devkit.sh:53]; the host's WAYLAND_DISPLAY and DISPLAY are inherited [devkit.sh:49-53].
A6. Not handled: XDG_RUNTIME_DIR is inherited [devkit.sh:49].
A7. Not handled: SSH_AUTH_SOCK, keyring variables and HOME are inherited [devkit.sh:49].
A8. Not handled.
A9. Processes are identified by the marker `CONJURE_SANDBOX=<sandbox>` in /proc/*/environ [devkit.sh:23-28, devkit.sh:49]; cleanup waits up to 15 s and warns, it kills nothing [devkit.sh:31-36]. INT, TERM and HUP are routed to exit [devkit.sh:43-44].
A10. Not handled.
A11. Not handled; only `SHELL_DEBUG=backtrace-warnings` is set [devkit.sh:47].
A12. Only this uuid is enabled in the sandbox dconf [devkit.sh:51-52]; tools/install.sh installs the extension outside the sandbox [devkit.sh:16]. Crash flag: Not handled; XDG_RUNTIME_DIR, XDG_DATA_HOME and XDG_CACHE_HOME are real [devkit.sh:45, devkit.sh:49].
A13. Depends on tools/install.sh [devkit.sh:16]; nothing in this file.

## B. Lifecycle

B1. Checks /usr/libexec/mutter-devkit and exits 1 with an apt hint [devkit.sh:12-15]; reads the uuid from metadata.json via `python3 -I` [devkit.sh:10]. No version detection.
B2. Depends on tools/install.sh, whose stdout is discarded [devkit.sh:16].
B3. A new `mktemp -d` sandbox each run, removed by the EXIT trap [devkit.sh:18, devkit.sh:37, devkit.sh:41].
B4. `env CONJURE_SANDBOX=... dbus-run-session -- bash -c`; its exit status becomes the script's through cleanup [devkit.sh:30, devkit.sh:39, devkit.sh:49].
B5. Sets enabled-extensions and disable-user-extensions on the private bus under `set -euo pipefail` [devkit.sh:50-53].
B6. Depends on tools/install.sh [devkit.sh:16].
B7. enabled-extensions is set to only this uuid [devkit.sh:51].
B8. `gnome-shell --devkit --wayland`; no size or scale [devkit.sh:53].
B9. Not handled.
B10. Not handled.
B11. Not handled: a new run runs install.sh again [devkit.sh:16].
B12. Output goes to the terminal with `SHELL_DEBUG=backtrace-warnings` [devkit.sh:47]; cleanup keeps the original exit status [devkit.sh:30, devkit.sh:39].
B13. INT exits 130, TERM and HUP exit 143, all through the EXIT trap [devkit.sh:41-44]. No timeout.
B14. Waits up to 30 × 0.5 s for marked processes, warns about leftovers, removes the sandbox with one retry and warns if it remains [devkit.sh:29-40]; leftover processes are not killed.

## C. Properties

C1. Generic mechanism; project-bound only through metadata.json for the uuid and the project's tools/install.sh [devkit.sh:10, devkit.sh:16].
C2. No arguments; TMPDIR chooses the sandbox location [devkit.sh:18].
C3. Sandbox and marker are unique per run and no display name is fixed [devkit.sh:18, devkit.sh:27, devkit.sh:53]; install.sh writes outside the sandbox [devkit.sh:16].
C4. GNOME Shell with `--devkit`; /usr/libexec path and apt hint for Debian/Ubuntu [devkit.sh:12-13]; Wayland [devkit.sh:53].
C5. Bash, python3, mutter-devkit, dbus-run-session, gsettings, gnome-shell, grep, cut, seq and /proc; 54 lines [devkit.sh:1, devkit.sh:10, devkit.sh:27, devkit.sh:31, devkit.sh:49-54].
C6. Nothing from the sandbox, unless its removal fails, which is reported [devkit.sh:37-38]; what install.sh installs stays [devkit.sh:16].
C7. Depends on the repository's license file; the script has no license header [devkit.sh:1-8].
