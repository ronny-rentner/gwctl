# duboisf/vocis `Makefile`

## A. Shared with the real session

A1. `gnome-shell-nested` redirects nothing; `dev` points only XDG_CONFIG_HOME at a `mktemp -d` dir, while the extension sits in the real `$(HOME)/.local/share` and VOCIS_CONFIG points at the real config. [Makefile:12, Makefile:37-38, Makefile:62-64, Makefile:93-96]
A2. `gnome-shell-nested` keeps the real XDG_CONFIG_HOME; `dev` runs the private bus with the temp XDG_CONFIG_HOME. [Makefile:62-64, Makefile:93-97]
A3. Both targets use `dbus-run-session`, and `dev` runs `vocis serve` on that same private bus; the systemd user manager is not addressed. [Makefile:64, Makefile:97, Makefile:117-119]
A4. Not handled.
A5. `--nested --wayland` window on the host with DISPLAY and WAYLAND_DISPLAY inherited; `dev` starts `vocis serve` with the host's DISPLAY and WAYLAND_DISPLAY. [Makefile:63-64, Makefile:98-99, Makefile:118]
A6. Not handled; the real XDG_RUNTIME_DIR is inherited. [Makefile:63-64, Makefile:95-99]
A7. Not handled; the full environment is inherited. [Makefile:95-97]
A8. Not handled. [Makefile:92-122]
A9. `dev` keeps `$SHELL_PID` and `$VOCIS_PID`, kills only those on EXIT/INT/TERM and returns when either exits (`wait -n`); `gnome-shell-nested` has no process handling. [Makefile:99-108, Makefile:118-120]
A10. Not handled; a printed tip tells the user to disable the extension in the outer session. [Makefile:116]
A11. Not handled. [Makefile:63-64, Makefile:98-99]
A12. `install-extension` writes into the real extensions dir; `dev` enables only in its temp dconf; the crash flag is not handled. [Makefile:12, Makefile:36-38, Makefile:114-115]
A13. Not handled; `install` runs `go install`. [Makefile:16-17]

## B. Lifecycle

B1. Not handled; no tool or version checks. [Makefile:62-64, Makefile:92-122]
B2. `dev` → `install-extension` → `install` (`go install` with a git-describe version) and copies metadata.json and extension.js; `dev` then runs `./bin/vocis`, which only the `build` target produces and which is not a prerequisite. [Makefile:2-3, Makefile:16-21, Makefile:36-38, Makefile:92, Makefile:118]
B3. `dev` creates a new `mktemp -d -t vocis-dev-XXXXXX` per run and removes it in cleanup; `gnome-shell-nested` has no sandbox. [Makefile:93, Makefile:106]
B4. `dbus-run-session` in both targets. [Makefile:64, Makefile:97]
B5. Not handled; no settings are written before the shell starts. [Makefile:97-99]
B6. `install-extension` copies two files into the real `~/.local/share/gnome-shell/extensions/<uuid>`. [Makefile:12, Makefile:36-38]
B7. `dev` runs `gnome-extensions enable` after the wait loop and only prints a warning on failure. [Makefile:114-115]
B8. `gnome-shell --nested --wayland` with `MUTTER_DEBUG_DUMMY_MODE_SPECS=1280x800` as a literal in the recipe; no scale. [Makefile:63-64, Makefile:98-99]
B9. `dev` polls `gnome-extensions list` up to 5 times, 1 s apart, and proceeds after the last try regardless. [Makefile:109-113]
B10. `dev` starts `./bin/vocis serve` on the private bus; no other helpers. [Makefile:117-119]
B11. Not handled.
B12. Output goes to the terminal; `dev` prints that one of the two processes exited without naming which, and its last command is `echo`. [Makefile:120-121]
B13. `dev`: the trap covers EXIT, INT and TERM; `gnome-shell-nested` has no handling. [Makefile:102-108]
B14. `dev` kills its two PIDs, waits and removes the temp config; the installed extension stays and services the private bus started are not stopped. [Makefile:38, Makefile:102-107]

## C. Properties

C1. Bound to this project: APP, UUID, extension source and `vocis serve`. [Makefile:1, Makefile:10-11, Makefile:118]
C2. `make gnome-shell-nested` and `make dev`; no arguments, the make variables APP and EXTENSION_* can be overridden on the make command line. [Makefile:1, Makefile:10-12, Makefile:62, Makefile:92]
C3. `dev` runs get their own temp config and bus but share the real extensions dir. [Makefile:12, Makefile:93-97]
C4. No version or distro detection.
C5. GNU make, bash (`wait -n`), Go, `gnome-shell`, `dbus-run-session`, `gnome-extensions`, `mktemp`; the two nested targets are 3 and 31 lines of a 122-line Makefile. [Makefile:17, Makefile:62-64, Makefile:92-122]
C6. The extension in the real data dir and the `go install` binary; `dev`'s temp config is removed. [Makefile:17, Makefile:38, Makefile:106]
C7. Not stated; the file has no license header. [Makefile:1-122]
