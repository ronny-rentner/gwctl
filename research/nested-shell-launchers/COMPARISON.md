# Nested GNOME Shell launchers: comparison

Compares 83 nested GNOME Shell launchers question by question along QUESTIONS.md; the per-launcher details are in `reviews/`.

## A. Shared with the real session

### A1. Files

- Only XDG_CONFIG_HOME redirected: homie-gnome, GNOME-EXTENSIONS, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, conjure-launcher devkit, vibecheck, Video-Screensaver, surface-dial-evolved, earful, vocis, xi-extensions, eureka, lid-duo (15)
- XDG_CONFIG_HOME redirected, own data dir prepended to XDG_DATA_DIRS: ducktape, desktop-launcher (2)
- Only XDG_DATA_HOME redirected: bin, gnome-widget-panel (2)
- XDG_CONFIG_HOME and XDG_DATA_HOME: chorus, greenlight, nublet, gnomepods, Ubuntu-Workspace-Manager, gnome-shell-extension-liveradio, minibar, daily-time-tracker, gnome-hdr-3d-lut, gnome-shell-extension-genai-usage, trai, isobar-contour (12)
- XDG_CONFIG_HOME and XDG_CACHE_HOME: milkdrop-extension, paste-board (2)
- XDG config, data and cache dirs: mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, Tuxistant, zclock, gnome-spotify-extension, gnome-shell-extension-tailscale, ripowall, wall-in, gnome-study-tracker (9)
- XDG config, data and state dirs: yatm (1)
- All four XDG base dirs, XDG_RUNTIME_DIR and HOME real: gnome-grid-workspace-indicator, dropshade, gnome-extension-nowpill, conjure-launcher preview, nowplaying-card, gapia-desktop, islet, BananaTray, window-tiling-control (9)
- XDG base dirs and XDG_RUNTIME_DIR: gnome-shell-extension-ddterm, System-Monitor-GNOME-Extension, notification-sidebar, froonty-gnome, Wallfred, Gnome-Widgets, panthea-gnome, battery-buddy, gnome-study-tracker, 860-control, screenshot-utils (11)
- Only XDG_RUNTIME_DIR to a per-run temp dir, the rest left to distrobox and `setup.sh` or to gnome-shell-test-tool: liquid-glass, panthea-gnome (2)
- HOME and XDG dirs: mouse-follows-focus, GNOME-EXTENSIONS, Magunetto, ntfy-indicator, headroom (5)
- HOME and XDG dirs inside bwrap: dictation, elfvision (2)
- TMPDIR dropped by `env -i`: elfvision, 860-control (2)
- Real config or data entries symlinked into the redirected dirs: ducktape, conjure-launcher preview, gnome-shell-extension-genai-usage, trai (4)
- Left to the caller or to a helper script or tool: veil, praya-gnome-shell-extension, quota-glance, gnome-shell-extension-window-groups, arctis-companion (5)
- Not handled: gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, MacOSWorkspaces, vocis (11)

### A2. Settings

- GSETTINGS_BACKEND=keyfile in a redirected config dir: mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, chorus, greenlight, Tuxistant, nowplaying-card, milkdrop-extension, froonty-gnome, gapia-desktop, gnome-spotify-extension, elfvision, paste-board, gnome-shell-extension-tailscale, Magunetto, gnome-hdr-3d-lut, panthea-gnome, gnome-study-tracker, desktop-launcher, battery-buddy, GNOME-EXTENSIONS, notification-sidebar (21)
- Keyfile backend only on the gnome-shell command line, other processes keep the real settings: chorus, Tuxistant (2)
- DCONF_PROFILE pointed at an empty file or `/dev/null` beside the keyfile backend: GNOME-EXTENSIONS, notification-sidebar (2)
- GSETTINGS_BACKEND=memory: bin, 860-control (2)
- DCONF_PROFILE with a separate user db: ducktape, homie-gnome, BananaTray, MacOSWorkspaces, gnome-widget-panel (5)
- GSETTINGS_BACKEND=dconf with DCONF_PROFILE unset and redirected XDG_CONFIG_HOME: screenshot-utils (1)
- No backend variable, XDG_CONFIG_HOME redirected before the bus starts: gnome-shell-extension-ddterm, mouse-follows-focus, System-Monitor-GNOME-Extension, gnome-grid-workspace-indicator, dropshade, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, gnome-extension-nowpill, nublet, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, yatm, surface-dial-evolved, islet, gnome-shell-extension-liveradio, minibar, daily-time-tracker, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, Wallfred, Gnome-Widgets, headroom, ripowall, eureka, lid-duo, wall-in, isobar-contour (39)
- Redirected dirs set only inside bwrap, the bus starts outside it: dictation (1)
- Copy of the real dconf database as nested start: Quick-Settings-Scroll, Tailscale-Gnome, ducktape (3)
- Selected real settings read and written into the nested settings: GNOME-EXTENSIONS, greenlight, conjure-launcher preview, Ubuntu-Workspace-Manager, Video-Screensaver, paste-board, xi-extensions, gnome-grid-workspace-indicator (8)
- Checks before or after writing that settings went to the private store: gnome-grid-workspace-indicator, dropshade, notification-sidebar (3)
- GSETTINGS_SCHEMA_DIR set to project or state schemas: nublet, gapia-desktop, window-tiling-control, Wallfred, gnome-widget-panel (5)
- Settings variables handed to services the bus starts via the activation environment: quota-glance, gnome-widget-panel, Gnome-Widgets (3)
- Writes the real session's enabled-extensions: myPets (restored on exit), gnome-extension-milkdrop-viz, authenticator-companion, mini-eq run_gnome_extension_dev_shell (with `--real-session-install`) (4)
- Two real keys compared before and after the run, written back on change: ripowall (1)
- Left to the caller or to a helper (distrobox box, gnome-shell-test-tool, `tools/dev-datahome.sh`, lib-sandbox.sh): veil, arctis-companion, liquid-glass, panthea-gnome, praya-gnome-shell-extension, quota-glance, gnome-shell-extension-window-groups (7)
- Not handled: gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, vocis (10)

### A3. Session bus

- Private bus from `dbus-run-session`: ducktape, mouse-follows-focus, bin, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, panthea-gnome, gnome-widget-panel, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, 860-control, isobar-contour, screenshot-utils (78)
- Own `dbus-daemon --session`: gnome-shell-extension-ddterm, Gnome-Widgets, astra-monitor (3)
- Separate private buses for setup steps and for the shell: mouse-follows-focus, gnome-shell-extension-window-groups (2)
- Bus started inside a distrobox container: nublet, liquid-glass (2)
- Some setup or helper steps run on the host session bus: mouse-follows-focus, Quick-Settings-Scroll, Tailscale-Gnome, mini-eq run_gnome_extension_dev_shell, System-Monitor-GNOME-Extension, milkdrop-extension, yatm, gapia-desktop, ntfy-indicator, gnome-hdr-3d-lut, ripowall, astra-monitor, earful (13)
- Host bus address passed on to the private bus daemon or into the nested session: gnome-shell-extension-ddterm, ducktape, authenticator-companion, gnome-spotify-extension (4)
- Host bus address unset or dropped before the private bus starts: screenshot-utils, 860-control (2)
- Private bus address written to a file for outside use: homie-gnome, GNOME-EXTENSIONS, dictation, dropshade, surface-dial-evolved, islet, froonty-gnome, gnome-widget-panel, desktop-launcher, lid-duo, wall-in, Gnome-Widgets (12)
- Activation environment updated with `dbus-update-activation-environment` or explicit keys, without `--systemd`: froonty-gnome, Gnome-Widgets, gnome-widget-panel, quota-glance (4)
- Inner script checks that the bus differs from the outer one: isobar-contour (1)
- Left to the caller or to a make target: veil, arctis-companion, praya-gnome-shell-extension (3)
- Not handled for the systemd user manager: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, bin, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, 860-control, isobar-contour, screenshot-utils (80)

### A4. System bus

- Private `dbus-daemon` as system bus: froonty-gnome, elfvision (2)
- Real system bus forwarded through `xdg-dbus-proxy`, filtered to named services (`--system-bus`): froonty-gnome (1)
- DBUS_SYSTEM_BUS_ADDRESS set to the private session bus: screenshot-utils (1)
- DBUS_SYSTEM_BUS_ADDRESS dropped by `env -i`: 860-control (1)
- Host system bus socket passed into a distrobox container: nublet, liquid-glass (2)
- Left to the caller or to a helper (gnome-shell-test-tool, lib-sandbox.sh): veil, quota-glance, gnome-shell-extension-window-groups (3)
- Not handled: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, bin, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, nowplaying-card, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, islet, gnome-spotify-extension, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, isobar-contour (74)

### A5. Display

