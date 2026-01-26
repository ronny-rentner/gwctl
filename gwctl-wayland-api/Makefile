UUID = gwctl-wayland-api@kamuko.de
NAME = Gnome Wayland API
DOMAIN = kamuko.de
ZIP_NAME = $(UUID).zip

RES ?= 3200x1600
SCALE ?= 1
TEXT_SCALE ?= 1.5

TEST_ENV ?= $(PWD)/.test-env

.PHONY: all compile zip run test-install clean clean-env

all: compile zip

compile:
	@echo ":: No compilation needed for this extension."

zip: compile
	@echo ":: Creating extension bundle..."
	@zip -qr $(ZIP_NAME) extension.js metadata.json

run: compile
	@echo "Running in persistent home: $(TEST_ENV)"
	@mkdir -p $(TEST_ENV)/data/gnome-shell/extensions
	@mkdir -p $(TEST_ENV)/config/systemd/user
	@# 1. Create the private runtime directory
	@mkdir -p $(TEST_ENV)/runtime/keyring
	@chmod 700 $(TEST_ENV)/runtime
	@for svc in localsearch-3.service localsearch-extractor-3.service tracker-extract-3.service tracker-extract.service tracker-miner-apps.service tracker-miner-fs-3.service tracker-miner-fs.service tracker-miner-rss.service tracker-store.service tracker-writeback.service evolution-addressbook-factory.service evolution-calendar-factory.service evolution-source-registry.service evolution-user-prompter.service; \
	do \
		ln -sf /dev/null $(TEST_ENV)/config/systemd/user/$$svc; \
	done; \
	rm -rf $(TEST_ENV)/data/gnome-shell/extensions/$(UUID); \
	mkdir -p $(TEST_ENV)/data/gnome-shell/extensions/$(UUID); \
	cp extension.js metadata.json $(TEST_ENV)/data/gnome-shell/extensions/$(UUID); \
	XDG_DATA_HOME=$(TEST_ENV)/data \
	XDG_CONFIG_HOME=$(TEST_ENV)/config \
	XDG_RUNTIME_DIR=$(TEST_ENV)/runtime \
	dbus-run-session -- bash -c "\
		eval \$$$(gnome-keyring-daemon --start --components=secrets); \
		gsettings set org.gnome.shell disable-extension-version-validation true; \
		gsettings set org.gnome.shell enabled-extensions \"['$(UUID)']\"; \
		gsettings set org.gnome.desktop.search-providers disabled \"['org.gnome.Characters.desktop', 'org.gnome.font-viewer.desktop', 'org.gnome.Software.desktop', 'org.gnome.clocks.desktop']\"; \
		export GTK_A11Y=none; \
		export NO_AT_SPI_BUS_DIRECT_NAV=1; \
		export GTK_USE_PORTAL=0; \
		env MUTTER_DEBUG_DUMMY_MODE_SPECS=\"$(RES)\" MUTTER_DEBUG_DUMMY_MONITOR_SCALES=\"$(SCALE)\" gnome-shell --nested --wayland"

test-install: zip
	@echo "Installing to persistent home: $(TEST_ENV)"
	@mkdir -p $(TEST_ENV)/data $(TEST_ENV)/config/systemd/user
	@for svc in localsearch-3.service localsearch-extractor-3.service tracker-extract-3.service tracker-extract.service tracker-miner-apps.service tracker-miner-fs-3.service tracker-miner-fs.service tracker-miner-rss.service tracker-store.service tracker-writeback.service evolution-addressbook-factory.service evolution-calendar-factory.service evolution-source-registry.service evolution-user-prompter.service; do \
		ln -sf /dev/null $(TEST_ENV)/config/systemd/user/$$svc; \
	done; \
	XDG_DATA_HOME=$(TEST_ENV)/data XDG_CONFIG_HOME=$(TEST_ENV)/config gnome-extensions install --force $(ZIP_NAME); \
	XDG_DATA_HOME=$(TEST_ENV)/data XDG_CONFIG_HOME=$(TEST_ENV)/config dbus-run-session -- bash -c \
		"\
			gsettings set org.gnome.shell disable-extension-version-validation true; \
			gsettings set org.gnome.shell enabled-extensions \"['$(UUID)']\"; \
			gsettings set org.gnome.desktop.interface text-scaling-factor $(TEXT_SCALE); \
			gsettings set org.gnome.desktop.search-providers disabled \"['org.gnome.Characters.desktop', 'org.gnome.font-viewer.desktop', 'org.gnome.Software.desktop', 'org.gnome.clocks.desktop']\"; \
			export GTK_A11Y=none; \
			export NO_AT_SPI_BUS_DIRECT_NAV=1; \
			export GTK_USE_PORTAL=0; \
			env MUTTER_DEBUG_DUMMY_MODE_SPECS=\"$(RES)\" MUTTER_DEBUG_DUMMY_MONITOR_SCALES=\"$(SCALE)\" gnome-shell --nested --wayland"

clean-env:
	rm -rf $(TEST_ENV)

clean:
	rm -f $(ZIP_NAME)