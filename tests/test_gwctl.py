import json
import unittest
from unittest import mock

import dbus
from click.testing import CliRunner

import ultraclick as click
from gwctl import GnomeWindowControl

INTERFACE_XML = """
<node>
   <interface name="org.gnome.Shell.Extensions.gwctlAPI">
      <method name="List">
         <arg type="aa{sv}" direction="out" name="windows"/>
      </method>
      <method name="GetTitle">
         <arg type="u" direction="in" name="winid"/>
         <arg type="s" direction="out" name="title"/>
      </method>
      <method name="Move">
         <arg type="u" direction="in" name="winid"/>
         <arg type="i" direction="in" name="x"/>
         <arg type="i" direction="in" name="y"/>
      </method>
      <method name="ShowOSD">
         <arg type="s" direction="in" name="text"/>
         <arg type="u" direction="in" name="duration_ms">
            <annotation name="Default" value="5000"/>
         </arg>
      </method>
   </interface>
</node>
"""


def window(id, title, focus):
    return dbus.Dictionary({
        dbus.String('id'): dbus.UInt64(id, variant_level=1),
        dbus.String('title'): dbus.String(title, variant_level=1),
        dbus.String('focus'): dbus.Boolean(focus, variant_level=1),
    }, signature='sv')


class FakeProxy:
    """Stands in for the extension's object on the session bus, with the values dbus-python returns for it."""

    def __init__(self):
        self.calls = []
        self.results = {
            'List': dbus.Array([window(1, 'Editor', True), window(2, 'Terminal', False)], signature='a{sv}'),
            'GetTitle': dbus.String('Editor'),
        }

    def Introspect(self, dbus_interface):
        return INTERFACE_XML

    def get_dbus_method(self, member, dbus_interface=None):
        def method(*args):
            self.calls.append((member, args))
            return self.results.get(member)
        return method


class FakeBus:
    def __init__(self, proxy):
        self.proxy = proxy

    def get_object(self, bus_name, object_path):
        return self.proxy


class TestGwctl(unittest.TestCase):
    def setUp(self):
        self.proxy = FakeProxy()
        patch = mock.patch('dbus.SessionBus', lambda: FakeBus(self.proxy))
        patch.start()
        self.addCleanup(patch.stop)

    def run_cli(self, *args):
        return CliRunner().invoke(click.group_from_class(GnomeWindowControl, name='gwctl'), list(args))

    def test_json_has_plain_types(self):
        result = self.run_cli('--json', 'list')
        self.assertEqual(result.exit_code, 0, result.output)
        self.assertEqual(json.loads(result.output), [
            {'id': 1, 'title': 'Editor', 'focus': True},
            {'id': 2, 'title': 'Terminal', 'focus': False},
        ])

    def test_plain_mode_defaults_to_json(self):
        with mock.patch.object(click.output, 'plain', True):
            result = self.run_cli('list')
        self.assertEqual(len(json.loads(result.output)), 2)

    def test_filter_reads_value_as_field_type(self):
        for value in ('true', 'on', '1'):
            with self.subTest(value=value):
                result = self.run_cli('--json', '--filter', 'focus', value, 'list')
                self.assertEqual([entry['title'] for entry in json.loads(result.output)], ['Editor'])

    def test_field_prints_one_line_per_entry(self):
        self.assertEqual(self.run_cli('--field', 'id', 'list').output, '1\n2\n')

    def test_fields_print_tab_separated(self):
        self.assertEqual(self.run_cli('--field', 'id', '--field', 'title', 'list').output, '1\tEditor\n2\tTerminal\n')

    def test_explicit_json_reduces_entries_to_fields(self):
        result = self.run_cli('--json', '--field', 'id', '--field', 'title', 'list')
        self.assertEqual(json.loads(result.output), [{'id': 1, 'title': 'Editor'}, {'id': 2, 'title': 'Terminal'}])

    def test_unknown_field_fails(self):
        for args in (('--field', 'a'), ('--filter', 'a', 'x')):
            with self.subTest(args=args):
                result = self.run_cli(*args, 'list')
                self.assertEqual(result.exit_code, 1)
                self.assertIn('Unknown field: a', result.output)

    def test_text_result_prints_as_is(self):
        self.assertEqual(self.run_cli('gettitle', '1').output, 'Editor\n')

    def test_arguments_go_to_dbus_in_order(self):
        result = self.run_cli('move', '5', '10', '20')
        self.assertEqual(result.exit_code, 0, result.output)
        self.assertEqual(self.proxy.calls, [('Move', (5, 10, 20))])

    def test_default_annotation_makes_argument_optional(self):
        self.run_cli('showosd', 'hello')
        self.run_cli('showosd', 'hello', '--duration-ms', '800')
        self.assertEqual(self.proxy.calls, [('ShowOSD', ('hello', 5000)), ('ShowOSD', ('hello', 800))])

    def test_python_call_returns_plain_values(self):
        windows = GnomeWindowControl().list()
        self.assertIs(windows[0]['focus'], True)
        self.assertIs(type(windows[0]['title']), str)


if __name__ == '__main__':
    unittest.main()