- Host Wayland socket handed to the shell as absolute path, or bound or symlinked into the sandbox: gnome-shell-extension-ddterm, notification-sidebar, liquid-glass, froonty-gnome, elfvision, Gnome-Widgets, panthea-gnome, headroom, 860-control (9)
- Own nested Wayland socket name: gnome-shell-extension-ddterm, ducktape, GNOME-EXTENSIONS, Tuxistant, gnome-shell-extension-window-groups, froonty-gnome, paste-board, xi-extensions, ripowall, wall-in, liquid-glass, arctis-companion, gnome-study-tracker, headroom, 860-control (15)
- Headless mode with virtual monitors: GNOME-EXTENSIONS, System-Monitor-GNOME-Extension, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, 860-control, isobar-contour, screenshot-utils (13)
- Headless display mirrored to the host as a GStreamer window: GNOME-EXTENSIONS (1)
- Own X server, Xephyr or Xvfb: gnome-shell-extension-ddterm, astra-monitor, screenshot-utils (3)
- X11 off with `--no-x11`: mouse-follows-focus, veil, Tuxistant, nowplaying-card, BananaTray, Gnome-Widgets, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, eureka, wall-in, 860-control, screenshot-utils, liquid-glass (16)
- Nested Xwayland with own cookie: GNOME-EXTENSIONS (1)
- DISPLAY or WAYLAND_DISPLAY unset or dropped: GNOME-EXTENSIONS, froonty-gnome, elfvision, Gnome-Widgets, headroom, 860-control, screenshot-utils, liquid-glass (8)
- Test clients, apps or services pointed at the nested display: mini-eq run_nested_flathub_extension_smoke, paste-board, Magunetto, ripowall, froonty-gnome, Gnome-Widgets (6)
- Host display variables still inherited by the shell in at least one mode, beside the steps above: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, Tuxistant, paste-board, xi-extensions, ripowall, gnome-shell-extension-window-groups, astra-monitor, nowplaying-card, BananaTray, Magunetto, mini-eq run_nested_flathub_extension_smoke, System-Monitor-GNOME-Extension, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, battery-buddy, isobar-contour (20)
- Left to the caller or to a helper (gnome-shell-test-tool, distrobox): veil, quota-glance, nublet (3)
- Not handled: bin, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, gnome-extension-nowpill, chorus, greenlight, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, islet, gnome-spotify-extension, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, window-tiling-control, MacOSWorkspaces, Wallfred, lid-duo (48)

### A6. Audio and video

- Own PipeWire and WirePlumber started: veil, froonty-gnome, liquid-glass (3)
- PIPEWIRE_RUNTIME_DIR, in one case also PULSE_SERVER, pointed at the host's: gnome-shell-extension-ddterm, Gnome-Widgets, panthea-gnome, 860-control (4)
- Private runtime dir without audio server: elfvision, Gnome-Widgets, notification-sidebar, Wallfred, System-Monitor-GNOME-Extension (5)
- Fake control service of the audio app on the private bus: mini-eq run_gnome_extension_dev_shell (1)
- Headless display mirrored to the host through PipeWire: GNOME-EXTENSIONS (1)
- Left to a helper (distrobox, gnome-shell-test-tool, lib-sandbox.sh): nublet, quota-glance, gnome-shell-extension-window-groups (3)
- Not handled: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, bin, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, nowplaying-card, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, islet, gnome-spotify-extension, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, 860-control, isobar-contour, screenshot-utils (75)

### A7. Secrets

- Own `gnome-keyring-daemon` for secrets started with the host env, SSH_AUTH_SOCK exported from it: bin (1)
- SSH_AUTH_SOCK and keyring variables unset or dropped by `env -i`: elfvision, 860-control (2)
- Variables named in EXT_STAND_IN_UNSET and those containing `$HOME` removed (`--stand-in`): GNOME-EXTENSIONS (1)
- Claude credentials kept out: private CLAUDE_CONFIG_DIR, stand-in CLI, Claude variables unset: froonty-gnome (1)
- Host credentials passed in: GitHub token as GH_TOKEN or host `gh` config via GH_CONFIG_DIR: greenlight, quota-glance (2)
- Host app's secrets reached through a proxy on the host bus: authenticator-companion (1)
- SSH_AUTH_SOCK handed to services the private bus starts via `dbus-update-activation-environment --all`: gnome-widget-panel (1)
- Left to the caller or to a helper (distrobox, lib-sandbox.sh): veil, nublet, gnome-shell-extension-window-groups (3)
- Not handled: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, quota-glance, nowplaying-card, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, isobar-contour, screenshot-utils (77)

### A8. Portals, gvfs, FUSE

- GIO_USE_VFS=local: mouse-follows-focus, elfvision, panthea-gnome, screenshot-utils, BananaTray (mock daemon only) (5)
- GIO_USE_VOLUME_MONITOR=unix: froonty-gnome (1)
- GTK_USE_PORTAL=0: bin (1)
- Automount turned off in the nested settings: notification-sidebar (1)
- FUSE mounts in the private runtime dir unmounted at cleanup: froonty-gnome, Gnome-Widgets, panthea-gnome, System-Monitor-GNOME-Extension, notification-sidebar, liquid-glass, 860-control, screenshot-utils (8)
- Directory removal kept on one file system with `rm --one-file-system`: Gnome-Widgets, notification-sidebar (2)
- Document portal dir `doc/by-app/<app_id>` created in the real runtime dir: mini-eq run_nested_flathub_extension_smoke (1)
- bwrap `--dev /dev`, portals left to the session bus config file: elfvision (1)
- Left to the caller or to a helper (distrobox, gnome-shell-test-tool, lib-sandbox.sh): veil, nublet, quota-glance, gnome-shell-extension-window-groups (4)
- Not handled: gnome-shell-extension-ddterm, ducktape, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, nowplaying-card, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, islet, gnome-spotify-extension, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, isobar-contour (69)

### A9. Processes

- Kills only PIDs it started or recorded: gnome-shell-extension-ddterm, ducktape, gnome-extension-milkdrop-viz, authenticator-companion, System-Monitor-GNOME-Extension, praya-gnome-shell-extension, notification-sidebar, liquid-glass, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, Tuxistant, gnomepods, zclock, froonty-gnome, elfvision, paste-board, BananaTray, vocis, Gnome-Widgets, gnome-widget-panel, arctis-companion, headroom, battery-buddy, 860-control, isobar-contour (25)
- App killed by ID with `flatpak kill`: mini-eq run_nested_flathub_extension_smoke (1)
- Processes found through a marker in `/proc/*/environ` (env variable, sandbox path or bus address): GNOME-EXTENSIONS, conjure-launcher devkit (waits, kills nothing), Video-Screensaver, trai, froonty-gnome, Gnome-Widgets (6)
- `pkill -f` or `pgrep -f` patterns: bin, gnome-wayland-wallpaper-slideshow, astra-monitor, ntfy-indicator, GNOME-EXTENSIONS, gnome-shell-extension-window-nativizer (6)
- Own session or process group via `setsid`, stopped as a group: GNOME-EXTENSIONS, nowplaying-card, dictation, gnome-shell-extension-window-nativizer, Gnome-Widgets (5)
- Tied to the parent with bwrap `--die-with-parent` or `setpriv --pdeathsig`: elfvision, froonty-gnome (2)
- Shell ended by `timeout` or after a fixed run time: gnome-wayland-wallpaper-slideshow, gnome-extension-milkdrop-viz, gnome-hdr-3d-lut, ripowall, eureka, panthea-gnome, System-Monitor-GNOME-Extension (7)
- Background processes started without tracking: veil, ripowall, lid-duo, liquid-glass, Magunetto (5)
- Left to lib-sandbox.sh (`wg_snapshot_x`, `wg_reap_x`): gnome-shell-extension-window-groups (1)
- Not handled: mouse-follows-focus, homie-gnome, gnome-shell-extension-auto-headphones, myPets, eave, gnome-grid-workspace-indicator, dropshade, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, gnome-extension-nowpill, chorus, greenlight, nublet, conjure-launcher preview, vibecheck, quota-glance, Ubuntu-Workspace-Manager, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, islet, gnome-spotify-extension, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, earful, gnome-shell-extension-genai-usage, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, gnome-study-tracker, desktop-launcher, wall-in, screenshot-utils (41)

### A10. Input

- Pointer and keyboard events injected via Mutter's RemoteDesktop API on the nested bus: GNOME-EXTENSIONS (1)
- Nested shortcuts, input sources or numlock set apart from or copied from the host: Magunetto, xi-extensions, conjure-launcher preview, minibar, daily-time-tracker, greenlight (6)
- Dialogs, overview and notifications closed via Eval: 860-control (1)
- Headless or Xvfb display: Gnome-Widgets, screenshot-utils (2)
- Host input-method variables unset: liquid-glass (1)
- Printed tip to disable the extension in the outer session: vocis (1)
- Not handled: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, bin, veil, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, nublet, Tuxistant, conjure-launcher devkit, gnomepods, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, isobar-contour (72)

### A11. GPU and rendering

- Software rendering via LIBGL_ALWAYS_SOFTWARE, llvmpipe or the Mesa EGL vendor file: ducktape, dictation, elfvision, screenshot-utils (4)
- GSK_RENDERER=gl: ducktape, vibecheck (2)
- `/dev/dri` hidden with a tmpfs inside bwrap: dictation (1)
- `--disable-animations`: quota-glance (1)
- LP_NUM_THREADS=0 in one test mode: System-Monitor-GNOME-Extension (1)
- COGL_DEBUG passed through when set: lid-duo (1)
- Left to distrobox: nublet (1)
- Not handled: gnome-shell-extension-ddterm, mouse-follows-focus, bin, veil, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, wall-in, 860-control, isobar-contour (74)

### A12. The real shell's state

