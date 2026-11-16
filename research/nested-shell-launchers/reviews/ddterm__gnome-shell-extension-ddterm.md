# ddterm/gnome-shell-extension-ddterm `tools/run_nested_shell.py`

## A. Shared with the real session

A1. XDG_CONFIG_HOME, XDG_CACHE_HOME, XDG_STATE_HOME, XDG_DATA_HOME and XDG_RUNTIME_DIR point into a temp dir or `--base-dir`, created with mode 0700; XDG_RUNTIME_DIR is the same dir as XDG_CACHE_HOME and XDG_DATA_HOME the same as XDG_STATE_HOME. HOME and TMPDIR are not set. [run_nested_shell.py:39-56, run_nested_shell.py:221-226]
A2. No DCONF_PROFILE or GSETTINGS_BACKEND is set. [run_nested_shell.py:53-67]
A3. Starts its own `dbus-daemon --session` listening in the private runtime dir and gives its address to clients and shell; the daemon itself receives the copied host env, including the host DBUS_SESSION_BUS_ADDRESS. The systemd user manager is not handled. [run_nested_shell.py:53, run_nested_shell.py:84-104, run_nested_shell.py:140, run_nested_shell.py:152-154]
A4. Not handled; DBUS_SYSTEM_BUS_ADDRESS is inherited with the copied host env. [run_nested_shell.py:53]
A5. wayland-devkit hands the shell an absolute path to the host Wayland socket (default `wayland-0`) and keeps DISPLAY; wayland-nested gives the host DISPLAY only to the shell and leaves the host WAYLAND_DISPLAY in the shell env; xephyr starts its own Xephyr with `-nolisten tcp` and drops WAYLAND_DISPLAY. The nested socket name is `wayland-test`; Xwayland is not configured. [run_nested_shell.py:110-126, run_nested_shell.py:171-217]
A6. wayland-devkit sets the shell's PIPEWIRE_RUNTIME_DIR to the host's PIPEWIRE_RUNTIME_DIR, XDG_RUNTIME_DIR or USERPROFILE; other modes do not handle audio: PipeWire or PulseAudio variables of the copied host env are inherited. [run_nested_shell.py:53, run_nested_shell.py:182-185]
A7. Not handled; SSH_AUTH_SOCK and keyring variables are inherited with the copied host env, no keyring is started. [run_nested_shell.py:53]
A8. Not handled; the launcher never unmounts anything; only NO_AT_BRIDGE=1 is set. [run_nested_shell.py:65, run_nested_shell.py:220-226]
A9. Tracks dbus-daemon and Xephyr as Popen objects and terminates exactly those PIDs (SIGTERM, then SIGKILL after 10 s); no kill patterns, no own process groups. [run_nested_shell.py:70-77, run_nested_shell.py:97-102, run_nested_shell.py:117-122]
A10. Not handled. [run_nested_shell.py:129-168]
A11. Not handled; no renderer or GPU variables are set. [run_nested_shell.py:53-67]
A12. Extension install and enable run with the redirected XDG dirs on the private bus. The crash flag is not handled; XDG_CACHE_HOME, XDG_RUNTIME_DIR and XDG_STATE_HOME are redirected. [run_nested_shell.py:44-47, run_nested_shell.py:152-166]
A13. Not handled; no downloads or tokens, the bundle is a local file. [run_nested_shell.py:246-259]

## B. Lifecycle

