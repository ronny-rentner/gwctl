# GNOME Window Control (gwctl)

A command-line interface for controlling GNOME windows through D-Bus.

## Features

- List all windows and their properties
- Move, resize, and manipulate windows
- Dynamic command generation based on available D-Bus methods
- Easy to use command-line interface

## Installation

```bash
pip install gwctl
```

## Requirements

- Python 3.9+
- GNOME Shell
- D-Bus (dbus-python)
- UltraClick
- 'Windows D-Bus Interface' GNOME Shell extension

## Usage

```bash
# Show version information
gwctl version

# List all windows
gwctl list

# Get details of a specific window
gwctl details WINDOW_ID

# Move a window
gwctl move WINDOW_ID X Y

# Check D-Bus connection status
gwctl setup check-connection
```

## License

MIT License
EOF < /dev/null
