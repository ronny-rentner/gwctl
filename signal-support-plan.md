# Add D-Bus signal support to gwctl

## Purpose

Extend gwctl’s existing D-Bus method support with generic D-Bus signal support, available through Python and the CLI.

Start with GNOME’s focus-window signal. Other signals can be added later without adding signal-specific Python handlers.

## GNOME Shell extension

### Signal forwarding

Carry the GNOME signal name, omitting the `notify::` prefix, in a generic D-Bus signal:

```text
Signal(s name, s data)
```

Start with `notify::focus-window`. Relay the native signal name, omitting the `notify::` prefix. Construct an explicit result object and serialize it as JSON in `data`, following the existing extension commands. Use the native callback’s available values without querying additional window state or constructing a `List` snapshot.

The native callback receives the display object and a property descriptor. Initially include readily available fields from that data that can be represented in JSON; additional fields can be added later.

Relay one D-Bus signal per native GNOME signal. Do not synthesize focus/unfocus pairs, reorder signals, or generate an initial signal.

### Observation lifecycle

Implement two D-Bus methods in the extension: `Watch(as signals)` and `Unwatch(as signals)`.

Observation starts only on `Watch`. Record the caller’s selected signals under its unique D-Bus name. Monitor ownership of that name through GIO’s name-watching API; this registration is the connection’s D-Bus name watch. Connections watching the same signal share one GNOME handler registration.

The extension owns these resources:

| Resource                   | Created when                             | Released when                                                  |
| -------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| Connection record          | A connection starts watching             | It watches no signals, or the extension is disabled            |
| D-Bus name watch           | Its connection record is established     | Its connection record is removed                               |
| GNOME handler registration | The first connection watches that signal | No connections watch that signal, or the extension is disabled |
| Exported D-Bus object      | The extension is enabled                 | The extension is disabled, after observation cleanup           |

Validate signal names before changing observation state for either method. `Watch` establishes the caller’s observation record, name watch, and any required GNOME handlers. `Unwatch` removes only the specified signals from that caller’s record, preserving its other signals and other connections’ observation.

When a caller’s unique bus name has no owner, clear its watched signals. This must also cover a caller disconnecting during `Watch` setup. After either `Unwatch` or disconnection, release handlers no longer needed by any connection and remove connection records and name watches with no watched signals.

If setup fails, release resources allocated by that setup, preserve resources needed by other connections, and return the error.

On extension disable, release all observation resources before withdrawing the D-Bus interface. Re-enabling starts with no active observation.

## gwctl D-Bus integration

Extend introspection to collect D-Bus signal names, descriptions, and argument definitions alongside methods. Do not add a separate discovery method.

Keep discovery, signal listing, and existing commands on the existing connection. Listening uses a separate D-Bus connection configured for GLib, opened only when listening is requested. Load and initialize GLib support only in that listening path, without changing the process-wide D-Bus defaults.

Use dbus-python’s existing signal-registration API internally. Retain its returned registration handles so Python callers can request active cleanup through `unwatch`.

Listening setup in `watch` registers the selected callbacks and automatically invokes D-Bus `Watch`. Callback registration, `Watch`, and `Unwatch` must use the listening connection and the same extension interface.

Add `PyGObject` as a dependency without a version constraint to provide Python access to GLib.

## gwctl Python usage

Follow the existing Python method naming: `watch` starts listening and `unwatch` stops selected signals. The caller supplies callbacks and runs its own event loop; gwctl owns the listening connection and local callback registrations.

A successful `unwatch` stops observation through D-Bus `Unwatch` and releases the local callback registrations for the specified signals. Preserve the remaining watched signals. When no watched signals remain, close the listening connection. Keep the discovery connection and the caller’s event loop usable.

Report setup and cleanup failures to the Python caller without terminating its process. A failed setup must release resources acquired by that setup while preserving existing observation.

## gwctl CLI

Extend the CLI command for D-Bus `Watch` with signal listing and listening:

```sh
gwctl watch --all
gwctl watch
gwctl watch Signal
```

With no arguments, list available D-Bus signals. `--all` listens to all available signals; explicit signal names select which signals to listen to.

The CLI owns the listening connection, local callback registrations, and GLib event loop. Allocate these only for listening and run the loop in the CLI’s main thread. Listing signals must not allocate these resources or initialize GLib.

End listening on interruption or failure, reporting failures through CLI error handling. Process exit releases local resources and closes the D-Bus connections; the extension’s name-watch handling releases observation for the disconnected listening connection.

Follow the existing result and output-format conventions, including interpretation of JSON-valued strings. Honor the requested output format; JSONL produces one record per signal.

## Validation

Use the existing isolated Shell infrastructure; preserve existing method behavior.

### GNOME Shell extension

- GNOME signal names preserved in the transported data except for the omitted `notify::` prefix.
- Native signals are relayed as they are.
- Payloads use readily available callback data and follow the existing result-object style.
- Observation starts on `Watch`; multiple clients share handlers; observation of a signal stops when its last interested connection calls `Unwatch` for it or disconnects.
- `Unwatch` removes only the caller’s specified signals, preserving other recorded signals for that caller and all other connections.
- No duplicate handlers after extension disable/re-enable.
- Caller disconnection during `Watch` setup and partial setup failure leave no orphan records, name watches, or GNOME handlers.

### gwctl D-Bus integration

- Signal discovery and reception remain generic, using the existing library registration API.
- Listening setup requests `Watch` automatically; signal registration, `Watch`, and `Unwatch` use the same listening connection.
- Setup failures are reported to the caller.
- Existing commands retain their behavior and require no GLib imports or initialization.

### gwctl Python usage

- `unwatch` releases only the selected signals’ observation and local registrations, preserving remaining watched signals.
- Stopping all watched signals closes the listening connection while leaving the discovery connection, caller’s event loop, and Python process usable.
- Setup failure releases resources acquired by that setup without disturbing existing observation; setup and cleanup errors reach the caller.

### gwctl CLI

- No arguments lists signals; `--all` and explicit names select signals for listening.
- Listing signals and unrelated commands allocate no listening resources and do not start GNOME observation.
- Selected CLI formats, JSONL record boundaries, applicable filtering/field selection, and interruption.
- After normal exit, interruption, or setup/callback/output failure, the extension releases observation associated with the terminated process’s listening connection.