B1. Looks up gnome-shell, gnome-extensions, dbus-daemon and Xephyr with `shutil.which`; a missing tool makes the matching option required. No version detection: the user picks `wayland-devkit` (49+) or `wayland-nested` (48 and earlier). [run_nested_shell.py:261-286, run_nested_shell.py:290-306, run_nested_shell.py:317-324]
B2. Not handled; takes a prebuilt bundle from `--bundle`, EXTENSION_BUNDLE or the first `**/*.shell-extension.zip` under the cwd. [run_nested_shell.py:246-259]
B3. Creates a fresh TemporaryDirectory per run and deletes it afterwards; with `--base-dir`, `mkdir` runs without `exist_ok`. No reset. [run_nested_shell.py:37-51, run_nested_shell.py:220-226]
B4. Runs `dbus-daemon --session --nofork --address=unix:dir=<runtime> --print-address=<fd>` and reads the address from a pipe; the address is handed on as DBUS_SESSION_BUS_ADDRESS to `gnome-extensions` and the shell. [run_nested_shell.py:81-106, run_nested_shell.py:153-154]
B5. Not handled; no gsettings beyond what `gnome-extensions enable` writes. [run_nested_shell.py:156-168]
B6. Reads the UUID from the bundle's metadata.json and runs `gnome-extensions install <bundle>` with `check=True`. [run_nested_shell.py:149-160]
B7. Runs `gnome-extensions enable <uuid>` before the shell starts, with `check=True`. [run_nested_shell.py:162-166]
B8. wayland-devkit: `--devkit --wayland-display=wayland-test`; wayland-nested: `--nested --wayland-display=wayland-test`; xephyr: `--x11` under Xephyr. Wayland size is left to the inherited MUTTER_DEBUG_DUMMY_MODE_SPECS named in the docstring; Xephyr gets no `-screen` argument; scale not handled. [run_nested_shell.py:18-19, run_nested_shell.py:112, run_nested_shell.py:190, run_nested_shell.py:206, run_nested_shell.py:212-217]
B9. Not handled for the shell, which runs in the foreground; the bus and Xephyr are awaited through `--print-address` and `-displayfd` pipes. [run_nested_shell.py:91, run_nested_shell.py:104, run_nested_shell.py:112, run_nested_shell.py:124, run_nested_shell.py:168]
B10. Not handled; no eval, prefs, screenshot or app helpers, no `--unsafe-mode`; the client env with WAYLAND_DISPLAY=wayland-test is only used for `gnome-extensions`. [run_nested_shell.py:156-168, run_nested_shell.py:188-190]
B11. Not handled. [run_nested_shell.py:149-168]
B12. Shell output goes to the inherited terminal. [run_nested_shell.py:168]
B13. No signal handling; the ExitStack terminates the daemon and Xephyr. The only timeout is the 10 s wait in `terminate_process`, after which it kills. [run_nested_shell.py:70-77, run_nested_shell.py:94-106]
B14. dbus-daemon and Xephyr are terminated via ExitStack callbacks and the temp dir is removed; `--base-dir` is kept, and bus-activated services are not stopped explicitly. [run_nested_shell.py:102, run_nested_shell.py:122, run_nested_shell.py:221-226]

## C. Properties

C1. Generic: installs any extension bundle; it lives in the ddterm repo but has no ddterm-specific code. [run_nested_shell.py:15-16, run_nested_shell.py:253-259]
C2. Global `--base-dir`; subcommands `wayland-devkit`, `wayland-nested`, `xephyr`; options `--bundle`, `--gnome-shell`, `--gnome-extensions`, `--dbus-daemon`, `--xephyr`; env EXTENSION_BUNDLE and MUTTER_DEBUG_DUMMY_MODE_SPECS. [run_nested_shell.py:18-19, run_nested_shell.py:238-324]
C3. With the default temp dir, each run has its own runtime dir and bus. [run_nested_shell.py:40, run_nested_shell.py:45, run_nested_shell.py:90]
C4. GNOME 49+ (devkit), 48 and earlier (nested) and X11 via Xephyr. No distribution-specific code. [run_nested_shell.py:290-315]
C5. Python 3, stdlib only. External: gnome-shell, gnome-extensions, dbus-daemon, Xephyr; 330 lines. [run_nested_shell.py:25-33, run_nested_shell.py:261-324]
C6. Nothing with the default temp dir; a `--base-dir` stays on disk. [run_nested_shell.py:40, run_nested_shell.py:221-226]
C7. GPL-2.0-or-later (SPDX header). [run_nested_shell.py:3-5]