- Crash flag in the real runtime dir deleted: nublet, ntfy-indicator, gnome-widget-panel (3)
- Crash flag removed at exit only when the run created it: Video-Screensaver, xi-extensions, GNOME-EXTENSIONS (3)
- Runtime dir private: gnome-shell-extension-ddterm, panthea-gnome, gnome-study-tracker, 860-control, screenshot-utils (5)
- Extension installed into a private data dir: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, bin, GNOME-EXTENSIONS, System-Monitor-GNOME-Extension, dictation, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher preview, gnomepods, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, yatm, froonty-gnome, islet, gnome-spotify-extension, elfvision, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, gnome-shell-extension-genai-usage, trai, window-tiling-control, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, gnome-study-tracker, headroom, battery-buddy, ripowall, wall-in, 860-control, isobar-contour, screenshot-utils (52)
- Nested run installs or links the extension into the real extensions dir: GNOME-EXTENSIONS, astra-monitor, System-Monitor-GNOME-Extension, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, conjure-launcher devkit, Video-Screensaver, vocis, MacOSWorkspaces, eureka (13)
- Other targets or subcommands install into or act on the real session: mouse-follows-focus, Wallfred, panthea-gnome, gnome-widget-panel (4)
- No install step, extension expected installed already: myPets, gnome-extension-milkdrop-viz, surface-dial-evolved, paste-board, desktop-launcher, lid-duo (6)
- Installation left to the caller or to a project helper (install, build or deploy script, test tool): veil, arctis-companion, authenticator-companion, eave, gnome-shell-extension-window-nativizer, praya-gnome-shell-extension, vibecheck, quota-glance, milkdrop-extension, gapia-desktop, earful, xi-extensions (12)
- Run aborted when a copy exists in the real `~/.local/share`: ducktape (1)
- Host user data dir removed from XDG_DATA_DIRS, or XDG_DATA_DIRS reset: gapia-desktop, wall-in (2)
- Enabled only in the nested settings: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, GNOME-EXTENSIONS, System-Monitor-GNOME-Extension, dictation, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, yatm, surface-dial-evolved, froonty-gnome, islet, gnome-spotify-extension, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, 860-control, isobar-contour, screenshot-utils (65)
- Enabled in the real session's settings: myPets (restored on exit), gnome-extension-milkdrop-viz, authenticator-companion, astra-monitor, mini-eq run_gnome_extension_dev_shell (with `--real-session-install`) (5)
- Real enabled-extensions compared before and after, restored on change: ripowall (1)
- Session mode's bundled extensions or the machine's search providers disabled in the nested settings: screenshot-utils, conjure-launcher preview (2)
- Extension disabled again after the check: arctis-companion (1)
- Not handled: homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow (3)

### A13. Network and external services

- Workspace Matrix zip downloaded from extensions.gnome.org with `curl`, no integrity check: gnome-grid-workspace-indicator (1)
- Docker images built for compatibility tests: System-Monitor-GNOME-Extension (1)
- `npm install` when `tsc` is missing: gnome-widget-panel (1)
- `go install` in the install target: vocis (1)
- Host tokens or config handed into the nested session (GitHub token, `gh`, IntelliJ, Cursor or project config, ntfy server settings): greenlight, quota-glance, surface-dial-evolved, gnome-shell-extension-genai-usage, trai, ntfy-indicator (6)
- Host bus or a host service reachable from the nested session: ducktape, authenticator-companion, gnome-spotify-extension (3)
- Real service replaced by a mock, stub, fake service or stand-in CLI: gnomepods, nowplaying-card, BananaTray, headroom, 860-control, mini-eq run_gnome_extension_dev_shell, froonty-gnome (7)
- Real project daemon or app started with the real config: Tuxistant, BananaTray (2)
- Namespaces unshared with bwrap `--unshare-all`, data source fixed to `demo`: elfvision (1)
- Left to project helpers (install, build or pack scripts): conjure-launcher devkit, conjure-launcher preview, milkdrop-extension, yatm, islet, gapia-desktop, earful, xi-extensions, window-tiling-control, vibecheck (10)
- Not handled: gnome-shell-extension-ddterm, mouse-follows-focus, bin, veil, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, eave, gnome-shell-extension-window-nativizer, dictation, praya-gnome-shell-extension, dropshade, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, nublet, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, paste-board, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, arctis-companion, gnome-study-tracker, desktop-launcher, battery-buddy, ripowall, eureka, lid-duo, wall-in, isobar-contour, screenshot-utils (51)

## B. Lifecycle

### B1. Prerequisites

- GNOME major version read from `gnome-shell --version`: veil, astra-monitor, eave, gnome-grid-workspace-indicator, MacOSWorkspaces, liquid-glass, screenshot-utils (7)
- Launch mode chosen by the detected version: astra-monitor, eave, screenshot-utils (3)
- `--devkit` support detected from `gnome-shell --help`: mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, eave, gnome-grid-workspace-indicator, Video-Screensaver, battery-buddy (6)
- Mutter and schema package versions queried with `rpm`: gapia-desktop (1)
- Version or mode picked by the user: gnome-shell-extension-ddterm, liquid-glass (2)
- mutter-devkit binary checked: mouse-follows-focus, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, greenlight, Tuxistant, conjure-launcher devkit, conjure-launcher preview, vibecheck, quota-glance, nowplaying-card, froonty-gnome, elfvision, BananaTray, dropshade, notification-sidebar, panthea-gnome, gnome-widget-panel, gnome-study-tracker, battery-buddy, astra-monitor, eave (21)
- Some required tools looked up on PATH: gnome-shell-extension-ddterm, ducktape, bin, greenlight, GNOME-EXTENSIONS, astra-monitor, eave, System-Monitor-GNOME-Extension, elfvision, paste-board, BananaTray, gapia-desktop, MacOSWorkspaces, Wallfred, window-tiling-control, gnome-widget-panel, daily-time-tracker (17)
- Host display, socket, runtime dir or session bus checked: chorus, myPets, MacOSWorkspaces, froonty-gnome, elfvision, notification-sidebar, liquid-glass, paste-board, panthea-gnome, gnome-spotify-extension, authenticator-companion (11)
- Project inputs checked (source dir, bundle, metadata, config, daemon binary, arguments): ducktape, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, Tuxistant, myPets, GNOME-EXTENSIONS, dictation, Gnome-Widgets, headroom, ntfy-indicator, screenshot-utils, elfvision, gnome-grid-workspace-indicator, liquid-glass (14)
- Refuses a second instance in the same sandbox or linked git worktrees: froonty-gnome, GNOME-EXTENSIONS (2)
- Ubuntu or a container detected from files: trai, liquid-glass (2)
- Note printed when the extension is not enabled in the real session: Quick-Settings-Scroll, Tailscale-Gnome (2)
- Relies on a prepared container or toolbox: nublet, 860-control (2)
- Not handled: homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, gnome-extension-milkdrop-viz, gnome-shell-extension-window-nativizer, praya-gnome-shell-extension, superbar, gnome-movement-breaks, gnome-extension-nowpill, gnomepods, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, milkdrop-extension, yatm, surface-dial-evolved, islet, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, gnome-hdr-3d-lut, earful, gnome-shell-extension-genai-usage, vocis, xi-extensions, desktop-launcher, ripowall, eureka, lid-duo, wall-in, isobar-contour, arctis-companion (33)

### B2. Build and packaging

- `gnome-extensions pack` into a bundle: mouse-follows-focus, superbar, gnome-movement-breaks, astra-monitor, dictation, gnome-grid-workspace-indicator, ntfy-indicator, panthea-gnome, System-Monitor-GNOME-Extension (9)
- Language build step (tsc, npm, cargo, Go, Bun pack script): astra-monitor, dictation, gnome-widget-panel, dropshade, vocis, BananaTray, liquid-glass, gnome-shell-extension-genai-usage (8)
- Schemas compiled by the launcher: ducktape, veil, gnome-extension-nowpill, nublet, Tuxistant, conjure-launcher preview, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, gnome-spotify-extension, gnome-shell-extension-liveradio, daily-time-tracker, gnome-hdr-3d-lut, MacOSWorkspaces, Wallfred, battery-buddy, trai, isobar-contour, eureka, dropshade, greenlight, Tailscale-Gnome, liquid-glass, ntfy-indicator, gnome-widget-panel, astra-monitor, dictation, gnome-grid-workspace-indicator, System-Monitor-GNOME-Extension, GNOME-EXTENSIONS (30)
- Translations compiled: Tailscale-Gnome, System-Monitor-GNOME-Extension (2)
- Checks: syntax, schema dry run, zip test, checksum: superbar, gnome-movement-breaks, panthea-gnome, System-Monitor-GNOME-Extension (4)
- Test fixture converted: gnome-hdr-3d-lut (1)
- Build left to a project target or helper script: mini-eq run_gnome_extension_dev_shell, chorus, greenlight, conjure-launcher devkit, vibecheck, nowplaying-card, milkdrop-extension, yatm, froonty-gnome, gapia-desktop, islet, elfvision, earful, xi-extensions, window-tiling-control, gnome-shell-extension-window-nativizer, authenticator-companion, eave, myPets, notification-sidebar, GNOME-EXTENSIONS, Video-Screensaver (22)
- Prebuilt bundle or prior build required: gnome-shell-extension-ddterm, veil, ducktape, quota-glance, headroom, Gnome-Widgets, screenshot-utils, zclock, Tuxistant, liquid-glass (10)
- Source tree copied or linked as is: bin, mini-eq run_nested_flathub_extension_smoke, gnomepods, islet, gnome-shell-extension-tailscale, Magunetto, minibar, ripowall, gnome-study-tracker, wall-in, 860-control, BananaTray, Quick-Settings-Scroll (13)
- Left to the caller: arctis-companion (1)
- Not handled: homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, gnome-extension-milkdrop-viz, praya-gnome-shell-extension, surface-dial-evolved, paste-board, desktop-launcher, lid-duo (9)

### B3. Sandbox

