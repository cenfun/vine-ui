# Changelog

All notable changes to this project will be documented in this file.

## [4.1.0] - 2026-08-28

### Added

- Added the `simple` underline style and configurable simple colors to `VuiTab`.
- Added `VuiContentRenderer` for rendering text, trusted HTML, Vue components, and VNodes.
- Added custom icons, colors, borders, backgrounds, HTML content, component content, and manual dismissal to Toasts.
- Added configurable Toast container positioning and per-container Toast limits through `setToastContainerPosition()` and `setMaxToastCount()`.
- Added Toast enter and leave animations based on the configured container position.

### Changed

- Centralized global style injection and reduced the specificity of the global reset styles.
- Improved Checkbox and Radio control layout, label truncation, and icon alignment.
- Split the mount, Toast, and global tooltip utilities into dedicated modules.
- Updated development dependencies.

### Fixed

- Fixed default-slot detection for Checkbox, Radio, Input, and Switch labels.
- Fixed Toast cleanup so manual dismissal cancels pending timers and repeated dismissal is safe.
- Fixed `timeout: 0` so it reliably disables automatic Toast dismissal.
- Fixed invalid and negative Toast timeouts so they fall back to the default 2000 ms timeout.
- Fixed Toast count enforcement so adding a Toast dismisses the oldest Toast in the same container.
- Fixed Toast exit animations and reduced-motion behavior.

[4.1.0]: https://github.com/cenfun/vine-ui/compare/4.0.0...4.1.0
