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
@asterai/cli/0.4.0 linux-x64 node-v20.12.2
$ asterai --help [COMMAND]
USAGE
  $ asterai COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`asterai auth KEY`](#asterai-auth-key)
- [`asterai build [INPUT]`](#asterai-build-input)
- [`asterai codegen`](#asterai-codegen)
- [`asterai deploy [INPUT]`](#asterai-deploy-input)
- [`asterai help [COMMAND]`](#asterai-help-command)
- [`asterai init [OUTDIR]`](#asterai-init-outdir)
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

_See code: [src/commands/auth.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.4.0/src/commands/auth.ts)_

## `asterai build [INPUT]`

compiles the plugin

```
USAGE
  $ asterai build [INPUT] [-m <value>]

FLAGS
  -m, --manifest=<value>  [default: plugin.asterai.proto] manifest path

DESCRIPTION
  compiles the plugin

EXAMPLES
  $ asterai build
```

_See code: [src/commands/build.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.4.0/src/commands/build.ts)_

## `asterai codegen`

Generate code from the plugin manifest

```
USAGE
  $ asterai codegen [-m <value>] [-o <value>] [-a <value>] [-l <value>] [-s]

FLAGS
  -a, --appId=<value>      app id
  -l, --language=<value>   [default: js] language of generated typings
  -m, --manifest=<value>   [default: plugin.asterai.proto] manifest path
  -o, --outputDir=<value>  [default: generated] output directory
  -s, --staging            use staging endpoint

DESCRIPTION
  Generate code from the plugin manifest

EXAMPLES
  $ asterai codegen
```

_See code: [src/commands/codegen.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.4.0/src/commands/codegen.ts)_

## `asterai deploy [INPUT]`

compiles and uploads the plugin to asterai

```
USAGE
  $ asterai deploy [INPUT] -a <value> [-m <value>] [-e <value>] [-s]

FLAGS
  -a, --app=<value>       (required) app ID to immediately configure this plugin with
  -e, --endpoint=<value>  [default: https://api.asterai.io/app/plugin]
  -m, --manifest=<value>  [default: plugin.asterai.proto] manifest path
  -s, --staging

DESCRIPTION
  compiles and uploads the plugin to asterai

EXAMPLES
  $ asterai deploy --app 66a46b12-b1a7-4b72-a64a-0e4fe21902b6
```

_See code: [src/commands/deploy.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.4.0/src/commands/deploy.ts)_

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
  $ asterai init [OUTDIR]

DESCRIPTION
  Initialise a new plugin project

EXAMPLES
  $ asterai init project-name
```

_See code: [src/commands/init.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.4.0/src/commands/init.ts)_

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

_See code: [src/commands/query.ts](https://github.com/asterai-io/asterai-sdk/blob/v0.4.0/src/commands/query.ts)_

<!-- commandsstop -->