- New temp dir per run with a removal trap on exit: gnome-shell-extension-ddterm, ducktape, superbar, gnome-movement-breaks, mini-eq run_nested_flathub_extension_smoke, chorus, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, zclock, Ubuntu-Workspace-Manager, milkdrop-extension, gnome-spotify-extension, elfvision, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, gnome-hdr-3d-lut, ntfy-indicator, trai, vocis, panthea-gnome, gnome-study-tracker, notification-sidebar, ripowall, 860-control, isobar-contour, screenshot-utils, System-Monitor-GNOME-Extension (kept after failure or with RP_KEEP=1) (31)
- New temp dir per run, left behind: paste-board, minibar, daily-time-tracker, earful, gnome-shell-extension-genai-usage, xi-extensions, lid-duo, eureka (8)
- Fixed dir deleted and recreated at each start: Quick-Settings-Scroll, Tailscale-Gnome, mini-eq run_gnome_extension_dev_shell, gnome-extension-nowpill, gnome-shell-extension-window-groups, dictation, gnome-grid-workspace-indicator, GNOME-EXTENSIONS (run dir), Gnome-Widgets (`data/` and `run/`) (9)
- Fixed dir reused across runs: mouse-follows-focus, bin, homie-gnome, greenlight, nublet, vibecheck, nowplaying-card, Video-Screensaver, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, window-tiling-control, MacOSWorkspaces, Wallfred, gnome-widget-panel, desktop-launcher, headroom, battery-buddy, wall-in, dropshade, liquid-glass, GNOME-EXTENSIONS (settings), Gnome-Widgets (config, cache, state) (25)
- Reset by option or make target (`--reset`, `--clean`, `make clean`): mouse-follows-focus, Quick-Settings-Scroll, Tailscale-Gnome, greenlight, froonty-gnome, window-tiling-control, GNOME-EXTENSIONS (7)
- Sandbox location chosen by option or env variable: gnome-shell-extension-ddterm, BananaTray, headroom, window-tiling-control, greenlight, surface-dial-evolved, froonty-gnome, eureka, wall-in, gnome-shell-extension-window-groups (10)
- Starts serialized by a session lock helper: gnome-shell-extension-window-nativizer (1)
- Left to the caller or to a helper: veil, arctis-companion, praya-gnome-shell-extension, quota-glance (4)
- Not handled: gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, vocis, System-Monitor-GNOME-Extension (10)

### B4. Starting the bus

- `dbus-run-session` in the foreground around the shell or an inner script: ducktape, mouse-follows-focus, gnome-shell-extension-auto-headphones, myPets, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, nublet, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, gnome-spotify-extension, elfvision, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, Wallfred, panthea-gnome, gnome-widget-panel, battery-buddy, ripowall, eureka, isobar-contour, screenshot-utils (44)
- Script replaces itself with `exec dbus-run-session`: bin, homie-gnome, authenticator-companion, eave, gnome-grid-workspace-indicator, dropshade, greenlight, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, islet, minibar, daily-time-tracker, window-tiling-control, MacOSWorkspaces, gnome-study-tracker, desktop-launcher, headroom, wall-in (20)
- Script re-runs itself as inner stage under `dbus-run-session`: gnome-grid-workspace-indicator, notification-sidebar, Tuxistant, froonty-gnome, paste-board, BananaTray, xi-extensions, headroom, 860-control (9)
- `dbus-run-session` started in the background: gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, gnome-extension-milkdrop-viz, dictation, froonty-gnome, Magunetto, lid-duo (8)
- Own `dbus-daemon --session`, address read from a pipe or file descriptors: gnome-shell-extension-ddterm, Gnome-Widgets, astra-monitor (3)
- Session bus with its own config file: elfvision (1)
- Private system bus started and polled for its socket: froonty-gnome, elfvision (2)
- Separate bus per setup step and for the shell: mouse-follows-focus, gnome-shell-extension-window-groups (2)
- Host bus address unset or dropped by `env -i` first: screenshot-utils, 860-control (2)
- Left to the caller or to a make target: veil, arctis-companion, praya-gnome-shell-extension (3)

### B5. Initial settings

- enabled-extensions written into the nested settings before the shell starts: ducktape, veil, GNOME-EXTENSIONS, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, nowplaying-card, gnome-shell-extension-window-groups, Ubuntu-Workspace-Manager, Video-Screensaver, yatm, surface-dial-evolved, froonty-gnome, islet, gnome-spotify-extension, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, isobar-contour, screenshot-utils (59)
- disable-user-extensions false: ducktape, veil, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, nowplaying-card, gnome-shell-extension-window-groups, surface-dial-evolved, froonty-gnome, islet, gnome-spotify-extension, paste-board, BananaTray, gnome-hdr-3d-lut, gnome-shell-extension-genai-usage, window-tiling-control, MacOSWorkspaces, Gnome-Widgets, gnome-widget-panel, arctis-companion, desktop-launcher, headroom, battery-buddy, ripowall, lid-duo, wall-in, isobar-contour, dropshade, liquid-glass, GNOME-EXTENSIONS, yatm (34)
- welcome-dialog-last-shown-version set: veil, greenlight, Tuxistant, conjure-launcher preview, Video-Screensaver, surface-dial-evolved, froonty-gnome, GNOME-EXTENSIONS, gnome-grid-workspace-indicator, liquid-glass, desktop-launcher, headroom, battery-buddy, ripowall, trai, Gnome-Widgets, screenshot-utils (17)
- Extension version validation off: veil, Magunetto, window-tiling-control, gnome-grid-workspace-indicator (4)
- Real settings copied in (database copy, dump or selected keys): Quick-Settings-Scroll, Tailscale-Gnome, greenlight, conjure-launcher preview, Ubuntu-Workspace-Manager, Video-Screensaver, paste-board, xi-extensions, GNOME-EXTENSIONS, gnome-grid-workspace-indicator (10)
- Settings file or dump loaded with `dconf load`: mouse-follows-focus, xi-extensions, Video-Screensaver (3)
- Extension's own keys preset: yatm, surface-dial-evolved, dropshade, ntfy-indicator, Wallfred, gnome-hdr-3d-lut, elfvision, nowplaying-card, nublet, gnome-widget-panel, MacOSWorkspaces, quota-glance (inside the shell) (12)
- Color scheme preset: gnome-shell-extension-window-groups, surface-dial-evolved, gnome-shell-extension-genai-usage, headroom, eureka, gnome-widget-panel (6)
- Input sources, shortcuts, hot corners, numlock, favorites or cursor theme preset: minibar, daily-time-tracker, Magunetto, xi-extensions, conjure-launcher preview, paste-board, screenshot-utils, greenlight (8)
- Animations, automount or accessibility toggled: nowplaying-card, islet, notification-sidebar, isobar-contour (4)
- Session mode's bundled extensions or search providers disabled: screenshot-utils, conjure-launcher preview (2)
- Settings written only when the keyfile is absent: froonty-gnome, GNOME-EXTENSIONS (2)
- Writes checked or guarded: BananaTray, dropshade, notification-sidebar (3)
- Only environment variables, no settings: milkdrop-extension, astra-monitor, dictation (3)
- Written into the real session's settings: myPets, gnome-extension-milkdrop-viz, authenticator-companion (3)
- Left to a project helper script: gapia-desktop (1)
- Not handled: gnome-shell-extension-ddterm, bin, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, eave, gnome-shell-extension-window-nativizer, praya-gnome-shell-extension, zclock, vocis, 860-control, System-Monitor-GNOME-Extension (12)

### B6. Installing the extension

- `gnome-extensions install` of a bundle: gnome-shell-extension-ddterm, mouse-follows-focus, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, astra-monitor, islet, gnome-grid-workspace-indicator, ntfy-indicator, panthea-gnome, screenshot-utils, System-Monitor-GNOME-Extension (12)
- Bundle unzipped: ducktape, veil, greenlight, gnome-shell-extension-genai-usage, headroom, dictation, liquid-glass (7)
- Files copied: mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, Tuxistant, zclock, gnome-spotify-extension, gnome-shell-extension-liveradio, BananaTray, gnome-hdr-3d-lut, trai, window-tiling-control, MacOSWorkspaces, Gnome-Widgets, gnome-study-tracker, battery-buddy, wall-in, 860-control, vocis (18)
- Symlink to the checkout: bin, nublet, conjure-launcher preview, gnomepods, gnome-shell-extension-window-groups, Ubuntu-Workspace-Manager, froonty-gnome, islet, elfvision, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, Wallfred, gnome-widget-panel, ripowall, eureka, isobar-contour, dropshade, GNOME-EXTENSIONS, System-Monitor-GNOME-Extension (21)
- Left to a project target or helper script: chorus, conjure-launcher devkit, vibecheck, nowplaying-card, milkdrop-extension, yatm, gapia-desktop, earful, xi-extensions, eave, authenticator-companion, gnome-shell-extension-window-nativizer, praya-gnome-shell-extension, Video-Screensaver, myPets, notification-sidebar, Quick-Settings-Scroll, Tailscale-Gnome, quota-glance (19)
- Target is the real extensions dir: superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell (`--real-session-install`), astra-monitor, MacOSWorkspaces, vocis, eureka, System-Monitor-GNOME-Extension, Quick-Settings-Scroll, Tailscale-Gnome, Video-Screensaver, conjure-launcher devkit, GNOME-EXTENSIONS (13)
- Helper, driver or companion extensions installed beside it: Gnome-Widgets, desktop-launcher, battery-buddy, isobar-contour, 860-control, gnome-grid-workspace-indicator, liquid-glass, eureka, System-Monitor-GNOME-Extension (9)
- Left to the caller: arctis-companion (1)
- Not handled: homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, gnome-extension-milkdrop-viz, surface-dial-evolved, paste-board, lid-duo, desktop-launcher (8)

### B7. Enabling

