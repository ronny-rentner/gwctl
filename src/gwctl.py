#!/usr/bin/env python3

import sys
import json
import dbus
import xml.etree.ElementTree as ET
import ultraclick as click

# DBus constants
BUS_NAME = 'org.gnome.Shell'
OBJ_PATH = '/org/gnome/Shell/Extensions/Windows'
IFACE_NAME = 'org.gnome.Shell.Extensions.Windows'

class SetupCommand:
    """Tools for setting up and troubleshooting the GNOME window management interface."""

    @click.command()
    def install_extension(self):
        click.output.headline("GNOME Window Management API Extension Required\n")
        click.output.warning(
            "This tool requires a GNOME Shell extension that provides a D-Bus interface\n"
            "for window management. No such extension was detected on your system.\n"
        )
        click.output.info(
            "To enable window management functionality, you need to:\n"
            "1. Install the 'Windows D-Bus Interface' extension from GNOME Extensions\n"
            "2. Enable the extension through GNOME Extensions or Tweaks\n\n"
            "For more information, visit: [bold]https://extensions.gnome.org/[/bold]\n"
        )

    @click.command()
    def check_connection(self):
        """Check D-Bus connection status.

        This command provides information about the D-Bus connection
        status and helps diagnose why the window management interface
        might not be available.
        """
        # Get methods from context
        methods = click.ctx.meta.get('methods', {})

        if methods:
            click.output.success("D-Bus connection successful")
            return (
                f"Connected to: {IFACE_NAME}\n"
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
    """GNOME Window Control.

    This tool provides commands for interacting with GNOME windows through D-Bus.
    Commands are dynamically generated based on the methods available on the D-Bus interface.
    """

    setup = SetupCommand

    @classmethod
    def parse_introspection(cls, xml_str):
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
            if iface.get('name') == IFACE_NAME:
                iface_elem = iface
                break
        if iface_elem is None:
            raise Exception(f"Interface {IFACE_NAME} not found in introspection data")

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
    def setup_commands(cls):
        """Dynamically set up D-Bus commands and return initial context.

        This method:
        1. Establishes D-Bus connections
        2. Performs introspection
        3. Registers dynamic commands
        4. Returns a context dictionary with D-Bus resources
        """
        # Initialize context dictionary
        context = {}

        try:
            # Establish D-Bus connection
            bus = dbus.SessionBus()
            obj = bus.get_object(BUS_NAME, OBJ_PATH)
            iface = dbus.Interface(obj, dbus_interface=IFACE_NAME)

            # Store in context
            context['dbus_bus'] = bus
            context['dbus_obj'] = obj
            context['dbus_iface'] = iface

            # Perform D-Bus introspection
            introspect_xml = obj.Introspect(dbus_interface='org.freedesktop.DBus.Introspectable')
            methods = cls.parse_introspection(introspect_xml)
            context['methods'] = methods

            # Register commands on the class
            for method_name, details in methods.items():
                cmd_name = method_name.lower()
                cmd = create_method_command(method_name, details)
                setattr(cls, cmd_name, cmd)

        except Exception as e:
            click.output.error(f"D-Bus connection failed: {e}")
            click.output.info("Use 'gwctl setup check-connection' for diagnostics.")

        # Store methods in class for access via property
        cls._methods = context['methods']

        return context

    @click.option("--verbose", is_flag=True, help="Enable verbose output")
    def __init__(self, verbose=False):
        self.verbose = verbose

        # Share verbose flag with child commands
        click.ctx.meta['verbose'] = verbose

        if verbose:
            click.output.info(f"Connected to {IFACE_NAME}")
            click.output.info(f"Found {len(click.ctx.meta['methods'])} methods")

    @property
    def methods(self):
        """Access the available D-Bus methods."""
        return self._methods

    def _call_dbus_method(self, method_name, **kwargs):
        """Execute a D-Bus method call and process its result.
        """
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
        dbus_info = f"Connected to: {IFACE_NAME}\n" \
                   f"Available methods: {len(self.methods)}"

        return f"gwctl v0.2.0 - GNOME Window Control\n\n{dbus_info}"


def main():
    """Entry point for the application when installed as a package."""
    # Setup D-Bus commands and get initial context
    meta = GnomeWindowControl.setup_commands()
    
    # Run CLI with this context
    click.group_from_class(GnomeWindowControl, name="gwctl", initial_ctx_meta=meta)()

if __name__ == "__main__":
    # For direct script execution
    main()
