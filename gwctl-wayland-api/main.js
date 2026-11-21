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
import {getKeyboardManager} from 'resource:///org/gnome/shell/misc/keyboardManager.js';

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
            <annotation name="Description" value="One dictionary with index and name per workspace." />
         </arg>
         <annotation name="Description" value="Lists all workspaces with their index and name." />
      </method>
      <method name="Details">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to get details for." />
         </arg>
         <arg type="a{sv}" direction="out" name="details">
            <annotation name="Description" value="A dictionary with detailed information about the specified window." />
         </arg>
         <annotation name="Description" value="Returns detailed information about a specific window (by winid)." />
      </method>
      <method name="GetTitle">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to fetch the title from." />
         </arg>
         <arg type="s" direction="out" name="win">
            <annotation name="Description" value="Returns the title of the specified window." />
         </arg>
         <annotation name="Description" value="Returns the title of the specified window." />
      </method>
      <method name="GetFrameRect">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window." />
         </arg>
         <arg type="a{sv}" direction="out" name="frameRect">
            <annotation name="Description" value="x, y, width and height of the window's visible edges." />
         </arg>
         <annotation name="Description" value="Returns the position and size of the window's visible edges. A shadow the application draws around the window is not included." />
      </method>
      <method name="GetBufferRect">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window." />
         </arg>
         <arg type="a{sv}" direction="out" name="bufferRect">
            <annotation name="Description" value="x, y, width and height of the area the window's pixels cover." />
         </arg>
         <annotation name="Description" value="Returns the position and size of the area the window's pixels cover. This includes a shadow the application draws around the window, so it can be larger than the frame rectangle." />
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
      <method name="MakeAbove">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to keep above other windows." />
         </arg>
         <annotation name="Description" value="Keeps the specified window above other windows." />
      </method>
      <method name="UnmakeAbove">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window that other windows may cover again." />
         </arg>
         <annotation name="Description" value="Lets other windows cover the specified window again." />
      </method>
      <method name="MakeFullscreen">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to show fullscreen." />
         </arg>
         <annotation name="Description" value="Shows the specified window fullscreen." />
      </method>
      <method name="UnmakeFullscreen">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to end fullscreen for." />
         </arg>
         <annotation name="Description" value="Ends fullscreen for the specified window." />
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
         <annotation name="Description" value="Closes the specified window." />
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
         <annotation name="Description" value="Show a temporary GNOME on-screen display without taking focus." />
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
         <annotation name="Description" value="Insert text into the focussed application." />
      </method>
      <method name="Key">
         <arg type="as" direction="in" name="keys">
            <annotation name="Description" value="Keys in the order to send, in GNOME accelerator format: a key symbol name or a keycode as hex, with modifiers in front, e.g. Return, &lt;Control&gt;a or 0x24." />
         </arg>
         <annotation name="Description" value="Press and release keys one after another in the focussed application." />
      </method>
   </interface>
