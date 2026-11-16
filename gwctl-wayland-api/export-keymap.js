#!/usr/bin/env -S gjs -m
/* export-keymap.js
 *
 * Writes the active keymap of the running session to ~/.cache/gwctl-wayland-api-keymap.json:
 *
 *   {"groups": [{"<key symbol name>": [keyval, keycode, modifiers], ...}, ...]}
 *
 * One object per layout group. Each key symbol maps to the key that produces it in that group with the fewest
 * modifiers held.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

// Gdk 4 has no flags for Mod2 to Mod5, so it cannot be asked which symbol a key produces with AltGr held.
import Gdk from 'gi://Gdk?version=3.0';
import GLib from 'gi://GLib';

Gdk.init([]);
const keymap = Gdk.Keymap.get_for_display(Gdk.Display.get_default());

// The largest key code the kernel defines (KEY_MAX) as XKB keycode.
const MAX_KEYCODE = 0x2ff + 8;

const keycodes = [];
let groupCount = 0;
for (let keycode = 8; keycode <= MAX_KEYCODE; keycode++) {
    const [found, keys] = keymap.get_entries_for_keycode(keycode);
    if (!found)
        continue;
    keycodes.push(keycode);
    groupCount = Math.max(groupCount, ...keys.map(key => key.group + 1));
}

const bitCount = state => state.toString(2).replaceAll('0', '').length;
// Every combination of Shift, Lock, Control and Mod1 to Mod5, fewest modifiers first, so that the first key found
// for a symbol is the one that needs the fewest.
const states = Array.from({length: 256}, (_, state) => state).sort((a, b) => bitCount(a) - bitCount(b) || a - b);

const groups = Array.from({length: groupCount}, () => ({}));
for (const [group, symbols] of groups.entries()) {
    for (const state of states) {
        for (const keycode of keycodes) {
            const [found, keyval] = keymap.translate_keyboard_state(keycode, state, group);
            const name = found ? Gdk.keyval_name(keyval) : null;
            if (name !== null && !(name in symbols))
                symbols[name] = [keyval, keycode, state];
        }
    }
}

GLib.file_set_contents(`${GLib.get_user_cache_dir()}/gwctl-wayland-api-keymap.json`, JSON.stringify({groups}));
