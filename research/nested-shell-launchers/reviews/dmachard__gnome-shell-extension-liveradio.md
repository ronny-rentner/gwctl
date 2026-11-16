# dmachard/gnome-shell-extension-liveradio `test-nested.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME and XDG_CONFIG_HOME point into `mktemp -d -t gnome-test-XXXXXX`; HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. [test-nested.sh:5, test-nested.sh:26-27]
A2. No GSETTINGS_BACKEND; the redirected XDG_CONFIG_HOME is in dbus-run-session's environment. [test-nested.sh:26-29]
A3. dbus-run-session gives gsettings and the shell a private session bus; the systemd user manager is not addressed. [test-nested.sh:28-31]
A4. Not handled.
A5. `--devkit --wayland`; host display variables are inherited and Xwayland is not disabled. [test-nested.sh:30]
A6. Not handled; the host XDG_RUNTIME_DIR is inherited. [test-nested.sh:26-28]
A7. Not handled; the full host environment is inherited. [test-nested.sh:26-28]
A8. Not handled.
A9. No process handling; gnome-shell replaces the inner bash through `exec`. [test-nested.sh:30]
A10. Not handled.
A11. Not handled.
A12. Enables only `liveradio@dmachard.dev` in the temp settings. [test-nested.sh:26-29]
A13. Not handled.

## B. Lifecycle

B1. Not handled.
B2. Copies six named files and the schema XML into the temp extension dir and compiles the schemas there. [test-nested.sh:12-20]
B3. New temp dir per run, removed by the EXIT trap. [test-nested.sh:5, test-nested.sh:9]
B4. `dbus-run-session bash -c "…"` as the last command. [test-nested.sh:28-31]
B5. Sets enabled-extensions only. [test-nested.sh:28-30]
B6. `cp` of the files into `$TMP_DIR/data/gnome-shell/extensions/<uuid>`. [test-nested.sh:6, test-nested.sh:15-16]
B7. gsettings inside the bus before `exec gnome-shell`; no check. [test-nested.sh:29-30]
B8. `gnome-shell --devkit --wayland`; no size or scale. [test-nested.sh:30]
B9. Not handled.
B10. Not handled.
B11. Not handled.
B12. Terminal output only. [test-nested.sh:28-31]
B13. Only an EXIT trap, which removes the temp dir; no timeout. [test-nested.sh:9]
B14. `rm -rf "$TMP_DIR"` on EXIT. [test-nested.sh:9]

## C. Properties

C1. Bound to liveradio: UUID and file list. [test-nested.sh:4, test-nested.sh:15]
C2. No arguments or variables.
C3. Each run has its own temp dir and bus; no fixed names. [test-nested.sh:5, test-nested.sh:28]
C4. `--devkit --wayland`, no version detection. [test-nested.sh:30]
C5. Bash; mktemp, cp, glib-compile-schemas, dbus-run-session, gsettings, gnome-shell; 31 lines. [test-nested.sh:1, test-nested.sh:5, test-nested.sh:15-20, test-nested.sh:28-30]
C6. Nothing; the temp dir is removed. [test-nested.sh:9]
C7. Not stated in the given file.
