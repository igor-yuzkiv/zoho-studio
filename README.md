# Zoho Studio Chrome Extension

## ⚠️ Disclaimer

This project is an independent, non-commercial developer tool and is not affiliated with, endorsed by, or supported by Zoho.

It is maintained as a personal project and may evolve over time. Use it only in environments you are authorized to access and in accordance with your organization's policies.

---

![extension_preview.png](extension_preview.png)

**Zoho Studio** is a browser-based development workspace for Zoho services. This repository contains a Chrome
extension and shared packages designed to inspect, browse, and manage Zoho artifacts directly from a side panel UI.

---

## 🚀 Overview

The extension works alongside an active Zoho tab and provides a developer-oriented workspace directly in the browser.
Its purpose is to reduce the friction of navigating complex Zoho interfaces and replace ad-hoc scripts with a more
consistent workflow.

### Key Capabilities

- **Unified Interface:** Browse resources across different Zoho services in one place.
- **Deep Inspection:** Read metadata and inspect artifacts such as functions, workflows, modules, and forms.
- **Developer Workflow:** Access Deluge code, execution logs, field definitions, and exports from a single UI.
- **Service Support:** The current runtime registers integrations for **Zoho CRM** and **Zoho Creator**.

---

## 🔒 Security & Privacy

This project follows a **local-first** approach.

The extension operates only within:

- the Zoho pages opened in your browser
- the API endpoint you explicitly configure
- the local browser storage used by the extension

Additional notes:

- **No Hosted Backend:** The extension runs entirely in the browser and communicates only with your active Zoho session and any API endpoints you explicitly configure.
- **Credential Handling:** It uses browser-level permissions (such as `cookies` and `webRequest`) to operate within your Zoho session and does not store credentials outside of the browser.
- **Local Storage:** Artifacts and metadata are cached locally using **IndexedDB (Dexie)**.
- **Controlled Data Flow:** Data remains on your machine unless you explicitly configure or modify the extension to send it elsewhere.
- **User-Controlled Behavior:** Any interaction with external systems depends on your own configuration or changes to the code.

---

## 🛠 Functionality

### Core Architecture

- **Modular Design:** Built around integration manifests where each provider declares its capabilities and tab
  resolvers.
- **Integration Registry:** The extension app registers and discovers supported providers through a centralized
  registry.
- **Typed Core Models:** Shared provider and artifact models live in `packages/core`.
- **Capability-Driven Structure:** Provider-specific logic plugs into shared abstractions instead of being hardcoded in
  the UI.
- **Dependency Injection:** Uses `tsyringe` to keep browser services and storage implementations replaceable.
- **Local Persistence:** Uses Dexie/IndexedDB for caching provider artifacts in the browser.
- **Monorepo Structure:** Clear separation between the extension app, core abstractions, UI kit, utilities, export
  helpers, and provider integrations.

### Zoho CRM Features

- **Artifact Support:** Functions, Workflows, Modules, Fields, and Webhooks.
- **Function Debugging:** View execution logs and metadata directly in the side panel.
- **Exports:** ZIP export for functions, including Deluge code and metadata, plus JSON exports for workflows, modules,
  fields, and webhooks.
- **Direct Links:** Jump directly to related edit pages in Zoho CRM where supported.

### Zoho Creator Features

- **Form Inspection:** Load forms from the current application context.
- **Definition View:** Access form definitions and field tables.
- **Metadata View:** Inspect form metadata in a normalized workspace format.
- **Mapping:** Creator forms are mapped into the shared artifact model used across the extension.

### Git Features (Beta)

The Git feature is currently available in beta and is intended to support exporting provider artifacts into Git
repositories through a configured API backend.

It is controlled by the env flag `VITE_FEATURE_GIT`. If the flag is disabled, the Git menu, Git settings route, and
Git commit actions are hidden in the extension UI.

The current implementation includes:

- Git user configuration inside the extension UI
- repository registration from the extension UI
- provider artifact export and commit flow into a selected repository
- commit author name and email support
- ZIP-based artifact upload during commit operations

Important:

- this feature is not standalone and requires a backend API
- this repository does not ship a complete Git backend for you
- if you want to use the Git feature, you can implement that backend yourself and connect the extension to it

The frontend currently expects these two backend endpoints:

