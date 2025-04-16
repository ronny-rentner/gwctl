# GNOME Wayland Window Control (gwctl)

A command-line interface for controlling GNOME Wayland windows through D-Bus.

## Features

- List all windows and their properties
- Move, resize, and manipulate Wayland windows
- Dynamic command generation based on available D-Bus methods
- Easy to use command-line interface

## Installation

```bash
pip install gwctl
```

## Requirements

- Python 3.9+
- GNOME Shell with Wayland
- D-Bus (dbus-python)
- UltraClick
- 'Windows D-Bus Interface' GNOME Shell extension

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

# Combine filter and field extraction
gwctl --filter wm_class firefox --field id list

# Get details of a specific window
gwctl details WINDOW_ID

# Move a window
gwctl move WINDOW_ID X Y

# Check D-Bus connection status
gwctl setup check-connection
```

## Advanced Usage with jq

The `list` command outputs JSON data that can be piped to `jq` for filtering and formatting:

```bash
# List all windows and format the output
gwctl list | jq

# Filter windows by title (case-insensitive)
gwctl list | jq '.[] | select(.title | ascii_downcase | contains("firefox"))'

# Get just the window IDs and titles
gwctl list | jq '.[] | {id: .id, title: .title}'

# Find windows in a specific workspace
gwctl list | jq '.[] | select(.workspace == 1)'

# Find a window by title and get its ID (useful for scripting)
WINDOW_ID=$(gwctl list | jq -r '.[] | select(.title | contains("Terminal")) | .id')
gwctl move $WINDOW_ID 100 100

# List all windows on the primary monitor
gwctl list | jq '.[] | select(.monitor == 0)'

# Format windows list as a simple table with ID and title
gwctl list | jq -r '.[] | "\(.id)\t\(.title)"'

# Find and activate all Firefox windows (using jq)
gwctl list | jq -r '.[] | select(.wm_class | contains("firefox")) | .id' | xargs -n 1 gwctl activate

# Find and activate all Firefox windows (using built-in filter)
gwctl --filter wm_class firefox --field id list | xargs -n 1 gwctl activate
```

## License

MIT License
