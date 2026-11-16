# Shahriyar31/eureka `dev/run-test.sh`

## A. Shared with the real session

A1. Only XDG_CONFIG_HOME is redirected, to `$WORK/config`; XDG_DATA_HOME, cache, state, runtime dir, HOME and TMPDIR are inherited. Both extensions are symlinked into the real `$HOME/.local/share/gnome-shell/extensions`, and `glib-compile-schemas` writes into the source tree. [run-test.sh:6-11, run-test.sh:15]
A2. XDG_CONFIG_HOME is set before `dbus-run-session`; GSETTINGS_BACKEND and DCONF_PROFILE are inherited. [run-test.sh:15]
A3. `dbus-run-session` gives a private session bus; the systemd user manager is not addressed. [run-test.sh:15]
A4. Not handled; the host system bus is inherited. [run-test.sh:15]
A5. `--devkit --wayland --no-x11 --virtual-monitor 1536x960`; no socket name is set. [run-test.sh:18]
A6. Not handled; runtime dir and audio variables are inherited. [run-test.sh:15]
A7. Not handled; SSH_AUTH_SOCK and keyring variables are inherited, no `env -i`. [run-test.sh:15]
A8. Not handled. [run-test.sh:15]
A9. `timeout 120` bounds the shell; no PIDs, traps or kill patterns. [run-test.sh:18]
A10. Not handled.
A11. Not handled. [run-test.sh:18]
A12. Both extensions are installed into the real extensions dir; `eureka-devtest@local` is removed after the run, `eureka@shahriyar31.github.io` stays. The real dconf is not written; the crash flag is not addressed. [run-test.sh:10-11, run-test.sh:20]
A13. No downloads; the queries from $1 go to the test extension; what they trigger Depends on `dev/eureka-devtest@local`. [run-test.sh:3, run-test.sh:14]

## B. Lifecycle

B1. Not handled; no tool or version check.
B2. Compiles the extension's schemas in the source tree. [run-test.sh:8]
B3. WORK is `$EUREKA_WORK` or a new `mktemp -d`; it is never reset or deleted. [run-test.sh:6-7]
B4. `env XDG_CONFIG_HOME=... dbus-run-session`. [run-test.sh:15]
B5. `dconf write` sets enabled-extensions and color-scheme (prefer-dark for `dark`, else default). [run-test.sh:12, run-test.sh:15-17]
B6. `ln -sfn` into the real extensions dir; the dir is not created. [run-test.sh:9-11]
B7. Through enabled-extensions before the shell starts; no check in the file that they became active. [run-test.sh:16]
B8. Devkit, Wayland only, virtual monitor 1536x960, `timeout 120`; scale not set. [run-test.sh:18]
B9. Not handled in the file; depends on `dev/eureka-devtest@local`. [run-test.sh:11, run-test.sh:16]
B10. Queries and screenshot dir are passed as EUREKA_QUERIES and EUREKA_SHOTS; typing and screenshots depend on `dev/eureka-devtest@local`. [run-test.sh:14]
B11. Not handled.
B12. All output goes to `$WORK/shell.log`; lines matching DEVTEST, JS ERROR or `Eureka:` are printed. [run-test.sh:19, run-test.sh:21-22]
B13. `timeout 120`; no trap. [run-test.sh:18]
B14. Removes only the devtest symlink; the eureka symlink, the WORK dir and the compiled schemas remain. [run-test.sh:8, run-test.sh:10, run-test.sh:20]

## C. Properties

C1. Bound to Eureka: UUIDs, EUREKA_* variables and the devtest extension. [run-test.sh:10-11, run-test.sh:14, run-test.sh:16]
C2. $1 queries separated by `;` (required), $2 `dark|light`, environment variable EUREKA_WORK. [run-test.sh:3, run-test.sh:6, run-test.sh:12, run-test.sh:14]
C3. WORK is unique per run unless EUREKA_WORK is shared, but all instances share the symlinks in the real extensions dir. [run-test.sh:6, run-test.sh:10-11]
C4. No version check; uses `gnome-shell --devkit`; Wayland only. [run-test.sh:18]
C5. POSIX sh, glib-compile-schemas, dconf, dbus-run-session, gnome-shell, `timeout`, grep, sed; 22 lines. [run-test.sh:1, run-test.sh:8, run-test.sh:15-21]
C6. The WORK dir (dconf database, screenshots, `shell.log`), the eureka symlink in the real extensions dir and the compiled schema in the source tree. [run-test.sh:6-8, run-test.sh:10, run-test.sh:19]
C7. Depends on the repository's license file; the script has no license header. [run-test.sh:1-3]
