#!/usr/bin/env python3

import sys
import json
import dbus
import subprocess
import os
import xml.etree.ElementTree as ET
import importlib.metadata
from functools import partial
from types import MethodType
import rich.console
import rich.highlighter
import rich.table
import rich.text
import ultraclick as click

# DBus constants
BUS_NAME = 'org.gnome.Shell'
DEFAULT_INTERFACES = [
    'org.gnome.Shell.Extensions.gwctlAPI',
    'org.gnome.Shell.Extensions.Windows'
]

# Click's parameter types read a filter value as the type of the field it is compared with, e.g. on or 1 as True.
FILTER_TYPES = {bool: click.BOOL, int: click.INT, str: click.STRING}

def matches(value, text):
    """Tells whether a field value equals the filter text, read the way Click reads the value's type, e.g. on as True."""
    return value == FILTER_TYPES[type(value)].convert(text, None, None)

def check_fields(entries, names):
    """Raises an error naming the fields that no entry has. Without entries, there is nothing to check against."""
    known = {key for entry in entries for key in entry}
    unknown = [name for name in names if name not in known]
    if entries and unknown:
        raise click.ClickException(f"Unknown field: {', '.join(unknown)}")

class JsonDataFormatter(type(click.output)):
    """Prints lists and dicts, the extension's data, as indented JSON and everything else as text."""

    def result(self, value):
        if isinstance(value, (list, dict)):
            click.echo(json.dumps(value, indent=2))
        else:
            super().result(value)

class PrettyDataFormatter(type(click.output)):
    """Prints lists of dicts and dicts, the extension's data, as tables with rich, and everything else as text."""

    def result(self, value):
        if isinstance(value, list):
            keys = list(value[0])[:self.max_columns] if value else []
            table = rich.table.Table(*keys)
            for item in value:
                table.add_row(*(self._cell(item[key]) for key in keys))
            rich.console.Console().print(table)
        elif isinstance(value, dict):
            table = rich.table.Table(show_header=False)
            for key, item in value.items():
                table.add_row(key, self._cell(item))
            rich.console.Console().print(table)
        else:
            super().result(value)

    def _cell(self, value):
        # Strings show as they are, without Rich markup; other values in their JSON spelling, highlighted by type.
        if isinstance(value, str):
            return rich.text.Text(value)
        return rich.highlighter.JSONHighlighter()(json.dumps(value))

def plain(value):
    """Converts dbus-python values, such as dbus.Boolean or dbus.String, into the plain Python types they stand for."""
    if isinstance(value, dbus.Boolean):
        return bool(value)
    if isinstance(value, dict):
        return {str(key): plain(item) for key, item in value.items()}
    if isinstance(value, list):
        return [plain(item) for item in value]
    if isinstance(value, str):
        return str(value)
    if isinstance(value, int):
        return int(value)
    return value

def iface_to_path(iface):
    """Derive DBus object path from interface name."""
    return '/' + iface.replace('.', '/')

