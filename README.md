# Zoho Studio Chrome Extension

This repository contains a monorepo for the Zoho Studio browser tooling. The main browser extension application lives in [`apps/chrome-ext`](apps/chrome-ext).

## Requirements

- Node.js
- npm
- Google Chrome or another Chromium-based browser

## Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables for the extension app.

Use [`apps/chrome-ext/.env.example`](apps/chrome-ext/.env.example) as a reference and make sure the API URLs match your local or remote backend.

## Run In Development

Start the extension build in development mode:

```bash
npx nx dev chrome-ext
```

The dev server uses port `4201`. Keep the terminal running while working on the extension.

## Build The Extension

Create a production build:

```bash
npx nx build chrome-ext
```

The unpacked extension output is generated in [apps/chrome-ext/dist](apps/chrome-ext/dist)

## Install The Extension In Chrome

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the [apps/chrome-ext/dist](apps/chrome-ext/dist) folder.
5. Open the extension from the Chrome toolbar or side panel.

## Notes

- If the extension cannot reach the API, verify the values in the app env files.
- After changing the source code, rebuild or keep the dev command running and reload the extension in Chrome.