- Through enabled-extensions in the nested settings before start: ducktape, mouse-follows-focus, veil, GNOME-EXTENSIONS, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, nowplaying-card, gnome-shell-extension-window-groups, Ubuntu-Workspace-Manager, Video-Screensaver, yatm, surface-dial-evolved, froonty-gnome, islet, gnome-spotify-extension, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, isobar-contour, screenshot-utils (60)
- `gnome-extensions enable` on the private bus before the shell starts: gnome-shell-extension-ddterm (1)
- `gnome-extensions enable` or D-Bus `EnableExtension` once the shell is up: zclock, praya-gnome-shell-extension, vocis, System-Monitor-GNOME-Extension, dictation, elfvision, 860-control, GNOME-EXTENSIONS (8)
- Extension state checked after start (State ACTIVE or GetExtensionInfo): GNOME-EXTENSIONS, Gnome-Widgets, gnome-widget-panel, arctis-companion, myPets, System-Monitor-GNOME-Extension (6)
- Settings key read back after writing: BananaTray (1)
- Through the real session's enabled-extensions or `gnome-extensions enable` on the host bus: myPets, gnome-extension-milkdrop-viz, authenticator-companion, astra-monitor, mini-eq run_gnome_extension_dev_shell (5)
- Enable command printed for the user: eave (1)
- Not done for the nested shell, hint to enable in the real session: Quick-Settings-Scroll, Tailscale-Gnome (2)
- Left to a project helper or test tool: milkdrop-extension, gapia-desktop, gnome-shell-extension-window-nativizer, quota-glance, panthea-gnome (5)
- Not handled: bin, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow (4)

### B8. Starting the shell

- `--devkit` window: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, bin, veil, homie-gnome, gnome-wayland-wallpaper-slideshow, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, 860-control (71)
- `--nested` window: gnome-shell-extension-auto-headphones, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, isobar-contour, gnome-shell-extension-ddterm, mini-eq run_gnome_extension_dev_shell, astra-monitor, eave, gnome-grid-workspace-indicator, liquid-glass, screenshot-utils (17)
- `--headless` with virtual monitors: GNOME-EXTENSIONS, System-Monitor-GNOME-Extension, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, 860-control, isobar-contour, screenshot-utils (13)
- Under Xephyr or Xvfb: gnome-shell-extension-ddterm, astra-monitor, screenshot-utils (3)
- `--devkit` with `--virtual-monitor`: conjure-launcher preview, eureka, wall-in, BananaTray (4)
- Session mode set with `--mode`: Video-Screensaver, trai, astra-monitor, screenshot-utils (4)
- `--unsafe-mode`: ducktape, gnome-shell-extension-window-nativizer, elfvision (3)
- `--automation-script`: conjure-launcher preview, screenshot-utils (2)
- Extra arguments forwarded to gnome-shell: gapia-desktop, gnome-spotify-extension, BananaTray (3)
- Inside bwrap or a user and mount namespace: dictation, elfvision, gapia-desktop, GNOME-EXTENSIONS (4)
- Size via MUTTER_DEBUG_DUMMY_MODE_SPECS: veil, mini-eq run_gnome_extension_dev_shell, astra-monitor, Ubuntu-Workspace-Manager, milkdrop-extension, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, liquid-glass (14)
- Size via MUTTER_DEBUG_DUMMY_MONITOR_CONFIG ini: bin (1)
- Size via `--virtual-monitor`: conjure-launcher preview, eureka, wall-in, BananaTray, GNOME-EXTENSIONS, System-Monitor-GNOME-Extension, Gnome-Widgets, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, 860-control, isobar-contour, screenshot-utils (16)
- Size via the Xephyr or Xvfb screen: astra-monitor, screenshot-utils (2)
- Size left to an inherited MUTTER_DEBUG_DUMMY_MODE_SPECS: gnome-shell-extension-ddterm, gnome-grid-workspace-indicator (2)
- Size left to gnome-shell-test-tool: quota-glance, panthea-gnome (2)
- No size set: mouse-follows-focus, ducktape, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, dictation, praya-gnome-shell-extension, dropshade, notification-sidebar, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, gnomepods, vibecheck, nowplaying-card, gnome-shell-extension-window-groups, zclock, Video-Screensaver, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, elfvision, paste-board, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, ripowall, lid-duo (48)
- Scale not set: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, bin, veil, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, 860-control, isobar-contour, screenshot-utils (83)

### B9. Readiness

- Polls for the nested Wayland socket: ducktape, mini-eq run_nested_flathub_extension_smoke, froonty-gnome, paste-board (4)
- Polls a D-Bus name or call on the nested bus (NameHasOwner, `gdbus wait`, introspect, Peer.Ping, ListExtensions, Eval): zclock, dictation, gnome-widget-panel, GNOME-EXTENSIONS, elfvision, Gnome-Widgets (6)
- Polls `gnome-extensions list` or `info` for the UUID or State ACTIVE: praya-gnome-shell-extension, vocis, 860-control, arctis-companion, notification-sidebar, GNOME-EXTENSIONS (6)
- Polls the shell's panel from a test script inside the shell: quota-glance (1)
- Polls for a done file written by a driver extension: isobar-contour (1)
- Left to an automation script, driver extension or test tool: conjure-launcher preview, screenshot-utils, eureka, panthea-gnome (4)
- Polls the log or the process list: mini-eq run_nested_flathub_extension_smoke, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension (3)
- Fixed sleep: Magunetto, myPets, gnome-extension-milkdrop-viz, battery-buddy, ripowall, isobar-contour, System-Monitor-GNOME-Extension, astra-monitor, liquid-glass, mini-eq run_gnome_extension_dev_shell, authenticator-companion, veil (12)
- Helper daemons, Xephyr or the system bus awaited: gnome-shell-extension-ddterm, BananaTray, nowplaying-card, froonty-gnome, elfvision (5)
- Not handled: mouse-follows-focus, bin, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, eave, gnome-grid-workspace-indicator, dropshade, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, gnomepods, vibecheck, gnome-shell-extension-window-groups, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, islet, gnome-spotify-extension, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, panthea-gnome, gnome-study-tracker, desktop-launcher, headroom, lid-duo, wall-in (48)

### B10. Interaction

- Eval, screenshot or UI-driving helpers, test scripts or driver extensions in the session: GNOME-EXTENSIONS, Gnome-Widgets, 860-control, battery-buddy, System-Monitor-GNOME-Extension, eureka, isobar-contour, screenshot-utils, conjure-launcher preview, panthea-gnome, ripowall, quota-glance (12)
- `--unsafe-mode`, or a helper extension that sets unsafe mode: ducktape, gnome-shell-extension-window-nativizer, elfvision, desktop-launcher (4)
- Preferences opened for the nested session: elfvision, notification-sidebar, gnome-widget-panel, battery-buddy (4)
- Preferences or other targets act on the real session: mouse-follows-focus, superbar, Wallfred (3)
- Apps, mock daemons, fake services, proxies or test windows started with the session: mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, Tuxistant, gnomepods, nowplaying-card, BananaTray, paste-board, Magunetto, arctis-companion, headroom, 860-control, vocis, liquid-glass, authenticator-companion, ripowall (15)
- Commands run in the nested environment from outside (`run`, `app`): froonty-gnome, Gnome-Widgets, GNOME-EXTENSIONS (3)
- Bus address or environment file for outside tools: homie-gnome, dictation, dropshade, surface-dial-evolved, islet, gnome-widget-panel, desktop-launcher, lid-duo, wall-in, froonty-gnome, GNOME-EXTENSIONS, Gnome-Widgets (12)
- Extra arguments forwarded to gnome-shell: gapia-desktop, gnome-spotify-extension (2)
- Host bus address forwarded to the extension: gnome-spotify-extension (1)
- Script for test apps named: gnome-shell-extension-window-groups (1)
- Nested display name, shortcuts or how to run the app printed: ducktape, xi-extensions, mini-eq run_gnome_extension_dev_shell (3)
- Not handled: gnome-shell-extension-ddterm, bin, veil, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, astra-monitor, myPets, gnome-extension-milkdrop-viz, eave, praya-gnome-shell-extension, gnome-grid-workspace-indicator, Tailscale-Gnome, Quick-Settings-Scroll, gnome-movement-breaks, gnome-extension-nowpill, chorus, greenlight, nublet, conjure-launcher devkit, vibecheck, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, window-tiling-control, MacOSWorkspaces, gnome-study-tracker (37)

### B11. Iteration

- Reload inside the running session: re-stage or compile schemas, disable, re-enable: GNOME-EXTENSIONS (1)
- Watches source files, restarts the shell with reinstall: nowplaying-card (1)
- Restart subcommand, or start restarts the running shell: dictation, Gnome-Widgets (2)
- Next run rebuilds, repacks, recopies or reinstalls: mouse-follows-focus, superbar, gnome-movement-breaks, greenlight, conjure-launcher devkit, yatm, astra-monitor, MacOSWorkspaces, ntfy-indicator, headroom, gnome-shell-extension-genai-usage, battery-buddy, wall-in, earful, gnome-widget-panel, panthea-gnome, gnome-grid-workspace-indicator, dropshade, Video-Screensaver, Tuxistant, gnome-study-tracker, BananaTray, daily-time-tracker (23)
- Extension linked to the checkout, used as is at the next start: bin, froonty-gnome, elfvision, islet, ripowall (5)
- Real session reloaded: System-Monitor-GNOME-Extension, Wallfred (2)
- Not handled: gnome-shell-extension-ddterm, ducktape, veil, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, praya-gnome-shell-extension, notification-sidebar, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, nublet, conjure-launcher preview, gnomepods, vibecheck, quota-glance, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, milkdrop-extension, surface-dial-evolved, gapia-desktop, gnome-spotify-extension, paste-board, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, gnome-hdr-3d-lut, trai, vocis, xi-extensions, window-tiling-control, arctis-companion, desktop-launcher, eureka, lid-duo, 860-control, isobar-contour, screenshot-utils (49)

