# this file is *not* meant to cover or endorse the use of nox or pytest or
# testing in general,
#
#  It's meant to show the use of:
#
#  - check-manifest
#     confirm items checked into vcs are in your sdist
#  - readme_renderer (when using a reStructuredText README)
#     confirms your long_description will render correctly on PyPI.
#
#  and also to help confirm pull requests to this project.

import os

import nox

nox.options.sessions = ["lint"]

# Define the minimal nox version required to run
nox.options.needs_version = ">= 2024.3.2"


@nox.session
def lint(session):
    session.install("flake8")
    session.run(
        "flake8", "--exclude", ".nox,*.egg,build,data",
        "--select", "E,W,F", "."
    )


@nox.session
def build_and_check_dists(session):
    session.install("build", "check-manifest >= 0.42", "twine")
    # If your project uses README.rst, uncomment the following:
    # session.install("readme_renderer")

    session.run("check-manifest", "--ignore", "noxfile.py,tests/**")
    session.run("python", "-m", "build")
    session.run("python", "-m", "twine", "check", "dist/*")


# No tests needed as they require a running GNOME session