class SetupCommand:
    """Tools for setting up and troubleshooting the GNOME Wayland window management interface."""

    @click.command()
    def install_extension(self):
        """Install or update the required GNOME Shell extension from a ZIP package."""
        uuid = "gwctl-wayland-api@kamuko.de"
        
        # 1. Search for extension ZIP packages
        zip_files = []
        search_paths = ['.', 'gwctl-wayland-api']
        
        for path in search_paths:
            if os.path.isdir(path):
                # Look for {uuid}.zip (new format) or *.shell-extension.zip (old format)
                zip_files += [os.path.join(path, f) for f in os.listdir(path) 
                             if f == f"{uuid}.zip" or f.endswith('.shell-extension.zip')]
        
        if not zip_files:
            click.output.headline("GNOME Wayland Extension Required")
            click.output.warning("No extension package (*.shell-extension.zip) found locally.\n")
            click.output.info(
                "This tool requires the 'gwctl API' extension to function.\n"
                "You can install it manually from the GNOME Extensions website:\n"
            )
            
            url = "https://extensions.gnome.org/"
            click.output.info(f"Website: [bold]{url}[/bold]\n")

            if click.confirm("Would you like to open the extensions website now?"):
                click.launch(url)
            return

        # 2. Package found - Check installation status
        zip_files.sort(reverse=True)
        target_zip = zip_files[0]
        
        target_path = os.path.expanduser(f"~/.local/share/gnome-shell/extensions/{uuid}")
        is_installed = os.path.exists(target_path)

        click.output.headline("GNOME Wayland Extension Setup")
        click.output.info(f"Package found: [bold]{target_zip}[/bold]")
        
        if is_installed:
            click.output.info(f"Status: [green]Installed[/green] ({uuid})")
            prompt = "Update already installed extension?"
            use_force = True
        else:
            click.output.info("Status: [red]Not Installed[/red]")
            prompt = "Install extension now?"
            use_force = False

        if click.confirm(f"\n{prompt}"):
            try:
                cmd = ['gnome-extensions', 'install']
                if use_force:
                    cmd.append('--force')
                cmd.append(target_zip)
                
                subprocess.run(cmd, check=True)
                click.output.success("Extension installed successfully.")
                
                # Attempt to enable
                click.output.info(f"Attempting to enable [bold]{uuid}[/bold]...")
                result = subprocess.run(['gnome-extensions', 'enable', uuid], capture_output=True, text=True)
                if result.returncode == 0:
                    click.output.success("Extension enabled successfully!")
                    if is_installed:
                        # GNOME Shell keeps the extension code it loaded at login, so the new files only take effect then.
                        click.output.warning("GNOME Shell keeps running the old version until you log out and back in.")
                else:
                    click.output.warning("Could not enable automatically (Shell restart likely required).")
                    click.output.info("\n[bold]Required next steps:[/bold]")
                    click.output.info("1. Restart GNOME Shell (Log out and back in)")
                    click.output.info(f"2. Enable manually: [bold]gnome-extensions enable {uuid}[/bold]")

            except subprocess.CalledProcessError as e:
                click.output.error(f"Installation failed: {e}")
            except Exception as e:
                click.output.error(f"An unexpected error occurred: {e}")

    @click.command()
    def check_connection(self):
        """Check D-Bus connection status.

        This command provides information about the D-Bus connection
        status and helps diagnose why the window management interface
        might not be available.
        """
        # The root group owns the instance that established the D-Bus connection.
        root = click.ctx.find_root()
        control = root.meta[root.command.instance_key]
        methods = control.meta.get('methods', {})
        iface_name = control.meta.get('iface_name', 'Unknown')

        if methods:
            click.output.success("D-Bus connection successful")
            return (
                f"Connected to: {iface_name}\n"
                f"Available methods: {len(methods)}\n\n"
                "Window management functionality is available."
            )
        else:
            click.output.error(f"Could not connect to GNOME Shell D-Bus interface")
            click.ctx.forward(self.install_extension)


def create_method_command(method_name, details):
    """Define a D-Bus method with pending CLI decorators."""

    def method_command(self, **kwargs):
        return self._call_dbus_method(method_name, **kwargs)

    method_command = partial(method_command, **{
        name: default for name, type_code, desc, default in details.get('in_args', []) if default is not None
    })
    method_command = click.command(name=method_name.lower())(method_command)

    # Set callback name to match the command name for ultraclick
    #method_command.callback.__name__ = method_name.lower()

    help_text = details.get('desc', f"Call the {method_name} D-Bus method.")

    # Process arguments
    for name, type_code, desc, default in details.get('in_args', []):
        if type_code == 'b':
            if default is not None:
                # The flag name and active value depend on the boolean default.
                method_command = click.option(f'--{"no-" if default else ""}{name}', name, is_flag=True, flag_value=not default, default=default, help=desc)(method_command)
            else:
                method_command = click.option(f'--{name}', name, is_flag=True, help=desc)(method_command)
            continue

        # Map D-Bus type to Click type
        if type_code in ['i', 'u', 'x', 't']:
            click_type = click.INT
        elif type_code == 'd':
            click_type = click.FLOAT
        else:
            click_type = click.STRING

        if default is not None:
            method_command = click.option(f'--{name.replace("_", "-")}', name, type=click_type, default=default, help=desc)(method_command)
        else:
            help_text += f"\n\n{name.upper()}  {desc}\n"
            # A D-Bus array takes all remaining command line arguments.
            method_command = click.argument(name, type=click_type, nargs=-1 if type_code.startswith('a') else 1)(method_command)

    method_command.__doc__ = help_text
    return method_command

