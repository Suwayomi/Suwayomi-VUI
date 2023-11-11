# Tachidesk-VUI

Robonau's Svelte + skeleton tachidesk UI

| Discord                                                                                                                                                    | Github                                                                                                                                                                                                                                                                                                                                                                                                                                    | Docker                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Discord](https://img.shields.io/discord/801021177333940224.svg?label=discord&labelColor=7289da&color=2c2f33&style=flat)](https://discord.gg/DDZdqZWaHA) | ![](https://img.shields.io/github/stars/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/forks/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/tag/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/release/Suwayomi/Tachidesk-VUI.svg) ![](https://img.shields.io/github/issues/Suwayomi/Tachidesk-VUI.svg) ![](https://github.com/Suwayomi/Tachidesk-VUI/actions/workflows/build.yml/badge.svg) | ![](https://ghcr-badge.deta.dev/suwayomi/tachidesk-vui/latest_tag?filter=latest) ![](https://ghcr-badge.deta.dev/suwayomi/tachidesk-vui/size?filter=latest) |

# How To Use:

## Web Server files

The Tachidesk-VUI-Web.zip file in the release is for hosting the ui though `server.webUIFlavor = "Custom"` config and replacing the contents of the webUI folder in the Tachidesk data directory

The files could also be used in a stand alone webserver though you would have to redirect `/api` trafic to tachidesk server

## Docker

#### Compose

```yaml
version: '3.7'
services:
  tachideskvui:
    image: ghcr.io/suwayomi/tachidesk-vui:latest
    ports:
      - '9013:8080'
    restart: unless-stopped
```

## Developing

install dependencies with `bun install`

start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
```
