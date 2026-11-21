# Testing

The extension has automated tests: `make test-shell` in `gwctl-wayland-api/` runs them in a headless GNOME Shell.

The tests of the `gwctl` command replace the session bus with the values the extension sends over it, so they need no
GNOME Shell: run `python -m unittest` in the repository root. CI runs them too, after checking that the package compiles,
builds and imports.

To try `gwctl` by hand against the real extension, run `make preview` in `gwctl-wayland-api/`, then `./gwctl-preview` in
the repository root.
