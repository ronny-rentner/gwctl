/* main.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Meta from 'gi://Meta';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const DBUS_INTERFACE = `
<node>
   <interface name="org.gnome.Shell.Extensions.gwctlAPI">
      <method name="List">
         <arg type="aa{sv}" direction="out" name="windows">
            <annotation name="Description" value="One dictionary of properties per window." />
         </arg>
         <annotation name="Description" value="Lists all windows and returns their properties." />
      </method>
      <method name="ListWorkspaces">
         <arg type="aa{sv}" direction="out" name="workspaces">
            <annotation name="Description" value="One dictionary of properties per workspace." />
         </arg>
         <annotation name="Description" value="Lists all workspaces and returns their properties." />
      </method>
      <method name="Details">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to get details for." />
         </arg>
         <arg type="a{sv}" direction="out" name="details">
            <annotation name="Description" value="A dictionary of the specified window's properties." />
         </arg>
         <annotation name="Description" value="Returns the properties of the specified window." />
      </method>
      <method name="GetTitle">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to fetch the title from." />
         </arg>
         <arg type="s" direction="out" name="title">
            <annotation name="Description" value="The title of the specified window." />
         </arg>
         <annotation name="Description" value="Returns the title of the specified window." />
      </method>
      <method name="GetGeometry">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window." />
         </arg>
         <arg type="a{sv}" direction="out" name="geometry">
            <annotation name="Description" value="x, y, width and height of the window's visible edges, and buffer_x, buffer_y, buffer_width and buffer_height of the area its pixels cover." />
         </arg>
         <annotation name="Description" value="Returns the position and size of the window's visible edges and of the area its pixels cover." />
      </method>
      <method name="MoveToWorkspace">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to be moved." />
         </arg>
         <arg type="u" direction="in" name="workspaceNum">
            <annotation name="Description" value="The target workspace number to move the window to." />
         </arg>
         <annotation name="Description" value="Moves the specified window to a given workspace number." />
      </method>
      <method name="Stick">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to show on all workspaces." />
         </arg>
         <annotation name="Description" value="Shows the specified window on all workspaces." />
      </method>
      <method name="Unstick">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to show on the active workspace only." />
         </arg>
         <annotation name="Description" value="Shows the specified window on the active workspace only." />
      </method>
      <method name="ActivateWorkspace">
         <arg type="u" direction="in" name="workspaceNum">
            <annotation name="Description" value="The number of the workspace to switch to." />
         </arg>
         <annotation name="Description" value="Switches to the given workspace." />
      </method>
      <method name="MoveToMonitor">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to be moved." />
         </arg>
         <arg type="u" direction="in" name="monitor">
            <annotation name="Description" value="The number of the monitor to move the window to." />
         </arg>
         <annotation name="Description" value="Moves the specified window to the given monitor." />
      </method>
      <method name="KeepAbove">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to keep above other windows." />
         </arg>
         <annotation name="Description" value="Keeps the specified window above other windows." />
      </method>
      <method name="UnkeepAbove">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window that other windows may cover again." />
         </arg>
         <annotation name="Description" value="Lets other windows cover the specified window again." />
      </method>
      <method name="Fullscreen">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to show fullscreen." />
         </arg>
         <annotation name="Description" value="Shows the specified window fullscreen." />
      </method>
      <method name="Unfullscreen">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to end fullscreen for." />
         </arg>
         <annotation name="Description" value="Ends fullscreen for the specified window." />
      </method>
      <method name="Toggle">
         <arg type="s" direction="in" name="command">
            <annotation name="Description" value="Either command of the pair whose state to switch: stick, keepabove, fullscreen, maximize or minimize, or the same with un in front." />
         </arg>
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window." />
         </arg>
         <annotation name="Description" value="Switches a state of the specified window to its opposite." />
      </method>
      <method name="MoveResize">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to be moved and resized." />
         </arg>
         <arg type="i" direction="in" name="x">
            <annotation name="Description" value="The new X coordinate for the window." />
         </arg>
         <arg type="i" direction="in" name="y">
            <annotation name="Description" value="The new Y coordinate for the window." />
         </arg>
         <arg type="u" direction="in" name="width">
            <annotation name="Description" value="The new width of the window, in pixels." />
         </arg>
         <arg type="u" direction="in" name="height">
            <annotation name="Description" value="The new height of the window, in pixels." />
         </arg>
         <annotation name="Description" value="Moves and resizes the window to the given coordinates and dimensions." />
      </method>
      <method name="Resize">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to be resized." />
         </arg>
         <arg type="u" direction="in" name="width">
            <annotation name="Description" value="The new width for the window." />
         </arg>
         <arg type="u" direction="in" name="height">
            <annotation name="Description" value="The new height for the window." />
         </arg>
         <annotation name="Description" value="Resizes the window without moving it." />
      </method>
      <method name="Move">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to be moved." />
         </arg>
         <arg type="i" direction="in" name="x">
            <annotation name="Description" value="The new X coordinate for the window's position." />
         </arg>
         <arg type="i" direction="in" name="y">
            <annotation name="Description" value="The new Y coordinate for the window's position." />
         </arg>
         <annotation name="Description" value="Moves the window to the specified coordinates." />
      </method>
      <method name="Maximize">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to maximize." />
         </arg>
         <annotation name="Description" value="Maximizes the specified window." />
      </method>
      <method name="Minimize">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to minimize." />
         </arg>
         <annotation name="Description" value="Minimizes the specified window." />
      </method>
      <method name="Unmaximize">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to restore from maximized state." />
         </arg>
         <annotation name="Description" value="Restores a maximized window to its previous size and position." />
      </method>
      <method name="Unminimize">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to restore from minimized state." />
         </arg>
         <annotation name="Description" value="Restores a minimized window, making it visible again." />
      </method>
      <method name="Activate">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to activate (focus)." />
         </arg>
         <annotation name="Description" value="Activates (focuses) the specified window." />
      </method>
      <method name="Close">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to close." />
         </arg>
         <annotation name="Description" value="Asks the specified window to close, like its close button." />
      </method>
      <method name="Kill">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window whose application to kill." />
         </arg>
         <annotation name="Description" value="Kills the application of the specified window." />
      </method>
      <method name="ShowOSD">
         <arg type="s" direction="in" name="text">
            <annotation name="Description" value="Text with Pango markup to display in the on-screen display." />
         </arg>
         <arg type="s" direction="in" name="icon">
            <annotation name="Description" value="Icon name for the on-screen display." />
            <annotation name="Default" value="dialog-information-symbolic" />
         </arg>
         <arg type="u" direction="in" name="duration_ms">
            <annotation name="Description" value="Display duration in milliseconds." />
            <annotation name="Default" value="5000" />
         </arg>
         <annotation name="Description" value="Shows the GNOME on-screen display." />
      </method>
      <method name="Type">
         <arg type="s" direction="in" name="text">
            <annotation name="Description" value="Text to insert." />
         </arg>
         <arg type="b" direction="in" name="preedit">
            <annotation name="Description" value="Insert text in preedit mode which allows replacing the text." />
         </arg>
         <arg type="b" direction="in" name="clear">
            <annotation name="Description" value="Clear preedit text on input reset." />
         </arg>
         <annotation name="Description" value="Inserts text into the focussed application." />
      </method>
      <method name="Key">
         <arg type="as" direction="in" name="keys">
            <annotation name="Description" value="Keys in the order to send, in GNOME accelerator format: a key symbol name with modifiers or other keys to hold in front, or modifiers alone, e.g. Return, &lt;Control&gt;a, &lt;Control_R&gt;a or &lt;Super&gt;." />
         </arg>
         <annotation name="Description" value="Presses and releases keys one after another (e.g. &lt;Control&gt;s)." />
      </method>
   </interface>
</node>
`;

// Modifier names of the GNOME accelerator format and the key that holds each modifier.
const MODIFIERS = {
  primary: Clutter.KEY_Control_L,
  control: Clutter.KEY_Control_L,
  ctrl: Clutter.KEY_Control_L,
  ctl: Clutter.KEY_Control_L,
  shift: Clutter.KEY_Shift_L,
  shft: Clutter.KEY_Shift_L,
  alt: Clutter.KEY_Alt_L,
  mod1: Clutter.KEY_Alt_L,
  mod4: Clutter.KEY_Super_L,
  mod5: Clutter.KEY_ISO_Level3_Shift,
  meta: Clutter.KEY_Meta_L,
  hyper: Clutter.KEY_Hyper_L,
  super: Clutter.KEY_Super_L,
  // Technically not a modifier but who cares?
  esc: Clutter.KEY_Escape,
};

// The commands Toggle switches, each with the List field that tells whether its state is on, the method that runs it
// and the method that undoes it.
const TOGGLES = {
  stick: ['on_all_workspaces', 'Stick', 'Unstick'],
  keepabove: ['above', 'KeepAbove', 'UnkeepAbove'],
  fullscreen: ['fullscreen', 'Fullscreen', 'Unfullscreen'],
  maximize: ['maximized', 'Maximize', 'Unmaximize'],
  minimize: ['minimized', 'Minimize', 'Unminimize'],
};

export default class Extension {
  enable() {
    // Keep D-Bus export setup with the implementation so the entry shim stays trivial.
    this._dbus = Gio.DBusExportedObject.wrapJSObject(DBUS_INTERFACE, this);
    this._dbus.export(Gio.DBus.session, '/org/gnome/Shell/Extensions/gwctlAPI');
  }

  disable() {
    this._dbus.flush();
    this._dbus.unexport();
    delete this._dbus;
    delete this._keyboard;
  }

  _findWindow(winid) {
    const window = global.get_window_actors().map(actor => actor.meta_window).find(window => window.get_id() == winid);
    if (!window) {
      throw new Error('Not found');
    }
    return window;
  }

  _findKeyval(name) {
    // Clutter names the XF86 keys without that prefix.
    const keyval = Clutter[`KEY_${name.replace(/^XF86/, '')}`];
    if (keyval === undefined) {
      throw new Error(`Unknown key: ${name}`);
    }
    return keyval;
  }

  _unmaximize(window) {
    if (window.maximized_horizontally || window.maximized_vertically) {
      window.unmaximize();
    }
  }

  _rectInfo(rect, prefix = '') {
    return {
      [`${prefix}x`]: GLib.Variant.new('i', rect.x),
      [`${prefix}y`]: GLib.Variant.new('i', rect.y),
      [`${prefix}width`]: GLib.Variant.new('i', rect.width),
      [`${prefix}height`]: GLib.Variant.new('i', rect.height),
    };
  }

  _windowInfo(window) {
    return {
      id: GLib.Variant.new('t', window.get_id()),
      title: GLib.Variant.new('s', window.get_title()),
      // Mutter returns null for a missing WM_CLASS, and D-Bus has no null, so both its parts go out as empty strings.
      wm_class: GLib.Variant.new('s', window.get_wm_class() ?? ''),
      focus: GLib.Variant.new('b', window.has_focus()),
      // -1 marks a window on all workspaces, as in wmctrl; get_workspace() would report the active workspace for it.
      workspace: GLib.Variant.new('i', window.is_on_all_workspaces() ? -1 : window.get_workspace().index()),
      monitor: GLib.Variant.new('i', window.get_monitor()),
      in_current_workspace: GLib.Variant.new('b', window.located_on_workspace(global.workspace_manager.get_active_workspace())),
      on_all_workspaces: GLib.Variant.new('b', window.is_on_all_workspaces()),
      above: GLib.Variant.new('b', window.is_above()),
      fullscreen: GLib.Variant.new('b', window.is_fullscreen()),
      maximized: GLib.Variant.new('b', window.is_maximized()),
      minimized: GLib.Variant.new('b', window.minimized),
      pid: GLib.Variant.new('i', window.get_pid()),
      wm_class_instance: GLib.Variant.new('s', window.get_wm_class_instance() ?? ''),
      ...this._rectInfo(window.get_frame_rect()),
      moveable: GLib.Variant.new('b', window.allows_move()),
      resizeable: GLib.Variant.new('b', window.allows_resize()),
      canclose: GLib.Variant.new('b', window.can_close()),
      canmaximize: GLib.Variant.new('b', window.can_maximize()),
      canminimize: GLib.Variant.new('b', window.can_minimize()),
      // Mutter returns null for a missing role, and D-Bus has no null, so it goes out as an empty string.
      role: GLib.Variant.new('s', window.get_role() ?? ''),
      layer: GLib.Variant.new('u', window.get_layer()),
      window_type: GLib.Variant.new('u', window.get_window_type()),
      frame_type: GLib.Variant.new('u', window.get_frame_type()),
      user_time: GLib.Variant.new('u', window.get_user_time()),
      stable_sequence: GLib.Variant.new('u', window.get_stable_sequence()),
    };
  }

  Details(winid) {
    return this._windowInfo(this._findWindow(winid));
  }

  List() {
    return global.get_window_actors().map(actor => this._windowInfo(actor.meta_window));
  }

  ListWorkspaces() {
    const activeIndex = global.workspace_manager.get_active_workspace_index();
    return Array.from({length: global.workspace_manager.get_n_workspaces()}, (_, index) => ({
      index: GLib.Variant.new('u', index),
      name: GLib.Variant.new('s', Meta.prefs_get_workspace_name(index)),
      active: GLib.Variant.new('b', index === activeIndex),
    }));
  }

  GetGeometry(winid) {
    const window = this._findWindow(winid);
    return {...this._rectInfo(window.get_frame_rect()), ...this._rectInfo(window.get_buffer_rect(), 'buffer_')};
  }

  GetTitle(winid) {
    return this._findWindow(winid).get_title();
  }

  MoveToWorkspace(winid, workspaceNum) {
    this._findWindow(winid).change_workspace_by_index(workspaceNum, false);
  }

  Stick(winid) {
    this._findWindow(winid).stick();
  }

  Unstick(winid) {
    this._findWindow(winid).unstick();
  }

  ActivateWorkspace(workspaceNum) {
    const workspace = global.workspace_manager.get_workspace_by_index(workspaceNum);
    if (!workspace) {
      throw new Error('Not found');
    }
    workspace.activate(global.get_current_time());
  }

  MoveToMonitor(winid, monitor) {
    this._findWindow(winid).move_to_monitor(monitor);
  }

  KeepAbove(winid) {
    this._findWindow(winid).make_above();
  }

  UnkeepAbove(winid) {
    this._findWindow(winid).unmake_above();
  }

  Fullscreen(winid) {
    this._findWindow(winid).make_fullscreen();
  }

  Unfullscreen(winid) {
    this._findWindow(winid).unmake_fullscreen();
  }

  Toggle(command, winid) {
    // Both commands of a pair switch the same state, so e.g. unstick works like stick.
    const toggle = TOGGLES[command.replace(/^un/, '')];
    if (!toggle) {
      throw new Error(`Cannot toggle: ${command}`);
    }
    const [field, run, undo] = toggle;
    if (this._windowInfo(this._findWindow(winid))[field].unpack()) {
      this[undo](winid);
    } else {
      this[run](winid);
    }
  }

  MoveResize(winid, x, y, width, height) {
    const window = this._findWindow(winid);
    this._unmaximize(window);
    window.move_resize_frame(true, x, y, width, height);
  }

  Resize(winid, width, height) {
    const window = this._findWindow(winid);
    this._unmaximize(window);
    const frame = window.get_frame_rect();
    window.move_resize_frame(true, frame.x, frame.y, width, height);
  }

  Move(winid, x, y) {
    const window = this._findWindow(winid);
    this._unmaximize(window);
    window.move_frame(true, x, y);
  }

  Maximize(winid) {
    this._findWindow(winid).maximize();
  }

  Minimize(winid) {
    this._findWindow(winid).minimize();
  }

  Unmaximize(winid) {
    this._findWindow(winid).unmaximize();
  }

  Unminimize(winid) {
    this._findWindow(winid).unminimize();
  }

  Activate(winid) {
    const window = this._findWindow(winid);
    const workspace = window.get_workspace();
    if (workspace) {
      workspace.activate_with_focus(window, 0);
    } else {
      window.activate(0);
    }
  }

  Close(winid) {
    this._findWindow(winid).delete(global.get_current_time());
  }

  Kill(winid) {
    this._findWindow(winid).kill();
  }

  ShowOSD(text, icon, duration_ms) {
    Main.osdWindowManager.showAll(Gio.Icon.new_for_string(icon), text);
    for (const osd of Main.osdWindowManager._osdWindows) {
      osd._label.clutter_text.set_markup(text);
      GLib.source_remove(osd._hideTimeoutId);
      osd._hideTimeoutId = GLib.timeout_add_once(GLib.PRIORITY_DEFAULT, duration_ms, osd._hide.bind(osd));
    }
  }

  Type(text, preedit, clear) {
    const inputMethod = global.stage.context.get_backend().get_input_method();
    if (preedit) {
      const cursor = [...text].length;
      inputMethod.set_preedit_text(text === '' ? null : text, cursor, cursor,
        clear ? Clutter.PreeditResetMode.CLEAR : Clutter.PreeditResetMode.COMMIT);
    } else {
      // A commit should replace the preview, but Mutter 50.5 sends its stored preview again right after the commit, in
      // the same text-input "done". Clearing the stored preview first prevents it.
      inputMethod.set_preedit_text(null, 0, 0, Clutter.PreeditResetMode.CLEAR);
      inputMethod.commit(text);
    }
  }

  Key(keys) {
    // The input method's forward_key() cannot carry modifiers to Wayland applications, a virtual keyboard holds them
    // down as keys like a real one.
    this._keyboard ??= global.stage.context.get_backend().get_default_seat().create_virtual_device(Clutter.InputDeviceType.KEYBOARD_DEVICE);
    for (const key of keys) {
      const held = [];
      const name = key.replace(/<(\w+)>/g, (tag, modifier) => {
        // A modifier name stands for the key that holds the modifier, any other name for that key itself.
        held.push(MODIFIERS[modifier.toLowerCase()] ?? this._findKeyval(modifier));
        return '';
      });
      // Modifiers alone, e.g. <Super>, have no key of their own. The lookup comes before anything is pressed, so an
      // unknown key cannot leave a modifier held down.
      const keyval = name === '' ? 0 : this._findKeyval(name);
      // The virtual keyboard takes the time of the event in microseconds.
      const time = GLib.get_monotonic_time();
      held.forEach(heldKeyval => this._keyboard.notify_keyval(time, heldKeyval, Clutter.KeyState.PRESSED));
      if (keyval) {
        // notify_keyval() finds the key in the current layout and itself holds Shift or AltGr when the keyval needs them.
        this._keyboard.notify_keyval(time, keyval, Clutter.KeyState.PRESSED);
        this._keyboard.notify_keyval(time, keyval, Clutter.KeyState.RELEASED);
      }
      held.toReversed().forEach(heldKeyval => this._keyboard.notify_keyval(time, heldKeyval, Clutter.KeyState.RELEASED));
    }
  }
}
