# Testing

The extension has automated tests: `make test-shell` in `gwctl-wayland-api/` runs them in a headless GNOME Shell.

The `gwctl` command has no automated tests yet. Test it against the preview: run `make preview` in
`gwctl-wayland-api/`, then `./gwctl-preview` in the repository root.

CI checks that the Python package compiles, builds and imports.
