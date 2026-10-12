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
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const MR_DBUS_IFACE = `
<node>
   <interface name="org.gnome.Shell.Extensions.gwctlAPI">
      <method name="List">
         <arg type="s" direction="out" name="win">
            <annotation name="Description" value="Returns a JSON string representing an array of windows." />
         </arg>
         <annotation name="Description" value="Lists all windows and returns their properties as a JSON string." />
      </method>
      <method name="Details">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window to get details for." />
         </arg>
         <arg type="s" direction="out" name="win">
            <annotation name="Description" value="Returns a JSON string with detailed information about the specified window." />
         </arg>
         <annotation name="Description" value="Returns detailed information about a specific window (by winid) as a JSON string." />
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
            <annotation name="Description" value="The ID of the window whose frame rectangle is to be retrieved." />
         </arg>
         <arg type="s" direction="out" name="frameRect">
            <annotation name="Description" value="Returns a JSON string with the frame rectangle (x, y, width, height) of the window." />
         </arg>
         <annotation name="Description" value="Returns the frame rectangle of the window as a JSON string." />
      </method>
      <method name="GetFrameBounds">
         <arg type="u" direction="in" name="winid">
            <annotation name="Description" value="The ID of the window whose frame bounds are to be retrieved." />
         </arg>
         <arg type="s" direction="out" name="frameBounds">
            <annotation name="Description" value="Returns a JSON string representing the frame bounds (outer geometry) of the window." />
         </arg>
         <annotation name="Description" value="Returns the frame bounds of the window as a JSON string." />
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
         </arg>
         <arg type="u" direction="in" name="duration_ms">
            <annotation name="Description" value="Display duration in milliseconds." />
         </arg>
         <annotation name="Description" value="Show a temporary GNOME on-screen display without taking focus." />
      </method>
      <method name="Type">
         <arg type="s" direction="in" name="text">
            <annotation name="Description" value="Text to insert or display provisionally." />
         </arg>
         <arg type="b" direction="in" name="preedit">
            <annotation name="Description" value="Show replaceable provisional text; an empty string clears it." />
         </arg>
         <arg type="b" direction="in" name="clear">
            <annotation name="Description" value="Clear preedit on input reset instead of committing it; only applies when preedit is true." />
         </arg>
         <annotation name="Description" value="Insert final text, or show provisional text when preedit is true." />
      </method>
   </interface>
</node>
`;

export default class Extension {
  enable() {
    // Keep D-Bus export setup with the implementation so the entry shim stays trivial.
    this._dbus = Gio.DBusExportedObject.wrapJSObject(MR_DBUS_IFACE, this);
    this._dbus.export(Gio.DBus.session, '/org/gnome/Shell/Extensions/gwctlAPI');
    // Disabled noisy lifecycle debug log.
    // log('This is a debug message (enable).');
  }

  disable() {
    // Disabled noisy lifecycle debug log.
    // log('This is a debug message (disable).');
    this._dbus.flush();
    this._dbus.unexport();
    delete this._dbus;
  }

  _get_window_by_wid(winid) {
    let win = global.get_window_actors().find(w => w.meta_window.get_id() == winid);
    return win;
  }

  Details(winid) {
    const w = this._get_window_by_wid(winid);

    if (!w) {
      throw new Error('Not found');
    }

    const workspaceManager = global.workspace_manager;
    const currentmonitor = global.display.get_current_monitor();
    // const monitor = global.display.get_monitor_geometry(currentmonitor);

    const props = {
      get: ['wm_class', 'wm_class_instance', 'pid', 'id', 'maximized', 'display', 'frame_type', 'window_type', 'layer', 'monitor', 'role', 'title'],
      can: ['close', 'maximize', 'minimize'],
      has: ['focus'],
      custom: new Map([
        ['moveable', 'allows_move'],
        ['resizeable', 'allows_resize'],
        ['area', 'get_work_area_current_monitor'],
        ['area_all', 'get_work_area_all_monitors'],
        ['canclose', 'can_close'],
        ['canmaximize', 'can_maximize'],
        ['canminimize', 'can_minimize'],
        ['canshade', 'can_shade'],
      ]),
      frame: ['x', 'y', 'width', 'height']
    };

    const win = {
      in_current_workspace: w.meta_window.located_on_workspace?.(workspaceManager.get_active_workspace?.()),
      area_cust: w.meta_window.get_work_area_for_monitor?.(currentmonitor)
    };

    props.get.forEach(name => win[name] = w.meta_window[`get_${name}`]?.());
    props.can.forEach(name => win[`can${name}`] = w.meta_window[`can_${name}`]?.());
    props.has.forEach(name => win[name] = w.meta_window[`has_${name}`]?.());
    props.custom.forEach((fname, name) => { win[name] = w.meta_window[fname]?.() });
    let frame = w.meta_window.get_frame_rect();
    props.frame.forEach(name => win[name] = frame[name]);

    return JSON.stringify(win);
  }