### B12. Observing

- Shell output to the terminal: gnome-shell-extension-ddterm, ducktape, mouse-follows-focus, bin, homie-gnome, gnome-shell-extension-auto-headphones, astra-monitor, authenticator-companion, eave, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, gnome-extension-nowpill, chorus, greenlight, nublet, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, surface-dial-evolved, gapia-desktop, islet, gnome-spotify-extension, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, panthea-gnome, gnome-study-tracker, desktop-launcher, headroom, wall-in, isobar-contour, screenshot-utils (58)
- Output to a log file: dictation, GNOME-EXTENSIONS, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, mini-eq run_nested_flathub_extension_smoke, Tuxistant, yatm, froonty-gnome, paste-board, Gnome-Widgets, gnome-widget-panel, arctis-companion, battery-buddy, ripowall, eureka, lid-duo, 860-control, liquid-glass, myPets, gnome-extension-milkdrop-viz, veil (21)
- Output filtered for the extension's lines or errors: gnome-wayland-wallpaper-slideshow, zclock, Tailscale-Gnome, gnome-shell-extension-window-nativizer, gnome-widget-panel, myPets, ripowall, eureka, battery-buddy, arctis-companion, System-Monitor-GNOME-Extension, isobar-contour (12)
- Debug output turned on (G_MESSAGES_DEBUG, SHELL_DEBUG, extension log settings): gnome-wayland-wallpaper-slideshow, chorus, milkdrop-extension, gnome-shell-extension-tailscale, conjure-launcher devkit, gnome-hdr-3d-lut, astra-monitor, gnome-extension-milkdrop-viz, liquid-glass (9)
- Shell output discarded: elfvision (1)
- Shell exit status passed on as the script's: ducktape, bin, homie-gnome, gnome-shell-extension-auto-headphones, veil, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, Tuxistant, conjure-launcher devkit, vibecheck, quota-glance, eave, authenticator-companion, notification-sidebar, paste-board, gnome-shell-extension-genai-usage, screenshot-utils, 860-control, isobar-contour (19)
- Exit status set from log or state checks: arctis-companion, System-Monitor-GNOME-Extension, Gnome-Widgets, ripowall, isobar-contour (5)
- Exit status discarded or not read: gnome-wayland-wallpaper-slideshow, gnome-extension-milkdrop-viz, gnome-shell-extension-window-groups, nublet, dictation, astra-monitor, praya-gnome-shell-extension, gnome-widget-panel, lid-duo, froonty-gnome, nowplaying-card, vocis, System-Monitor-GNOME-Extension (13)
- Status or logs subcommands: GNOME-EXTENSIONS, Gnome-Widgets, dictation, System-Monitor-GNOME-Extension, Wallfred (5)
- Paths or preset values printed: gnome-shell-extension-window-groups, BananaTray, ntfy-indicator, daily-time-tracker, lid-duo, superbar (6)

### B13. Stopping

- EXIT trap only: superbar, gnome-movement-breaks, gnomepods, Ubuntu-Workspace-Manager, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, ntfy-indicator, Video-Screensaver, gnome-hdr-3d-lut, gnome-study-tracker, arctis-companion, isobar-contour, gnome-shell-extension-window-groups, Tuxistant, zclock, ripowall, headroom, liquid-glass, panthea-gnome, notification-sidebar, 860-control, conjure-launcher preview (23)
- Traps on INT and TERM, some also HUP, beside EXIT: chorus, mini-eq run_nested_flathub_extension_smoke, mini-eq run_gnome_extension_dev_shell, ducktape, praya-gnome-shell-extension, myPets, astra-monitor, vocis, xi-extensions, trai, BananaTray, screenshot-utils, elfvision, froonty-gnome, gnome-spotify-extension, conjure-launcher devkit, paste-board, System-Monitor-GNOME-Extension (18)
- Signal handlers exit with 128 plus the signal number: elfvision, froonty-gnome, gnome-spotify-extension, conjure-launcher devkit, paste-board (5)
- Signal handlers that do not exit: chorus, trai, BananaTray, astra-monitor, myPets, System-Monitor-GNOME-Extension (6)
- Ctrl+C caught in Python, child or process group stopped: nowplaying-card, gnome-widget-panel (2)
- Stop subcommand: GNOME-EXTENSIONS, Gnome-Widgets, dictation (3)
- Idle watchdog: GNOME-EXTENSIONS (1)
- Shell stopped by `timeout`, after a fixed time or after the test: gnome-wayland-wallpaper-slideshow, gnome-extension-milkdrop-viz, gnome-hdr-3d-lut, panthea-gnome, eureka, ripowall, System-Monitor-GNOME-Extension, battery-buddy, arctis-companion (9)
- Startup or state-wait timeouts: ducktape, mini-eq run_nested_flathub_extension_smoke, dictation, elfvision, 860-control, arctis-companion, isobar-contour, notification-sidebar, Gnome-Widgets, GNOME-EXTENSIONS (10)
- TERM, then KILL after a grace period: gnome-shell-extension-ddterm, nowplaying-card, notification-sidebar, dictation, GNOME-EXTENSIONS (5)
- Not handled: mouse-follows-focus, bin, veil, homie-gnome, gnome-shell-extension-auto-headphones, eave, authenticator-companion, gnome-shell-extension-window-nativizer, gnome-grid-workspace-indicator, dropshade, Tailscale-Gnome, Quick-Settings-Scroll, gnome-extension-nowpill, greenlight, nublet, vibecheck, quota-glance, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, islet, minibar, daily-time-tracker, earful, gnome-shell-extension-genai-usage, window-tiling-control, MacOSWorkspaces, Wallfred, desktop-launcher, lid-duo, wall-in (32)

### B14. Cleanup

- Temp or sandbox dir removed at exit: gnome-shell-extension-ddterm, ducktape, superbar, gnome-movement-breaks, mini-eq run_nested_flathub_extension_smoke, chorus, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, zclock, Ubuntu-Workspace-Manager, milkdrop-extension, gnome-spotify-extension, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, gnome-hdr-3d-lut, ntfy-indicator, trai, vocis, BananaTray, panthea-gnome, gnome-study-tracker, notification-sidebar, ripowall, 860-control, isobar-contour, screenshot-utils, System-Monitor-GNOME-Extension, liquid-glass (runtime dir), GNOME-EXTENSIONS (run dir), Gnome-Widgets (`run/`), elfvision (via a helper script) (34)
- Removal retried, or reported when it fails: conjure-launcher devkit, notification-sidebar, System-Monitor-GNOME-Extension, Gnome-Widgets (4)
- Own processes killed by PID, process group or environment marker: gnome-shell-extension-ddterm, ducktape, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, Tuxistant, gnomepods, zclock, froonty-gnome, paste-board, BananaTray, liquid-glass, notification-sidebar, vocis, Gnome-Widgets, arctis-companion, headroom, battery-buddy, 860-control, isobar-contour, praya-gnome-shell-extension, trai, Video-Screensaver, authenticator-companion, GNOME-EXTENSIONS, dictation, gnome-widget-panel, nowplaying-card, elfvision, System-Monitor-GNOME-Extension, gnome-shell-extension-window-nativizer (on failed start only) (30)
- Processes killed by `pkill -f` pattern: gnome-wayland-wallpaper-slideshow, ntfy-indicator, astra-monitor (3)
- FUSE mounts unmounted: froonty-gnome, Gnome-Widgets, panthea-gnome, System-Monitor-GNOME-Extension, notification-sidebar, liquid-glass, 860-control, screenshot-utils (8)
- Crash flag removed: nublet, Video-Screensaver, xi-extensions, gnome-widget-panel, GNOME-EXTENSIONS, ntfy-indicator (6)
- Real settings restored: myPets, ripowall (2)
- Run files removed (PID, bus or env files, settings dump, demo file, symlink, Xwayland cookie and locks): eureka, gnome-widget-panel, dictation, xi-extensions, Gnome-Widgets, froonty-gnome, battery-buddy, GNOME-EXTENSIONS (8)
- Processes stated as left running (bus-activated services, Xephyr, test windows, helpers, keyring daemon): gnome-shell-extension-ddterm, notification-sidebar, Gnome-Widgets, vocis, conjure-launcher devkit, astra-monitor, Magunetto, ripowall, liquid-glass, bin (10)
- Left to the caller or to a helper: veil, quota-glance, gnome-shell-extension-window-groups (3)
- Not handled: mouse-follows-focus, bin, homie-gnome, gnome-shell-extension-auto-headphones, eave, gnome-extension-milkdrop-viz, gnome-grid-workspace-indicator, dropshade, Tailscale-Gnome, Quick-Settings-Scroll, gnome-extension-nowpill, greenlight, vibecheck, yatm, surface-dial-evolved, gapia-desktop, islet, minibar, daily-time-tracker, earful, gnome-shell-extension-genai-usage, window-tiling-control, MacOSWorkspaces, Wallfred, desktop-launcher, lid-duo, wall-in (27)

## C. Properties

### C1. Generic or bound

