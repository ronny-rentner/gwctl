# JayDoubleu/gnome-shell-extension-tailscale `test-nested.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_CACHE_HOME point into `mktemp -d /tmp/tailscale-ext-test.XXXXXX`; HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. [test-nested.sh:9, test-nested.sh:12-14]
A2. `GSETTINGS_BACKEND=keyfile` is exported before dbus-run-session; the script writes the keyfile in the temp config dir beforehand. [test-nested.sh:15, test-nested.sh:24-29, test-nested.sh:35]
A3. dbus-run-session gives the shell a private session bus; the systemd user manager is not addressed. [test-nested.sh:35]
A4. Not handled.
A5. `--devkit --wayland`; host display variables are inherited and Xwayland is not disabled. [test-nested.sh:35]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [test-nested.sh:12-15]
A7. Not handled; the full host environment is inherited. [test-nested.sh:12-15]
A8. Not handled.
A9. No process handling; dbus-run-session runs in the foreground. [test-nested.sh:35]
A10. Not handled.
A11. Not handled.
A12. The keyfile enables only the extension, disable-user-extensions is not set. [test-nested.sh:26-29]
A13. Not handled.

## B. Lifecycle

B1. None; a comment names `sudo dnf install mutter-devkit`. [test-nested.sh:3]
B2. None; the script's own dir is linked as is, without schema compilation. [test-nested.sh:6, test-nested.sh:20]
B3. New temp dir per run, removed on EXIT. [test-nested.sh:9-10]
B4. `dbus-run-session gnome-shell --devkit --wayland` as the last command. [test-nested.sh:35]
B5. Writes a keyfile with `enabled-extensions` only. [test-nested.sh:24-29]
B6. `ln -sfn` of the script's dir into the temp extension dir. [test-nested.sh:6, test-nested.sh:18-21]
B7. Through the keyfile; no check. [test-nested.sh:27-28]
B8. `gnome-shell --devkit --wayland`; no size or scale. [test-nested.sh:35]
B9. Not handled.
B10. Not handled.
B11. Not handled.
B12. Sets `G_MESSAGES_DEBUG=Tailscale` and `SHELL_DEBUG=all`; terminal output. [test-nested.sh:32-35]
B13. Only an EXIT trap in a `#!/bin/sh` script; no timeout. [test-nested.sh:1, test-nested.sh:10]
B14. `rm -rf "$XDG_HOME"` on EXIT. [test-nested.sh:10]

## C. Properties

C1. Bound to the Tailscale extension by UUID and debug domain. [test-nested.sh:5, test-nested.sh:32]
C2. No arguments or variables. [test-nested.sh:5-35]
C3. Each run has its own temp dir and bus. [test-nested.sh:9, test-nested.sh:35]
C4. Fedora install hint (`dnf`); `--devkit --wayland`; no version detection. [test-nested.sh:3, test-nested.sh:35]
C5. POSIX sh; mktemp, ln, dbus-run-session, gnome-shell, mutter-devkit; 35 lines. [test-nested.sh:1, test-nested.sh:3, test-nested.sh:9, test-nested.sh:20, test-nested.sh:35]
C6. Nothing; the temp dir is removed. [test-nested.sh:10]
C7. Not stated in the given file.