  List() {
    const win = global.get_window_actors();
    const workspaceManager = global.workspace_manager;

    const props = {
      get: ['wm_class', 'wm_class_instance', 'title', 'pid', 'id', 'user_time', 'stable_sequence', 'workspace', 'frame_type', 'window_type', 'width', 'height', 'x', 'y'],
      has: ['focus'],
      // custom: new Map([])
    };

    const winJsonArr = win.map(w => {
      const win = {
        in_current_workspace: w.meta_window.located_on_workspace?.(workspaceManager.get_active_workspace?.())
      };
      props.get.forEach(name => win[name] = w.meta_window[`get_${name}`]?.());
      props.has.forEach(name => win[name] = w.meta_window[`has_${name}`]?.());
      // props.custom.forEach((fname, name) => { win[name] = w.meta_window[fname]?.() });
      return win;
    });

    return JSON.stringify(winJsonArr);
  }

  GetFrameBounds(winid) {
    let w = this._get_window_by_wid(winid);
    if (w) {
      const result = {
        frame_bounds: w.meta_window.get_frame_bounds(),
      }
      return JSON.stringify(result);
    } else {
      throw new Error('Not found');
    }
  }

  GetFrameRect(winid) {
    let w = this._get_window_by_wid(winid);
    if (w) {
      let frame = w.meta_window.get_frame_rect()
      const result = {
        "x": frame.x,
        "y": frame.y,
        "width": frame.width,
        "height": frame.height
      }
      return JSON.stringify(result);
    } else {
      throw new Error('Not found');
    }
  }

  GetTitle(winid) {
    let w = this._get_window_by_wid(winid);
    if (w) {
      return w.meta_window.get_title();
    } else {
      throw new Error('Not found');
    }
  }

  MoveToWorkspace(winid, workspaceNum) {
    let win = this._get_window_by_wid(winid).meta_window;
    if (win) {
      win.change_workspace_by_index(workspaceNum, false);
    } else {
      throw new Error('Not found');
    }
  }

  MoveResize(winid, x, y, width, height) {
    let win = this._get_window_by_wid(winid);

    if (win) {
      if (win.meta_window.maximized_horizontally || win.meta_window.maximized_vertically) {
        win.meta_window.unmaximize(3);
      }

      win.meta_window.move_resize_frame(1, x, y, width, height);
    } else {
      throw new Error('Not found');
    }
  }

  Resize(winid, width, height) {
    let win = this._get_window_by_wid(winid);
    if (win) {
      if (win.meta_window.maximized_horizontally || win.meta_window.maximized_vertically) {
        win.meta_window.unmaximize(3);
      }
      win.meta_window.move_resize_frame(1, win.get_x(), win.get_y(), width, height);
    } else {
      throw new Error('Not found');
    }
  }

  Move(winid, x, y) {
    let win = this._get_window_by_wid(winid);
    if (win) {
      if (win.meta_window.maximized_horizontally || win.meta_window.maximized_vertically) {
        win.meta_window.unmaximize(3);
      }
      win.meta_window.move_frame(1, x, y);
    } else {
      throw new Error('Not found');
    }
  }

  Maximize(winid) {
    let win = this._get_window_by_wid(winid).meta_window;
    if (win) {
      win.maximize(3);
    } else {
      throw new Error('Not found');
    }
  }

  Minimize(winid) {
    let win = this._get_window_by_wid(winid).meta_window;
    if (win) {
      win.minimize();
    } else {
      throw new Error('Not found');
    }
  }

  Unmaximize(winid) {
    let win = this._get_window_by_wid(winid).meta_window;
    if (win) {
      win.unmaximize(3);
    } else {
      throw new Error('Not found');
    }
  }

  Unminimize(winid) {
    let win = this._get_window_by_wid(winid).meta_window;
    if (win) {
      win.unminimize();
    } else {
      throw new Error('Not found');
    }
  }

  Activate(winid) {
    const win = this._get_window_by_wid(winid).meta_window;
    if (win) {
      const workspace = win.get_workspace();
      if (workspace) {
        workspace.activate_with_focus(win, 0);
      } else {
        win.activate(0);
      }
    } else {
      throw new Error('Not found');
    }
  }

  Close(winid) {
    let win = this._get_window_by_wid(winid).meta_window;
    if (win) {
      win.kill();
      // win.delete(Math.floor(Date.now() / 1000));
    } else {
      throw new Error('Not found');
    }
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
      inputMethod.set_preedit_text(null, 0, 0, Clutter.PreeditResetMode.CLEAR);
      inputMethod.commit(text);
    }
  }
}