- Generic, nothing project-specific: gnome-shell-extension-ddterm, gnome-shell-extension-auto-headphones, homie-gnome (3)
- Generic in the extension, tied to a caller, repo layout or project helper script: veil, GNOME-EXTENSIONS, conjure-launcher devkit, milkdrop-extension, eave, praya-gnome-shell-extension, gapia-desktop (7)
- Project defaults overridable by env variables: bin (1)
- Bound only through UUID, names or a log filter: notification-sidebar, gnome-study-tracker, desktop-launcher, gnome-wayland-wallpaper-slideshow (4)
- Bound to one project: ducktape, mouse-follows-focus, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, gnome-grid-workspace-indicator, dropshade, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher preview, gnomepods, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, yatm, surface-dial-evolved, froonty-gnome, islet, gnome-spotify-extension, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, 860-control, isobar-contour, screenshot-utils (68)

### C2. Interface

- Subcommands: gnome-shell-extension-ddterm, GNOME-EXTENSIONS, System-Monitor-GNOME-Extension, dictation, Wallfred, Gnome-Widgets, panthea-gnome, gnome-widget-panel, battery-buddy, froonty-gnome (10)
- Make or just targets: mouse-follows-focus, Quick-Settings-Scroll, Tailscale-Gnome, superbar, gnome-movement-breaks, gnome-extension-nowpill, earful, vocis, GNOME-EXTENSIONS (9)
- Options: gnome-shell-extension-ddterm, ducktape, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, greenlight, gnomepods, BananaTray, froonty-gnome, window-tiling-control, islet, liquid-glass, gnome-study-tracker, isobar-contour, 860-control, gnome-widget-panel, GNOME-EXTENSIONS, panthea-gnome (17)
- Positional arguments: ducktape, arctis-companion, headroom, lid-duo, ripowall, eureka, xi-extensions, desktop-launcher, screenshot-utils, surface-dial-evolved, 860-control, liquid-glass, gnome-grid-workspace-indicator, elfvision, gnome-shell-extension-window-nativizer (15)
- Arguments forwarded to gnome-shell: gapia-desktop, gnome-spotify-extension, BananaTray (3)
- Environment variables as inputs: bin, veil, gnome-shell-extension-ddterm, greenlight, nowplaying-card, gnome-shell-extension-window-groups, Ubuntu-Workspace-Manager, milkdrop-extension, surface-dial-evolved, froonty-gnome, islet, elfvision, ntfy-indicator, gnome-shell-extension-genai-usage, trai, window-tiling-control, MacOSWorkspaces, Wallfred, headroom, ripowall, eureka, lid-duo, wall-in, isobar-contour, screenshot-utils, praya-gnome-shell-extension, chorus, liquid-glass, System-Monitor-GNOME-Extension, GNOME-EXTENSIONS, conjure-launcher preview, notification-sidebar, Magunetto, gnome-grid-workspace-indicator, BananaTray, ducktape, conjure-launcher devkit, zclock, mini-eq run_nested_flathub_extension_smoke, panthea-gnome, nublet (41)
- Internal re-entry marker for the inner stage: Tuxistant, froonty-gnome, xi-extensions, headroom, 860-control, gnome-grid-workspace-indicator, paste-board, notification-sidebar, BananaTray (9)
- `key=value` lines as output: lid-duo (1)
- No arguments or variables: gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, homie-gnome, astra-monitor, myPets, gnome-extension-milkdrop-viz, eave, authenticator-companion, Video-Screensaver, yatm, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, minibar, daily-time-tracker, gnome-hdr-3d-lut, vibecheck, quota-glance, Tuxistant, paste-board, dropshade (20)

### C3. Several instances

- Own temp dir and bus per run: gnome-shell-extension-ddterm, ducktape, chorus, conjure-launcher devkit, conjure-launcher preview, gnomepods, zclock, Ubuntu-Workspace-Manager, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, earful, gnome-shell-extension-genai-usage, trai, BananaTray, elfvision, 860-control, isobar-contour, screenshot-utils, notification-sidebar, paste-board, mini-eq run_nested_flathub_extension_smoke, milkdrop-extension, gnome-spotify-extension, Tuxistant, superbar, gnome-movement-breaks, vocis, panthea-gnome, gnome-study-tracker, System-Monitor-GNOME-Extension, eureka, liquid-glass, ntfy-indicator, ripowall, xi-extensions, lid-duo (40)
- Unique nested socket name per run: ducktape, paste-board (2)
- Fixed sandbox, state or real dirs shared by all runs: mouse-follows-focus, Quick-Settings-Scroll, Tailscale-Gnome, mini-eq run_gnome_extension_dev_shell, gnome-extension-nowpill, greenlight, nublet, vibecheck, nowplaying-card, gnome-shell-extension-window-groups, Video-Screensaver, yatm, surface-dial-evolved, islet, gapia-desktop, MacOSWorkspaces, Wallfred, gnome-widget-panel, desktop-launcher, battery-buddy, wall-in, dropshade, gnome-grid-workspace-indicator, homie-gnome, headroom, window-tiling-control, gnome-shell-extension-auto-headphones, GNOME-EXTENSIONS, Gnome-Widgets, dictation, gnome-shell-extension-window-nativizer, froonty-gnome (32)
- Some names shared despite per-run dirs (display name, log, bus file, build dir, schemas, real extensions dir, real dconf): Tuxistant, mini-eq run_nested_flathub_extension_smoke, paste-board, superbar, gnome-movement-breaks, vocis, eureka, milkdrop-extension, gnome-spotify-extension, earful, daily-time-tracker, isobar-contour, panthea-gnome, gnome-study-tracker, Magunetto, liquid-glass, BananaTray, ntfy-indicator, ripowall, xi-extensions, lid-duo, arctis-companion, myPets, gnome-extension-milkdrop-viz, authenticator-companion, System-Monitor-GNOME-Extension (26)
- Separate instances through an env variable or option choosing the dir or display: greenlight, surface-dial-evolved, window-tiling-control, headroom, froonty-gnome, eureka, gnome-shell-extension-window-groups, BananaTray (8)
- Single instance: second start refused, reused or serialized, or earlier shells stopped or killed: froonty-gnome, dictation, Gnome-Widgets, GNOME-EXTENSIONS, gnome-shell-extension-window-nativizer, bin, gnome-wayland-wallpaper-slideshow, astra-monitor (8)
- Left to the caller or to a helper: veil, arctis-companion, quota-glance, praya-gnome-shell-extension (4)
- Not handled: eave (1)

### C4. Targets

- Version or `--devkit` support detected at run time: astra-monitor, eave, gnome-grid-workspace-indicator, screenshot-utils, MacOSWorkspaces, gapia-desktop, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, Video-Screensaver, battery-buddy, trai (Ubuntu mode file), liquid-glass (container) (12)
- `--devkit` for newer and `--nested` or Xephyr for older GNOME, by detection or choice: gnome-shell-extension-ddterm, astra-monitor, eave, gnome-grid-workspace-indicator, mini-eq run_gnome_extension_dev_shell, liquid-glass, screenshot-utils (7)
- `--devkit` as the only windowed mode: ducktape, mouse-follows-focus, bin, veil, homie-gnome, gnome-wayland-wallpaper-slideshow, myPets, gnome-extension-milkdrop-viz, authenticator-companion, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, dropshade, notification-sidebar, Tailscale-Gnome, Quick-Settings-Scroll, superbar, gnome-movement-breaks, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, zclock, Ubuntu-Workspace-Manager, Video-Screensaver, milkdrop-extension, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, gnome-spotify-extension, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, ntfy-indicator, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, eureka, lid-duo, wall-in, 860-control (65)
- `--nested` only: gnome-shell-extension-auto-headphones, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, isobar-contour (10)
- Headless mode: GNOME-EXTENSIONS, System-Monitor-GNOME-Extension, Gnome-Widgets, panthea-gnome, gnome-widget-panel, arctis-companion, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, 860-control, isobar-contour, screenshot-utils (13)
- GNOME versions named in a header, comment, message or helper metadata: gnome-shell-extension-ddterm, homie-gnome, Quick-Settings-Scroll, Tailscale-Gnome, astra-monitor, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, liquid-glass, quota-glance, gnome-shell-extension-window-groups, Video-Screensaver, froonty-gnome, BananaTray, Magunetto, earful, MacOSWorkspaces, gnome-widget-panel, gnome-study-tracker, desktop-launcher, battery-buddy, screenshot-utils (22)
- Debian or Ubuntu package hints (apt, mutter-dev-bin): mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, Tuxistant, conjure-launcher devkit, conjure-launcher preview, nowplaying-card, Ubuntu-Workspace-Manager, Video-Screensaver, froonty-gnome, BananaTray, gnome-widget-panel, gnome-study-tracker, battery-buddy, astra-monitor, vibecheck (15)
- Fedora or rpm hints (dnf, rpm, Fedora package names): eave, gnomepods, gnome-shell-extension-tailscale, dropshade, notification-sidebar, elfvision, panthea-gnome, astra-monitor (8)
- rpm-based distributions only: gapia-desktop (1)
- Arch paths or pacman: quota-glance, vibecheck (2)
- Nix: ducktape, daily-time-tracker, astra-monitor (3)
- Ubuntu session mode: Video-Screensaver, trai, screenshot-utils (3)
- Inside a distrobox, toolbox or Docker container: nublet, liquid-glass, 860-control, System-Monitor-GNOME-Extension (4)
- Wayland host or Wayland only: Tuxistant, nowplaying-card, BananaTray, elfvision, notification-sidebar, eureka, wall-in, 860-control, froonty-gnome, conjure-launcher devkit, conjure-launcher preview, gnomepods, vibecheck, Ubuntu-Workspace-Manager, ducktape, gnome-shell-extension-window-groups, screenshot-utils, liquid-glass (18)
- X display needed, or an X11 path: MacOSWorkspaces, gnome-shell-extension-ddterm, astra-monitor, screenshot-utils, liquid-glass, dictation, Wallfred (7)