class GnomeWindowControl:
    """GNOME Wayland Window Control.

    This tool provides commands for interacting with GNOME Wayland windows through D-Bus.
    Commands are dynamically generated based on the methods available on the D-Bus interface.
    """

    setup = SetupCommand

    @classmethod
    def parse_introspection(cls, xml_str, interface_name):
        """
        Parse D-Bus introspection XML and extract method information.
        Returns a dictionary mapping method names to their details:
          - 'desc': method description
          - 'in_args': input arguments as (name, type, description, default) tuples
          - 'out_args': output arguments as (name, type, description, default) tuples
        An absent default is None.
        """
        root = ET.fromstring(xml_str)
        iface_elem = None
        for iface in root.findall('interface'):
            if iface.get('name') == interface_name:
                iface_elem = iface
                break
        if iface_elem is None:
            raise Exception(f"Interface {interface_name} not found in introspection data")

        methods = {}
        for method in iface_elem.findall('method'):
            mname = method.get('name')

            # Extract method description
            mdesc = ''
            for anno in method.findall('annotation'):
                if anno.get('name') == 'Description':
                    mdesc = anno.get('value')
                    break

            in_args = []
            out_args = []
            for arg in method.findall('arg'):
                arg_desc = ''
                arg_default = None
                for anno in arg.findall('annotation'):
                    if anno.get('name') == 'Description':
                        arg_desc = anno.get('value')
                    elif anno.get('name') == 'Default':
                        arg_default = anno.get('value')
                        if arg.get('type') in ['i', 'u', 'x', 't']:
                            arg_default = int(arg_default)
                        elif arg.get('type') == 'd':
                            arg_default = float(arg_default)
                        elif arg.get('type') == 'b':
                            arg_default = click.BOOL.convert(arg_default, None, None)

                arg_tuple = (arg.get('name'), arg.get('type'), arg_desc, arg_default)

                if arg.get('direction') == 'in':
                    in_args.append(arg_tuple)
                elif arg.get('direction') == 'out':
                    out_args.append(arg_tuple)
                else:
                    raise Exception('Cannot parse DBus XML')

            methods[mname] = {
                'desc': mdesc,
                'in_args': in_args,
                'out_args': out_args
            }
        return methods

    def setup_commands(self, interface=None):
        """Dynamically set up D-Bus commands and return connection metadata.

        This method:
        1. Establishes D-Bus connections (trying fallbacks)
        2. Performs introspection
        3. Registers dynamic commands
        4. Returns a metadata dictionary with D-Bus resources
        """
        meta = { 'methods': [] }
        bus = dbus.SessionBus()
        working_iface = None
        last_error = None

        for iface_name in ([interface] if interface else DEFAULT_INTERFACES):
            obj_path = iface_to_path(iface_name)
            try:
                obj = bus.get_object(BUS_NAME, obj_path)
                introspect_xml = obj.Introspect(dbus_interface='org.freedesktop.DBus.Introspectable')
                methods = self.parse_introspection(introspect_xml, iface_name)
                
                working_iface = iface_name
                meta['dbus_bus'] = bus
                meta['dbus_obj'] = obj
                meta['dbus_iface'] = dbus.Interface(obj, dbus_interface=iface_name)
                meta['iface_name'] = iface_name
                meta['obj_path'] = obj_path
                meta['methods'] = methods

                # Each instance exposes the commands discovered on its own connection.
                for method_name, details in methods.items():
                    cmd_name = method_name.lower()
                    cmd = create_method_command(method_name, details)
                    setattr(self, cmd_name, MethodType(cmd, self))
                
                break
            except Exception as e:
                last_error = e
                continue

        if not working_iface:
            click.output.error(f"D-Bus connection failed: {last_error}")
            click.output.info("Use 'gwctl setup check-connection' for diagnostics.")

        return meta

    @click.option("--verbose", is_flag=True, help="Enable verbose output")
    @click.option("--interface", help="Specify the D-Bus interface name")
    @click.option("--filter", nargs=2, is_eager=True, multiple=True, help="Filter JSON output by field and value (e.g., --filter wm_class firefox)")
    @click.option("--field", multiple=True, help="Extract only the specified field from results (e.g., --field id); repeatable")
    @click.option("--json/--no-json", "json_output", help="Print results as JSON; by default only in plain text output, such as a pipe")
    @click.option("--max-columns", type=int, help="Maximum number of columns in tables, which show results without --json")
    def __init__(self, verbose=False, interface=None, filter=None, field=None, json_output=None, max_columns=8):
        print_json = click.output.plain if json_output is None else json_output
        if print_json:
            click.use_formatter(JsonDataFormatter)
        else:
            click.use_formatter(PrettyDataFormatter)
            click.output.max_columns = max_columns

        self.verbose = verbose
        self.interface = interface
        self.filter = filter
        self.field = field

        self.meta = self.setup_commands(interface)

        # Share options with child commands
        self.meta['verbose'] = verbose
        self.meta['interface'] = interface
        self.meta['filter'] = filter
        self.meta['field'] = field
        self.meta['json'] = json_output

        if verbose:
            iface_name = self.meta.get('iface_name', 'Unknown')
            obj_path = self.meta.get('obj_path', 'Unknown')
            click.output.info(f"Connected to {iface_name} at {obj_path}")
            click.output.info(f"Found {len(self.meta['methods'])} methods")
            if filter:
                filters_str = ", ".join([f"{f[0]}={f[1]}" for f in filter])
                click.output.info(f"Filtering results: {filters_str}")
            if field:
                click.output.info(f"Extracting fields: {', '.join(field)}")

    @property
    def methods(self):
        """Access the available D-Bus methods."""
        return self.meta['methods']

    def _call_dbus_method(self, method_name, **kwargs):
        """Execute a D-Bus method call and process its result."""
        iface = self.meta['dbus_iface']

        # Look up each D-Bus input argument by name in kwargs to build the positional argument list.
        args = [kwargs[name] for name, type_code, desc, default in self.methods[method_name]['in_args']]

        # Dynamically invoke the method with positional arguments
        result = getattr(iface, method_name)(*args)

        # If result is a tuple with one element, unwrap it
        if isinstance(result, tuple) and len(result) == 1:
            result = result[0]

        # Filter out None results
        if result is None:
            return

        result = plain(result)

        # Apply filters if present
        filters = self.meta.get('filter')
        if filters and isinstance(result, list):
            check_fields(result, [field for field, value in filters])
            # Apply each filter criteria
            for field, value in filters:
                result = [item for item in result if matches(item[field], value)]

        # Extract specific fields if requested
        fields = self.meta.get('field')
        if fields and isinstance(result, list):
            check_fields(result, fields)
            # Only an explicit --json gives the fields as JSON; by default they stay lines that tools like xargs read.
            if self.meta.get('json'):
                return [{name: item[name] for name in fields} for item in result]
            # Print one line per entry, its fields separated by tabs, for easy piping
            return "\n".join("\t".join(str(item[name]) for name in fields) for item in result)

        return result

    @click.command()
    def version(self):
        """Show version and system information.

        Displays the version of gwctl along with information about
        the connected D-Bus interface.
        """
        # Get version from package metadata
        version = importlib.metadata.version('gwctl')
        iface_name = self.meta.get('iface_name', 'Unknown')
        
        dbus_info = f"Connected to: {iface_name}\n" \
                   f"Available methods: {len(self.methods)}"

        return f"gwctl v{version} - GNOME Wayland Window Control\n\n{dbus_info}"


def main():
    """Entry point for the application when installed as a package."""
    # Run CLI with this context
    try:
        click.group_from_class(GnomeWindowControl, name="gwctl")()
    except dbus.exceptions.DBusException as error:
        click.output.error(str(error))
        sys.exit(1)

if __name__ == "__main__":
    # For direct script execution
    main()
