import unittest
from unittest.mock import patch

from click.testing import CliRunner
import ultraclick as click
import dbus

from gwctl import GnomeWindowControl, main


class TestGnomeWindowControl(unittest.TestCase):
    @patch('gwctl.dbus.Interface')
    @patch('gwctl.dbus.SessionBus')
    def test_method_supports_python_and_cli_calls(self, session_bus, interface):
        session_bus.return_value.get_object.return_value.Introspect.return_value = '''
            <node>
              <interface name="org.example.Test">
                <method name="Type">
                  <annotation name="Description" value="Type supplied text"/>
                  <arg name="text" type="s" direction="in"/>
                  <arg name="preedit" type="b" direction="in"/>
                </method>
              </interface>
            </node>
        '''
        interface.return_value.Type.return_value = 'typed'

        control = GnomeWindowControl(interface='org.example.Test')
        self.assertEqual(control.type(text='hello', preedit=True), 'typed')
        interface.return_value.Type.assert_called_once_with('hello', True)
        interface.return_value.Type.reset_mock()

        cli = click.group_from_class(GnomeWindowControl, name='gwctl')
        for args, expected in ((['type', 'hello', '--preedit'], 'typed'),
                               (['type', '--help'], 'Type supplied text'),
                               (['setup', 'check-connection'], 'Connected to: org.example.Test')):
            with self.subTest(args=args):
                result = CliRunner().invoke(cli, ['--interface', 'org.example.Test'] + args)
                self.assertEqual(result.exit_code, 0, result.exception)
                self.assertIn(expected, result.stdout)
        interface.return_value.Type.assert_called_once_with('hello', True)

        error = dbus.exceptions.DBusException('Extension unavailable')
        interface.return_value.Type.side_effect = error
        with self.assertRaises(dbus.exceptions.DBusException) as raised:
            control.type(text='hello', preedit=True)
        self.assertIs(raised.exception, error)

        with patch('sys.argv', ['gwctl', '--interface', 'org.example.Test', 'type', 'hello']), \
             patch('gwctl.click.output.error') as report, self.assertRaises(SystemExit) as exited:
            main()
        self.assertEqual(exited.exception.code, 1)
        report.assert_called_once_with(str(error))


if __name__ == '__main__':
    unittest.main()