### C5. Dependencies and size

- Bash: ducktape, bin, veil, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, GNOME-EXTENSIONS, astra-monitor, myPets, gnome-extension-milkdrop-viz, authenticator-companion, eave, gnome-shell-extension-window-nativizer, System-Monitor-GNOME-Extension, dictation, praya-gnome-shell-extension, gnome-grid-workspace-indicator, dropshade, notification-sidebar, liquid-glass, mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, greenlight, Tuxistant, conjure-launcher devkit, conjure-launcher preview, gnomepods, gnome-shell-extension-window-groups, zclock, Video-Screensaver, surface-dial-evolved, froonty-gnome, islet, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, Magunetto, minibar, daily-time-tracker, ntfy-indicator, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, panthea-gnome, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, ripowall, lid-duo, wall-in, isobar-contour (55)
- POSIX sh: chorus, nublet, Ubuntu-Workspace-Manager, milkdrop-extension, yatm, gapia-desktop, gnome-spotify-extension, gnome-shell-extension-tailscale, trai, arctis-companion, eureka, 860-control, screenshot-utils (13)
- zsh: gnome-hdr-3d-lut (1)
- Python 3: gnome-shell-extension-ddterm, nowplaying-card, gnome-widget-panel (3)
- GNU make with shell recipes: mouse-follows-focus, Quick-Settings-Scroll, Tailscale-Gnome, superbar, gnome-extension-nowpill, earful, vocis (7)
- just: gnome-movement-breaks (1)
- Node: vibecheck, quota-glance (2)
- Bun: gnome-shell-extension-genai-usage (1)
- bwrap: dictation, elfvision, gapia-desktop (3)
- distrobox: nublet, liquid-glass (2)
- Xephyr or xvfb-run: gnome-shell-extension-ddterm, astra-monitor, screenshot-utils (3)
- PipeWire and WirePlumber: veil, froonty-gnome, liquid-glass (3)
- flatpak: mini-eq run_nested_flathub_extension_smoke (1)
- Docker: System-Monitor-GNOME-Extension (1)
- gnome-shell-test-tool: quota-glance, panthea-gnome (2)
- xdg-dbus-proxy and setpriv: froonty-gnome (1)
- GStreamer `gst-launch-1.0`: GNOME-EXTENSIONS (1)
- Project build toolchains (tsc, npm, cargo, Go, Bun, node, eslint): astra-monitor, dictation, gnome-widget-panel, dropshade, BananaTray, vocis, gnome-shell-extension-genai-usage, liquid-glass, System-Monitor-GNOME-Extension (9)
- Up to 50 lines (for make and just files, the nested part): gnome-shell-extension-auto-headphones, lid-duo, wall-in, veil, homie-gnome, eureka, gnome-wayland-wallpaper-slideshow, nublet, gnomepods, yatm, gnome-extension-milkdrop-viz, gnome-hdr-3d-lut, milkdrop-extension, surface-dial-evolved, gnome-shell-extension-liveradio, trai, arctis-companion, zclock, Ubuntu-Workspace-Manager, minibar, Tuxistant, gnome-shell-extension-tailscale, gnome-shell-extension-window-groups, desktop-launcher, bin, chorus, praya-gnome-shell-extension, conjure-launcher preview, vibecheck, gnome-spotify-extension, isobar-contour, daily-time-tracker, dropshade, gnome-movement-breaks, earful, vocis, superbar, gnome-extension-nowpill, Quick-Settings-Scroll (39)
- 51 to 150 lines: authenticator-companion, eave, gnome-study-tracker, conjure-launcher devkit, mouse-follows-focus, islet, greenlight, quota-glance (three files), Magunetto, gnome-shell-extension-genai-usage, gnome-shell-extension-window-nativizer, headroom, screenshot-utils, Tailscale-Gnome, window-tiling-control, xi-extensions, Video-Screensaver, ripowall, gapia-desktop, gnome-grid-workspace-indicator, MacOSWorkspaces, ntfy-indicator, myPets, paste-board, 860-control, nowplaying-card, elfvision, panthea-gnome, notification-sidebar, battery-buddy (30)
- 151 to 400 lines: mini-eq run_nested_flathub_extension_smoke, astra-monitor, liquid-glass, Wallfred, dictation, mini-eq run_gnome_extension_dev_shell, ducktape, Gnome-Widgets, froonty-gnome, gnome-shell-extension-ddterm, BananaTray (11)
- Over 400 lines: System-Monitor-GNOME-Extension, GNOME-EXTENSIONS, gnome-widget-panel (3)

### C6. Kept between runs

- Nothing: gnome-shell-extension-ddterm, ducktape, chorus, gnomepods, zclock, gnome-spotify-extension, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, gnome-hdr-3d-lut, trai, notification-sidebar, screenshot-utils, elfvision (15)
- Sandbox, profile or state dir with settings, or per-run temp dirs left behind: gnome-shell-extension-ddterm (`--base-dir`), mouse-follows-focus, bin, homie-gnome, GNOME-EXTENSIONS, System-Monitor-GNOME-Extension, dictation, gnome-grid-workspace-indicator, dropshade, liquid-glass, Tailscale-Gnome, Quick-Settings-Scroll, mini-eq run_gnome_extension_dev_shell, gnome-extension-nowpill, greenlight, nublet, vibecheck, nowplaying-card, gnome-shell-extension-window-groups, Video-Screensaver, yatm, surface-dial-evolved, froonty-gnome, gapia-desktop, islet, paste-board, minibar, daily-time-tracker, earful, gnome-shell-extension-genai-usage, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, gnome-widget-panel, gnome-study-tracker, desktop-launcher, headroom, battery-buddy, eureka, lid-duo, wall-in, BananaTray (`--profile-dir`) (44)
- Logs, screenshots or other output files: mini-eq run_nested_flathub_extension_smoke, Tuxistant, myPets, gnome-extension-milkdrop-viz, gnome-shell-extension-window-nativizer, dictation, ripowall, arctis-companion, eureka, lid-duo, 860-control, gnome-widget-panel, paste-board, isobar-contour, panthea-gnome, System-Monitor-GNOME-Extension, yatm, froonty-gnome, Gnome-Widgets, battery-buddy, GNOME-EXTENSIONS (21)
- Build outputs in the repo (bundle, compiled schemas, translations, Docker images): mouse-follows-focus, superbar, gnome-movement-breaks, conjure-launcher preview, gnome-shell-extension-window-groups, Ubuntu-Workspace-Manager, nublet, gnome-grid-workspace-indicator, dropshade, astra-monitor, dictation, daily-time-tracker, ntfy-indicator, Wallfred, panthea-gnome, isobar-contour, eureka, System-Monitor-GNOME-Extension, gnome-widget-panel, gnome-extension-nowpill (20)
- Changes in the real session (installed or linked extension, settings, crash flag, processes, binaries): Quick-Settings-Scroll, Tailscale-Gnome, superbar, gnome-movement-breaks, mini-eq run_gnome_extension_dev_shell, Video-Screensaver, astra-monitor, vocis, MacOSWorkspaces, eureka, System-Monitor-GNOME-Extension, GNOME-EXTENSIONS, conjure-launcher devkit, gnome-extension-milkdrop-viz, authenticator-companion, ntfy-indicator (16)
- Session uses the real dirs, everything stays: gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow (2)
- Left to the caller or to a helper: veil, quota-glance, milkdrop-extension, authenticator-companion, gnome-shell-extension-window-nativizer, eave, praya-gnome-shell-extension, earful, xi-extensions, arctis-companion, conjure-launcher devkit (11)

### C7. License

- GPL-2.0-or-later (SPDX header): gnome-shell-extension-ddterm, superbar, myPets, Ubuntu-Workspace-Manager, islet, desktop-launcher (6)
- GPL-3.0-or-later (SPDX header): gnomepods, eave, froonty-gnome (3)
- Not stated in the launcher, a LICENSE file is packed or copied: Quick-Settings-Scroll, Tailscale-Gnome, gnome-movement-breaks, gnome-spotify-extension, ntfy-indicator, System-Monitor-GNOME-Extension, gnome-grid-workspace-indicator, panthea-gnome (8)
- Depends on the repository's license file, no notice in the launcher: mouse-follows-focus, ducktape, bin, veil, homie-gnome, gnome-shell-extension-auto-headphones, gnome-wayland-wallpaper-slideshow, Tuxistant, conjure-launcher devkit, conjure-launcher preview, vibecheck, quota-glance, nowplaying-card, gnome-shell-extension-window-groups, zclock, ripowall, eureka, lid-duo, wall-in, 860-control, isobar-contour, screenshot-utils (22)
- Not stated: mini-eq run_gnome_extension_dev_shell, mini-eq run_nested_flathub_extension_smoke, gnome-extension-nowpill, chorus, greenlight, nublet, Video-Screensaver, GNOME-EXTENSIONS, astra-monitor, gnome-extension-milkdrop-viz, authenticator-companion, gnome-shell-extension-window-nativizer, dictation, praya-gnome-shell-extension, dropshade, notification-sidebar, liquid-glass, milkdrop-extension, yatm, surface-dial-evolved, gapia-desktop, elfvision, paste-board, BananaTray, gnome-shell-extension-liveradio, gnome-shell-extension-tailscale, Magunetto, minibar, daily-time-tracker, gnome-hdr-3d-lut, earful, gnome-shell-extension-genai-usage, trai, vocis, xi-extensions, window-tiling-control, MacOSWorkspaces, Wallfred, Gnome-Widgets, gnome-widget-panel, arctis-companion, gnome-study-tracker, headroom, battery-buddy (44)
