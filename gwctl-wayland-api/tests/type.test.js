// Runs inside a headless Shell and checks what the extension's Type method leaves in real applications.
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GioUnix from 'gi://GioUnix';
import GLib from 'gi://GLib';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Scripting from 'resource:///org/gnome/shell/ui/scripting.js';

const UUID = 'gwctl-wayland-api@kamuko.de';
const out = `${GLib.get_user_state_dir()}/type-test`;

let extension, keyboard;

async function waitFor(predicate, message) {
    const deadline = GLib.get_monotonic_time() + 20000000;
    while (!await predicate()) {
        if (GLib.get_monotonic_time() > deadline)
            throw new Error(`Timed out: ${message}`);
        await Scripting.sleep(100);
    }
}

function equal(actual, expected, message) {
    if (actual !== expected)
        throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

async function shot(name) {
    const path = `${out}/${name}.png`;
    const stream = Gio.File.new_for_path(path).replace(null, false, Gio.FileCreateFlags.NONE, null);
    await new Promise((resolve, reject) => new Shell.Screenshot().screenshot(false, stream, (screenshot, result) => {
        try {
            screenshot.screenshot_finish(result);
            resolve();
        } catch (error) {
            reject(error);
        }
    }));
    stream.close(null);
}

async function pressKeys(...keyvals) {
    for (const keyval of keyvals)
        keyboard.notify_keyval(GLib.get_monotonic_time(), keyval, Clutter.KeyState.PRESSED);
    for (const keyval of keyvals.reverse())
        keyboard.notify_keyval(GLib.get_monotonic_time(), keyval, Clutter.KeyState.RELEASED);
    await Scripting.sleep(100);
}

function readFile(path) {
    return new TextDecoder().decode(GLib.file_get_contents(path)[1]);
}

// Each application writes the committed text into its file; text() returns it without line breaks.
const apps = [{
    name: 'Text Editor',
    wmClass: 'org.gnome.TextEditor',
    file: `${out}/editor.txt`,
    launch() {
        GioUnix.DesktopAppInfo.new('org.gnome.TextEditor.desktop')
            .launch_uris([Gio.File.new_for_path(this.file).get_uri()], global.create_app_launch_context(0, -1));
    },
    async text() {
        await pressKeys(Clutter.KEY_Control_L, Clutter.KEY_s);
        await Scripting.sleep(1000);
        return readFile(this.file).replaceAll('\n', '');
    },
}, {
    name: 'Terminal',
    wmClass: 'org.gnome.Terminal',
    file: `${out}/terminal.txt`,
    launch() {
        Gio.AppInfo.create_from_commandline(`gnome-terminal -- sh -c 'cat > "${this.file}"'`, null,
            Gio.AppInfoCreateFlags.NONE).launch([], global.create_app_launch_context(0, -1));
    },
    // cat receives the line once Return ends it.
    async text() {
        await pressKeys(Clutter.KEY_Return);
        await Scripting.sleep(500);
        return readFile(this.file).replaceAll('\n', '');
    },
}];

const cases = [
    ['1 preview then commit', {preview: 'one', commit: 'one', expected: 'one'}],
    ['2 second preview then commit', {preview: 'two', commit: 'two', expected: 'onetwo'}],
    ['3a reset mode COMMIT', {preview: 'three', commit: 'three', expected: 'onetwothree'}],
    ['3b reset mode CLEAR', {preview: 'four', clear: true, commit: 'four', expected: 'onetwothreefour'}],
    ['4 empty commit', {preview: 'five', commit: '', expected: 'onetwothreefour'}],
];

function findWindow(app) {
    return global.get_window_actors().map(actor => actor.meta_window)
        .find(window => window.get_wm_class() === app.wmClass);
}

async function focus(app) {
    findWindow(app).activate(global.display.get_current_time_roundtrip());
    await waitFor(() => findWindow(app).has_focus(), `the ${app.name} window has focus`);
    await Scripting.sleep(1000);
}

// The overview takes the keyboard focus from the window, so the application's text input is reset and enabled again.
async function moveFocusAwayAndBack() {
    Main.overview.show();
    await waitFor(() => Main.overview.visible && !Main.overview.animationInProgress, 'the overview is shown');
    Main.overview.hide();
    await waitFor(() => !Main.overview.visible, 'the overview is hidden');
    await Scripting.sleep(500);
}

export async function run() {
    // The Shell's helper process for automation scripts leaves by itself after half a minute, which can be before
    // this test is done. Without this, the Shell tries to stop it at the end and ends with a failure.
    await Scripting.disableHelperAutoExit();
    await waitFor(() => Main.extensionManager.lookup(UUID)?.stateObj, 'the extension is on');
    extension = Main.extensionManager.lookup(UUID).stateObj;
    keyboard = global.stage.context.get_backend().get_default_seat()
        .create_virtual_device(Clutter.InputDeviceType.KEYBOARD_DEVICE);
    Main.overview.hide();
    await waitFor(() => !Main.overview.visible, 'the overview is hidden');
    GLib.mkdir_with_parents(out, 0o755);

    for (const app of apps) {
        GLib.file_set_contents(app.file, '');
        app.launch();
        await waitFor(() => findWindow(app), `the ${app.name} window`);
        await focus(app);
        for (const [name, {preview, clear = false, commit, expected}] of cases) {
            extension.Type(preview, true, clear);
            await Scripting.sleep(300);
            extension.Type(commit, false, false);
            await Scripting.sleep(300);
            // A preview left behind is reset with the mode it was shown with when the focus leaves.
            await moveFocusAwayAndBack();
            await shot(`${app.name} ${name}`.replace(/\W+/g, '-'));
            equal(await app.text(), expected, `${app.name} ${name}`);
            print(`PASS ${app.name} ${name}`);
        }
    }
}
