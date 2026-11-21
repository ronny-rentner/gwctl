# GNOME Wayland Window Control (gwctl)

A command-line interface for controlling GNOME Wayland windows through D-Bus.
gwctl lists, moves, resizes, focuses and closes windows on GNOME under Wayland, from the command line, from Python and
over D-Bus.

## Features

- List all windows and their properties
- Move, resize, and manipulate Wayland windows
- Dynamic command generation based on available D-Bus methods
- Easy to use command-line interface

## How it works

gwctl comes in two parts. A GNOME Shell extension runs inside GNOME Shell, which manages all windows under Wayland,
and exposes window functions over D-Bus. The `gwctl` command calls these functions.

## Installation

```bash
git clone https://github.com/ronny-rentner/gwctl.git
cd gwctl
pip install .

# Install and enable the extension
gwctl setup install-extension
```

## Requirements

- Python 3.10+
- GNOME Shell with Wayland
- D-Bus (dbus-python)
- UltraClick
- The 'gwctl API' GNOME Shell extension from this repository

### Optional
- [jq](https://jqlang.github.io/jq/) - for advanced filtering and formatting of JSON output

## Shell Completion

### Bash

```bash
# Add to your ~/.bashrc for permanent completion
eval "$(_GWCTL_COMPLETE=bash_source gwctl)"
```

### Zsh

```bash
# Add to your ~/.zshrc for permanent completion
eval "$(_GWCTL_COMPLETE=zsh_source gwctl)"
```

## Usage

In a terminal, gwctl shows results as tables. In a pipe or a file, it prints JSON, so `jq` and scripts can read it.
`--json` and `--no-json` choose explicitly, and `--max-columns` limits how many columns a table shows (default 8).

```bash
# Show version information
gwctl version

# List all windows
gwctl list

# Filter windows by field
gwctl --filter wm_class firefox list

# Filter by multiple criteria 
gwctl --filter wm_class firefox --filter focus true list

# Extract specific field from results
gwctl --field id list

# Extract several fields: one line per window, the values separated by tabs
gwctl --field id --field title list

# Combine filter and field extraction
gwctl --filter wm_class firefox --field id list

# Get details of a specific window
gwctl details WINDOW_ID

# Move a window
gwctl move WINDOW_ID X Y

# List workspaces with their names
gwctl listworkspaces

# Show a window on all workspaces, and again only on the active one
gwctl stick WINDOW_ID
gwctl unstick WINDOW_ID

# Check D-Bus connection status
gwctl setup check-connection
```

## Python Usage

Construct `GnomeWindowControl` directly to connect to D-Bus and discover the available methods:

```python
from gwctl import GnomeWindowControl

control = GnomeWindowControl()
windows = control.list()
control.move(winid=123, x=100, y=100)
```

Method names are lowercase D-Bus method names. Pass all input arguments by keyword, using their D-Bus names
and Python types; boolean arguments must be supplied explicitly. `control.methods` lists the available
methods and their argument definitions.

Constructor options work from Python too:

```python
control = GnomeWindowControl(filter=[('wm_class', 'firefox')], field=['id'])
print(control.list())
```

These calls run in the current Python process without command-line parsing or a Click context.

## Advanced Usage with jq

The `list` command outputs JSON data that can be piped to `jq` for filtering and formatting:

```bash
# List all windows and format the output
gwctl list | jq

# Filter windows by title (case-insensitive)
gwctl list | jq '.[] | select(.title | ascii_downcase | contains("firefox"))'

# Get just the window IDs and titles
gwctl list | jq '.[] | {id: .id, title: .title}'

# Find the windows of workspace 1; add "or .on_all_workspaces" for those shown on every workspace
gwctl list | jq '.[] | select(.workspace == 1)'

# Find a window by title and get its ID (useful for scripting)
WINDOW_ID=$(gwctl list | jq -r '.[] | select(.title | contains("Terminal")) | .id')
gwctl move $WINDOW_ID 100 100

# List all windows on the first monitor
gwctl list | jq '.[] | select(.monitor == 0)'

# Format windows list as a simple table with ID and title
gwctl list | jq -r '.[] | "\(.id)\t\(.title)"'

# Find and activate all Firefox windows (using jq)
gwctl list | jq -r '.[] | select(.wm_class | contains("firefox")) | .id' | xargs -n 1 gwctl activate

# Find and activate all Firefox windows (using built-in filter)
gwctl --filter wm_class firefox --field id list | xargs -n 1 gwctl activate
```

## Development

To set up a development environment:

1.  **Clone the repository**
2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  **Install development dependencies:**
    ```bash
    pip install -e .[dev,test]
    ```
4.  **Build the project:**
    ```bash
    python -m build
    ```

### Trying the extension

The extension can run in a GNOME Shell of its own, isolated from your session. This needs GNOME Shell 49 or later with
Mutter's development kit. In `gwctl-wayland-api/`:

```bash
# GNOME Shell with the extension in a window; its state is kept in build/preview
make preview
# Delete the preview's state
make clean-env
# Run automated tests in a headless GNOME Shell
make test-shell
```

While the preview runs, `gwctl-preview` in the repository root runs gwctl against it instead of your session:

```bash
./gwctl-preview key h i Return
```

## License

GNU General Public License version 3 or later. See [LICENSE.txt](LICENSE.txt).
