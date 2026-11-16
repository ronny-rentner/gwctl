# markylaredo/myPets `tools/preview.sh`

## A. Shared with the real session

A1. Not handled: HOME, XDG dirs, runtime dir and TMPDIR are inherited; it requires the extension in the real `$XDG_DATA_HOME` extensions dir and logs to build/preview.log in the repo. [preview.sh:26-34, preview.sh:27, preview.sh:69-71]

A2. Not handled: it adds the UUID to the real dconf `enabled-extensions` and restores the saved value from a trap. [preview.sh:43-50, preview.sh:60]

A3. `dbus-run-session` gives the shell and the state query a private bus; the systemd user manager is not handled. [preview.sh:69-88]

A4. Not handled. [preview.sh:69]

A5. `gnome-shell --devkit --wayland`; requires WAYLAND_DISPLAY to be set, and the host's WAYLAND_DISPLAY and DISPLAY are inherited. [preview.sh:36-41, preview.sh:65-71]

A6. Not handled. [preview.sh:69]

A7. Not handled: the environment is inherited. [preview.sh:69]

A8. Not handled. [preview.sh:69]

A9. No setsid and no kill; the inner `gnome-shell ... &` is waited on. [preview.sh:69-72, preview.sh:87]

A10. Not handled.

A11. Not handled.

A12. The real shell's enabled-extensions key is changed for the run and restored on exit; the crash flag is not handled. [preview.sh:60, preview.sh:47]

A13. Not handled.

## B. Lifecycle

B1. Checks the installed metadata.json and WAYLAND_DISPLAY; no version detection, `--devkit` assumed. [preview.sh:31-41, preview.sh:71]

B2. Not handled: depends on ./install.sh. [preview.sh:32]

B3. Not handled.

B4. `dbus-run-session -- bash -c` starts the shell in the background inside. [preview.sh:69-72]

B5. Appends the UUID to the real enabled-extensions via a Python `ast.literal_eval` rewrite; `gsettings set` is unchecked (no `set -e`). [preview.sh:22, preview.sh:45, preview.sh:52-60]

B6. Depends on install.sh; only the presence of metadata.json is checked. [preview.sh:31-34]

B7. Through the real enabled-extensions key, see B5. [preview.sh:60]

B8. `gnome-shell --devkit --wayland`, default mode, no size or scale. [preview.sh:71]

B9. Fixed `sleep 12`, then one `GetExtensionInfo` call; prints the state or the raw reply. [preview.sh:74-85]

B10. Not handled.

B11. Not handled.

B12. Shell output and the inner stderr go to build/preview.log; afterwards it prints up to 5 log lines mentioning mypets with error, critical or TypeError. [preview.sh:71, preview.sh:88, preview.sh:91-97]

B13. The trap runs `restore` on INT and on EXIT; the INT trap does not exit; no timeout, no kill of the shell. [preview.sh:50]

B14. Only restores enabled-extensions and prints "Restored". [preview.sh:46-49]

## C. Properties

C1. Bound to myPets: UUID in shell and Python, log filter on "mypets". [preview.sh:24, preview.sh:55, preview.sh:91]

C2. No arguments, options or variables. [preview.sh:20]

C3. Fixed log path; each instance restores the list it read at its own start. [preview.sh:27, preview.sh:45, preview.sh:47]

C4. Wayland host with `gnome-shell --devkit`; no version check. [preview.sh:36-41, preview.sh:65-71]

C5. bash, python3, gsettings, gdbus, gnome-shell, dbus-run-session, grep; 97 lines. [preview.sh:1, preview.sh:45, preview.sh:52, preview.sh:69-76]

C6. build/preview.log. [preview.sh:27]

C7. GPL-2.0-or-later (SPDX header). [preview.sh:2]