</node>
`;

// Modifier names of the GNOME accelerator format.
const MODIFIERS = {
  primary: Clutter.ModifierType.CONTROL_MASK,
  control: Clutter.ModifierType.CONTROL_MASK,
  ctrl: Clutter.ModifierType.CONTROL_MASK,
  ctl: Clutter.ModifierType.CONTROL_MASK,
  shift: Clutter.ModifierType.SHIFT_MASK,
  shft: Clutter.ModifierType.SHIFT_MASK,
  alt: Clutter.ModifierType.MOD1_MASK,
  mod1: Clutter.ModifierType.MOD1_MASK,
  mod2: Clutter.ModifierType.MOD2_MASK,
  mod3: Clutter.ModifierType.MOD3_MASK,
  mod4: Clutter.ModifierType.MOD4_MASK,
  mod5: Clutter.ModifierType.MOD5_MASK,
  meta: Clutter.ModifierType.META_MASK,
  hyper: Clutter.ModifierType.HYPER_MASK,
  super: Clutter.ModifierType.SUPER_MASK,
};

export default class Extension {
  enable() {
    // Keep D-Bus export setup with the implementation so the entry shim stays trivial.
    this._dbus = Gio.DBusExportedObject.wrapJSObject(DBUS_INTERFACE, this);
    this._dbus.export(Gio.DBus.session, '/org/gnome/Shell/Extensions/gwctlAPI');
    // The exporter needs Gdk, which must not be loaded into the shell, so it runs as a process of its own.
    const dir = GLib.path_get_dirname(GLib.filename_from_uri(import.meta.url)[0]);
    Gio.Subprocess.new(['gjs', '-m', GLib.build_filenamev([dir, 'export-keymap.js'])], Gio.SubprocessFlags.NONE);
  }

  disable() {
    this._dbus.flush();
    this._dbus.unexport();
    delete this._dbus;
  }

  _findWindow(winid) {
    const window = global.get_window_actors().map(actor => actor.meta_window).find(window => window.get_id() == winid);
    if (!window) {
      throw new Error('Not found');
    }
    return window;
  }

  _unmaximize(window) {
    if (window.maximized_horizontally || window.maximized_vertically) {
      window.unmaximize(Meta.MaximizeFlags.BOTH);
    }
  }

  _rectInfo(rect) {
    return {
      x: GLib.Variant.new('i', rect.x),
      y: GLib.Variant.new('i', rect.y),
      width: GLib.Variant.new('i', rect.width),
      height: GLib.Variant.new('i', rect.height),
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

  GetBufferRect(winid) {
    return this._rectInfo(this._findWindow(winid).get_buffer_rect());
  }

  GetFrameRect(winid) {
    return this._rectInfo(this._findWindow(winid).get_frame_rect());
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

  MakeAbove(winid) {
    this._findWindow(winid).make_above();
  }

  UnmakeAbove(winid) {
    this._findWindow(winid).unmake_above();
  }

  MakeFullscreen(winid) {
    this._findWindow(winid).make_fullscreen();
  }

  UnmakeFullscreen(winid) {
    this._findWindow(winid).unmake_fullscreen();
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
    this._findWindow(winid).maximize(Meta.MaximizeFlags.BOTH);
  }

  Minimize(winid) {
    this._findWindow(winid).minimize();
  }

  Unmaximize(winid) {
    this._findWindow(winid).unmaximize(Meta.MaximizeFlags.BOTH);
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
    const keymapFile = `${GLib.get_user_cache_dir()}/gwctl-wayland-api-keymap.json`;
    if (!this._keymap && GLib.file_test(keymapFile, GLib.FileTest.EXISTS)) {
      this._keymap = JSON.parse(new TextDecoder().decode(GLib.file_get_contents(keymapFile)[1]));
    }
    const symbols = this._keymap?.groups[getKeyboardManager().currentLayout.groupIndex] ?? {};
    // Resolve every key first so an unknown one fails before anything is sent.
    const combos = keys.map(key => {
      let state = 0;
      const name = key.replace(/<(\w+)>/g, (tag, modifier) => {
        state |= MODIFIERS[modifier.toLowerCase()];
        return '';
      });
      if (/^0x[0-9a-f]+$/i.test(name)) {
        return [0, parseInt(name, 16), state];
      }
      // GNOME accelerators ignore case and the XF86 prefix; of names differing only by case, the lower-case one wins.
      const wanted = name.toLowerCase().replace(/^xf86/, '');
      const symbol = Object.keys(symbols).filter(s => s.toLowerCase() === wanted).sort().at(-1);
      if (!symbol) {
        throw new Error(`Unknown key: ${key}`);
      }
      const [keyval, keycode, modifiers] = symbols[symbol];
      return [keyval, keycode, state | modifiers];
    });
    const inputMethod = global.stage.context.get_backend().get_input_method();
    for (const [keyval, keycode, state] of combos) {
      // forward_key() takes the time of the event in microseconds.
      inputMethod.forward_key(keyval, keycode, state, GLib.get_monotonic_time(), true);
      inputMethod.forward_key(keyval, keycode, state, GLib.get_monotonic_time(), false);
    }
  }
}
