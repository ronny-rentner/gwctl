# edpenz/mouse-follows-focus `Makefile`

## A. Shared with the real session

A1. PROFILE_ENV sets HOME, XDG_CONFIG_HOME, XDG_DATA_HOME, XDG_CACHE_HOME and XDG_STATE_HOME under `$(CURDIR)/build/profile`; XDG_RUNTIME_DIR and TMPDIR stay real. [Makefile:37-43]
A2. No DCONF_PROFILE or GSETTINGS_BACKEND. [Makefile:39]
A3. Separate `dbus-run-session` buses for `dconf load` and for the shell; `gnome-extensions install` runs with the inherited host session bus; the systemd user manager is not handled. [Makefile:48, Makefile:49, Makefile:54]
A4. Not handled. [Makefile:38-43]
A5. `gnome-shell --devkit --wayland --no-x11`: Xwayland is off; the host Wayland display and DISPLAY are inherited. [Makefile:38-43, Makefile:54]
A6. Not handled. [Makefile:38-43]
A7. Not handled; HOME is redirected, SSH_AUTH_SOCK and keyring variables are inherited. [Makefile:38-43]
A8. Sets GIO_USE_VFS=local; portals are not handled. [Makefile:38-43]
A9. Not handled; make runs the shell in the foreground. [Makefile:54]
A10. Not handled. [Makefile:52-54]
A11. Not handled. [Makefile:52-54]
A12. Installs the bundle into the profile and loads `test-profile.ini` into the profile's dconf. The other targets `install`, `uninstall`, `enable`, `disable` and `prefs` act on the real session. [Makefile:17-30, Makefile:46-50]
A13. Not handled; no downloads. [Makefile:11-13]

## B. Lifecycle

B1. Checks that `/usr/libexec/mutter-devkit` is executable; no version detection, and jq, gnome-extensions, dconf, dbus-run-session and gnome-shell are not checked. [Makefile:1, Makefile:53]
B2. `gnome-extensions pack --force --extra-source=lib` builds the bundle when a source file changes. [Makefile:5, Makefile:11-15]
B3. Creates `build/profile` and reuses it; a stamp file reruns the setup when the bundle, `test-profile.ini` or the Makefile change; `make clean` resets it. [Makefile:32-33, Makefile:37, Makefile:45-50]
B4. `dbus-run-session` wraps `dconf load` and the shell, each with its own bus; `gnome-extensions install` gets none. [Makefile:48, Makefile:49, Makefile:54]
B5. Depends on `test-profile.ini`; the Makefile substitutes `@UUID@` with sed and loads it with `dconf load /`. [Makefile:49]
B6. `gnome-extensions install --force` with PROFILE_ENV. [Makefile:48]
B7. Depends on `test-profile.ini`; the Makefile only loads it into dconf. [Makefile:49]
B8. `gnome-shell --devkit --wayland --no-x11`; size and scale not handled. [Makefile:54]
B9. Not handled. [Makefile:54]
B10. Not handled for the nested shell; the `prefs` target opens preferences in the real session. [Makefile:29-30]
B11. Rerunning `make test-shell` repacks and reinstalls changed sources. [Makefile:11, Makefile:46-52]
B12. Output goes to the terminal. [Makefile:54]
B13. Not handled. [Makefile:52-54]
B14. Not handled; the profile stays until `make clean`. [Makefile:32-33]

## C. Properties

C1. Bound to this project: the UUID comes from `metadata.json`, but the source list, `--extra-source=lib` and `test-profile.ini` belong to this project. [Makefile:1, Makefile:5, Makefile:13, Makefile:46-49]
C2. Make targets `test-profile` and `test-shell`; no documented variables. [Makefile:45, Makefile:52]
C3. Two runs share `build/profile` and its dconf db; each gets its own bus. [Makefile:37, Makefile:54]
C4. `--devkit` with the hardcoded path `/usr/libexec/mutter-devkit`; no version or distribution detection. [Makefile:53-54]
C5. GNU make, jq, sed, gnome-extensions, dconf, dbus-run-session, gnome-shell; 54 lines. [Makefile:1, Makefile:5, Makefile:13, Makefile:37, Makefile:48-54]
C6. `build/profile` with its stamp and dconf db, and the bundle in `dist`. [Makefile:4, Makefile:37, Makefile:45-50]
C7. Depends on the repository's license file; the given file has no license notice. [Makefile:1-54]
