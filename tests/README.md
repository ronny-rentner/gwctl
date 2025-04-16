# Testing

This project is difficult to test in automated environments because it requires:
- A running GNOME Shell session
- D-Bus connections to that session
- The "Windows D-Bus Interface" GNOME Shell extension

Therefore, automatic testing is limited to:
- Linting
- Package building
- Import verification

Manual testing is recommended for functionality verification.
EOF < /dev/null