1. `POST /git/repositories`

    JSON body:

    ```json
    {
        "name": "string",
        "description": "string?",
        "author": {
            "name": "string",
            "email": "string"
        }
    }
    ```

    Expected purpose:
    create or register a Git repository and return a repository object with at least `name`.

2. `POST /git/repositories/{repository}/commit`

    Multipart form-data fields:
    - `file`
    - `message`
    - `repository`
    - `author[name]`
    - `author[email]`

    Expected purpose:
    accept the exported ZIP archive, create a commit in the target repository, and return a response with at least
    `message`.

If these endpoints are not implemented on your backend, the Git beta functionality in the extension will not work.

---

## ⚙️ Configuration

The extension reads environment variables from `apps/chrome-ext/.env`. Use `apps/chrome-ext/.env.example` as the
template.

| Variable                       | Description                                                                                               | Default                                      |
| :----------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------- |
| `VITE_API_BASE_URL`            | Base URL for API requests                                                                                 | `http://127.0.0.1:8000/api`                  |
| `VITE_API_PROXY_TARGET`        | Proxy target used in local development                                                                    | `http://127.0.0.1:8000`                      |
| `VITE_API_HOST_PERMISSION_URL` | Chrome host permissions for your API. Supports one or multiple patterns separated by commas or new lines. | `*://127.0.0.1/*,*://localhost/*`            |
| `VITE_GITHUB_REPO_URL`         | Repository URL used for issue/report links in the UI                                                      | `https://github.com/igor-yuzkiv/zoho-studio` |
| `VITE_FEATURE_GIT`             | Enables beta Git functionality                                                                            | `false`                                      |

If your API runs on a different host, port, or domain, update both `VITE_API_BASE_URL` and
`VITE_API_HOST_PERMISSION_URL` accordingly.

Examples:

- single host pattern: `VITE_API_HOST_PERMISSION_URL="*://127.0.0.1/*"`
- multiple host patterns: `VITE_API_HOST_PERMISSION_URL="*://127.0.0.1/*,*://localhost/*"`

---

## 🗂 Repository Structure

- `apps/chrome-ext` - the main browser extension application
- `packages/core` - integration and capability primitives
- `packages/ui-kit` - shared UI components and styles
- `packages/utils` - shared utility helpers and types
- `packages/export-zip` - ZIP export helpers
- `integrations/*` - provider-specific integration packages

---

## 📦 Installation & Build

### 1. Requirements

- **Node.js** (v22 or higher)
- **npm**
- **Nx CLI**: `npm install -g nx`
- **Google Chrome** or another Chromium-based browser with side panel support
- **A compatible API application/service** available over HTTP

### 2. Setup

```bash
npm install
cp apps/chrome-ext/.env.example apps/chrome-ext/.env
```

Then edit `apps/chrome-ext/.env` if your API service does not run at the default local address.

### 3. Build And Run

Production build:

```bash
npx nx build chrome-ext
```

Development mode:

```bash
npx nx dev chrome-ext
```

Type-checking:

```bash
npx nx typecheck chrome-ext
```

The production output is generated in `apps/chrome-ext/dist`. The development server runs on `http://localhost:4201`.

### 4. Load Into Chrome

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `apps/chrome-ext/dist` directory.
5. Pin the extension if needed.
6. Open any supported Zoho page in another tab.
7. Open the extension from the Chrome toolbar or side panel.

When a supported Zoho service is open, it should appear in the extension's service list.

### 5. Typical Local Setup

1. Install dependencies with `npm install`.
2. Copy `apps/chrome-ext/.env.example` to `apps/chrome-ext/.env`.
3. Start your API service on `127.0.0.1:8000`.
4. Run `npx nx build chrome-ext`.
5. Load `apps/chrome-ext/dist` as an unpacked extension in Chrome.
6. Open a Zoho CRM or Zoho Creator page in a browser tab.
7. Open the extension side panel and start working.

---

## 🧰 Troubleshooting

- If the extension cannot reach the API, verify `apps/chrome-ext/.env` and confirm the API server is running.
- If a Zoho service does not appear in the UI, make sure the relevant Zoho page is open in another tab.
- If you change environment variables, rebuild the extension before reloading it in Chrome.
- If the unpacked extension does not refresh, reload it from `chrome://extensions/`.
- If Zoho changes its internal behavior, unsupported integrations may require code updates.
