# Zoho Studio Chrome Extension
![extension_preview.png](extension_preview.png)

Zoho Studio is a browser-based development workspace for Zoho services. This repository contains the Chrome extension application and the shared packages used to inspect, browse, and work with Zoho artifacts from a side panel UI.

The main application lives in [`apps/chrome-ext`](apps/chrome-ext). The current extension runtime registers integrations for:

- Zoho CRM
- Zoho Creator

## What This Project Does

The extension is designed to work next to an open Zoho tab and expose a development-oriented workspace inside the browser side panel. Depending on the active integration, it can detect available providers, read metadata, and work with artifacts through the configured API layer.

At a high level, the project includes:

- a Chrome extension built with Vite, Vue 3, and Manifest V3
- shared core, UI, utility, and export packages in the monorepo
- integration packages for Zoho-related providers
- a configurable HTTP API endpoint used by the extension

## Repository Structure

- `apps/chrome-ext` - the main browser extension application
- `packages/core` - integration and capability primitives
- `packages/ui-kit` - shared UI components and styles
- `packages/utils` - shared utility helpers and types
- `packages/export-zip` - ZIP export helpers
- `integrations/*` - provider-specific integration packages

## Requirements

- Node.js
- npm
- Google Chrome or another Chromium-based browser with extension side panel support
- A compatible API application/service available over HTTP

## Important Notice

This project is an independent tool and is not affiliated with, endorsed by, or supported by Zoho.

This project uses unofficial, undocumented, or otherwise unsupported Zoho web APIs, browser flows, and page/runtime behavior. Because of that:

- compatibility may break at any time without notice
- some features may stop working after Zoho UI or backend changes
- you use this software at your own risk

By using this project, the user accepts full responsibility for:

- how the extension is installed and used
- the environments and accounts it is connected to
- compliance with internal policies, contracts, and applicable law
- any impact caused by unsupported API usage or automation behavior

No warranty is provided. Use it only in environments you are authorized to access.

## Privacy And Data Handling

The project is intended to work only with:

- the Zoho pages you open in your browser
- the API endpoint you explicitly configure for the extension

The project is not designed to send your working data to unrelated third parties. The codebase does not describe analytics, ad trackers, or deliberate forwarding of project data outside the Zoho pages you open and the API endpoint you configure.

However, your effective data flow still depends on your own setup. If you point the extension to a remote API server, that server will receive the requests sent to it. You are responsible for operating and trusting the API service you configure.

## Configuration

The extension reads its environment variables from `apps/chrome-ext/.env` when run through the Nx targets configured in this repository.

Use [`apps/chrome-ext/.env.example`](apps/chrome-ext/.env.example) as the template:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_API_PROXY_TARGET=http://127.0.0.1:8000
VITE_API_HOST_PERMISSION_URL="*://127.0.0.1/*"
VITE_GITHUB_REPO_URL="https://github.com/igor-yuzkiv/zoho-studio"
```

Variable meaning:

- `VITE_API_BASE_URL` - base URL used by the extension for API requests
- `VITE_API_PROXY_TARGET` - proxy target used during local development when the API base URL is relative
- `VITE_API_HOST_PERMISSION_URL` - extra Chrome host permission for your API host
- `VITE_GITHUB_REPO_URL` - repository URL used for issue/report links inside the UI

## Installation Guide

### 1. Install Dependencies

From the repository root:

```bash
npm install
```

### 2. Configure The Extension

Create an environment file for the extension:

```bash
cp apps/chrome-ext/.env.example apps/chrome-ext/.env
```

Then edit `apps/chrome-ext/.env` if your API service does not run at the default local address.

### 3. Install Or Start The API Application

This extension expects a compatible HTTP API service. The example configuration assumes:

- API base URL: `http://127.0.0.1:8000/api`
- API host: `http://127.0.0.1:8000`

Before using the extension:

1. Start your API application/service.
2. Confirm it is reachable from the browser.
3. If it runs on a different host, port, or domain, update `apps/chrome-ext/.env`.
4. Rebuild the extension after changing environment values.

If your API is remote, make sure `VITE_API_HOST_PERMISSION_URL` matches that host pattern.

## Build And Run

### Production Build

Build the unpacked extension:

```bash
npx nx build chrome-ext
```

The output is generated in [`apps/chrome-ext/dist`](apps/chrome-ext/dist).

### Development Mode

Start the extension in development mode:

```bash
npx nx dev chrome-ext
```

The local Vite dev server runs on `http://localhost:4201`.

For type-checking:

```bash
npx nx typecheck chrome-ext
```

## Install The Chrome Extension

After building the extension:

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the [`apps/chrome-ext/dist`](apps/chrome-ext/dist) directory.
5. Pin the extension if needed.
6. Open any supported Zoho page in another browser tab.
7. Open the extension from the Chrome toolbar or side panel.

When a supported Zoho service is open, it should appear in the extension's service list.

## Typical Local Setup

For a default local workflow:

1. Install dependencies with `npm install`.
2. Copy `apps/chrome-ext/.env.example` to `apps/chrome-ext/.env`.
3. Start your API service on `127.0.0.1:8000`.
4. Run `npx nx build chrome-ext`.
5. Load `apps/chrome-ext/dist` as an unpacked extension in Chrome.
6. Open a Zoho CRM or Zoho Creator page in a browser tab.
7. Open the extension side panel and start working.

## Troubleshooting

- If the extension cannot reach the API, verify `apps/chrome-ext/.env` and confirm the API server is running.
- If a Zoho service does not appear in the UI, make sure the relevant Zoho page is open in another tab.
- If you change environment variables, rebuild the extension before reloading it in Chrome.
- If the unpacked extension does not refresh, reload it from `chrome://extensions/`.
- If Zoho changes its internal behavior, unsupported integrations may need code updates before they work again.
