UUID = gwctl-wayland-api@kamuko.de
NAME = gwctl Wayland API
ZIP = $(UUID).zip

SCALE ?= 1
TEXT_SCALE ?= 1.25

EXTENSION_FILES = extension.js main.js metadata.json export-keymap.js

# What shell-session.sh needs from here.
export SCALE TEXT_SCALE

.PHONY: all compile zip install preview test-shell clean clean-env

all: compile zip

compile:
	@echo ":: No compilation needed for this extension."

zip: compile
	@echo ":: Creating extension bundle..."
	@# Package every runtime module so the installed extension can resolve the entry shim import.
	@zip -qr $(ZIP) $(EXTENSION_FILES)

install: zip
	@echo ":: Installing extension..."
	@gnome-extensions install --force "$(ZIP)"
	@echo ":: Installed $(UUID). Log out and back in to load it."

# A Shell in a window, with the extension. Its settings are under build/preview and are kept between runs.
preview: zip
	@bash shell-session.sh "$(ZIP)"

# Checks what Type leaves in real applications, in a Shell without a screen.
test-shell: zip
	@bash shell-session.sh "$(ZIP)" "$(CURDIR)/build/$@" --reset-settings \
		--wayland --headless --virtual-monitor 1920x1080 --automation-script tests/type.test.js

# What the preview Shell keeps: its settings and its copy of the extension.
clean-env:
	rm -rf build/preview

clean:
	rm -f $(ZIP)
