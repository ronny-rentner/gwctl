# Joaco2382/ripowall `scripts/probar-extension.sh`

## A. Shared with the real session

A1. XDG_DATA_HOME, XDG_CONFIG_HOME and XDG_CACHE_HOME point into a `mktemp -d` dir; HOME, XDG_STATE_HOME, XDG_RUNTIME_DIR and TMPDIR are inherited. The config generator reads the real `~/.config/ripowall/config.json` or `~/.config/hidamari/config.json` and writes a modified copy into the temp dir. [probar-extension.sh:17, probar-extension.sh:19, probar-extension.sh:23-34, probar-extension.sh:49]
A2. XDG_CONFIG_HOME is set before `dbus-run-session`; GSETTINGS_BACKEND and DCONF_PROFILE are inherited. The script reads two keys of the real dconf before and after the run and writes them back there if they changed. [probar-extension.sh:47, probar-extension.sh:49-56, probar-extension.sh:61-69]
A3. `dbus-run-session` gives the shell a private session bus; the systemd user manager is not addressed. The before/after `gsettings` calls run on the real session bus. [probar-extension.sh:47, probar-extension.sh:49-52, probar-extension.sh:63, probar-extension.sh:66]
A4. Not handled; DBUS_SYSTEM_BUS_ADDRESS is inherited. [probar-extension.sh:49-52]
A5. `--devkit --wayland --wayland-display ripowall-anidado`; X11 is not disabled. The test window gets WAYLAND_DISPLAY=ripowall-anidado but keeps the host DISPLAY and no GDK_BACKEND. [probar-extension.sh:57-58]
A6. Not handled; XDG_RUNTIME_DIR and audio variables are inherited. [probar-extension.sh:49-52]
A7. Not handled; SSH_AUTH_SOCK and the rest of the environment are inherited, no `env -i`. [probar-extension.sh:49-52]
A8. Not handled; no GIO_USE_VFS, no unmounting, and XDG_RUNTIME_DIR is the real one. [probar-extension.sh:49-52]
A9. `timeout $SEG` ends gnome-shell; the background `(sleep 12; python3 maximizada.py)` subshell is neither tracked nor killed. No kill patterns; the only trap is EXIT for the temp dir. [probar-extension.sh:18, probar-extension.sh:57-58]
A10. Not handled; screen-lock settings are not touched.
A11. Not handled; the GPU environment is inherited. [probar-extension.sh:49-52, probar-extension.sh:58]
A12. The extension exists only as a symlink in the temp data dir; enabled-extensions and disable-user-extensions of the real dconf are compared before/after and restored on change. The crash flag is not addressed; XDG_RUNTIME_DIR is inherited. [probar-extension.sh:20, probar-extension.sh:46-47, probar-extension.sh:61-69]
A13. No downloads or tokens; FONDO passes a local wallpaper path into the test config. [probar-extension.sh:31-32]

## B. Lifecycle

B1. Not handled; no tool or version check.
B2. No build or schema compilation; the checkout's extension dir is symlinked as is. [probar-extension.sh:20]
B3. A fresh `mktemp -d` per run, removed by the EXIT trap; a given output dir is reused after deleting its old `captura.png`. [probar-extension.sh:13, probar-extension.sh:17-21]
B4. `dbus-run-session` with the XDG overrides set before it. [probar-extension.sh:49-59]
B5. Sets disable-user-extensions false, enabled-extensions to the UUID and welcome-dialog-last-shown-version "999". [probar-extension.sh:53-56]
B6. Symlinks `extension/ripowall@ripotech.cl` into the temp data dir and writes a test config to `$T/ripowall.json`; the extension dir's existence is not checked. [probar-extension.sh:20, probar-extension.sh:22-34]
B7. Through enabled-extensions before the shell starts; no check that the extension became active. [probar-extension.sh:55]
B8. `timeout $SEG gnome-shell --devkit --wayland --wayland-display ripowall-anidado`; size and scale are not set. [probar-extension.sh:58]
B9. Not handled; the test window starts after a fixed `sleep 12`. [probar-extension.sh:57]
B10. A generated GTK 4 window maximizes at 12 s and quits after 6 s; the screenshot path is passed as RIPOWALL_PRUEBA_CAPTURA, the capture Depends on the extension and `ripowall_renderer.py`. No eval or external control. [probar-extension.sh:35-44, probar-extension.sh:50, probar-extension.sh:57]
B11. Not handled; each run starts a new session from the symlinked checkout. [probar-extension.sh:17, probar-extension.sh:20]
B12. Shell output goes to `$OUT/shell.log`, lines matching ripowall or JS ERROR are printed, and the capture's presence is reported; the exit code is 1 only if the real settings changed. [probar-extension.sh:58, probar-extension.sh:71-74]
B13. `timeout` stops the shell after SEG seconds (default 25); the only trap is EXIT, which does not stop gnome-shell. [probar-extension.sh:12, probar-extension.sh:18, probar-extension.sh:58]
B14. The EXIT trap removes `$T`; the output dir stays and the background test-window subshell is not killed; no mounts handled. [probar-extension.sh:18, probar-extension.sh:57]

## C. Properties

C1. Bound to RipoWall: fixed UUID, RIPOWALL_* variables, ripowall/hidamari config paths and the test window. [probar-extension.sh:15, probar-extension.sh:25, probar-extension.sh:36-44, probar-extension.sh:50-51]
C2. Positional `[seconds=25] [output-dir]` and environment variable FONDO; usage only in the header comment. [probar-extension.sh:4, probar-extension.sh:12-13, probar-extension.sh:31]
C3. Temp and default output dirs are unique per run, but the display name `ripowall-anidado` is fixed and the before/after check uses the real dconf. [probar-extension.sh:13, probar-extension.sh:17, probar-extension.sh:46-47, probar-extension.sh:57-58, probar-extension.sh:61-69]
C4. No version check; uses `gnome-shell --devkit --wayland`; distributions are not addressed. [probar-extension.sh:58]
C5. Bash with an associative array, python3 with PyGObject GTK 4, dbus-run-session, gsettings, gnome-shell, coreutils `timeout`, grep; 74 lines. [probar-extension.sh:1, probar-extension.sh:23, probar-extension.sh:37, probar-extension.sh:46, probar-extension.sh:52, probar-extension.sh:58, probar-extension.sh:72]
C6. The output dir with `shell.log` and `captura.png`; the temp dir is removed. [probar-extension.sh:5, probar-extension.sh:13, probar-extension.sh:18, probar-extension.sh:58]
C7. Depends on the repository's license file; the script has no license header. [probar-extension.sh:1-10]
