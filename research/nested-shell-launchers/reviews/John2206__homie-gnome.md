# John2206/homie-gnome `tools/nested.sh`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to the fixed `/tmp/homie-nested/config`; HOME, XDG_DATA_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR stay real. [nested.sh:11-14]
A2. DCONF_PROFILE names a profile with only `user-db:homienested`, exported before `dbus-run-session`. [nested.sh:13-16]
A3. `dbus-run-session` after the exports; the systemd user manager is not handled. [nested.sh:14-16]
A4. Not handled. [nested.sh:10-22]
A5. `gnome-shell --devkit` with the inherited host display variables; Xwayland not disabled. [nested.sh:22]
A6. Not handled. [nested.sh:10-22]
A7. Not handled. [nested.sh:10-22]
A8. Not handled. [nested.sh:10-22]
A9. Not handled; `exec` chain without kills. [nested.sh:16, nested.sh:22]
A10. Not handled. [nested.sh:10-22]
A11. Not handled. [nested.sh:10-22]
A12. No install or enable; XDG_DATA_HOME is real. Crash flag not handled; XDG_CACHE_HOME, XDG_STATE_HOME and XDG_RUNTIME_DIR are real. [nested.sh:13-15]
A13. Not handled. [nested.sh:10-22]

## B. Lifecycle

B1. Not handled. [nested.sh:10-22]
B2. Not handled. [nested.sh:10-22]
B3. Reuses `/tmp/homie-nested`; the profile and env file are rewritten each run, the dconf db persists; no reset. [nested.sh:11-13, nested.sh:17]
B4. `exec dbus-run-session bash -c`. [nested.sh:16]
B5. Not handled. [nested.sh:10-22]
B6. Not handled. [nested.sh:10-22]
B7. Not handled. [nested.sh:10-22]
B8. `gnome-shell --devkit`; size and scale not handled. [nested.sh:22]
B9. Not handled. [nested.sh:22]
B10. Writes `/tmp/homie-nested/env` with XDG_CONFIG_HOME, DCONF_PROFILE and the nested DBUS_SESSION_BUS_ADDRESS, to be sourced by outside commands. [nested.sh:9, nested.sh:16-22]
B11. Not handled. [nested.sh:10-22]
B12. Output to the terminal; the exit status passes through `exec`. [nested.sh:16, nested.sh:22]
B13. Not handled. [nested.sh:16-22]
B14. Not handled; the env file keeps the bus address. [nested.sh:17-21]

## C. Properties

C1. Generic; only the dir and db names refer to the project. [nested.sh:11-13]
C2. None: no arguments or variables; usage only in a comment. [nested.sh:9]
C3. No: the dir and env file are fixed and overwritten by each run. [nested.sh:11, nested.sh:17]
C4. GNOME 49+ per comment, `--devkit`. [nested.sh:2, nested.sh:22]
C5. Bash, dbus-run-session, gnome-shell; 22 lines. [nested.sh:1, nested.sh:16, nested.sh:22]
C6. `/tmp/homie-nested` with the dconf db, profile and env file. [nested.sh:11-21]
C7. Depends on the repository's license file; the given file has no license notice. [nested.sh:1-22]
