UUID := gwctl-wayland-api@kamuko.de
EXTENSION_FILES := extension.js main.js metadata.json
ZIP := $(UUID).zip

# UI scale (a whole number) and text scale, independent of the display resolution.
SCALE ?= 2
TEXT_SCALE ?= 1.25
# Headless display size in pixels; the interactive preview follows its devkit window size.
RESOLUTION ?= 3840x2160

# What shell-session.sh needs from here.
export SCALE TEXT_SCALE

.ONESHELL:
.SHELLFLAGS := -ec

.PHONY: preview test-shell compile zip install clean clean-env
.DEFAULT_GOAL := preview

compile:
	@#echo ":: No compilation needed for this extension"

# Settings are under build/preview and are kept between runs.
preview: zip
	@bash shell-session.sh "$(ZIP)" "$@"

test-shell: zip
	@echo ":: Running tests/extension.test.js"
	bash shell-session.sh "$(ZIP)" "$@" --reset \
		--wayland --headless --virtual-monitor $(RESOLUTION) \
			--automation-script tests/extension.test.js

zip: compile
	@echo ":: Creating extension bundle"
	zip -qr -FS $(ZIP) $(EXTENSION_FILES)
	echo ":: Extension bundle ready: $(abspath $(ZIP))"

install: zip
	@echo ":: Installing extension"
	gnome-extensions install --force "$(ZIP)"
	echo ":: Installed $(UUID). Log out and back in to load it."

clean:
	rm -f $(ZIP)

clean-env:
	rm -rf build/preview build/test-shell
