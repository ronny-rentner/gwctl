// Runs inside a headless Shell and checks the extension's methods in real applications.
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GioUnix from 'gi://GioUnix';
import GLib from 'gi://GLib';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Scripting from 'resource:///org/gnome/shell/ui/scripting.js';

const out = `${GLib.get_user_state_dir()}/type-test`;

let extension;
const steps = [];

function step(name, act) {
    steps.push([name, act]);
}

// Resolves once the condition holds, checking it again whenever the object emits one of the signals.
function waitFor(condition, object, signals) {
    return new Promise(resolve => {
        const handlers = signals.map(signal => object.connect(signal, check));
        function check() {
            if (condition()) {
                handlers.forEach(handler => object.disconnect(handler));
                resolve();
            }
        }
        check();
    });
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

function readFile(path) {
    return new TextDecoder().decode(GLib.file_get_contents(path)[1]);
}

// Text Editor writes its document into its file when it saves.
const editor = {
    name: 'Text Editor',
    wmClass: 'org.gnome.TextEditor',
    file: `${out}/editor.txt`,
    launch() {
        GioUnix.DesktopAppInfo.new('org.gnome.TextEditor.desktop')
            .launch_uris([Gio.File.new_for_path(this.file).get_uri()], global.create_app_launch_context(0, -1));
    },
};

// Terminal runs cat, which writes each line once Return ends it.
const terminal = {
    name: 'Terminal',
    wmClass: 'org.gnome.Terminal',
    file: `${out}/terminal.txt`,
    launch() {
        Gio.AppInfo.create_from_commandline(`gnome-terminal -- sh -c 'cat > "${this.file}"'`, null,
            Gio.AppInfoCreateFlags.NONE).launch([], global.create_app_launch_context(0, -1));
    },
};

// Returns what a list method of the extension sends over D-Bus, unpacked as a D-Bus caller receives it.
function list(method) {
    return new GLib.Variant('aa{sv}', extension[method]()).recursiveUnpack();
}

function findWindow(app) {
    return global.display.list_all_windows().find(window => window.get_wm_class() === app.wmClass);
}

async function focus(app) {
    findWindow(app).activate(global.display.get_current_time_roundtrip());
    await waitFor(() => findWindow(app).has_focus(), global.display, ['notify::focus-window']);
    await Scripting.sleep(100);
}

step('Opening Text Editor', async () => {
    GLib.unlink(editor.file);
    editor.launch();
    await waitFor(() => findWindow(editor), global.window_manager, ['map']);
});

step('Opening Terminal', async () => {
    GLib.unlink(terminal.file);
    terminal.launch();
    await waitFor(() => findWindow(terminal), global.window_manager, ['map']);
});

// Each case types one line, which the last steps check in the files.
const cases = [
    ['Preview then commit', {preview: 'one', commit: 'one'}],
    ['A second preview then commit', {preview: 'two', commit: 'two'}],
    ['A preview in reset mode COMMIT then commit', {preview: 'three', commit: 'three'}],
    ['A preview in reset mode CLEAR then commit', {preview: 'four', clear: true, commit: 'four'}],
    ['An empty commit', {preview: 'five', commit: ''}],
];

for (const [name, {preview, clear = false, commit}] of cases) {
    step(`${name} in Text Editor`, async () => {
        await focus(editor);
        extension.Type(preview, true, clear);
        extension.Type(commit, false, false);
        extension.Key(['Return', '<Control>s']);
        await shot(`Text Editor ${name}`.replace(/\W+/g, '-'));
    });
    step(`${name} in Terminal`, async () => {
        await focus(terminal);
        extension.Type(preview, true, clear);
        extension.Type(commit, false, false);
        extension.Key(['Return']);
        await shot(`Terminal ${name}`.replace(/\W+/g, '-'));
    });
}

step('List reports the workspace of moved, stuck and unstuck windows', async () => {
    const editorWindow = findWindow(editor);
    const terminalWindow = findWindow(terminal);
    extension.MoveToWorkspace(editorWindow.get_id(), 1);
    const workspaces = new Map(list('List').map(window => [window.id, window.workspace]));
    equal(workspaces.get(editorWindow.get_id()), 1, 'List workspace of a moved window');
    equal(workspaces.get(terminalWindow.get_id()), 0, 'List workspace of a window left on the first workspace');
    extension.Stick(terminalWindow.get_id());
    const sticky = list('List').find(window => window.id === terminalWindow.get_id());
    equal(sticky.workspace, -1, 'List workspace of a stuck window');
    equal(sticky.on_all_workspaces, true, 'List on_all_workspaces of a stuck window');
    extension.Unstick(terminalWindow.get_id());
    const unstuck = list('List').find(window => window.id === terminalWindow.get_id());
    equal(unstuck.workspace, 0, 'List workspace of an unstuck window, the active workspace');
});

step('Toggle switches keep-above to its opposite, under either name of the pair', async () => {
    const editorWindow = findWindow(editor);
    extension.Toggle('keepabove', editorWindow.get_id());
    equal(list('List').find(window => window.id === editorWindow.get_id()).above, true, 'List above after toggling keepabove');
    extension.Toggle('unkeepabove', editorWindow.get_id());
    equal(list('List').find(window => window.id === editorWindow.get_id()).above, false, 'List above after toggling unkeepabove');
});

step('ListWorkspaces reports the workspace names set in GNOME', async () => {
    new Gio.Settings({schema_id: 'org.gnome.desktop.wm.preferences'}).set_strv('workspace-names', ['Mail']);
    await Scripting.waitLeisure();
    equal(list('ListWorkspaces')[0].name, 'Mail', 'ListWorkspaces name of workspace 0');
    equal(list('ListWorkspaces')[1].index, 1, 'ListWorkspaces index of the second workspace');
});

step('ActivateWorkspace switches the active workspace', async () => {
    extension.ActivateWorkspace(1);
    await waitFor(() => list('ListWorkspaces')[1].active, global.workspace_manager, ['active-workspace-changed']);
    equal(list('ListWorkspaces')[0].active, false, 'ListWorkspaces active of an inactive workspace');
});

step('Checking the lines typed into Text Editor', async () => {
    // Text Editor adds a newline after the document's last line when it saves.
    equal(readFile(editor.file), 'one\ntwo\nthree\nfour\n\n\n', 'Text Editor file');
});

step('Checking the lines typed into Terminal', async () => {
    equal(readFile(terminal.file), 'one\ntwo\nthree\nfour\n\n', 'Terminal file');
});

export async function run() {
    // The Shell starts a useless helper process with every automation script, so let's get rid of it.
    (await Scripting._getPerfHelper()).ExitSync();
    // Without this, the Shell tries to stop the helper again at the end and fails.
    await Scripting.disableHelperAutoExit();
    // Stands in for the keyboard a real desktop has from the start. Without one, applications set up their keyboard
    // input only when Key() creates its own device, too late for the keys of that first call. The device stays as long
    // as this variable holds it.
    const keyboard = global.stage.context.get_backend().get_default_seat()
        .create_virtual_device(Clutter.InputDeviceType.KEYBOARD_DEVICE);
    // shell-session.sh enables only the extension under test.
    const [uuid] = global.settings.get_strv('enabled-extensions');
    await waitFor(() => Main.extensionManager.lookup(uuid)?.stateObj, Main.extensionManager, ['extension-state-changed']);
    extension = Main.extensionManager.lookup(uuid).stateObj;
    Main.overview.hide();
    await waitFor(() => !Main.overview.visible, Main.overview, ['hidden']);
    GLib.mkdir_with_parents(out, 0o755);
    for (const [name, act] of steps) {
        await act();
        print(`PASS ${name}`);
    }
    print(`${steps.length} Shell checks passed`);
}
