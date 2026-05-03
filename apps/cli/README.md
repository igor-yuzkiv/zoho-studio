# zoho-studio-cli

Interactive CLI for Zoho Studio, built with [Ink](https://github.com/vadimdemedes/ink). Includes a WebSocket server on port `3001` for communication with the Chrome extension.

## Prerequisites

- Node.js >= 16
- Built from the `zoho-studio` NX monorepo root

## Commands

All commands are run from the **monorepo root**.

### Build

Compiles TypeScript sources to `apps/cli/dist/`:

```bash
npx nx run cli:build
```

For development build (with source maps):

```bash
npx nx run cli:build:development
```

### Dev

Watches for source changes and auto-restarts the process:

```bash
npx nx run cli:dev
```

Runs two processes in parallel:
- `esbuild --watch` — rebuilds on file changes
- `node --watch` — restarts on output changes

### Init (global install)

Builds the project and registers `zoho-studio-cli` as a global command via `npm link`:

```bash
npx nx run cli:init
```

This creates symlinks:
- `~/.nvm/.../lib/node_modules/zoho-studio-cli` → `apps/cli/`
- `~/.nvm/.../bin/zoho-studio-cli` → `apps/cli/dist/main.js`

After running `init`, you can launch the CLI from any directory:

```bash
zoho-studio-cli
zoho-studio-cli --name Jane
```

### Uninstall global link

```bash
npm unlink -g zoho-studio-cli
```

## WebSocket Server

The CLI starts a WebSocket server on `ws://localhost:3001` alongside the UI. The Chrome extension connects to this server to exchange messages with the CLI process.
