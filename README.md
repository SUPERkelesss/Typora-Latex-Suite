# Typora Latex Suite Plugin

> This plugin was developed with the assistance of AI agent tools.

[简体中文](./README_CN.md)

## Installation

1. Download [obgnail/typora_plugin: Typora plugin. Feature enhancement tool](https://github.com/obgnail/typora_plugin) and configure it as instructed.

2. Add the following configuration to `./plugin/global/settings/custom_plugin.user.toml` under your Typora installation directory:

   ```toml
   [latexSuitePlugin]
   name = "Latex Suite"
   enable = true
   hide = false
   order = 1
   use_physics_package = true
   ```

3. Copy `latexSuitePlugin.js` and the `latex-suite` directory to `./plugin/custom/plugins`.

## Fast Setup

Read the [cheatsheet](./cheatsheet.md) to obtain available snippets. You can also add custom snippets in `snippets.js`.

## Switching Snippet Profiles

By default, the plugin uses snippets intended for documents that load the `physics` package. To switch profiles, edit
`./plugin/global/settings/custom_plugin.user.toml` under your Typora installation directory:

```toml
[latexSuitePlugin]
use_physics_package = true # false
```

Available values:

- `true`: `snippets.js` emits commands provided by the `physics` package. This is the default.
- `false`: the same `snippets.js` file emits standard LaTeX/amsmath commands.

Run `npm test` to execute regression tests that do not depend on Typora. The current implementation targets the typora_plugin 1.17.x API as its compatibility baseline.

## Development

Following the [typora_plugin](https://github.com/obgnail/typora_plugin) convention, the plugin entry point is `latexSuitePlugin.js`, while the core implementation resides in `latex-suite`:

- `controller.js`: Typora events and the snippet expansion flow.
- `editor-adapter.js`: adapters for the Typora and DOM editing APIs.
- `matcher.js`: independently testable snippet matching and placeholder parsing.
- `session.js`: temporary document-level state.
- `snippets.js`: unified snippet definitions that can be customized as needed.

## Credits and Acknowledgements

**Typora Latex Suite** uses the Typora custom plugin framework provided by
[typora_plugin](https://github.com/obgnail/typora_plugin).

The snippet design, syntax, and some default rules were adapted from
[Obsidian Latex Suite](https://github.com/artisticat1/obsidian-latex-suite).
