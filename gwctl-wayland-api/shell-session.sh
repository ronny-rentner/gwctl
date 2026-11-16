# Runs a GNOME Shell with the extension package given as the first argument, isolated in its own XDG directories and
# session bus, so it cannot touch the desktop's files or settings. They live in the directory given as the second
# argument, by default build/preview in the current directory. Further arguments go to gnome-shell.
set -e

zip=$(realpath "${1:?Usage: shell-session.sh ZIP [DIR [gnome-shell options]]}")
dir=$(realpath -m "${2:-build/preview}")
shift
[ $# -eq 0 ] || shift
echo "Running in persistent home: $dir"

# UI scale (a whole number) and text scale of the Shell; the environment can override these defaults. run_session
# below runs in another bash, which gets them through the environment.
export SCALE="${SCALE:-1}" TEXT_SCALE="${TEXT_SCALE:-1.25}"

export XDG_CONFIG_HOME="$dir/config"
export XDG_DATA_HOME="$dir/data"
export XDG_CACHE_HOME="$dir/cache"
export XDG_STATE_HOME="$dir/state"
# Keeps the settings out of the desktop's dconf database: GSettings writes a keyfile under XDG_CONFIG_HOME itself, and
# dconf gets an empty profile.
export GSETTINGS_BACKEND=keyfile DCONF_PROFILE=/dev/null
# The window appears on the desktop. The name of the desktop's Wayland socket is looked up in the runtime directory,
# so it becomes a full path before the runtime directory changes.
export WAYLAND_DISPLAY="$XDG_RUNTIME_DIR/$WAYLAND_DISPLAY"
export XDG_RUNTIME_DIR="$dir/runtime"
export GTK_A11Y=none
export NO_AT_SPI_BUS_DIRECT_NAV=1
export GTK_USE_PORTAL=0
export GDK_DEBUG=no-portals
export ADW_DISABLE_PORTAL=1
# pipewire's realtime module asks the system for a higher priority, which a preview does not need.
# wireplumber loads the module regardless, so there its messages are switched off.
export WIREPLUMBER_DEBUG=mod.rt:0

mkdir -p "$XDG_CONFIG_HOME/systemd/user" "$XDG_RUNTIME_DIR/keyring" "$XDG_CONFIG_HOME/wireplumber/wireplumber.conf.d"

chmod 700 "$XDG_RUNTIME_DIR" "$XDG_RUNTIME_DIR/keyring"

# wireplumber's script that mutes on unplugging removes four hooks at its start that it never registered, with an
# error for each. The session has no audio devices, so the script is left out.
echo 'wireplumber.profiles = { policy = { hooks.device.routes.automute-alsa = disabled } }' \
	> "$XDG_CONFIG_HOME/wireplumber/wireplumber.conf.d/no-automute.conf"

# Everything that talks to the session bus. The first argument is the package, the rest go to gnome-shell.
run_session() {
	#eval $(gnome-keyring-daemon --daemonize --components=secrets)

	# --force replaces the copy installed by the last run.
	uuid=$(gnome-extensions install --force --print-uuid "$1")
	shift

	gsettings set org.gnome.shell disable-extension-version-validation true
	gsettings set org.gnome.shell enabled-extensions "['$uuid']"
	gsettings set org.gnome.desktop.search-providers disabled \
		"['org.gnome.Characters.desktop', 'org.gnome.font-viewer.desktop', 'org.gnome.Software.desktop', 'org.gnome.clocks.desktop']"
	gsettings set org.gnome.desktop.interface scaling-factor $SCALE
	gsettings set org.gnome.desktop.interface text-scaling-factor $TEXT_SCALE

	# gwctl-preview finds this session's bus through this file.
	echo "$DBUS_SESSION_BUS_ADDRESS" > "$XDG_RUNTIME_DIR/bus-address"
	# pipewire does not end with the session bus, so it is stopped with the session.
	trap 'kill $(jobs -p)' EXIT
	pipewire --properties '{ module.rt = false }' &
	wireplumber --profile policy &

	gnome-shell --wayland --devkit "$@"
}

# The bus starts only now, after the XDG directories and the settings backend are set, because the services it starts
# inherit them. The bash that dbus-run-session starts gets run_session through the environment.
export -f run_session
dbus-run-session -- bash -ec 'run_session "$@"' bash "$zip" "$@"
