# gwctl (GNOME Wayland Window Control)

A Python-based command-line interface for controlling GNOME Wayland windows via D-Bus.

## Project Overview

`gwctl` allows users to list, move, resize, and manipulate windows in a GNOME Wayland session. It works by communicating with a specific GNOME Shell extension (e.g., `org.gnome.Shell.Extensions.gwctlAPI`) over D-Bus.

**Key Features:**
*   **Dynamic Command Generation:** CLI commands are generated dynamically based on the available methods introspected from the D-Bus interface.
*   **Filtering & Output:** Supports filtering window lists and outputting JSON for processing with tools like `jq`.
*   **Ultraclick:** Uses `ultraclick` for a rich CLI experience.

## Architecture

*   **Entry Point:** `src/gwctl.py` contains the main logic, `GnomeWindowControl` class, and D-Bus interaction code.
*   **D-Bus Integration:** Uses `dbus-python` to talk to `org.gnome.Shell`. It looks for interfaces like `org.gnome.Shell.Extensions.gwctlAPI` or `org.gnome.Shell.Extensions.Windows`.
*   **Configuration:** `pyproject.toml` handles packaging and dependencies.

## Development Workflow

### Prerequisites

*   Python 3.9+
*   GNOME Shell with Wayland
*   `dbus-python` dependencies (system-level headers might be needed, e.g., `libdbus-1-dev`, `libglib2.0-dev`).

### Setup

1.  **Create a Virtual Environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Install Dependencies:**
    ```bash
    pip install -e .[dev,test]
    ```

### Building

To build the package distribution:

```bash
pip install build
python -m build
```

### Testing

**Note:** Automated unit tests are **not** currently implemented because the tool requires a running GNOME Wayland session with the specific extension installed to function. Testing is primarily manual.

## Key Files

*   `src/gwctl.py`: Main source code.
*   `pyproject.toml`: Project metadata, dependencies, and build config.
*   `README.md`: User documentation and usage examples.

## Conventions

*   **Packaging:** Modern Python packaging using `pyproject.toml` and `setuptools`.
*   **CLI Design:** Uses `ultraclick`. Commands are often mapped directly to D-Bus methods.