#!/usr/bin/env python3

import sys
import json
import dbus
import subprocess
import os
import xml.etree.ElementTree as ET
import importlib.metadata
import ultraclick as click

# DBus constants
BUS_NAME = 'org.gnome.Shell'
DEFAULT_INTERFACES = [
    'org.gnome.Shell.Extensions.gwctlAPI',
    'org.gnome.Shell.Extensions.Windows'
]

def iface_to_path(iface):
    """Derive DBus object path from interface name."""
    return '/' + iface.replace('.', '/')

class SetupCommand:
    """Tools for setting up and troubleshooting the GNOME Wayland window management interface."""

    @click.command()
    def install_extension(self):
        """Install or update the required GNOME Shell extension."""
        # Search for extension ZIP in local directories
        zip_files = []
        search_paths = ['.', 'gwctl-wayland-api']
        uuid = "gwctl-wayland-api@kamuko.de"  # Default fallback
        
        # Try to find UUID from metadata.json
        if os.path.isdir('gwctl-wayland-api'):
            metadata_path = os.path.join('gwctl-wayland-api', 'metadata.json')
            if os.path.exists(metadata_path):
                try:
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                        uuid = metadata.get('uuid', uuid)
                except Exception:
                    pass

        for path in search_paths:
            if os.path.isdir(path):
                for f in os.listdir(path):
                    if f.endswith('.shell-extension.zip'):
                        zip_files.append(os.path.join(path, f))
        
        if zip_files:
            zip_files.sort(reverse=True)
            target_zip = zip_files[0]
            
            click.output.headline("GNOME Wayland Window Management API Extension Found")
            click.output.info(f"Package: [bold]{target_zip}[/bold]")
            click.output.info(f"UUID: [bold]{uuid}[/bold]\n")
            
            if click.confirm("Would you like to install and enable it now?"):
                try:
                    # Install
                    subprocess.run(['gnome-extensions', 'install', '--force', target_zip], check=True)
                    click.output.success("Extension installed successfully.")
                    
                    # Attempt to enable
                    click.output.info(f"Attempting to enable [bold]{uuid}[/bold]...")
                    result = subprocess.run(['gnome-extensions', 'enable', uuid], capture_output=True, text=True)
                    
                    if result.returncode == 0:
                        click.output.success("Extension enabled successfully!")
                    else:
                        click.output.warning("Could not enable extension automatically.")
                        click.output.info("This is common on Wayland right after installation.")
                        click.output.info("\n[bold]Required next steps:[/bold]")
                        click.output.info("1. Restart GNOME Shell (Log out and back in)")
                        click.output.info(f"2. Enable manually if needed: [bold]gnome-extensions enable {uuid}[/bold]")
                except subprocess.CalledProcessError as e:
                    click.output.error(f"Operation failed: {e}")
                except Exception as e:
                    click.output.error(f"An unexpected error occurred: {e}")
        else:
            click.output.headline("GNOME Wayland Extension Required")
            click.output.warning("No extension package (*.shell-extension.zip) was found locally.\n")
            click.output.info(
                "This tool requires the 'Windows D-Bus Interface' extension to function.\n"
                "You can install it manually from the GNOME Extensions website:\n"
            )
            
            url = "https://extensions.gnome.org/"
            click.output.info(f"Website: [bold]{url}[/bold]\n")

            if click.confirm("Would you like to open the extensions website now?"):
                click.launch(url)

    @click.command()
    def check_connection(self):
        """Check D-Bus connection status.

        This command provides information about the D-Bus connection
        status and helps diagnose why the window management interface
        might not be available.
        """
        # Get methods from context
        methods = click.ctx.meta.get('methods', {})
        iface_name = click.ctx.meta.get('iface_name', 'Unknown')

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
    """Create a Click command that invokes a D-Bus method."""

    @click.command(name=method_name.lower())
    def method_command(self, **kwargs):
        return self._call_dbus_method(method_name, **kwargs)

    # Set callback name to match the command name for ultraclick
    #method_command.callback.__name__ = method_name.lower()

    help_text = details.get('desc', f"Call the {method_name} D-Bus method.")

    # Process arguments
    for name, type_code, desc in details.get('in_args', []):
        help_text += f"\n\n{name.upper()}  {desc}\n"

        # Map D-Bus type to Click type
        if type_code in ['i', 'u', 'x', 't']:
            click_type = click.INT
        elif type_code == 'd':
            click_type = click.FLOAT
        elif type_code == 'b':
            click_type = click.BOOL
        else:
            click_type = click.STRING

        method_command = click.argument(name, type=click_type)(method_command)

    method_command.help = help_text
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
          - 'in_args': input arguments as (name, type, description) tuples
          - 'out_args': output arguments as (name, type, description) tuples
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
                for anno in arg.findall('annotation'):
                    if anno.get('name') == 'Description':
                        arg_desc = anno.get('value')
                        break

                arg_tuple = (arg.get('name'), arg.get('type'), arg_desc)

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

    @classmethod
    def setup_commands(cls, interface=None):
        """Dynamically set up D-Bus commands and return initial context.

        This method:
        1. Establishes D-Bus connections (trying fallbacks)
        2. Performs introspection
        3. Registers dynamic commands
        4. Returns a context dictionary with D-Bus resources
        """
        # Initialize context dictionary
        context = { 'methods': [] }
        bus = dbus.SessionBus()
        working_iface = None
        last_error = None

        for iface_name in ([interface] if interface else DEFAULT_INTERFACES):
            obj_path = iface_to_path(iface_name)
            try:
                obj = bus.get_object(BUS_NAME, obj_path)
                introspect_xml = obj.Introspect(dbus_interface='org.freedesktop.DBus.Introspectable')
                methods = cls.parse_introspection(introspect_xml, iface_name)
                
                # Success! Store in context
                working_iface = iface_name
                context['dbus_bus'] = bus
                context['dbus_obj'] = obj
                context['dbus_iface'] = dbus.Interface(obj, dbus_interface=iface_name)
                context['iface_name'] = iface_name
                context['obj_path'] = obj_path
                context['methods'] = methods

                # Register commands on the class
                for method_name, details in methods.items():
                    cmd_name = method_name.lower()
                    cmd = create_method_command(method_name, details)
                    setattr(cls, cmd_name, cmd)
                
                break
            except Exception as e:
                last_error = e
                continue

        if not working_iface:
            click.output.error(f"D-Bus connection failed: {last_error}")
            click.output.info("Use 'gwctl setup check-connection' for diagnostics.")

        # Store methods in class for access via property
        cls._methods = context.get('methods', [])

        return context

    @click.option("--verbose", is_flag=True, help="Enable verbose output")
    @click.option("--interface", help="Specify the D-Bus interface name")
    @click.option("--filter", nargs=2, is_eager=True, multiple=True, help="Filter JSON output by field and value (e.g., --filter wm_class firefox)")
    @click.option("--field", help="Extract only the specified field from results (e.g., --field id)")
    def __init__(self, verbose=False, interface=None, filter=None, field=None):
        self.verbose = verbose
        self.interface = interface
        self.filter = filter
        self.field = field

        # Setup D-Bus commands and get initial context
        click.ctx.meta |= GnomeWindowControl.setup_commands(interface)

        # Share options with child commands
        click.ctx.meta['verbose'] = verbose
        click.ctx.meta['interface'] = interface
        click.ctx.meta['filter'] = filter
        click.ctx.meta['field'] = field

        if verbose:
            iface_name = click.ctx.meta.get('iface_name', 'Unknown')
            obj_path = click.ctx.meta.get('obj_path', 'Unknown')
            click.output.info(f"Connected to {iface_name} at {obj_path}")
            click.output.info(f"Found {len(click.ctx.meta['methods'])} methods")
            if filter:
                filters_str = ", ".join([f"{f[0]}={f[1]}" for f in filter])
                click.output.info(f"Filtering results: {filters_str}")
            if field:
                click.output.info(f"Extracting field: {field}")

    @property
    def methods(self):
        """Access the available D-Bus methods."""
        return self._methods

    def _call_dbus_method(self, method_name, **kwargs):
        """Execute a D-Bus method call and process its result."""
        # Get D-Bus interface from context
        iface = click.ctx.meta['dbus_iface']

        # Extract values from kwargs as a list
        args = list(kwargs.values())

        # Dynamically invoke the method with positional arguments
        try:
            result = getattr(iface, method_name)(*args)
        except dbus.exceptions.DBusException as e:
            error_msg = f"Error calling '{method_name}': {str(e)}"
            click.output.error(error_msg)
            sys.exit(1)

        # If result is a tuple with one element, unwrap it
        if isinstance(result, (list, tuple)) and len(result) == 1:
            result = result[0]

        # Filter out None results
        if result is None:
            return

        if isinstance(result, str):
            try:
                parsed = json.loads(result)
                
                # Apply filters if present
                filters = click.ctx.meta.get('filter')
                if filters and isinstance(parsed, list):
                    # Apply each filter criteria
                    for field, value in filters:
                        parsed = [item for item in parsed if field in item and str(item[field]) == value]
                
                # Extract specific field if requested
                field = click.ctx.meta.get('field')
                if field and isinstance(parsed, list):
                    # Print one value per line for easy piping
                    return "\n".join(str(item.get(field, "")) for item in parsed)
                    
                return json.dumps(parsed, indent=2)
            except Exception:
                pass

        return result

    @click.command()
    def version(self):
        """Show version and system information.

        Displays the version of gwctl along with information about
        the connected D-Bus interface.
        """
        # Get version from package metadata
        version = importlib.metadata.version('gwctl')
        iface_name = click.ctx.meta.get('iface_name', 'Unknown')
        
        dbus_info = f"Connected to: {iface_name}\n" \
                   f"Available methods: {len(self.methods)}"

        return f"gwctl v{version} - GNOME Wayland Window Control\n\n{dbus_info}"


def main():
    """Entry point for the application when installed as a package."""
    # Run CLI with this context
    click.group_from_class(GnomeWindowControl, name="gwctl")()

if __name__ == "__main__":
    # For direct script execution
    main()
