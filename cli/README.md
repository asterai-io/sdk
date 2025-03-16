# @asterai/cli

CLI for building and deploying asterai plugins

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@asterai/cli.svg)](https://npmjs.org/package/@asterai/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@asterai/cli.svg)](https://npmjs.org/package/@asterai/cli)

<!-- toc -->

- [@asterai/cli](#asteraicli)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @asterai/cli
$ asterai COMMAND
running command...
$ asterai (--version)
@asterai/cli/0.6.1 linux-x64 node-v20.12.2
$ asterai --help [COMMAND]
USAGE
  $ asterai COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`asterai auth KEY`](#asterai-auth-key)
- [`asterai deploy`](#asterai-deploy)
- [`asterai help [COMMAND]`](#asterai-help-command)
- [`asterai init [OUTDIR]`](#asterai-init-outdir)
- [`asterai pkg [INPUT]`](#asterai-pkg-input)
- [`asterai query`](#asterai-query)

## `asterai auth KEY`

authenticate to asterai

```
USAGE
  $ asterai auth KEY

DESCRIPTION
  authenticate to asterai

EXAMPLES
  $ asterai auth
```

_See code: [src/commands/auth.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.6.1/src/commands/auth.ts)_

## `asterai deploy`

uploads a plugin to asterai

```
USAGE
  $ asterai deploy [-a <value>] [-e <value>] [-s] [--plugin <value>] [--pkg <value>]

FLAGS
  -a, --agent=<value>     agent ID to immediately activate this plugin for
  -e, --endpoint=<value>  [default: https://api.asterai.io]
  -s, --staging
      --pkg=<value>       [default: package.wasm] package WASM path
      --plugin=<value>    [default: plugin.wasm] plugin WASM path

DESCRIPTION
  uploads a plugin to asterai

EXAMPLES
  $ asterai deploy --app 66a46b12-b1a7-4b72-a64a-0e4fe21902b6
```

_See code: [src/commands/deploy.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.6.1/src/commands/deploy.ts)_

## `asterai help [COMMAND]`

Display help for asterai.

```
USAGE
  $ asterai help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for asterai.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.22/src/commands/help.ts)_

## `asterai init [OUTDIR]`

Initialise a new plugin project

```
USAGE
  $ asterai init [OUTDIR] [--typescript] [--rust]

FLAGS
  --rust        init a the plugin project in rust
  --typescript  init a the plugin project in typescript

DESCRIPTION
  Initialise a new plugin project

EXAMPLES
  $ asterai init project-name
```

_See code: [src/commands/init.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.6.1/src/commands/init.ts)_

## `asterai pkg [INPUT]`

bundles the WIT into a binary WASM package

```
USAGE
  $ asterai pkg [INPUT] [-o <value>] [-w <value>] [-e <value>]

ARGUMENTS
  INPUT  [default: plugin.wit] path to the plugin's WIT file

FLAGS
  -e, --endpoint=<value>  [default: https://api.asterai.io]
  -o, --output=<value>    [default: package.wasm] output file name for the binary WASM package
  -w, --wit=<value>       [default: package.wit] output package converted to the WIT format

DESCRIPTION
  bundles the WIT into a binary WASM package

EXAMPLES
  $ asterai pkg
```

_See code: [src/commands/pkg.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.6.1/src/commands/pkg.ts)_

## `asterai query`

query an asterai app interactively

```
USAGE
  $ asterai query -a <value> -k <value> [-s] [-e <value>]

FLAGS
  -a, --app=<value>       (required)
  -e, --endpoint=<value>  [default: https://api.asterai.io]
  -k, --key=<value>       (required) app query key
  -s, --staging

DESCRIPTION
  query an asterai app interactively

EXAMPLES
  $ asterai query
```

_See code: [src/commands/query.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.6.1/src/commands/query.ts)_

<!-- commandsstop -->
